import test from 'node:test';
import assert from 'node:assert/strict';
import { InertiaScrollService } from '../../js/services/inertia-scroll.js';

function fixture(href, targetExists=true, currentHash='') {
  const previous={document:globalThis.document,window:globalThis.window};
  let listener, prevented=false;
  const calls=[], history=[], target={id:'section'};
  globalThis.document={
    addEventListener:(type,fn)=>{assert.equal(type,'click');listener=fn;},
    getElementById:id=>targetExists&&id==='section'?target:null,
    querySelector:()=>({offsetHeight:80}),
  };
  globalThis.window={location:{hash:currentHash},history:{pushState:(...args)=>history.push(args)}};
  const anchor={getAttribute:()=>href};
  InertiaScrollService.bindAnchorLinks({scrollTo:(...args)=>calls.push(args)});
  return {
    click:()=>listener({target:{closest:()=>anchor},preventDefault:()=>{prevented=true;}}),
    state:()=>({calls,history,prevented,target}),
    restore:()=>{globalThis.document=previous.document;globalThis.window=previous.window;},
  };
}
test('valid section links preserve a copyable fragment and fixed-header scroll offset',()=>{
  const f=fixture('#section');
  try { f.click(); const s=f.state(); assert(s.prevented); assert.deepEqual(s.history,[[null,'','#section']]); assert.deepEqual(s.calls,[[s.target,{offset:-90,duration:1.2}]]); } finally {f.restore();}
});
test('clicking the current section does not duplicate browser history',()=>{
  const f=fixture('#section',true,'#section');
  try { f.click(); assert.equal(f.state().calls.length,1); assert.deepEqual(f.state().history,[]); } finally {f.restore();}
});
for(const href of ['#missing','#%ZZ','#','']) test('invalid or missing target does not hijack navigation: '+href,()=>{
  const f=fixture(href,false);
  try { f.click(); assert.equal(f.state().prevented,false); assert.deepEqual(f.state().calls,[]); assert.deepEqual(f.state().history,[]); } finally {f.restore();}
});
