/* ==========================================================================
   PRIMELOFT - MAIN APPLICATION CONTROLLER (v3)
   Theme, navigation, reveal/motion, hero depth, counters, slider, forms,
   consent-aware tracking and a generic lazy Lottie loader. No framework.
   ========================================================================== */

import { trackingService } from './services/tracking-service.js';
import { analyticsService } from './services/analytics-service.js';
import { SeoService } from './services/seo-service.js';
import { CookieConsentUI } from './services/cookie-consent-ui.js';

const root = document.documentElement;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
const isMobileNav = () => window.matchMedia('(max-width: 760px)').matches;

/* ---------- theme (applied inline in <head>; keep bfcache in sync) ---------- */
function applyTheme(theme) {
  root.setAttribute('data-theme', theme);
  try { localStorage.setItem('primeloft-theme', theme); } catch (_) {}
  const btn = document.getElementById('themeToggle');
  if (btn) btn.setAttribute('aria-pressed', String(theme === 'dark'));
}
window.addEventListener('pageshow', (e) => {
  if (!e.persisted) return;
  try { const t = localStorage.getItem('primeloft-theme'); if (t) root.setAttribute('data-theme', t); } catch (_) {}
});

document.addEventListener('DOMContentLoaded', () => {
  root.classList.add('js');

  /* ---------- services ---------- */
  SeoService.init();
  trackingService.init();
  analyticsService.init();
  CookieConsentUI.init();

  /* ---------- theme toggle ---------- */
  const themeToggleBtn = document.getElementById('themeToggle');
  if (themeToggleBtn) {
    themeToggleBtn.setAttribute('aria-pressed', String(root.getAttribute('data-theme') === 'dark'));
    themeToggleBtn.addEventListener('click', () => applyTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'));
  }

  /* ---------- header scroll state ---------- */
  const header = document.getElementById('siteHeader');
  if (header) {
    let ticking = false;
    const update = () => { header.classList.toggle('scrolled', window.scrollY > 12); ticking = false; };
    window.addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(update); ticking = true; } }, { passive: true });
    update();
  }

  /* ---------- mobile nav + services menu ---------- */
  const mobileToggleBtn = document.getElementById('mobileToggle');
  const primaryNav = document.querySelector('nav.primary');
  const megas = document.querySelectorAll('.has-mega');

  const closeMegas = () => megas.forEach((m) => { m.classList.remove('open'); m.querySelector('.navlink')?.setAttribute('aria-expanded', 'false'); });
  const closeMobile = () => {
    if (!primaryNav) return;
    primaryNav.classList.remove('active');
    document.body.style.overflow = '';
    mobileToggleBtn?.setAttribute('aria-expanded', 'false');
    mobileToggleBtn?.setAttribute('aria-label', 'Open menu');
    closeMegas();
  };

  if (mobileToggleBtn && primaryNav) {
    mobileToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = primaryNav.classList.toggle('active');
      document.body.style.overflow = open ? 'hidden' : '';
      mobileToggleBtn.setAttribute('aria-expanded', String(open));
      mobileToggleBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      if (!open) closeMegas();
    });
    primaryNav.querySelectorAll('a').forEach((link) => {
      if (link.closest('.has-mega') && link.classList.contains('navlink')) return;
      link.addEventListener('click', () => { if (isMobileNav()) closeMobile(); });
    });
    window.addEventListener('resize', () => { if (!isMobileNav()) { document.body.style.overflow = ''; primaryNav.classList.remove('active'); mobileToggleBtn.setAttribute('aria-expanded', 'false'); } });
  }

  megas.forEach((item) => {
    const link = item.querySelector('.navlink');
    if (!link) return;
    link.addEventListener('click', (e) => {
      // Mobile: accordion. Desktop: first click/tap opens, second navigates.
      if (isMobileNav() || !item.classList.contains('open') && !finePointer.matches) {
        e.preventDefault();
        const open = item.classList.toggle('open');
        link.setAttribute('aria-expanded', String(open));
      }
    });
    link.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === ' ') { e.preventDefault(); item.classList.add('open'); link.setAttribute('aria-expanded', 'true'); item.querySelector('.mega a')?.focus(); }
    });
    item.addEventListener('mouseleave', () => { if (!isMobileNav()) { item.classList.remove('open'); link.setAttribute('aria-expanded', 'false'); } });
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.has-mega')) closeMegas();
    if (primaryNav?.classList.contains('active') && !e.target.closest('nav.primary') && !e.target.closest('#mobileToggle')) closeMobile();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeMegas(); closeMobile(); } });

  /* ---------- reveal on scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion.matches) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('visible'); io.unobserve(en.target); } });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    const vh = window.innerHeight;
    revealEls.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < vh * 0.9 && r.bottom > 0) el.classList.add('visible'); // already on screen: show immediately
      else io.observe(el);
    });
  } else {
    revealEls.forEach((el) => el.classList.add('visible'));
  }

  /* ---------- hero: entrance + depth parallax ---------- */
  const hero = document.querySelector('.hero-home');
  if (hero) {
    const ready = () => hero.classList.add('hero-ready');
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(ready, ready); else ready();
    setTimeout(ready, 900); // never leave the hero hidden
    const stage = hero.querySelector('.hero-stage');
    const layers = hero.querySelectorAll('[data-depth]');
    if (stage && layers.length && finePointer.matches && !reduceMotion.matches) {
      let tx = 0, ty = 0, cx = 0, cy = 0, raf = null;
      const loop = () => {
        cx += (tx - cx) * 0.08; cy += (ty - cy) * 0.08;
        layers.forEach((l) => { const d = parseFloat(l.dataset.depth) || 0; l.style.transform = `translate3d(${(cx * 18 * d).toFixed(2)}px, ${(cy * 14 * d).toFixed(2)}px, 0)`; });
        if (Math.abs(tx - cx) > 0.002 || Math.abs(ty - cy) > 0.002) raf = requestAnimationFrame(loop); else raf = null;
      };
      hero.addEventListener('pointermove', (e) => {
        const r = stage.getBoundingClientRect();
        tx = ((e.clientX - (r.left + r.width / 2)) / r.width) * 2;
        ty = ((e.clientY - (r.top + r.height / 2)) / r.height) * 2;
        if (!raf) raf = requestAnimationFrame(loop);
      });
      hero.addEventListener('pointerleave', () => { tx = 0; ty = 0; if (!raf) raf = requestAnimationFrame(loop); });
    }
  }

  /* ---------- animated counters ---------- */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const run = (el) => {
      const target = parseFloat(el.dataset.count);
      const prefix = el.dataset.prefix ? el.dataset.prefix.replace('&lt;', '<') : '';
      const suffix = el.dataset.suffix || '';
      const decimals = el.dataset.decimal === 'true' ? 1 : 0;
      const dur = 1500, t0 = performance.now();
      const step = (now) => {
        const p = Math.min(1, (now - t0) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = prefix + (target * eased).toFixed(decimals) + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      if (reduceMotion.matches) el.textContent = prefix + target.toFixed(decimals) + suffix; else requestAnimationFrame(step);
    };
    const io = new IntersectionObserver((entries) => entries.forEach((en) => { if (en.isIntersecting) { run(en.target); io.unobserve(en.target); } }), { threshold: 0.5 });
    counters.forEach((c) => io.observe(c));
  }

  /* ---------- process progress line ---------- */
  document.querySelectorAll('[data-process]').forEach((list) => {
    const steps = list.querySelectorAll('.process-step');
    const update = () => {
      const r = list.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.35)));
      list.style.setProperty('--progress', p.toFixed(3));
      steps.forEach((s, i) => s.classList.toggle('is-active', p >= (i + 0.5) / steps.length));
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  });

  /* ---------- 3D tilt on cards (fine pointers only) ---------- */
  if (finePointer.matches && !reduceMotion.matches) {
    document.querySelectorAll('.tilt').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(900px) rotateX(${(-y * 6).toFixed(2)}deg) rotateY(${(x * 8).toFixed(2)}deg) translateY(-4px)`;
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
  }

  /* ---------- testimonials slider ---------- */
  document.querySelectorAll('[data-testi]').forEach((slider) => {
    const track = slider.querySelector('.testi-track');
    const cards = Array.from(track.children);
    const dotsWrap = slider.querySelector('[data-testi-dots]');
    const section = slider.closest('section');
    const prev = section?.querySelector('[data-testi-prev]');
    const next = section?.querySelector('[data-testi-next]');
    if (!track || !cards.length) return;
    const dots = cards.map((_, i) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'testi-dot'; b.setAttribute('aria-label', `Go to testimonial ${i + 1}`); b.addEventListener('click', () => goTo(i)); dotsWrap?.appendChild(b); return b; });
    const padLeft = () => parseFloat(getComputedStyle(track).paddingLeft) || 0;
    const index = () => { const x = track.scrollLeft + padLeft(); let best = 0, bd = Infinity; cards.forEach((c, i) => { const d = Math.abs(c.offsetLeft - x); if (d < bd) { bd = d; best = i; } }); return best; };
    const goTo = (i) => { const c = cards[(i + cards.length) % cards.length]; track.scrollTo({ left: c.offsetLeft - padLeft(), behavior: reduceMotion.matches ? 'auto' : 'smooth' }); };
    const sync = () => { const i = index(); dots.forEach((d, k) => d.classList.toggle('active', k === i)); };
    track.addEventListener('scroll', () => requestAnimationFrame(sync), { passive: true });
    prev?.addEventListener('click', () => goTo(index() - 1));
    next?.addEventListener('click', () => goTo(index() + 1));
    track.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') { e.preventDefault(); goTo(index() + 1); } if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(index() - 1); } });
    // drag to scroll
    let down = false, startX = 0, startLeft = 0, moved = false;
    track.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') return; down = true; moved = false; startX = e.clientX; startLeft = track.scrollLeft; track.classList.add('dragging'); });
    window.addEventListener('pointermove', (e) => { if (!down) return; const dx = e.clientX - startX; if (Math.abs(dx) > 3) moved = true; track.scrollLeft = startLeft - dx; });
    window.addEventListener('pointerup', () => { if (!down) return; down = false; track.classList.remove('dragging'); goTo(index()); });
    track.addEventListener('click', (e) => { if (moved) e.preventDefault(); }, true);
    // autoplay
    let timer = null;
    const start = () => { if (reduceMotion.matches || timer) return; timer = setInterval(() => { const i = index(); goTo(i >= cards.length - 1 ? 0 : i + 1); }, 6000); };
    const stop = () => { clearInterval(timer); timer = null; };
    slider.addEventListener('pointerenter', stop); slider.addEventListener('pointerleave', start);
    slider.addEventListener('focusin', stop); slider.addEventListener('focusout', start);
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
    new IntersectionObserver((en) => en.forEach((x) => (x.isIntersecting ? start() : stop())), { threshold: 0.3 }).observe(slider);
    sync();
  });

  /* ---------- FAQ: keep one item open per list ---------- */
  document.querySelectorAll('.faq-list').forEach((list) => {
    list.addEventListener('toggle', (e) => { if (e.target.open) list.querySelectorAll('details[open]').forEach((d) => { if (d !== e.target) d.open = false; }); }, true);
  });

  /* ---------- anchor offset for hash links ---------- */
  if (window.location.hash) {
    const target = document.querySelector(window.location.hash);
    if (target) setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150);
  }

  /* ---------- contact form (Formspree, AJAX) ---------- */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const status = document.getElementById('formStatus');
    const btn = document.getElementById('btnSubmitContact');
    const setStatus = (type, msg) => { if (!status) return; status.hidden = false; status.className = 'form-status ' + type; status.textContent = msg; };
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      contactForm.querySelectorAll('.is-invalid').forEach((el) => el.classList.remove('is-invalid'));
      if (!contactForm.checkValidity()) {
        const bad = contactForm.querySelectorAll(':invalid');
        bad.forEach((el) => el.classList.add('is-invalid'));
        bad[0]?.focus();
        setStatus('err', 'Please fill in the highlighted fields so we can get back to you.');
        return;
      }
      const gotcha = contactForm.querySelector('input[name="_gotcha"]');
      if (gotcha && gotcha.value.trim() !== '') { setStatus('ok', 'Thank you! Your message has been sent.'); contactForm.reset(); return; }
      if (btn) btn.disabled = true;
      setStatus('busy', 'Sending your message…');
      try {
        const res = await fetch(contactForm.getAttribute('action'), { method: 'POST', body: new FormData(contactForm), headers: { Accept: 'application/json' } });
        if (!res.ok) throw new Error('Submission failed');
        setStatus('ok', 'Thank you! Your message is on its way. A senior partner will reply within one business day.');
        contactForm.reset();
        analyticsService.trackFormSubmission('contactForm');
      } catch (err) {
        setStatus('err', 'Something went wrong sending your message. Please try again or email contact@primeloft.tech directly.');
      } finally {
        if (btn) btn.disabled = false;
      }
    });
    contactForm.querySelectorAll('input, select, textarea').forEach((el) => el.addEventListener('input', () => el.classList.remove('is-invalid')));
  }

  /* ---------- newsletter forms ---------- */
  document.querySelectorAll('.newsletterForm').forEach((form) => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const status = form.parentElement.querySelector('.newsletterStatus');
      const set = (cls, msg) => { if (status) { status.className = 'newsletterStatus ' + cls; status.textContent = msg; } };
      const gotcha = form.querySelector('input[name="_gotcha"]');
      if (gotcha && gotcha.value.trim() !== '') { set('ok', 'Subscribed. Thank you!'); form.reset(); return; }
      if (btn) btn.disabled = true;
      set('', 'Subscribing…');
      try {
        const res = await fetch(form.getAttribute('action'), { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
        if (!res.ok) throw new Error('fail');
        set('ok', 'Subscribed. Thank you!');
        form.reset();
        analyticsService.pushEvent('newsletter_subscribed');
      } catch (_) {
        set('err', 'Could not subscribe right now. Please try again.');
      } finally {
        if (btn) btn.disabled = false;
      }
    });
  });

  /* ---------- Lottie: generic lazy loader for [data-lottie] ---------- */
  initLottie();
});

/* ==========================================================================
   LOTTIE LOADER
   <div data-lottie="name"> loads animations/name-{light|dark}.json, lazily,
   re-renders on theme change and pauses when off-screen.
   ========================================================================== */
let lottieLib = null;
function ensureLottie() {
  if (window.lottie) return Promise.resolve(window.lottie);
  if (lottieLib) return lottieLib;
  lottieLib = new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'js/libs/lottie_light.min.js?v=5.12.2';
    s.async = true;
    s.onload = () => resolve(window.lottie);
    s.onerror = () => {
      const cdn = document.createElement('script');
      cdn.src = 'https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie_light.min.js';
      cdn.crossOrigin = 'anonymous';
      cdn.onload = () => resolve(window.lottie);
      cdn.onerror = reject;
      document.head.appendChild(cdn);
    };
    document.head.appendChild(s);
  });
  return lottieLib;
}
const jsonCache = new Map();
function fetchJson(url) {
  if (!jsonCache.has(url)) {
    jsonCache.set(url, fetch(url).then((r) => { if (!r.ok) throw new Error(url + ' ' + r.status); return r.json(); }).catch((e) => { jsonCache.delete(url); console.warn('Lottie load failed', e); return null; }));
  }
  return jsonCache.get(url);
}
function initLottie() {
  const els = document.querySelectorAll('[data-lottie]');
  if (!els.length) return;
  const themeOf = () => (root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');
  const instances = [];

  async function mount(el) {
    if (el.dataset.lottieMounted) return;
    el.dataset.lottieMounted = '1';
    const name = el.dataset.lottie;
    const lib = await ensureLottie();
    if (!lib) return;
    const state = { el, name, anim: null, visible: true };
    instances.push(state);
    const render = async () => {
      const theme = themeOf();
      const data = await fetchJson(`animations/${name}-${theme}.json`);
      if (!data) return;
      if (state.anim) { try { state.anim.destroy(); } catch (_) {} state.anim = null; }
      el.innerHTML = '';
      state.anim = lib.loadAnimation({ container: el, renderer: 'svg', loop: true, autoplay: !reduceMotion.matches, animationData: data, rendererSettings: { preserveAspectRatio: 'xMidYMid meet', progressiveLoad: true, hideOnTransparent: true } });
      if (reduceMotion.matches) state.anim.goToAndStop(Math.round(data.op * 0.6), true);
      if (!state.visible) state.anim.pause();
      // prefetch the other theme in idle time
      const other = theme === 'dark' ? 'light' : 'dark';
      setTimeout(() => fetchJson(`animations/${name}-${other}.json`), 1500);
    };
    state.render = render;
    await render();
    if ('IntersectionObserver' in window) {
      new IntersectionObserver((entries) => entries.forEach((en) => { state.visible = en.isIntersecting; if (!state.anim) return; en.isIntersecting ? state.anim.play() : state.anim.pause(); }), { rootMargin: '200px 0px' }).observe(el);
    }
  }

  // eager for the hero, lazy for the rest
  const eager = [], lazy = [];
  els.forEach((el) => (el.classList.contains('lottie-hero') ? eager : lazy).push(el));
  eager.forEach(mount);
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => entries.forEach((en) => { if (en.isIntersecting) { io.unobserve(en.target); mount(en.target); } }), { rootMargin: '400px 0px' });
    lazy.forEach((el) => io.observe(el));
  } else {
    lazy.forEach(mount);
  }

  new MutationObserver(() => instances.forEach((s) => s.render && s.render())).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
  document.addEventListener('visibilitychange', () => instances.forEach((s) => { if (!s.anim) return; document.hidden ? s.anim.pause() : (s.visible && s.anim.play()); }));
}
