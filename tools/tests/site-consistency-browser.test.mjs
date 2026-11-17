import assert from 'node:assert/strict';
import fs from 'node:fs';
const base = 'http://127.0.0.1:8767';
const guideModule = new URL(fs.readFileSync('js/main.js','utf8').match(/from '([^']*chatbot[^']*)'/)[1], base + '/js/main.js').href;
const tabs = await (await fetch('http://127.0.0.1:9346/json')).json();
const ws = new WebSocket(tabs.find(t => t.type === 'page').webSocketDebuggerUrl);
await new Promise(resolve => ws.onopen = resolve);
let id = 0;
const pending = new Map(), errors = [], requests = [], checks = [];
const call = (method, params = {}) => new Promise((resolve, reject) => {
  pending.set(++id, { resolve, reject }); ws.send(JSON.stringify({ id, method, params }));
});
ws.onmessage = async ({ data }) => {
  const message = JSON.parse(data);
  if (message.id) {
    const p = pending.get(message.id); pending.delete(message.id);
    if (message.error) p.reject(message.error); else p.resolve(message.result);
  }
  if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails.text);
  if (message.method === 'Fetch.requestPaused') {
    const p = message.params;
    if (new URL(p.request.url).origin === base) await call('Fetch.continueRequest', { requestId: p.requestId });
    else {
      requests.push(p.request.url);
      await call('Fetch.fulfillRequest', { requestId: p.requestId, responseCode: 200, body: '' });
    }
  }
};
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
const ev = async expression => {
  const r = await call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails));
  return r.result.value;
};
async function navigate(path) {
  await call('Page.navigate', { url: `${base}/${path}` });
  for (let i = 0; i < 100; i++) {
    await pause(80);
    if (await ev(`location.pathname === ${JSON.stringify('/' + path.split('?')[0])} && document.readyState === 'complete' && !!document.querySelector('#plChatLauncher')`)) return;
  }
  throw new Error(`Page did not initialize: ${path}`);
}
async function check(name, fn) { await fn(); checks.push(name); console.log('PASS: ' + name); }
try {
  await call('Page.enable'); await call('Runtime.enable'); await call('Fetch.enable', { patterns: [{ urlPattern: '*' }] });
  await navigate('index.html');
  await ev('localStorage.clear()');
  requests.length = 0;
  await navigate('index.html');
  await check('analytics stays unloaded before consent; Guide is button only', async () => {
    assert(!requests.some(url => /googletagmanager|google-analytics/.test(url)));
    assert(await ev(`!document.querySelector('.cookie-banner').hidden && !document.querySelector('#plChatPromptCard') && document.querySelector('#plChatWindow').hidden && document.querySelector('#plChatLauncher').getAttribute('aria-expanded') === 'false'`));
  });
  await check('hero has readable contrast and no heading entrance animation', async () => {
    assert(await ev(`getComputedStyle(document.querySelector('h1')).opacity === '1' && getComputedStyle(document.querySelector('h1')).animationName === 'none' && getComputedStyle(document.querySelector('.pl-hero .pl-lead')).color === 'rgb(70, 84, 106)'`));
  });
  await check('cookie card retains spacing and accessible touch targets', async () => {
    assert(await ev(`parseFloat(getComputedStyle(document.querySelector('.cookie-banner')).paddingLeft) >= 20 && [...document.querySelectorAll('.cookie-actions button')].every(b=>b.getBoundingClientRect().height>=44)`));
  });
  await check('reject persists across pages and settings can reopen', async () => {
    await ev(`document.querySelector('[data-choice="rejected"]').click()`);
    await navigate('services.html');
    assert(await ev(`document.querySelector('.cookie-banner').hidden && window['ga-disable-G-B2J46QTCHB'] === true`));
    assert(!requests.some(url => /googletagmanager|google-analytics/.test(url)));
    await ev(`document.querySelector('[data-cookie-settings]').click()`);
    assert(await ev(`!document.querySelector('.cookie-banner').hidden && document.activeElement.dataset.choice === 'rejected'`));
  });
  await check('accept loads analytics once; withdrawal disables it and removes cookies', async () => {
    await ev(`document.querySelector('[data-choice="accepted"]').click()`); await pause(100);
    assert.equal(requests.filter(url => /googletagmanager/.test(url)).length, 1);
    await ev(`document.cookie='_ga=qa; path=/'; document.querySelector('[data-cookie-settings]').click(); document.querySelector('[data-choice="rejected"]').click()`);
    assert(await ev(`window['ga-disable-G-B2J46QTCHB'] === true && !document.cookie.split(';').some(c=>c.trim().startsWith('_ga='))`));
  });
  const catalog = JSON.parse(fs.readFileSync('tools/site/service-catalog.json', 'utf8'));
  await check('all 13 service names agree across nav, footer, cards, schema, Contact and Guide', async () => {
    const names = catalog.map(s => s.name);
    assert.deepEqual(await ev(`[...document.querySelectorAll('.mega-list .mtitle')].map(e=>e.textContent)`), names);
    assert.deepEqual(await ev(`[...document.querySelectorAll('.pl-footer__services a')].map(e=>e.textContent)`), names);
    assert.deepEqual(await ev(`[...document.querySelectorAll('article.pl-split h2')].map(e=>e.textContent)`), names);
    const schema = await ev(`JSON.parse(document.querySelector('script[type="application/ld+json"]').textContent)['@graph'].find(n=>n['@type']==='ItemList')`);
    assert.equal(schema.numberOfItems, 13); assert.deepEqual(schema.itemListElement.map(s => s.name), names);
    assert.deepEqual(await ev(`import(${JSON.stringify(guideModule)}).then(m=>m.ChatbotService.services.map(s=>s.label))`), names);
    await navigate('contact.html?service=integrations');
    assert.deepEqual(await ev(`[...document.querySelector('#contact-service').options].slice(1,-1).map(e=>e.textContent)`), names);
    assert.equal(await ev(`document.querySelector('#contact-service').value`), 'API Integration');
  });
  await check('Guide opens on click, closes on Escape and returns focus', async () => {
    await ev(`document.querySelector('#plChatLauncher').click()`);
    assert(await ev(`!document.querySelector('#plChatWindow').hidden`));
    await ev(`document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape'}))`);
    await pause(300);
    assert(await ev(`document.querySelector('#plChatWindow').hidden && document.activeElement.id === 'plChatLauncher'`));
  });
  await check('services are stable across reloads and maintenance copy is not duplicated', async () => {
    for (let i = 0; i < 3; i++) {
      await navigate('services.html');
      assert(await ev(`document.querySelectorAll('article.pl-split').length===13 && [...document.querySelectorAll('article.pl-split, article.pl-split .pl-split__text')].every(e=>getComputedStyle(e).opacity==='1') && document.querySelectorAll('#s-maintenance .pl-tag').length===3 && document.querySelectorAll('#s-maintenance .support-cycle li').length===4`));
    }
  });
  await check('Cookie settings and all four legal links match service-link hover underline and arrow', async () => {
    await call('DOM.enable'); await call('CSS.enable');
    const {root} = await call('DOM.getDocument');
    const {nodeIds} = await call('DOM.querySelectorAll',{nodeId:root.nodeId,selector:'.pl-footer__legal a'});
    assert.equal(nodeIds.length,5);
    const {nodeId:reference} = await call('DOM.querySelector',{nodeId:root.nodeId,selector:'.pl-footer__services li a'});
    const readStyle = selector => ev(`(()=>{const a=document.querySelector(${JSON.stringify(selector)}),b=getComputedStyle(a,'::before'),c=getComputedStyle(a,'::after');return {color:getComputedStyle(a).color,decoration:getComputedStyle(a).textDecorationLine,underline:b.transform,underlineColor:b.backgroundColor,arrowOpacity:c.opacity,arrowTransform:c.transform,arrowWidth:c.width,arrowMask:c.maskImage}})()`);
    await call('CSS.forcePseudoState',{nodeId:reference,forcedPseudoClasses:['hover']});
    await pause(250);
    const expected=await readStyle('.pl-footer__services li a');
    assert.equal(expected.color,'rgb(21, 84, 246)'); assert.equal(expected.arrowOpacity,'1');
    for(let i=0;i<nodeIds.length;i++) {
      await call('CSS.forcePseudoState',{nodeId:nodeIds[i],forcedPseudoClasses:['hover']});
      await pause(250);
      // Underline widths differ with label length; its scale and full style must agree.
      const selector=i===0?'.cookie-settings':`.pl-footer__bottom > .pl-footer__legal a:nth-child(${i})`;
      assert.deepEqual(await readStyle(selector),expected);
      await call('CSS.forcePseudoState',{nodeId:nodeIds[i],forcedPseudoClasses:[]});
    }
    assert(await ev(`document.querySelector('.pl-footer__copyright-group').firstElementChild.textContent.includes('All rights reserved.')`));
  });
  await check('mobile, tablet and desktop remain within viewport', async () => {
    for (const page of ['index.html','services.html','contact.html','terms.html','service-ecommerce.html','service-integrations.html']) {
      await navigate(page);
      for (const width of [360, 768, 1440]) {
        await call('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: width < 650 });
        assert(await ev(`document.documentElement.scrollWidth <= innerWidth`), `${page} overflows at ${width}`);
      }
    }
  });
  await check('every active page has 13 menu icons, one cookie link, working images and responsive layout', async () => {
    for(const page of fs.readdirSync('.').filter(name=>name.endsWith('.html')&&name!=='primeloft.html')) {
      await navigate(page);
      assert(await ev(`document.querySelectorAll('h1').length===1 && document.querySelectorAll('[data-cookie-settings]').length===1 && document.querySelectorAll('.mega-item').length===13 && [...document.querySelectorAll('.mega-item')].every(a=>a.querySelector('.pl-service-icon svg'))`),page);
      for(const width of [320,390,768,1440]) {
        await call('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width<650});
        assert(await ev(`document.documentElement.scrollWidth<=innerWidth`),`${page} overflows at ${width}`);
      }
      assert(await ev(`[...document.images].filter(i=>i.complete).every(i=>i.naturalWidth>0)`),`${page}: broken loaded image`);
    }
  });
  await check('Contact text and service rows have no residual reveal transform', async () => {
    await navigate('contact.html?service=seo');
    await call('Emulation.setDeviceMetricsOverride',{width:1680,height:1000,deviceScaleFactor:1,mobile:false});
    assert(await ev(`getComputedStyle(document.querySelector('.contact-story')).transform==='none' && document.querySelector('.contact-story').getBoundingClientRect().left>=40 && parseFloat(getComputedStyle(document.querySelector('.contact-response-promise')).paddingLeft)>=14`));
    assert.equal(await ev(`document.querySelector('#contact-service').value`),'SEO Services');
    assert(await ev(`[...document.querySelector('#contact-budget').options].some(o=>o.value==='$300 - $500')`));
    await navigate('services.html');
    assert(await ev(`[...document.querySelectorAll('.pl-split')].every(e=>getComputedStyle(e).transform==='none')`));
  });
  await check('expanded service pages have unique metadata, matching schema, substantive scope and working FAQs', async () => {
    const titles=[];
    for(const page of ['service-ecommerce.html','service-integrations.html']) {
      await navigate(page);
      titles.push(await ev('document.title'));
      const expectedFaqs = page === 'service-integrations.html' ? 9 : 8;
      assert(await ev(`document.querySelectorAll('.platform-service').length===6 && document.querySelectorAll('.platform-faq details').length===${expectedFaqs} && document.querySelectorAll('.platform-process li').length===3 && document.querySelectorAll('.detail-grid article').length===3`));
      const metadata=await ev(`({canonical:document.querySelector('link[rel="canonical"]').href,description:document.querySelector('meta[name="description"]').content,og:document.querySelector('meta[property="og:url"]').content,schema:JSON.parse(document.querySelector('script[type="application/ld+json"]').textContent),words:document.querySelector('main').textContent.split(/\\s+/).length})`);
      assert.equal(metadata.canonical,'https://primeloft.tech/'+page);assert.equal(metadata.og,metadata.canonical);
      assert(metadata.description.length>100); assert(metadata.words>900);
      const service=metadata.schema['@graph'].find(n=>n['@type']==='Service');assert.equal(service.url,metadata.canonical);
      await ev(`document.querySelector('.platform-faq summary').click()`);
      assert(await ev(`document.querySelector('.platform-faq details').open`));
      await ev(`document.querySelector('.platform-faq summary').click()`);
      assert(await ev(`!document.querySelector('.platform-faq details').open`));
    }
    assert.notEqual(titles[0],titles[1]);
  });
  await check('legal pages reuse the SEO sidebar, section links, collapse and active-section behavior', async () => {
    for(const page of ['terms.html','privacy.html','cookies.html']) {
      await navigate(page);
      await call('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
      assert(await ev(`getComputedStyle(document.querySelector('.seo-reading-aside')).position==='sticky' && document.querySelector('.seo-index').open && [...document.querySelectorAll('.seo-index nav a')].every(a=>document.getElementById(a.hash.slice(1)))`));
      await ev(`document.querySelector('.seo-index summary').click()`);
      assert(await ev(`!document.querySelector('.seo-index').open`));
      await ev(`document.querySelector('.seo-index summary').click();document.querySelector('.seo-index nav a:last-child').click()`);
      await pause(1400);
      assert(await ev(`location.hash===document.querySelector('.seo-index nav a:last-child').hash && !!document.querySelector('.seo-index nav a[aria-current="location"]')`));
      await call('Emulation.setDeviceMetricsOverride',{width:390,height:900,deviceScaleFactor:1,mobile:true});
      assert(await ev(`getComputedStyle(document.querySelector('.seo-reading-aside')).position==='static' && document.documentElement.scrollWidth<=innerWidth`));
    }
  });
  await check('Global Privacy Control keeps analytics disabled even after Accept', async () => {
    const {identifier} = await call('Page.addScriptToEvaluateOnNewDocument', {source: `Object.defineProperty(navigator,'globalPrivacyControl',{value:true,configurable:true})`});
    requests.length = 0;
    await navigate('index.html');
    await ev(`document.querySelector('[data-cookie-settings]').click();document.querySelector('[data-choice="accepted"]').click()`);
    assert(await ev(`window['ga-disable-G-B2J46QTCHB']===true`));
    assert(!requests.some(url => /googletagmanager|google-analytics/.test(url)));
    await call('Page.removeScriptToEvaluateOnNewDocument',{identifier});
  });
  await check('blocked browser storage does not break consent or the Guide', async () => {
    const {identifier} = await call('Page.addScriptToEvaluateOnNewDocument', {source: `Storage.prototype.getItem=function(){throw new Error('Storage blocked')};Storage.prototype.setItem=function(){throw new Error('Storage blocked')}`});
    await navigate('index.html');
    assert(await ev(`!document.querySelector('.cookie-banner').hidden && !!document.querySelector('#plChatLauncher')`));
    await ev(`document.querySelector('[data-choice="rejected"]').click()`);
    assert(await ev(`document.querySelector('.cookie-banner').hidden && window['ga-disable-G-B2J46QTCHB']===true`));
    await call('Page.removeScriptToEvaluateOnNewDocument',{identifier});
  });
  await check('ARC favicon is a 512px PNG and the homepage references its refreshed URL', async () => {
    assert(await ev(`document.querySelector('link[rel="icon"]').getAttribute('href')==='/favicon.png?v=4'`));
    const bytes=fs.readFileSync('favicon.png');
    assert.equal(bytes.readUInt32BE(16),512); assert.equal(bytes.readUInt32BE(20),512);
    assert(fs.readFileSync('favicon.ico').length>1000);
  });
  assert.deepEqual(errors, []);
  fs.writeFileSync('tools/qa-results/site-consistency-browser.json', JSON.stringify({ passed: true, checks, externalRequestsIntercepted: true, errors }, null, 2));
} finally { await call('Fetch.disable').catch(() => {}); ws.close(); }
