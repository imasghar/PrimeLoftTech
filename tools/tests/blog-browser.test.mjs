import assert from 'node:assert/strict';
import fs from 'node:fs';
const base = 'http://127.0.0.1:8767';
const tabs = await (await fetch('http://127.0.0.1:9346/json')).json();
const ws = new WebSocket(tabs.find(t => t.type === 'page').webSocketDebuggerUrl);
await new Promise(resolve => ws.onopen = resolve);
let id = 0;
const pending = new Map(), errors = [], checks = [];
function call(method, params = {}) {
  return new Promise((resolve, reject) => { pending.set(++id, {resolve, reject}); ws.send(JSON.stringify({id, method, params})); });
}
ws.onmessage = async ({data}) => {
  const m = JSON.parse(data);
  if (m.id) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.reject(m.error) : p.resolve(m.result); }
  if (m.method === 'Runtime.exceptionThrown') errors.push(m.params.exceptionDetails.text);
  if (m.method === 'Fetch.requestPaused') {
    if (new URL(m.params.request.url).origin === base) await call('Fetch.continueRequest', {requestId:m.params.requestId});
    else await call('Fetch.fulfillRequest', {requestId:m.params.requestId,responseCode:200,body:''});
  }
};
const pause = ms => new Promise(r => setTimeout(r, ms));
async function ev(expression) {
  const r = await call('Runtime.evaluate', {expression, returnByValue:true, awaitPromise:true});
  if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails));
  return r.result.value;
}
async function navigate(path) {
  await call('Page.navigate', {url:base+path});
  await waitForPath(path);
}
async function waitForPath(path) {
  for (let i=0;i<100;i++) {
    await pause(80);
    if (await ev(`location.pathname===${JSON.stringify(path)} && document.readyState==='complete' && !!document.querySelector('#plChatLauncher')`)) return;
  }
  throw new Error('Page did not initialize: '+path);
}
const paths = ['/blog/','/blog/small-business-website-cost-2026/','/blog/choose-web-design-agency-dera-ghazi-khan/'];
const sidebarStyle = `(()=>{
  const aside=getComputedStyle(document.querySelector('.seo-reading-aside'));
  const index=getComputedStyle(document.querySelector('.seo-index'));
  const summary=getComputedStyle(document.querySelector('.seo-index summary'));
  const nav=getComputedStyle(document.querySelector('.seo-index nav'));
  const link=getComputedStyle(document.querySelector('.seo-index nav a:not([aria-current])'));
  return {position:aside.position,top:aside.top,border:index.borderTop,summaryPadding:summary.padding,summaryColor:summary.color,navDisplay:nav.display,font:link.fontSize,padding:link.padding,color:link.color};
})()`;
try {
  await call('Page.enable'); await call('Runtime.enable');
  await call('Fetch.enable',{patterns:[{urlPattern:'*'}]});
  // Happy path uses real link clicks, including both articles and a contact CTA.
  await call('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
  await navigate('/index.html');
  await ev(`document.querySelector('nav.primary a[href="/blog/"]').click()`);
  await waitForPath('/blog/');
  await ev(`document.querySelector('.blog-card h2 a').click()`);
  await waitForPath(paths[1]);
  await ev(`document.querySelector('.blog-toc a').click()`);
  assert(await ev(`location.hash && !!document.getElementById(location.hash.slice(1))`));
  await ev(`document.querySelector('.blog-related-link').click()`);
  await waitForPath(paths[2]);
  await ev(`document.querySelector('.blog-prose a[href="/service-seo.html"]').click()`);
  await waitForPath('/service-seo.html');
  await ev(`document.querySelector('nav.primary a[href="/blog/"]').click()`);
  await waitForPath('/blog/');
  await ev(`document.querySelectorAll('.blog-card h2 a')[1].click()`);
  await waitForPath(paths[2]);
  await ev(`document.querySelector('.blog-prose a[href="/contact.html"]').click()`);
  await waitForPath('/contact.html');
  assert(await ev(`!!document.querySelector('#contactForm')`));
  checks.push('Happy path: Home > Blog > cost guide > contents > hiring guide > SEO service > Blog > hiring guide > Contact');
  const sidebarReferences={};
  for (const width of [320,390,768,1440]) {
    await call('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:width<650});
    await navigate('/service-seo.html');
    sidebarReferences[width]=await ev(sidebarStyle);
  }
  for (const path of paths) {
    const res=await fetch(base+path); assert.equal(res.status,200);
    const source=await res.text();
    assert(!source.includes('Publishing details')); assert(!source.includes('3093How'));
    for (const width of [320,390,768,1440]) {
      await call('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:width<650});
      await navigate(path);
      await ev(`document.querySelectorAll('img[loading="lazy"]').forEach(i=>i.loading='eager'); document.fonts.ready`);
      await pause(300);
      const state=await ev(`(()=>({
        overflow:document.documentElement.scrollWidth>innerWidth,
        h1:document.querySelectorAll('h1').length,
        broken:[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src),
        nav:[...document.querySelectorAll('nav.primary > a')].map(a=>a.textContent.trim()),
        active:document.querySelector('nav.primary a[aria-current="page"]')?.textContent.trim(),
        canonical:document.querySelector('link[rel="canonical"]').href,
        schema:JSON.parse(document.querySelector('#org-schema').textContent),
        toc:[...document.querySelectorAll('.blog-toc nav a')].every(a=>document.getElementById(a.hash.slice(1))),
        blogLink:document.querySelector('.cookie-policy-link')?.getAttribute('href')
        , titlePosition:getComputedStyle(document.querySelector('.blog-index-head, .blog-article-head')).position
        , titleTop:document.querySelector('h1').getBoundingClientRect().top
      }))()`);
      assert(!state.overflow,`${path} overflows at ${width}`);
      assert.equal(state.h1,1); assert.deepEqual(state.broken,[]);
      assert.equal(state.nav[state.nav.indexOf('About Us')+1],'Blog');
      assert.equal(state.active,'Blog'); assert(state.toc);
      assert.equal(state.canonical,'https://primeloft.tech'+path);
      assert.equal(state.blogLink,'/cookies.html');
      assert.equal(state.titlePosition,'static'); assert(state.titleTop>80, 'Title overlaps the site header');
      // Older cached HTML used a semantic header here. The blog CSS must
      // neutralize the global navbar rule even with that older markup.
      assert(await ev(`(()=>{
        const original=document.querySelector('.blog-index-head, .blog-article-head');
        const legacy=document.createElement('header');
        legacy.className=original.className;legacy.innerHTML=original.innerHTML;
        original.replaceWith(legacy);
        const style=getComputedStyle(legacy),rect=legacy.getBoundingClientRect();
        const okay=style.position==='static'&&style.backdropFilter==='none'&&rect.top>=80&&rect.left>=16;
        legacy.replaceWith(original);return okay;
      })()`), 'Legacy heading markup inherits navbar positioning');
      if (path !== '/blog/') {
        assert(await ev(`(()=>{
          const prose=document.querySelector('.blog-prose'), layout=document.querySelector('.blog-reading-layout');
          return !prose.hasAttribute('data-reveal')&&getComputedStyle(prose).transform==='none'&&prose.getAnimations().length===0&&
            (innerWidth<=900||Math.abs(prose.getBoundingClientRect().top-layout.getBoundingClientRect().top)<2);
        })()`), 'Article animation shifts the text below the sidebar');
        assert(await ev(`document.querySelector('.blog-toc nav').hasAttribute('data-lenis-prevent')`));
        assert.deepEqual(await ev(sidebarStyle),sidebarReferences[width], 'Blog sidebar differs from the SEO service sidebar');
        assert.equal(await ev(`document.querySelector('.seo-index').open`),width>900);
        await ev(`document.querySelector('.seo-index summary').click()`);
        assert.equal(await ev(`document.querySelector('.seo-index').open`),width<=900);
        await ev(`document.querySelector('.seo-index summary').click()`);
        assert(await ev(`(()=>{
          const card=document.querySelector('.blog-related'), style=getComputedStyle(card);
          const bounds=card.getBoundingClientRect(), title=card.querySelector('h2').getBoundingClientRect();
          return parseFloat(style.paddingLeft)>=24&&parseFloat(style.paddingTop)>=24&&title.left-bounds.left>=24&&!!card.querySelector('.blog-related-actions .pl-btn')&&!!card.querySelector('.blog-all-link');
        })()`), 'Related article card has no usable padding or actions');
        assert(state.schema['@graph'].some(n=>n['@type']==='BlogPosting'));
        assert.equal(await ev(`document.querySelectorAll('.blog-inline-image img').length`),1);
        assert(await ev(`document.querySelector('.blog-prose').innerText.length>10000`));
      } else assert.equal(await ev(`document.querySelectorAll('.blog-card').length`),2);
      if (width===390) {
        await ev(`document.querySelector('#mobileToggle').click()`);
        assert(await ev(`document.querySelector('nav.primary').classList.contains('active')`));
        await call('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape'});
        assert(await ev(`!document.querySelector('nav.primary').classList.contains('active')`));
      }
      checks.push(`${path}: ${width}px, readable content, images, metadata and navigation`);
      if (width===1440) {
        const shot=await call('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
        fs.mkdirSync('scratch/blog-preview',{recursive:true});
        fs.writeFileSync('scratch/blog-preview/'+(path==='/blog/'?'index':path.split('/')[2])+'.png',Buffer.from(shot.data,'base64'));
      }
    }
  }
  // Cross-links resolve locally without relying on JavaScript or external hosts.
  for (const path of paths.slice(1)) {
    await navigate(path);
    const targets=await ev(`[...document.querySelectorAll('main a')].map(a=>new URL(a.href)).filter(u=>u.origin==='https://primeloft.tech'||u.origin===${JSON.stringify(base)}).map(u=>u.pathname)`);
    for (const target of new Set(targets)) assert.equal((await fetch(base+target)).status,200,target);
  }
  await call('Emulation.setDeviceMetricsOverride',{width:1665,height:911,deviceScaleFactor:1,mobile:false});
  await navigate(paths[1]);
  await ev(`(()=>{document.documentElement.style.scrollBehavior='auto';const layout=document.querySelector('.blog-reading-layout');if(window.lenis)window.lenis.scrollTo(layout,{offset:-120,immediate:true});else scrollTo({top:layout.getBoundingClientRect().top+scrollY-120,behavior:'instant'});})()`);
  await pause(500);
  const before=await ev(`(()=>{const nav=document.querySelector('.blog-toc nav'),b=nav.getBoundingClientRect();nav.scrollTop=0;return {page:scrollY,x:b.x+30,y:b.y+40,scrollable:nav.scrollHeight>nav.clientHeight};})()`);
  assert(before.scrollable, 'Sidebar wheel test requires the real overflowing index');
  await call('Input.dispatchMouseEvent',{type:'mouseWheel',x:before.x,y:before.y,deltaX:0,deltaY:180});
  await pause(400);
  const after=await ev(`({page:scrollY,nav:document.querySelector('.blog-toc nav').scrollTop})`);
  assert(after.nav>0&&Math.abs(after.page-before.page)<2, 'Index scroll mismatch: '+JSON.stringify({before,after}));
  checks.push('Article starts level with sidebar; native index scrolling does not move the page');
  const layoutShot=await call('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
  fs.writeFileSync('scratch/blog-preview/scroll-layout.png',Buffer.from(layoutShot.data,'base64'));
  assert.deepEqual(errors,[]);
  fs.writeFileSync('tools/qa-results/blog-browser.json',JSON.stringify({passed:true,checks,errors,externalRequestsIntercepted:true},null,2));
  console.log(`PASS: ${checks.length} responsive page checks, cross-links, mobile menu, article schema and images.`);
} finally { await call('Fetch.disable').catch(()=>{}); ws.close(); }
