/* ==========================================================================
   PRIME LOFT - SITE THEME INTERACTIONS
   Header state, scroll reveals, concept-scene playback and tabs.
   Dependency-free; runs alongside main.js on every renewed page.
   ========================================================================== */

const root = document.documentElement;
root.classList.add('pl-js');

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------- 0. PREVIEW THEME OVERRIDE (?theme=light|dark, not persisted) ----------
const previewTheme = new URLSearchParams(location.search).get('theme');
if (previewTheme === 'light' || previewTheme === 'dark') {
  root.setAttribute('data-theme', previewTheme);
}

// ---------- 1. HEADER: STRONGER SURFACE ONCE THE PAGE SCROLLS ----------
const header = document.querySelector('header.pl-header');
if (header) {
  let ticking = false;
  const update = () => {
    ticking = false;
    header.classList.toggle('is-scrolled', window.scrollY > 16);
  };
  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }, { passive: true });
  update();
}

// ---------- 2. SCROLL REVEALS ----------
const revealEls = document.querySelectorAll('[data-reveal]');
if ('IntersectionObserver' in window && !reduceMotion) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  revealEls.forEach(el => revealObserver.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('is-in'));
}

// Keyboard focus reveals its block immediately so focused controls are never invisible
document.addEventListener('focusin', e => {
  const block = e.target.closest && e.target.closest('[data-reveal]');
  if (block && !block.classList.contains('is-in')) block.classList.add('is-in', 'is-instant');
});

// ---------- 3. CONCEPT SCENES: PLAY ENTRANCE WHEN VISIBLE ----------
const frames = Array.from(document.querySelectorAll('.pl-scene-frame')).filter(f => !f.closest('[role="tabpanel"]'));
if ('IntersectionObserver' in window && !reduceMotion) {
  const frameObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-current');
        frameObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });
  frames.forEach(f => frameObserver.observe(f));
} else {
  frames.forEach(f => f.classList.add('is-current'));
}

// ---------- 4. TABS (WAI-ARIA tabs pattern) ----------
document.querySelectorAll('[data-tabs]').forEach(group => {
  const tabs = Array.from(group.querySelectorAll('[role="tab"]'));
  const panels = tabs.map(tab => document.getElementById(tab.getAttribute('aria-controls')));

  function select(index, focus) {
    tabs.forEach((tab, i) => {
      const on = i === index;
      tab.setAttribute('aria-selected', String(on));
      tab.tabIndex = on ? 0 : -1;
      if (panels[i]) {
        panels[i].hidden = !on;
        const frame = panels[i].querySelector('.pl-scene-frame');
        if (frame) {
          frame.classList.remove('is-current');
          if (on) requestAnimationFrame(() => frame.classList.add('is-current'));
        }
      }
    });
    if (focus) tabs[index].focus();
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(i, false));
    tab.addEventListener('keydown', e => {
      const last = tabs.length - 1;
      let next = null;
      if (e.key === 'ArrowRight') next = i === last ? 0 : i + 1;
      if (e.key === 'ArrowLeft') next = i === 0 ? last : i - 1;
      if (e.key === 'Home') next = 0;
      if (e.key === 'End') next = last;
      if (next !== null) {
        e.preventDefault();
        select(next, true);
      }
    });
  });

  select(Math.max(0, tabs.findIndex(t => t.getAttribute('aria-selected') === 'true')), false);
});
