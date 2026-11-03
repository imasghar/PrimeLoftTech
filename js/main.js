/* ==========================================================================
   PRIME LOFT - MAIN APPLICATION CONTROLLER
   Integrates SEO, navigation, forms, the project guide,
   and Lazy Loaded Animations.
   ========================================================================== */

import { SeoService } from './services/seo-service.js?v=1.1.0';
import { InertiaScrollService } from './services/inertia-scroll.js';
import { ChatbotService } from './services/chatbot.js?v=4.1.0';
import { FAQAccordion } from './services/faq-accordion.js';

document.addEventListener('DOMContentLoaded', () => {

  // ---------- 1. MODULAR SERVICES INITIALIZATION ----------
  InertiaScrollService.init();
  SeoService.init();
  ChatbotService.init();
  FAQAccordion.init();

  // ---------- 3. MOBILE MENU TOGGLE ----------
  const mobileToggleBtn = document.getElementById('mobileToggle');
  const primaryNav = document.querySelector('nav.primary');

  if (mobileToggleBtn && primaryNav) {
    mobileToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isActive = primaryNav.classList.toggle('active');
      mobileToggleBtn.setAttribute('aria-expanded', String(isActive));
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && primaryNav.classList.contains('active')) {
        primaryNav.classList.remove('active');
        mobileToggleBtn.setAttribute('aria-expanded', 'false');
        mobileToggleBtn.focus();
      }
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

  // ---------- 5. ANCHOR SMOOTH SCROLL ----------
  if (window.location.hash) {
    let targetEl = null;
    try { targetEl = document.getElementById(decodeURIComponent(window.location.hash.slice(1))); } catch { /* Invalid URL fragment: ignore it. */ }
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
    const btn = document.getElementById('btnSubmitContact');
    const status = document.getElementById('formStatus');
    const fields = [...contactForm.querySelectorAll('input:not([type="hidden"]):not([name="_gotcha"]), select, textarea')];
    const buttonLabel = btn?.querySelector('span');
    const idleLabel = buttonLabel?.textContent;
    let submitting = false;
    const showStatus = (state, text) => {
      if (!status) return;
      status.style.display = 'block';
      status.dataset.state = state;
      status.textContent = text;
    };
    const clearError = field => {
      field.setCustomValidity('');
      field.removeAttribute('aria-invalid');
      const errorId = `${field.id}-error`;
      const error = document.getElementById(errorId);
      if (error) error.hidden = true;
      const descriptions = (field.getAttribute('aria-describedby') || '').split(' ').filter(id => id && id !== errorId);
      if (descriptions.length) field.setAttribute('aria-describedby', descriptions.join(' '));
      else field.removeAttribute('aria-describedby');
    };
    const showError = (field, message) => {
      if (!field.id) return;
      let error = document.getElementById(`${field.id}-error`);
      if (!error) {
        error = document.createElement('p');
        error.id = `${field.id}-error`;
        error.className = 'contact-field-error';
        field.after(error);
      }
      const label = field.labels?.[0]?.textContent.replace('*', '').trim() || 'This field';
      error.textContent = `Error: ${label} — ${message}`;
      error.hidden = false;
      field.setAttribute('aria-invalid', 'true');
      const descriptions = new Set((field.getAttribute('aria-describedby') || '').split(' ').filter(Boolean));
      descriptions.add(error.id);
      field.setAttribute('aria-describedby', [...descriptions].join(' '));
    };
    fields.forEach(field => {
      field.addEventListener('input', () => clearError(field));
      field.addEventListener('change', () => clearError(field));
    });
    contactForm.addEventListener('invalid', event => {
      if (!fields.includes(event.target)) return;
      showError(event.target, event.target.validationMessage);
      showStatus('error', 'Please check the marked fields before sending your inquiry.');
    }, true);
    contactForm.addEventListener('reset', () => fields.forEach(clearError));
    contactForm.addEventListener('submit', async e => {
      e.preventDefault();
      if (submitting) return;
      fields.forEach(field => {
        clearError(field);
        if (field.required && !field.value.trim()) field.setCustomValidity('Please complete this field.');
        if (field.maxLength > 0 && field.value.length > field.maxLength) field.setCustomValidity(`Use no more than ${field.maxLength} characters.`);
      });
      if (!contactForm.reportValidity()) return;
      const gotcha = contactForm.querySelector('input[name="_gotcha"]');
      if (gotcha?.value.trim()) {
        showStatus('error', 'Your inquiry could not be processed. Please try again or email contact@primeloft.tech.');
        return;
      }
      submitting = true;
      contactForm.setAttribute('aria-busy', 'true');
      if (btn) { btn.disabled = true; btn.style.opacity = '0.7'; }
      if (buttonLabel) buttonLabel.textContent = 'Sending inquiry…';
      showStatus('pending', 'Sending your inquiry…');
      try {
        const response = await fetch(contactForm.getAttribute('action') || 'https://formspree.io/f/xeajqqoy', {
          method: 'POST', body: new FormData(contactForm), signal: AbortSignal.timeout(20000), headers: { Accept: 'application/json' }
        });
        if (response.ok) {
          contactForm.reset();
          showStatus('success', 'Thank you. Your inquiry has been accepted. We will review your project details.');
        } else {
          const result = await response.json().catch(() => null);
          let firstInvalid;
          if (Array.isArray(result?.errors)) result.errors.forEach(error => {
            const field = fields.find(candidate => candidate.name === error.field);
            if (!field) return;
            const message = typeof error.message === 'string' ? error.message.slice(0, 300) : 'Please check this field.';
            field.setCustomValidity(message);
            showError(field, message);
            firstInvalid ||= field;
          });
          showStatus('error', response.status === 429
            ? 'Your inquiry was not accepted. Please try again later or email contact@primeloft.tech.'
            : 'Your inquiry was not accepted. Please check any marked fields, try again or email contact@primeloft.tech.');
          firstInvalid?.focus();
        }
      } catch {
        // A timeout may happen after the server received the request; never claim success.
        showStatus('error', 'We could not confirm that your inquiry was received. Please try again or email contact@primeloft.tech.');
      } finally {
        submitting = false;
        contactForm.removeAttribute('aria-busy');
        if (btn) { btn.disabled = false; btn.style.opacity = '1'; }
        if (buttonLabel) buttonLabel.textContent = idleLabel;
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
          status.textContent = 'âœ“ Subscribed successfully!';
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
          signal: AbortSignal.timeout(20000),
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          if (status && status.classList.contains('newsletterStatus')) {
            status.style.color = '#25D366';
            status.textContent = 'âœ“ Subscribed successfully!';
          }
          form.reset();
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

      script.addEventListener('error', () => { clearInterval(pollInterval); resolve(null); }, { once: true });

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

  async function initLottieAnimation(containers, lightUrl) {
    if (!containers || containers.length === 0) return;

    await ensureLottieLoaded();

    await fetchAnimationJson(lightUrl);

    containers.forEach(container => {
      let animInstance = null;

      function renderAnimation() {
        const targetUrl = lightUrl;
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
    initLottieAnimation(designContainers, 'animations/design-light.json');
  }

  const strategyContainers = document.querySelectorAll('.strategy-lottie-container');
  if (strategyContainers.length > 0) {
    initLottieAnimation(strategyContainers, 'animations/strategy-light.json');
  }

  const engineeringContainers = document.querySelectorAll('.engineering-lottie-container');
  if (engineeringContainers.length > 0) {
    initLottieAnimation(engineeringContainers, 'animations/engineering-light.json');
  }

  const aiContainers = document.querySelectorAll('.ai-lottie-container');
  if (aiContainers.length > 0) {
    initLottieAnimation(aiContainers, 'animations/ai-light.json');
  }

  const cloudContainers = document.querySelectorAll('.cloud-lottie-container');
  if (cloudContainers.length > 0) {
    initLottieAnimation(cloudContainers, 'animations/cloud-light.json');
  }

  const qualityContainers = document.querySelectorAll('.quality-lottie-container');
  if (qualityContainers.length > 0) {
    initLottieAnimation(qualityContainers, 'animations/quality-light.json');
  }

  const mobileContainers = document.querySelectorAll('.mobile-lottie-container');
  if (mobileContainers.length > 0) {
    initLottieAnimation(mobileContainers, 'animations/mobile-app-light.json');
  }

  const seoContainers = document.querySelectorAll('.seo-lottie-container');
  if (seoContainers.length > 0) {
    initLottieAnimation(seoContainers, 'animations/seo-light.json');
  }

  const contactEmailContainers = document.querySelectorAll('.contact-email-lottie');
  if (contactEmailContainers.length > 0) {
    initLottieAnimation(contactEmailContainers, 'animations/contact-email-light.json');
  }

  const contactPhoneContainers = document.querySelectorAll('.contact-phone-lottie');
  if (contactPhoneContainers.length > 0) {
    initLottieAnimation(contactPhoneContainers, 'animations/contact-phone-light.json');
  }

  const contactAddressContainers = document.querySelectorAll('.contact-address-lottie');
  if (contactAddressContainers.length > 0) {
    initLottieAnimation(contactAddressContainers, 'animations/contact-address-light.json');
  }

  const contactResponseContainers = document.querySelectorAll('.contact-response-lottie');
  if (contactResponseContainers.length > 0) {
    initLottieAnimation(contactResponseContainers, 'animations/contact-response-light.json');
  }

  const contactSendContainers = document.querySelectorAll('.contact-send-lottie');
  if (contactSendContainers.length > 0) {
    initLottieAnimation(contactSendContainers, 'animations/contact-send-light.json');
  }

  // ---------- 9. HOVER LOTTIE ANIMATIONS CONTROLLER (HEADER ICONS) ----------
  async function initHoverLottieAnimation(containers, lightUrl, hoverTargetSelector) {
    if (!containers || containers.length === 0) return;

    await ensureLottieLoaded();

    await fetchAnimationJson(lightUrl);

    containers.forEach(container => {
      let animInstance = null;
      let isHovered = false;
      const hoverTarget = hoverTargetSelector ? (container.closest(hoverTargetSelector) || container) : container;

      hoverTarget.addEventListener('mouseenter', () => {
        isHovered = true;
        if (animInstance) {
          animInstance.goToAndPlay(0, true);
        }
      });
      hoverTarget.addEventListener('mouseleave', () => {
        isHovered = false;
        if (animInstance) {
          animInstance.stop();
          animInstance.goToAndStop(0, true);
        }
      });
      hoverTarget.addEventListener('touchstart', () => {
        isHovered = true;
        if (animInstance) {
          animInstance.goToAndPlay(0, true);
        }
      }, { passive: true });

      function renderAnimation() {
        const targetUrl = lightUrl;
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
          autoplay: false,
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
          animInstance.addEventListener('DOMLoaded', () => {
            if (isHovered) {
              animInstance.goToAndPlay(0, true);
            } else {
              animInstance.goToAndStop(0, true);
            }
          });
          try {
            if (isHovered) {
              animInstance.goToAndPlay(0, true);
            } else {
              animInstance.goToAndStop(0, true);
            }
          } catch (_) {}
        } catch (err) {
          console.error('Error rendering hover Lottie:', err);
        }
      }

      renderAnimation();

    });
  }

  // Header nav icons hover animations
  const navHomeContainers = document.querySelectorAll('.nav-home-lottie');
  if (navHomeContainers.length > 0) {
    initHoverLottieAnimation(navHomeContainers, 'animations/nav-home-light.json', '.navlink');
  }

  const navServicesContainers = document.querySelectorAll('.nav-services-lottie');
  if (navServicesContainers.length > 0) {
    initHoverLottieAnimation(navServicesContainers, 'animations/nav-services-light.json', '.navlink');
  }

  const navAboutContainers = document.querySelectorAll('.nav-about-lottie');
  if (navAboutContainers.length > 0) {
    initHoverLottieAnimation(navAboutContainers, 'animations/nav-about-light.json', '.navlink');
  }

  // Header Contact Us button hover animation (replaces arrow)
  // Contrasting contact icon for the primary button.
  const contactBtnContainers = document.querySelectorAll('.contact-btn-lottie');
  if (contactBtnContainers.length > 0) {
    initHoverLottieAnimation(contactBtnContainers, 'animations/nav-contact-dark.json', '.btn');
  }

  const navContactContainers = document.querySelectorAll('.nav-contact-lottie:not(.contact-btn-lottie)');
  if (navContactContainers.length > 0) {
    initHoverLottieAnimation(navContactContainers, 'animations/nav-contact-light.json', '.navlink');
  }

  // ---------- 13. CLIENTS CAROUSEL CONTROLLER ----------
  const clientTrack = document.getElementById('clientCarouselTrack');
  const prevBtn = document.getElementById('clientsPrev');
  const nextBtn = document.getElementById('clientsNext');
  const dotsContainer = document.getElementById('clientCarouselDots');

  if (clientTrack && prevBtn && nextBtn) {
    const dots = dotsContainer ? Array.from(dotsContainer.querySelectorAll('.client-dot')) : [];

    const getScrollStep = () => {
      const firstItem = clientTrack.querySelector('.client-carousel-item');
      return firstItem ? firstItem.offsetWidth + 24 : 240;
    };

    const updateNavState = () => {
      const maxScroll = clientTrack.scrollWidth - clientTrack.clientWidth;
      const canScroll = maxScroll > 8;
      prevBtn.disabled = !canScroll || clientTrack.scrollLeft <= 4;
      nextBtn.disabled = !canScroll || clientTrack.scrollLeft >= maxScroll - 4;
      if (dotsContainer) {
        dotsContainer.style.display = canScroll && dots.length > 1 ? 'flex' : 'none';
      }
    };

    const updateDots = () => {
      if (!dots.length) return;
      const maxScroll = clientTrack.scrollWidth - clientTrack.clientWidth;
      if (maxScroll <= 0) {
        dots.forEach((dot, idx) => dot.classList.toggle('active', idx === 0));
        return;
      }
      const scrollRatio = clientTrack.scrollLeft / maxScroll;
      const activeIdx = Math.min(dots.length - 1, Math.max(0, Math.round(scrollRatio * (dots.length - 1))));
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === activeIdx);
      });
    };

    prevBtn.addEventListener('click', () => {
      clientTrack.scrollBy({ left: -getScrollStep(), behavior: 'smooth' });
    });

    nextBtn.addEventListener('click', () => {
      const maxScroll = clientTrack.scrollWidth - clientTrack.clientWidth;
      if (clientTrack.scrollLeft + getScrollStep() >= maxScroll - 10) {
        clientTrack.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        clientTrack.scrollBy({ left: getScrollStep(), behavior: 'smooth' });
      }
    });

    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        const maxScroll = clientTrack.scrollWidth - clientTrack.clientWidth;
        const targetScroll = (maxScroll / Math.max(1, dots.length - 1)) * idx;
        clientTrack.scrollTo({ left: targetScroll, behavior: 'smooth' });
      });
    });

    let scrollTimeout;
    clientTrack.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        updateDots();
        updateNavState();
      }, 50);
    }, { passive: true });

    window.addEventListener('resize', updateNavState, { passive: true });
    updateDots();
    updateNavState();
  }

  // ---------- 14. CURVED STEPPER CONTROLLER (CONTACT PAGE) ----------
  const stepperRoot = document.querySelector('[data-stepper]');
  if (stepperRoot) {
    const svg = stepperRoot.querySelector('svg');
    const path = stepperRoot.querySelector('[data-curve-path]');
    const steps = Array.from(stepperRoot.querySelectorAll('.step'));

    function drawStepperCurve() {
      if (!stepperRoot || !svg || !path || !steps.length) return;
      const box = stepperRoot.getBoundingClientRect();
      if (!box.width || !box.height) return;
      svg.setAttribute('viewBox', `0 0 ${box.width} ${box.height}`);
      const anchors = steps.map((el, i) => {
        const r = el.getBoundingClientRect();
        return {
          x: i % 2 === 0 ? r.right - box.left : r.left - box.left,
          y: r.top - box.top + r.height / 2
        };
      });
      let d = '';
      for (let i = 0; i < anchors.length - 1; i++) {
        const a = anchors[i], b = anchors[i + 1], dy = b.y - a.y;
        d += (i === 0 ? `M ${a.x} ${a.y} ` : '') +
          `C ${a.x + (i % 2 === 0 ? 85 : -85)} ${a.y + dy * .45}, ${b.x + (i % 2 === 0 ? -85 : 85)} ${b.y - dy * .45}, ${b.x} ${b.y} `;
      }
      path.setAttribute('d', d);
    }

    if (window.ResizeObserver) {
      new ResizeObserver(drawStepperCurve).observe(stepperRoot);
    }
    window.addEventListener('load', drawStepperCurve);
    window.addEventListener('resize', drawStepperCurve, { passive: true });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(drawStepperCurve);
    }
    requestAnimationFrame(drawStepperCurve);
    setTimeout(drawStepperCurve, 150);
    setTimeout(drawStepperCurve, 500);
  }

});


