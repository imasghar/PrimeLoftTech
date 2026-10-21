/**
 * Builds every generated Lottie animation into /animations (light + dark variants).
 * Usage: node tools/lottie/build.mjs [sceneName ...]
 * Scene modules export functions named after the scene key below.
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { writeScene } from './lib.mjs';

const outDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../animations');
const MODULES = {
  './scenes-core.mjs': { '404': 'notFound' },
  './scenes-quality.mjs': { 'quality': 'quality' },
  './scenes-a.mjs':    { 'hero': 'hero', 'web-development': 'webDevelopment', 'seo': 'seo', 'about': 'about' },
  './scenes-b.mjs':    { 'design': 'design', 'wordpress': 'wordpress', 'squarespace': 'squarespace' },
};
const wanted = process.argv.slice(2);
for (const [mod, scenes] of Object.entries(MODULES)) {
  let m;
  try { m = await import(mod); } catch (e) { console.warn('skip', mod, '-', e.message.split('\n')[0]); continue; }
  for (const [name, fnName] of Object.entries(scenes)) {
    if (wanted.length && !wanted.includes(name)) continue;
    if (typeof m[fnName] !== 'function') { console.warn('skip', name, '(no export', fnName + ')'); continue; }
    writeScene(outDir, name, m[fnName]);
  }
}
