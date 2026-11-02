const reduced = matchMedia('(prefers-reduced-motion: reduce)');
document.querySelectorAll('.auto-example').forEach(panel => {
  const button = panel.querySelector('.auto-run');
  const status = panel.querySelector('.auto-status');
  const nodes = [...panel.querySelectorAll('.auto-node')];
  let timer;
  const reset = () => {
    clearTimeout(timer);
    button.disabled = false;
    nodes.forEach(node => node.classList.remove('is-active', 'is-done'));
    status.textContent = 'Preview only. No tools are connected.';
  };
  button.addEventListener('click', () => {
    reset();
    if (reduced.matches) {
      nodes.forEach(node => node.classList.add('is-done'));
      status.textContent = 'Preview complete: four connected steps. No actions were sent.';
      return;
    }
    button.disabled = true;
    let index = 0;
    const next = () => {
      nodes.forEach(node => node.classList.remove('is-active'));
      if (index) nodes[index - 1].classList.add('is-done');
      if (index === nodes.length) {
        button.disabled = false;
        status.textContent = 'Preview complete. No actions were sent.';
        return;
      }
      nodes[index].classList.add('is-active');
      status.textContent = `Preview step ${index + 1}: ${nodes[index].querySelector('strong').textContent}`;
      index++;
      timer = setTimeout(next, 800);
    };
    next();
  });
  new MutationObserver(() => { if (panel.hidden) reset(); }).observe(panel, { attributes: true, attributeFilter: ['hidden'] });
  reduced.addEventListener('change', reset);
  document.addEventListener('visibilitychange', () => { if (document.hidden) reset(); });
});
