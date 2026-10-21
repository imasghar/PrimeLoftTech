/**
 * Static site generator for primeloft.tech.
 * Usage: node tools/site/build.mjs   (or: npm run build)
 * Writes every HTML page to the repo root plus sitemap.xml.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderPage } from './layout.mjs';
import * as pages from './pages.mjs';
import { SERVICES } from './data/services.mjs';
import { SITE } from './data/site.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const today = new Date().toISOString().slice(0, 10);

const all = [
  pages.home(),
  pages.services(),
  ...SERVICES.map((s) => pages.serviceDetail(s)),
  pages.about(),
  pages.contact(),
  pages.privacy(),
  pages.cookies(),
  pages.terms(),
  pages.notFound()
];

for (const page of all) {
  const html = renderPage(page);
  fs.writeFileSync(path.join(root, page.file), html, 'utf8');
  console.log('wrote', page.file.padEnd(40), (html.length / 1024).toFixed(1) + 'KB');
}

/* sitemap.xml (noindex pages excluded) */
const priority = (f) => (f === 'index.html' ? '1.0' : f === 'services.html' || f === 'contact.html' ? '0.9' : f.startsWith('service-') ? '0.85' : f === 'about.html' ? '0.8' : '0.3');
const changefreq = (f) => (f.startsWith('service') || f === 'index.html' ? 'weekly' : 'monthly');
const urls = all.filter((p) => !p.noindex).map((p) => `  <url>
    <loc>${SITE.url}/${p.file === 'index.html' ? '' : p.file}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq(p.file)}</changefreq>
    <priority>${priority(p.file)}</priority>
  </url>`).join('\n');
fs.writeFileSync(path.join(root, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`, 'utf8');
console.log('wrote sitemap.xml with', all.length - 1, 'urls');
