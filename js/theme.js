/* ==========================================================================
   PRIME LOFT - SITE THEME INTERACTIONS
   Header state, scroll reveals, concept-scene playback and tabs.
   Dependency-free; runs alongside main.js on every renewed page.
   ========================================================================== */

const root = document.documentElement;
root.classList.add('pl-js');

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
// Directional entrances for the six newest service pages.
const serviceMotionPage = /pl-page-service-(ai|cloud|quality|maintenance|wordpress|squarespace)\b/.test(document.body.className);
if (serviceMotionPage) {
  const cards = document.querySelectorAll(`
    .auto-service-list > *, .auto-control__grid > *, .auto-delivery li,
    .ops-service-grid > *, .ops-approach li, .ops-handoff article,
    .qa-coverage-grid > *, .qa-deliverable-list > *, .qa-engagement-grid > *, .qa-process li,
    .care-coverage-grid > *, .care-platforms article, .care-plan-grid > *, .care-start li,
    .platform-service, .platform-process li,
    .auto-faq details, .ops-faq details, .qa-faq details, .care-faq details, .platform-faq details
  `);
  cards.forEach((card, index) => {
    // Avoid nested entrances multiplying their offsets and delays.
    if (card.parentElement.closest('[data-reveal]')) return;
    card.setAttribute('data-reveal', '');
    card.dataset.revealDirection = index % 2 ? 'right' : 'left';
    card.style.setProperty('--reveal-delay', `${index % 3 * 65}ms`);
  });
}
// Extend the motion language across home, about, contact and every service page.
const siteCards = document.querySelectorAll('main article, main .pl-step, main .pl-plan, main .pl-head, main .service-definition > .pl-wrap, main .about-capabilities__rows > *, main .agency-client-feature');
siteCards.forEach((card, index) => {
  if (card.hasAttribute('data-reveal-direction') || card.parentElement.closest('[data-reveal]') || card.closest('[role="tabpanel"]')) return;
  card.setAttribute('data-reveal', '');
  card.dataset.revealDirection = index % 2 ? 'right' : 'left';
  card.style.setProperty('--reveal-delay', `${index % 3 * 90}ms`);
});
document.querySelectorAll('main [data-reveal]:not([data-reveal-direction])').forEach((block, index) => {
  block.dataset.revealDirection = index % 2 ? 'right' : 'left';
});

// Observe a stationary wrapper so the moving text cannot miss its own trigger.
document.querySelectorAll('.pl-footer__mark').forEach(mark => {
  const frame = document.createElement('div');
  frame.className = 'pl-footer__mark-frame';
  mark.before(frame);
  frame.append(mark);
  mark.removeAttribute('data-reveal');
  mark.removeAttribute('data-reveal-direction');
  if (!('IntersectionObserver' in window) || reduceMotion) {
    frame.classList.add('is-visible');
    return;
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => frame.classList.toggle('is-visible', entry.isIntersecting));
  }, { threshold: 0.08 });
  observer.observe(frame);
});

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

// Animate native FAQ details in both directions without changing keyboard behavior.
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const faqStates = new Map();
if (serviceMotionPage) document.querySelectorAll(
  '.auto-faq details, .ops-faq details, .qa-faq details, .care-faq details, .platform-faq details'
).forEach(details => {
  const summary = details.querySelector('summary');
  if (!summary || !details.animate) return;
  const state = { animation: null, targetOpen: details.open };
  faqStates.set(details, state);
  const settle = () => {
    state.animation?.cancel();
    state.animation = null;
    details.open = state.targetOpen;
    details.style.removeProperty('height');
    details.style.removeProperty('overflow');
  };
  state.settle = settle;
  summary.addEventListener('click', event => {
    if (motionPreference.matches) return;
    event.preventDefault();
    const start = details.getBoundingClientRect().height;
    state.targetOpen = state.animation ? !state.targetOpen : !details.open;
    state.animation?.cancel();
    details.style.removeProperty('height');
    details.open = false;
    const collapsed = details.getBoundingClientRect().height;
    details.open = true;
    const expanded = details.getBoundingClientRect().height;
    details.style.overflow = 'hidden';
    state.animation = details.animate(
      [{ height: `${start}px` }, { height: `${state.targetOpen ? expanded : collapsed}px` }],
      { duration: 320, easing: 'cubic-bezier(.4,0,.2,1)' }
    );
    state.animation.onfinish = settle;
  });
});
motionPreference.addEventListener('change', event => {
  if (!event.matches) return;
  faqStates.forEach(state => state.settle());
  revealEls.forEach(el => el.classList.add('is-in', 'is-instant'));
});
window.addEventListener('resize', () => faqStates.forEach(state => {
  if (state.animation) state.settle();
}));
