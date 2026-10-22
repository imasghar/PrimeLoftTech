/* ==========================================================================
   PRIME LOFT - MAIN APPLICATION CONTROLLER
   Integrates Theme, Modular Services (Consent, Tracking, Analytics, SEO),
   and Lazy Loaded Animations.
   ========================================================================== */

import { trackingService } from './services/tracking-service.js';
import { analyticsService } from './services/analytics-service.js';
import { SeoService } from './services/seo-service.js';
import { CookieConsentUI } from './services/cookie-consent-ui.js';
import { InertiaScrollService } from './services/inertia-scroll.js';

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
  InertiaScrollService.init();
  SeoService.init();
  trackingService.init();
  analyticsService.init();
  CookieConsentUI.init();

  // ---------- 1B. INSTANT NATIVE REVEAL ANIMATIONS (0ms CDN DELAY) ----------
  document.documentElement.classList.add('js');
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px 60px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('visible'));
  }

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

  // Services Dropdown Card Toggle (Click & Hover Support)
  const hasMegaElements = document.querySelectorAll('.has-mega');
  hasMegaElements.forEach(item => {
    const navLink = item.querySelector('.navlink');
    if (navLink) {
      navLink.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isOpen = item.classList.toggle('open');
        navLink.setAttribute('aria-expanded', String(isOpen));
      });
    }

    // Close dropdown when a service link is clicked
    item.querySelectorAll('.mega a').forEach(link => {
      link.addEventListener('click', () => {
        item.classList.remove('open');
        if (primaryNav) {
          primaryNav.classList.remove('active');
          if (mobileToggleBtn) mobileToggleBtn.setAttribute('aria-expanded', 'false');
        }
      });
    });
  });

  // Close dropdown on click outside
  document.addEventListener('click', (e) => {
    hasMegaElements.forEach(item => {
      if (!item.contains(e.target)) {
        item.classList.remove('open');
        const navLink = item.querySelector('.navlink');
        if (navLink) navLink.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Close dropdown on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      hasMegaElements.forEach(item => {
        item.classList.remove('open');
        const navLink = item.querySelector('.navlink');
        if (navLink) navLink.setAttribute('aria-expanded', 'false');
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

    // Sync Lenis Inertia Scroll with GSAP ScrollTrigger & Ticker
    if (window.lenis) {
      window.lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
        window.lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    }

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
        if (window.lenis) {
          window.lenis.scrollTo(targetEl, { offset: -80, duration: 1.2 });
        } else {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 250);
    }
  }

  // ---------- 6. FORMSPREE AJAX SUBMISSION HANDLER ----------
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('btnSubmitContact');
      const status = document.getElementById('formStatus');

      // Invisible Honeypot Anti-Bot Trap: if filled, silently discard bot request
      const gotcha = contactForm.querySelector('input[name="_gotcha"]');
      if (gotcha && gotcha.value.trim() !== '') {
        if (status) {
          status.style.display = 'block';
          status.style.background = 'rgba(37, 211, 102, 0.15)';
          status.style.color = '#25D366';
          status.style.border = '1px solid rgba(37, 211, 102, 0.3)';
          status.textContent = 'Thank you! Your message has been sent successfully. We will reply within 1 business day.';
        }
        contactForm.reset();
        return;
      }

      if (btn) {
        btn.disabled = true;
        btn.style.opacity = '0.7';
      }

      if (status) {
        status.style.display = 'block';
        status.style.background = 'var(--bg-alt)';
        status.style.color = 'var(--ink)';
        status.textContent = 'Sending your message...';
      }

      try {
        const formData = new FormData(contactForm);
        const endpoint = contactForm.getAttribute('action') || 'https://formspree.io/f/xeajqqoy';

        const response = await fetch(endpoint, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          if (status) {
            status.style.background = 'rgba(37, 211, 102, 0.15)';
            status.style.color = '#25D366';
            status.style.border = '1px solid rgba(37, 211, 102, 0.3)';
            status.textContent = 'Thank you! Your message has been sent successfully. We will reply within 1 business day.';
          }
          contactForm.reset();
          analyticsService.trackFormSubmission('contactForm');
        } else {
          const result = await response.json();
          throw new Error(result.errors ? result.errors.map(err => err.message).join(', ') : 'Submission failed');
        }
      } catch (error) {
        if (status) {
          status.style.background = 'rgba(239, 78, 56, 0.15)';
          status.style.color = 'var(--red)';
          status.style.border = '1px solid rgba(239, 78, 56, 0.3)';
          status.textContent = 'Oops! There was an issue sending your message. Please try again or email contact@primeloft.tech directly.';
        }
      } finally {
        if (btn) {
          btn.disabled = false;
          btn.style.opacity = '1';
        }
      }
    });
  }

  // ---------- 7. NEWSLETTER FORMSPREE SUBMISSION HANDLER ----------
  document.querySelectorAll('.newsletterForm').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const status = form.nextElementSibling;

      // Invisible Honeypot Anti-Bot Trap: if filled, silently discard bot request
      const gotcha = form.querySelector('input[name="_gotcha"]');
      if (gotcha && gotcha.value.trim() !== '') {
        if (status && status.classList.contains('newsletterStatus')) {
          status.style.display = 'block';
          status.style.color = '#25D366';
          status.textContent = '✓ Subscribed successfully!';
        }
        form.reset();
        return;
      }

      if (btn) btn.disabled = true;
      if (status && status.classList.contains('newsletterStatus')) {
        status.style.display = 'block';
        status.style.color = 'var(--ink-soft)';
        status.textContent = 'Subscribing...';
      }

      try {
        const formData = new FormData(form);
        const endpoint = form.getAttribute('action') || 'https://formspree.io/f/xeajqqoy';

        const response = await fetch(endpoint, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          if (status && status.classList.contains('newsletterStatus')) {
            status.style.color = '#25D366';
            status.textContent = '✓ Subscribed successfully!';
          }
          form.reset();
          if (analyticsService) {
            analyticsService.pushEvent('newsletter_subscribed');
          }
        } else {
          throw new Error('Subscription failed');
        }
      } catch (err) {
        if (status && status.classList.contains('newsletterStatus')) {
          status.style.color = 'var(--red)';
          status.textContent = 'Failed to subscribe. Please try again.';
        }
      } finally {
        if (btn) btn.disabled = false;
      }
    });
  });

  // ---------- 8. LOTTIE ANIMATIONS CONTROLLER (ALL 6 DISCIPLINES) ----------
  let lottieLoadedPromise = null;
  function ensureLottieLoaded() {
    if (window.lottie) return Promise.resolve(window.lottie);
    if (lottieLoadedPromise) return lottieLoadedPromise;

    lottieLoadedPromise = new Promise((resolve) => {
      if (window.lottie) return resolve(window.lottie);

      let script = document.querySelector('script[src*="lottie"]');
      if (!script) {
        script = document.createElement('script');
        script.src = 'js/libs/lottie_light.min.js?v=2.5.0';
        document.head.appendChild(script);
      }

      const pollInterval = setInterval(() => {
        if (window.lottie) {
          clearInterval(pollInterval);
          resolve(window.lottie);
        }
      }, 30);

      script.addEventListener('load', () => {
        clearInterval(pollInterval);
        resolve(window.lottie);
      }, { once: true });

      // Fallback: If local file load takes over 2s, fetch from cloudflare cdn
      setTimeout(() => {
        if (!window.lottie) {
          const cdnScript = document.createElement('script');
          cdnScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie_light.min.js';
          cdnScript.onload = () => {
            clearInterval(pollInterval);
            resolve(window.lottie);
          };
          document.head.appendChild(cdnScript);
        }
      }, 2000);
    });

    return lottieLoadedPromise;
  }

  const animationJsonCache = new Map();
  async function fetchAnimationJson(url) {
    if (animationJsonCache.has(url)) return animationJsonCache.get(url);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      animationJsonCache.set(url, data);
      return data;
    } catch (e) {
      console.warn('Could not fetch Lottie JSON from', url, e);
      return null;
    }
  }

  async function initLottieAnimation(containers, lightUrl, darkUrl) {
    if (!containers || containers.length === 0) return;

    await ensureLottieLoaded();

    const isInitialDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const primaryUrl = isInitialDark ? darkUrl : lightUrl;
    const secondaryUrl = isInitialDark ? lightUrl : darkUrl;

    // Fetch primary theme immediately, background-fetch secondary theme for smooth switching
    await fetchAnimationJson(primaryUrl);
    fetchAnimationJson(secondaryUrl);

    containers.forEach(container => {
      let animInstance = null;

      function renderAnimation() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const targetUrl = isDark ? darkUrl : lightUrl;
        const targetData = animationJsonCache.get(targetUrl);

        if (animInstance) {
          try {
            animInstance.destroy();
          } catch (_) {}
          animInstance = null;
        }
        container.innerHTML = '';

        const config = {
          container: container,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          rendererSettings: {
            preserveAspectRatio: 'xMidYMid meet',
            progressiveLoad: true,
            hideOnTransparent: true
          }
        };

        if (targetData) {
          config.animationData = targetData;
        } else {
          config.path = targetUrl;
        }

        try {
          animInstance = window.lottie.loadAnimation(config);
        } catch (err) {
          console.error('Error rendering Lottie:', err);
        }
      }

      renderAnimation();

      // Reactive theme observer on <html data-theme="...">
      const themeObserver = new MutationObserver((mutations) => {
        for (const m of mutations) {
          if (m.type === 'attributes' && m.attributeName === 'data-theme') {
            renderAnimation();
            break;
          }
        }
      });
      themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

      // Viewport intersection observer: keeps playing near viewport (400px margin) to conserve resources without freeze
      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (animInstance) {
              if (entry.isIntersecting) {
                animInstance.play();
              } else {
                animInstance.pause();
              }
            }
          });
        }, { rootMargin: '400px 0px 400px 0px' });
        observer.observe(container);
      }
    });
  }

  const designContainers = document.querySelectorAll('.design-lottie-container');
  if (designContainers.length > 0) {
    initLottieAnimation(designContainers, 'animations/design-light.json', 'animations/design-dark.json');
  }

  const strategyContainers = document.querySelectorAll('.strategy-lottie-container');
  if (strategyContainers.length > 0) {
    initLottieAnimation(strategyContainers, 'animations/strategy-light.json', 'animations/strategy-dark.json');
  }

  const engineeringContainers = document.querySelectorAll('.engineering-lottie-container');
  if (engineeringContainers.length > 0) {
    initLottieAnimation(engineeringContainers, 'animations/engineering-light.json', 'animations/engineering-dark.json');
  }

  const aiContainers = document.querySelectorAll('.ai-lottie-container');
  if (aiContainers.length > 0) {
    initLottieAnimation(aiContainers, 'animations/ai-light.json', 'animations/ai-dark.json');
  }

  const cloudContainers = document.querySelectorAll('.cloud-lottie-container');
  if (cloudContainers.length > 0) {
    initLottieAnimation(cloudContainers, 'animations/cloud-light.json', 'animations/cloud-dark.json');
  }

  const qualityContainers = document.querySelectorAll('.quality-lottie-container');
  if (qualityContainers.length > 0) {
    initLottieAnimation(qualityContainers, 'animations/quality-light.json', 'animations/quality-dark.json');
  }

  const contactEmailContainers = document.querySelectorAll('.contact-email-lottie');
  if (contactEmailContainers.length > 0) {
    initLottieAnimation(contactEmailContainers, 'animations/contact-email-light.json', 'animations/contact-email-dark.json');
  }

  const contactPhoneContainers = document.querySelectorAll('.contact-phone-lottie');
  if (contactPhoneContainers.length > 0) {
    initLottieAnimation(contactPhoneContainers, 'animations/contact-phone-light.json', 'animations/contact-phone-dark.json');
  }

  const contactAddressContainers = document.querySelectorAll('.contact-address-lottie');
  if (contactAddressContainers.length > 0) {
    initLottieAnimation(contactAddressContainers, 'animations/contact-address-light.json', 'animations/contact-address-dark.json');
  }

  const contactResponseContainers = document.querySelectorAll('.contact-response-lottie');
  if (contactResponseContainers.length > 0) {
    initLottieAnimation(contactResponseContainers, 'animations/contact-response-light.json', 'animations/contact-response-dark.json');
  }

  const contactSendContainers = document.querySelectorAll('.contact-send-lottie');
  if (contactSendContainers.length > 0) {
    initLottieAnimation(contactSendContainers, 'animations/contact-send-light.json', 'animations/contact-send-dark.json');
  }

});


