import test from 'node:test';
import assert from 'node:assert/strict';
import { submitWeb3Form } from '../../js/services/form-submission.js';
import { CONFIG } from '../../js/services/config.js?v=2.0.0';
const payload=()=>{const f=new FormData();f.set('name','QA');f.set('email','qa@example.test');f.set('message','Mock only');return f;};
async function withFetch(stub,fn){const original=globalThis.fetch;globalThis.fetch=stub;try{return await fn();}finally{globalThis.fetch=original;}}
for(const [label,status,body,success] of [
 ['confirmed success',200,'{"success":true}',true],['created success',201,'{"success":true}',true],
 ['explicit rejection',200,'{"success":false}',false],['missing success',200,'{}',false],
 ['truthy string',200,'{"success":"true"}',false],['truthy number',200,'{"success":1}',false],
 ['null',200,'null',false],['array',200,'[]',false],['malformed JSON',200,'<html>error</html>',false],
 ['empty response',204,null,false],['invalid key',400,'{"success":false}',false],
 ['unauthorized',401,'{"success":true}',false],['forbidden',403,'{"success":true}',false],
 ['rate limit',429,'{"success":true}',false],['server error',500,'{"success":true}',false],
 ['unavailable',503,'{"success":false}',false],
])test(label,()=>withFetch(async()=>new Response(body,{status}),async()=>assert.equal((await submitWeb3Form(payload())).success,success)));
test('uses fixed HTTPS endpoint, multipart body, accept header and live timeout signal',()=>withFetch(async(url,options)=>{assert.equal(url,'https://api.web3forms.com/submit');assert.equal(options.method,'POST');assert.equal(options.redirect,'error');assert.equal(options.credentials,'omit');assert(options.body instanceof FormData);assert.deepEqual(options.headers,{Accept:'application/json'});assert(options.signal instanceof AbortSignal);return new Response('{"success":true}');},()=>submitWeb3Form(payload())));
test('configured public key overrides a caller key without mutating source form data',()=>{const f=payload();f.append('access_key','wrong');return withFetch(async(_,o)=>{assert.equal(o.body.get('access_key'),CONFIG.WEB3FORMS_ACCESS_KEY);assert.equal(o.body.getAll('access_key').length,1);assert.equal(f.get('access_key'),'wrong');return new Response('{"success":true}');},()=>submitWeb3Form(f));});
test('normalizes legacy subject and strips AJAX redirect and empty legacy trap',()=>{const f=payload();f.set('_subject','Project');f.set('_gotcha','');f.set('redirect','https://untrusted.example/');return withFetch(async(_,o)=>{assert.equal(o.body.get('subject'),'Project');for(const key of ['_subject','_gotcha','redirect'])assert.equal(o.body.has(key),false);assert.equal(f.get('redirect'),'https://untrusted.example/');return new Response('{"success":true}');},()=>submitWeb3Form(f));});
test('explicit subject wins over legacy subject',()=>{const f=payload();f.set('_subject','Old');f.set('subject','Current');return withFetch(async(_,o)=>{assert.equal(o.body.get('subject'),'Current');return new Response('{"success":true}');},()=>submitWeb3Form(f));});
test('preserves unicode, literal XSS/SQL-looking input and repeated fields as body data only',()=>{const f=payload(),value='<img src=x onerror=alert(1)> & "quotes" 😀 اردو\n\' OR 1=1--';f.set('message',value);f.append('tag','a');f.append('tag','b');f.set('subject','Test\r\nBcc: qa@example.test');return withFetch(async(_,o)=>{assert.equal(o.body.get('message'),value);assert.deepEqual(o.body.getAll('tag'),['a','b']);assert.deepEqual(Object.keys(o.headers),['Accept']);return new Response('{"success":true}');},()=>submitWeb3Form(f));});
for(const trap of ['botcheck','_gotcha'])test(`rejects filled ${trap} without a network request`,()=>{const f=payload();f.set(trap,'on');let called=false;return withFetch(async()=>{called=true;return new Response('{"success":true}');},async()=>{await assert.rejects(submitWeb3Form(f));assert.equal(called,false);});});
for(const name of ['TypeError','AbortError','TimeoutError'])test(`propagates ${name} instead of false success`,()=>withFetch(async()=>{const e=new Error('Mock transport failure');e.name=name;throw e;},()=>assert.rejects(submitWeb3Form(payload()),{name})));
test('20-second timeout is requested and cancellation reaches fetch',async()=>{const original=AbortSignal.timeout;const controller=new AbortController();AbortSignal.timeout=ms=>{assert.equal(ms,20000);return controller.signal;};try{await withFetch(async(_,o)=>new Promise((_,reject)=>o.signal.addEventListener('abort',()=>reject(o.signal.reason),{once:true})),async()=>{const result=submitWeb3Form(payload());controller.abort(new DOMException('Mock timeout','TimeoutError'));await assert.rejects(result,{name:'TimeoutError'});});}finally{AbortSignal.timeout=original;}});
