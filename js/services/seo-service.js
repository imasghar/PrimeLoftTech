/**
 * PrimeLoft Tech - SEO safety net.
 * All structured data and canonical tags are rendered statically by the site generator
 * (tools/site). This service only guarantees a canonical link exists and never overrides one,
 * so index.html keeps its canonical pointing at the root URL.
 */
import { CONFIG } from './config.js';

export class SeoService {
  static init() {
    this.ensureCanonical();
  }

  static ensureCanonical() {
    if (document.querySelector('link[rel="canonical"]')) return;
    if (document.querySelector('meta[name="robots"][content*="noindex"]')) return;
    const link = document.createElement('link');
    link.rel = 'canonical';
    const path = window.location.pathname.replace(/index\.html$/, '');
    link.href = CONFIG.SITE_URL + path;
    document.head.appendChild(link);
  }
}
