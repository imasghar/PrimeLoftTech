/* ==========================================================================
   PRIME LOFT - EDITORIAL HOMEPAGE (PROTOTYPE) INTERACTIONS
   Header state, scroll reveals, hero parallax, statement word-fill and the
   sticky services stage. Dependency-free; works with or without Lenis.
   ========================================================================== */

const root = document.documentElement;
root.classList.add('ed-js');

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

// ---------- 0. PREVIEW THEME OVERRIDE (?theme=light|dark, not persisted) ----------
const previewTheme = new URLSearchParams(location.search).get('theme');
if (previewTheme === 'light' || previewTheme === 'dark') {
  root.setAttribute('data-theme', previewTheme);
}

// ---------- 1. SCROLL LOOP (one rAF-throttled listener) ----------
const scrollHandlers = [];
let ticking = false;

function runScrollHandlers() {
  ticking = false;
  const y = window.scrollY;
  scrollHandlers.forEach(fn => fn(y));
}

window.addEventListener('scroll', () => {
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(runScrollHandlers);
  }
}, { passive: true });

window.addEventListener('resize', () => requestAnimationFrame(runScrollHandlers), { passive: true });

// ---------- 2. HEADER: SOLID ONCE THE PAGE SCROLLS (ALWAYS STAYS VISIBLE) ----------
const header = document.querySelector('header');

if (header) {
  scrollHandlers.push(y => header.classList.toggle('is-scrolled', y > 24));
}

// ---------- 3. SCROLL REVEALS ----------
const revealEls = document.querySelectorAll('[data-ed-reveal]');
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
  const block = e.target.closest && e.target.closest('[data-ed-reveal]');
  if (block && !block.classList.contains('is-in')) block.classList.add('is-in', 'is-instant');
});

// ---------- 4. HERO COMPOSITION: POINTER + SCROLL PARALLAX ----------
const comp = document.getElementById('edHeroComp');
const hero = document.querySelector('.ed-hero');

if (comp && hero) {
  const stage = comp.querySelector('.ed-comp-stage');
  comp.querySelectorAll('.ed-layer').forEach(layer => {
    layer.style.setProperty('--depth', layer.dataset.depth || '1');
  });

  if (!reduceMotion) {
    if (finePointer) {
      hero.addEventListener('pointermove', e => {
        const r = hero.getBoundingClientRect();
        const mx = ((e.clientX - r.left) / r.width - 0.5) * 2;
        const my = ((e.clientY - r.top) / r.height - 0.5) * 2;
        stage.style.setProperty('--mx', mx.toFixed(3));
        stage.style.setProperty('--my', my.toFixed(3));
      });
      hero.addEventListener('pointerleave', () => {
        stage.style.setProperty('--mx', '0');
        stage.style.setProperty('--my', '0');
      });
    }

    scrollHandlers.push(y => {
      if (y < window.innerHeight * 1.2) stage.style.setProperty('--sy', Math.round(y));
    });
  }
}

// ---------- 5. STATEMENT: WORD-BY-WORD FILL ON SCROLL ----------
document.querySelectorAll('[data-ed-words]').forEach(el => {
  const words = el.textContent.trim().split(/\s+/);
  el.textContent = '';
  const spans = words.map((word, i) => {
    const span = document.createElement('span');
    span.className = 'w';
    span.textContent = word;
    el.appendChild(span);
    if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
    return span;
  });

  if (reduceMotion) {
    spans.forEach(s => s.classList.add('on'));
    return;
  }

  let lit = -1;
  scrollHandlers.push(() => {
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight;
    const progress = Math.min(1, Math.max(0, (vh * 0.82 - r.top) / (r.height + vh * 0.3)));
    const n = Math.round(progress * spans.length);
    if (n === lit) return;
    lit = n;
    spans.forEach((s, i) => s.classList.toggle('on', i < n));
  });
});

// ---------- 6. SERVICES: STICKY STAGE WITH SCENE SWITCHING ----------
const layout = document.querySelector('.ed-svc-layout');
const host = document.getElementById('edStageHost');
const stageNum = document.getElementById('edStageNum');
const stageBar = document.getElementById('edStageBar');

if (layout && host) {
  const items = Array.from(layout.querySelectorAll('.ed-svc'));
  const frames = items.map(item => item.querySelector('.ed-scene-frame'));
  const wide = window.matchMedia('(min-width: 1000px)');
  let active = 0;

  function setActive(index) {
    active = index;
    items.forEach((item, i) => item.classList.toggle('is-active', i === index));
    if (layout.classList.contains('has-stage')) {
      frames.forEach((frame, i) => frame.classList.toggle('is-current', i === index));
    }
    if (stageNum) stageNum.textContent = String(index + 1).padStart(2, '0');
    if (stageBar) stageBar.style.width = `${((index + 1) / items.length) * 100}%`;
  }

  function mount() {
    if (wide.matches) {
      frames.forEach(frame => host.appendChild(frame));
      layout.classList.add('has-stage');
    } else {
      layout.classList.remove('has-stage');
      items.forEach((item, i) => item.appendChild(frames[i]));
      frames.forEach(frame => frame.classList.remove('is-current'));
      frameObserver && frames.forEach(frame => frameObserver.observe(frame));
    }
    setActive(active);
  }

  // Stacked (narrow) layout: play each scene's entrance as it scrolls into view
  const frameObserver = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !layout.classList.contains('has-stage')) {
        entry.target.classList.add('is-current');
        frameObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 }) : null;

  if (!frameObserver) frames.forEach(frame => frame.classList.add('is-current'));

  // Wide layout: the item crossing the viewport's middle band becomes active
  if ('IntersectionObserver' in window) {
    const itemObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setActive(items.indexOf(entry.target));
      });
    }, { rootMargin: '-48% 0px -48% 0px', threshold: 0 });
    items.forEach(item => itemObserver.observe(item));
  }

  mount();
  wide.addEventListener('change', mount);
}

runScrollHandlers();
