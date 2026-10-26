/**
 * PrimeLoft Tech - FAQ Accordion Controller
 * Implements accessible, single-open accordion behavior.
 * When an accordion item is clicked, all other items in the section close automatically.
 */
export class FAQAccordion {
  static init() {
    const accordions = document.querySelectorAll('.faq-accordion-list');
    if (!accordions.length) return;

    accordions.forEach((container) => {
      const items = container.querySelectorAll('.faq-item');
      items.forEach((item) => {
        const btn = item.querySelector('.faq-question');
        if (!btn) return;

        btn.addEventListener('click', () => {
          const isCurrentlyOpen = item.classList.contains('is-open');

          // Close all items in this container (enforce single-open rule)
          items.forEach((other) => {
            other.classList.remove('is-open');
            const otherBtn = other.querySelector('.faq-question');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          });

          // If it was closed, open it now
          if (!isCurrentlyOpen) {
            item.classList.add('is-open');
            btn.setAttribute('aria-expanded', 'true');
          }
        });
      });
    });
  }
}
