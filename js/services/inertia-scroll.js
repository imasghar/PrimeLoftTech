/**
 * PrimeLoft Tech - Inertia Scroll Service (Lenis Engine)
 * Implements silky-smooth momentum & inertia physics on scroll.
 */

export class InertiaScrollService {
  static instance = null;

  static async init() {
    // Respect user's reduced motion system preference
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return null;
    }

    try {
      await this.loadLenisScript();
      if (!window.Lenis) {
        console.warn('InertiaScroll: Lenis constructor not available.');
        return null;
      }

      const lenis = new window.Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1.0,
        touchMultiplier: 1.0,
        syncTouch: false,
        autoResize: true,
        prevent: (node) => Boolean(node?.closest?.('#cookieModal') || node?.closest?.('.primary.active')),
      });

      this.instance = lenis;
      window.lenis = lenis;

      // Start RequestAnimationFrame Loop
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);

      // Connect with GSAP ScrollTrigger if present
      lenis.on('scroll', () => {
        if (window.ScrollTrigger) {
          window.ScrollTrigger.update();
        }
      });

      // Smooth in-page anchor scrolling with fixed header offset
      this.bindAnchorLinks(lenis);

      // Handle page visibility / BFCache & dynamic content resize
      window.addEventListener('pageshow', () => {
        lenis.resize();
      });

      return lenis;
    } catch (err) {
      console.warn('InertiaScroll initialization skipped:', err);
      return null;
    }
  }

  static loadLenisScript() {
    if (window.Lenis) return Promise.resolve();

    return new Promise((resolve) => {
      const script = document.createElement('script');
      // Resolve path relative to this module
      const localUrl = new URL('../vendor/lenis.min.js', import.meta.url).href;
      script.src = localUrl;
      script.async = true;

      script.onload = () => resolve();
      script.onerror = () => {
        // Fallback to CDN if local file fails
        const cdnScript = document.createElement('script');
        cdnScript.src = 'https://cdn.jsdelivr.net/npm/lenis@1.1.18/dist/lenis.min.js';
        cdnScript.async = true;
        cdnScript.onload = () => resolve();
        cdnScript.onerror = () => resolve();
        document.head.appendChild(cdnScript);
      };

      document.head.appendChild(script);
    });
  }

  static bindAnchorLinks(lenis) {
    document.addEventListener('click', (e) => {
      const anchor = e.target.closest('a[href^="#"]');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href || href === '#' || href.length < 2) return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const header = document.querySelector('header');
        const headerOffset = header ? header.offsetHeight + 10 : 70;
        lenis.scrollTo(target, { offset: -headerOffset, duration: 1.2 });
      }
    });
  }

  static stop() {
    if (this.instance) this.instance.stop();
  }

  static start() {
    if (this.instance) this.instance.start();
  }
}
