const service = document.getElementById('contact-service');
const budget = document.getElementById('contact-budget');

if (service && budget) {
  const defaultOptions = [...budget.options].map(({ text, value }) => ({ text, value }));
  const updateBudget = () => {
    const previous = budget.value;
    const options = service.value === 'SEO Services'
      ? [
          { text: 'Prefer not to choose', value: 'Prefer not to choose' },
          ...['$300 - $500', '$500 - $1,000', '$1,000 - $1,500'].map(value => ({ text: value, value })),
        ]
      : defaultOptions;
    budget.replaceChildren(...options.map(({ text, value }) => new Option(text, value)));
    if (options.some(option => option.value === previous)) budget.value = previous;
  };
  const aliases = {
      "ui-ux": "UI/UX Design",
      "ux-ui": "UI/UX Design",
      "design": "UI/UX Design",
      "software-development": "Website & Software Development",
      "software": "Website & Software Development",
      "website-development": "Website & Software Development",
      "engineering": "Website & Software Development",
      "mobile-apps": "Mobile App Development",
      "mobile-app-development": "Mobile App Development",
      "mobile": "Mobile App Development",
      "ai": "AI & Automation",
      "cloud": "Cloud & DevOps",
      "qa": "Software Testing & QA",
      "quality": "Software Testing & QA",
      "strategy": "Product Strategy",
      "ecommerce": "E-commerce Development",
      "integrations": "API Integration",
      "ux/ui": "UI/UX Design",
      "custom website": "Website & Software Development",
      "mobile application": "Mobile App Development",
      "seo": "SEO Services",
      "automation": "AI & Automation",
      "devops": "Cloud & DevOps",
      "testing & qa": "Software Testing & QA",
      "maintenance": "Maintenance & Support",
      "wordpress": "WordPress Development",
      "squarespace": "Squarespace Development"
  };
  const parameter = new URLSearchParams(window.location.search).get('service')?.trim().toLowerCase();
  const requestedService = (Object.hasOwn(aliases, parameter) ? aliases[parameter] : parameter)?.toLowerCase();
  const matchingOption = [...service.options].find(option => option.value.toLowerCase() === requestedService);
  if (matchingOption) service.value = matchingOption.value;
  service.addEventListener('change', updateBudget);
  service.form?.addEventListener('reset', () => setTimeout(updateBudget, 0));
  updateBudget();
}
