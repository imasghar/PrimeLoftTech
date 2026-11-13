// Keep the same active-section treatment as the SEO reading sidebar.
(() => {
  const links = [...document.querySelectorAll('.legal-reading-layout .seo-index nav a')];
  const sections = links.map(link => document.getElementById(link.hash.slice(1)));
  if (!links.length) return;
  links.forEach((link, index) => link.addEventListener('click', () => {
    if (!sections[index]) return;
    if (location.hash !== link.hash) history.pushState(null, '', link.hash);
    sections[index].setAttribute('tabindex', '-1');
    sections[index].focus({ preventScroll: true });
  }));
  let scheduled = false;
  function update() {
    scheduled = false;
    let active = 0;
    sections.forEach((section, index) => {
      if (section && section.getBoundingClientRect().top <= 150) active = index;
    });
    links.forEach((link, index) => {
      if (index === active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  window.addEventListener('scroll', () => {
    if (!scheduled) { scheduled = true; requestAnimationFrame(update); }
  }, { passive: true });
  update();
})();
