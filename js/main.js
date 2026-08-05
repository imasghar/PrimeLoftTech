/* ==========================================================================
   PRIME LOFT - MAIN APPLICATION CONTROLLER
   Integrates Theme, Modular Services (Consent, Tracking, Analytics, SEO),
   and Lazy Loaded Animations.
   ========================================================================== */

import { trackingService } from './services/tracking-service.js';
import { analyticsService } from './services/analytics-service.js';
import { SeoService } from './services/seo-service.js';
import { CookieConsentUI } from './services/cookie-consent-ui.js';

// 1. Instant Theme Initialization (0 ms FOIT/FOUC prevention)
(function initTheme() {
  const savedTheme = localStorage.getItem('primeloft-theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
})();

// BFCache (Back/Forward Cache) Restoration Handler
window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    const savedTheme = localStorage.getItem('primeloft-theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }
});

document.addEventListener('DOMContentLoaded', () => {

  // ---------- 1. MODULAR SERVICES INITIALIZATION ----------
  SeoService.init();
  trackingService.init();
  analyticsService.init();
  CookieConsentUI.init();

  // ---------- 2. THEME TOGGLE ----------
  const root = document.documentElement;
  const themeToggleBtn = document.getElementById('themeToggle');

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = root.getAttribute('data-theme');
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', nextTheme);
      localStorage.setItem('primeloft-theme', nextTheme);
    });
  }

  // ---------- 3. MOBILE MENU TOGGLE ----------
  const mobileToggleBtn = document.getElementById('mobileToggle');
  const primaryNav = document.querySelector('nav.primary');

  if (mobileToggleBtn && primaryNav) {
    mobileToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isActive = primaryNav.classList.toggle('active');
      mobileToggleBtn.setAttribute('aria-expanded', String(isActive));
    });

    // Close menu when clicking links (except mega menu accordion parent)
    primaryNav.querySelectorAll('.navlink:not(.has-mega > .navlink)').forEach(link => {
      link.addEventListener('click', () => {
        primaryNav.classList.remove('active');
        mobileToggleBtn.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!primaryNav.contains(e.target) && !mobileToggleBtn.contains(e.target)) {
        primaryNav.classList.remove('active');
        mobileToggleBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Mobile Mega Menu Accordion Toggle
  const hasMegaElements = document.querySelectorAll('.has-mega');
  hasMegaElements.forEach(item => {
    const navLink = item.querySelector('.navlink');
    if (navLink) {
      navLink.addEventListener('click', (e) => {
        if (window.matchMedia('(max-width: 720px)').matches) {
          e.preventDefault();
          item.classList.toggle('open');
        }
      });
    }
  });

  // ---------- 4. DYNAMIC LAZY GSAP ANIMATIONS LOADER ----------
  function loadGSAP() {
    if (window._gsapLoaded) return;
    window._gsapLoaded = true;

    const scriptGsap = document.createElement('script');
    scriptGsap.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js';
    scriptGsap.crossOrigin = 'anonymous';
    scriptGsap.onload = () => {
      const scriptST = document.createElement('script');
      scriptST.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js';
      scriptST.crossOrigin = 'anonymous';
      scriptST.onload = initGSAPAnimations;
      document.head.appendChild(scriptST);
    };
    document.head.appendChild(scriptGsap);
  }

  function initGSAPAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    // Hero Text Entrance Animation
    const heroHeading = document.getElementById('heroHeading');
    if (heroHeading) {
      gsap.set('.hero h1 .line span', { y: '110%', opacity: 0 });
      gsap.to('.hero h1 .line span', {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power4.out',
        stagger: 0.14,
        delay: 0.1
      });

      gsap.fromTo('.hero-inner .eyebrow', 
        { opacity: 0, y: 14 }, 
        { opacity: 1, y: 0, duration: 0.8 }
      );

      gsap.fromTo('.hero-inner p.lead, .hero-ctas, .hero-scroll', 
        { opacity: 0, y: 16 }, 
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, delay: 0.4 }
      );

      gsap.fromTo('.hero-blob', 
        { opacity: 0, scale: 0.8 }, 
        { opacity: 0.35, scale: 1, duration: 1.6, ease: 'power2.out' }
      );
    }

    // Results Counter Animation
    const statElements = document.querySelectorAll('.result-stat .num');
    if (statElements.length > 0) {
      statElements.forEach(el => {
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const decimal = el.dataset.decimal === 'true';

        ScrollTrigger.create({
          trigger: el,
          start: 'top 88%',
          once: true,
          onEnter: () => {
            let obj = { v: 0 };
            gsap.to(obj, {
              v: target,
              duration: 1.6,
              ease: 'power2.out',
              onUpdate: () => {
                el.textContent = (decimal ? obj.v.toFixed(1) : Math.round(obj.v)) + suffix;
              }
            });
          }
        });
      });
    }

    // Generic Scroll Reveal Animation
    gsap.utils.toArray('.reveal').forEach(el => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 90%',
        once: true,
        onEnter: () => {
          gsap.to(el, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' });
        }
      });
    });
  }

  // Load GSAP dynamically during browser idle time or on first scroll/touch
  if ('requestIdleCallback' in window) {
    requestIdleCallback(loadGSAP, { timeout: 1500 });
  } else {
    setTimeout(loadGSAP, 400);
  }

  ['touchstart', 'scroll', 'mousemove'].forEach(evt => {
    window.addEventListener(evt, loadGSAP, { passive: true, once: true });
  });

  // ---------- 5. ANCHOR SMOOTH SCROLL ----------
  if (window.location.hash) {
    const targetEl = document.querySelector(window.location.hash);
    if (targetEl) {
      setTimeout(() => {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    }
  }

});
