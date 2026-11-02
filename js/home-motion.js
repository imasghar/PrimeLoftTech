const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
const running = new Map();
const finishMotion = () => running.forEach(animation => animation.cancel());

function enter(element, delay = 0) {
  if (reduced.matches || !element.animate || element.contains(document.activeElement)) return;
  const animation = element.animate([
    { opacity: 0, transform: 'translateY(65px) scale(.92)' },
    { opacity: 1, transform: 'translateY(0) scale(1)' },
  ], { duration: 1100, delay, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards' });
  running.set(element, animation);
  animation.onfinish = animation.oncancel = () => running.delete(element);
}

if ('IntersectionObserver' in window) {
  const cards = [...document.querySelectorAll('.agency-tech-grid:not([aria-hidden]) li')];
  const observer = new IntersectionObserver(entries => {
    entries.filter(entry => entry.isIntersecting).forEach((entry, index) => {
      enter(entry.target, Math.min(index * 45, 360));
      observer.unobserve(entry.target);
    });
  }, { threshold: .1 });
  cards.forEach(card => observer.observe(card));
}
document.querySelectorAll('.agency-hero .pl-hero__inner > *, .agency-hero-art').forEach((element, index) => enter(element, index * 95));

// Pointer motion stays on decorative cards; it does not change scrolling or focus.
document.querySelectorAll('.agency-tech-grid li, .agency-hero-art').forEach(card => {
  let frame = 0;
  let point;
  const reset = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    card.style.removeProperty('--motion-x');
    card.style.removeProperty('--motion-y');
  };
  card.addEventListener('pointermove', event => {
    if (reduced.matches || !finePointer.matches) return;
    point = { x: event.clientX, y: event.clientY };
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--motion-x', `${((point.x - rect.left) / rect.width - .5) * 5}deg`);
      card.style.setProperty('--motion-y', `${((point.y - rect.top) / rect.height - .5) * -5}deg`);
    });
  }, { passive: true });
  card.addEventListener('pointerleave', reset);
  reduced.addEventListener('change', reset);
  finePointer.addEventListener('change', reset);
});
reduced.addEventListener('change', () => { if (reduced.matches) finishMotion(); });
document.addEventListener('visibilitychange', () => { if (document.hidden) finishMotion(); });
document.addEventListener('focusin', event => running.forEach((animation, element) => {
  if (element.contains(event.target)) animation.cancel();
}));
