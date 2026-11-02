// A sticky reading index on desktop and a compact disclosure on mobile.
const index = document.querySelector('.seo-index');
if (index) {
  const mobile = window.matchMedia('(max-width: 900px)');
  const updateLayout = () => { index.open = !mobile.matches; };
  updateLayout();
  mobile.addEventListener('change', updateLayout);
  const links = [...index.querySelectorAll('a[href^="#"]')];
  const sections = links.map(link => document.getElementById(link.hash.slice(1))).filter(Boolean);
  let scheduled = false;
  const updateCurrent = () => {
    scheduled = false;
    let current = sections[0];
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= 170) current = section;
      else break;
    }
    links.forEach(link => {
      if (link.hash === `#${current?.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };
  window.addEventListener('scroll', () => {
    if (!scheduled) { scheduled = true; requestAnimationFrame(updateCurrent); }
  }, { passive: true });
  links.forEach(link => link.addEventListener('click', () => {
    if (mobile.matches) index.open = false;
  }));
  updateCurrent();
}

// Animate on arrival without hiding content before JavaScript is available.
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const activeAnimations = new Map();
const revealGroups = [
  ['.seo-hero__grid > div:first-child', 'h1, p, .seo-hero__actions'],
  ['.seo-search-visual', ':scope > *'],
  ['.seo-reading-content > section', ':scope > *'],
  ['.seo-close', '.seo-wrap > *'],
];

if ('IntersectionObserver' in window && Element.prototype.animate) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(({ target, isIntersecting }) => {
      if (!isIntersecting) return;
      observer.unobserve(target);
      if (motionPreference.matches) return;
      const selector = target.dataset.seoMotionChildren;
      target.querySelectorAll(selector).forEach((element, position) => {
        if (element.contains(document.activeElement)) return;
        const animation = element.animate([
          { opacity: 0, transform: 'translateY(22px)' },
          { opacity: 1, transform: 'translateY(0)' },
        ], {
          duration: 650,
          delay: Math.min(position * 85, 255),
          easing: 'cubic-bezier(.22, 1, .36, 1)',
          fill: 'backwards',
        });
        activeAnimations.set(element, animation);
        animation.onfinish = animation.oncancel = () => activeAnimations.delete(element);
      });
    });
  }, { threshold: 0, rootMargin: '0px 0px -32px 0px' });

  revealGroups.forEach(([selector, children]) => {
    document.querySelectorAll(selector).forEach(element => {
      element.dataset.seoMotionChildren = children;
      observer.observe(element);
    });
  });
  motionPreference.addEventListener('change', () => {
    if (motionPreference.matches) activeAnimations.forEach(animation => animation.cancel());
  });
  document.addEventListener('focusin', event => {
    activeAnimations.forEach((animation, element) => {
      if (element.contains(event.target)) animation.cancel();
    });
  });
}
