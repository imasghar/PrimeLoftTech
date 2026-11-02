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
        prevent: (node) => Boolean(
          node?.closest?.('.primary.active') ||
          node?.closest?.('.pl-chat-widget') ||
          node?.closest?.('[data-lenis-prevent]')
        ),
      });

      this.instance = lenis;
      window.lenis = lenis;

      // Start RequestAnimationFrame Loop
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);

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
      script.onerror = () => resolve();

      document.head.appendChild(script);
    });
  }

  static bindAnchorLinks(lenis) {
    document.addEventListener('click', (e) => {
      const anchor = e.target.closest('a[href^="#"]');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href || href === '#' || href.length < 2) return;

      let target = null;
      try { target = document.getElementById(decodeURIComponent(href.slice(1))); } catch { return; }
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
