// Rasterize the existing ARC vector in local Chrome; no new artwork is generated.
import fs from 'node:fs';
const tabs = await (await fetch('http://127.0.0.1:9346/json')).json();
const ws = new WebSocket(tabs.find(t => t.type === 'page').webSocketDebuggerUrl);
await new Promise(resolve => ws.onopen = resolve);
let id = 0; const pending = new Map();
ws.onmessage = ({data}) => { const m = JSON.parse(data); if (m.id) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.reject(m.error) : p.resolve(m.result); } };
const call = (method,params={}) => new Promise((resolve,reject)=>{pending.set(++id,{resolve,reject});ws.send(JSON.stringify({id,method,params}));});
try {
  await call('Page.navigate',{url:'http://127.0.0.1:8767/index.html'});
  await new Promise(resolve=>setTimeout(resolve,500));
  for (const [size,path] of [[512,'favicon.png'],[256,'images/favicon-256x256.png'],[48,'images/favicon-48x48.png'],[32,'images/favicon-32x32.png'],[192,'images/favicon-192x192.png'],[180,'images/apple-touch-icon.png']]) {
    const result = await call('Runtime.evaluate',{awaitPromise:true,returnByValue:true,expression:`(async()=>{const img=new Image();img.src='/favicon.svg';await img.decode();const c=document.createElement('canvas');c.width=c.height=${size};c.getContext('2d').drawImage(img,0,0,${size},${size});return c.toDataURL('image/png').split(',')[1]})()`});
    if(result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
    fs.writeFileSync(path,Buffer.from(result.result.value,'base64'));
  }
  const png = fs.readFileSync('images/favicon-256x256.png');
  const header = Buffer.alloc(22); header.writeUInt16LE(1,2); header.writeUInt16LE(1,4); header.writeUInt16LE(1,10); header.writeUInt16LE(32,12); header.writeUInt32LE(png.length,14); header.writeUInt32LE(22,18);
  fs.writeFileSync('favicon.ico',Buffer.concat([header,png]));
  console.log('Rendered ARC PNG and ICO favicons from favicon.svg.');
} finally {ws.close();}
