const service = document.getElementById('contact-service');
const budget = document.getElementById('contact-budget');

if (service && budget) {
  const defaultOptions = [...budget.options].map(({ text, value }) => ({ text, value }));
  const updateBudget = () => {
    const previous = budget.value;
    const options = service.value === 'SEO'
      ? [
          { text: 'Prefer not to choose', value: 'Prefer not to choose' },
          ...['$300 - $500', '$500 - $1,000', '$1,000 - $1,500'].map(value => ({ text: value, value })),
        ]
      : defaultOptions;
    budget.replaceChildren(...options.map(({ text, value }) => new Option(text, value)));
    if (options.some(option => option.value === previous)) budget.value = previous;
  };
  const aliases = {
    'ui-ux': 'UX/UI', 'ux-ui': 'UX/UI', 'design': 'UX/UI',
    'software-development': 'Custom Website', 'software': 'Custom Website',
    'website-development': 'Custom Website', 'engineering': 'Custom Website',
    'mobile-apps': 'Mobile Application', 'mobile-app-development': 'Mobile Application',
    'mobile': 'Mobile Application', 'ai': 'Automation', 'cloud': 'DevOps',
    'qa': 'Testing & QA', 'quality': 'Testing & QA',
    'strategy': 'Other / Consultation',
  };
  const parameter = new URLSearchParams(window.location.search).get('service')?.trim().toLowerCase();
  const requestedService = (Object.hasOwn(aliases, parameter) ? aliases[parameter] : parameter)?.toLowerCase();
  const matchingOption = [...service.options].find(option => option.value.toLowerCase() === requestedService);
  if (matchingOption) service.value = matchingOption.value;
  service.addEventListener('change', updateBudget);
  service.form?.addEventListener('reset', () => setTimeout(updateBudget, 0));
  updateBudget();
}
