/**
 * Site-wide data: company details, navigation, testimonials, home-page FAQ, technology marquee.
 */
export const SITE = {
  url: 'https://primeloft.tech',
  name: 'PrimeLoft',
  legalName: 'PrimeLoft Tech',
  titleSuffix: 'PrimeLoft | Software Solutions',
  tagline: 'Software Solutions',
  description: 'PrimeLoft is a software development studio building websites, mobile apps and custom software for businesses worldwide. Senior-led teams, fixed-price proposals, remote-first delivery.',
  email: 'contact@primeloft.tech',
  phone: '+92 335 9873132',
  phoneIntl: '+923359873132',
  whatsapp: 'https://wa.me/923359873132',
  linkedin: 'https://www.linkedin.com/company/primloft/',
  facebook: 'https://www.facebook.com/share/1UUv6vvFdu/',
  address: { street: 'Garden Town, Multan Road', city: 'Dera Ghazi Khan', region: 'Punjab', postal: '32200', country: 'PK', countryName: 'Pakistan', short: 'Garden Town, Multan Road, Dera Ghazi Khan, Pakistan' },
  geo: { lat: 30.055, lng: 70.638 },
  hours: 'Mon-Sat, 09:00-18:00 PKT (UTC+5)',
  ogImage: 'https://primeloft.tech/images/og-cover.jpg?v=3.0',
  cssVersion: '3.0.0',
  jsVersion: '3.0.0',
  year: 2026,
  formspree: 'https://formspree.io/f/xeajqqoy'
};

export const NAV = [
  { label: 'Home', href: 'index.html' },
  { label: 'Services', href: 'services.html', mega: true },
  { label: 'About', href: 'about.html' },
  { label: 'Contact', href: 'contact.html' }
];

export const MARQUEE = ['React', 'Next.js', 'Angular', 'TypeScript', '.NET', 'Node.js', 'React Native', 'Flutter', 'WordPress', 'WooCommerce', 'Shopify', 'Squarespace', 'PostgreSQL', 'AWS', 'Azure', 'Cloudflare', 'Figma', 'Playwright', 'Claude API', 'Tailwind CSS'];

/* Testimonials: replace with real client quotes as they come in. Keep role + sector + country format. */
export const TESTIMONIALS = [
  { quote: 'They rebuilt our WordPress site from a slow template into a custom theme in five weeks. Page speed went from red to green, and our team can finally edit pages without breaking the layout.', who: 'Marketing Director', org: 'B2B services company', loc: 'United Kingdom', initials: 'MD', service: 'WordPress Development' },
  { quote: 'The app shipped on iOS and Android the same week from one codebase. Weekly beta builds meant there were no surprises at launch, and store review went through first time.', who: 'Founder', org: 'Fitness startup', loc: 'Australia', initials: 'FS', service: 'Mobile App Development' },
  { quote: 'What stood out was the honesty. They talked us out of features we did not need and gave us a fixed price that did not move. The portal launched on the date in the proposal.', who: 'Operations Manager', org: 'Logistics company', loc: 'United Arab Emirates', initials: 'OM', service: 'Custom Web Development' },
  { quote: 'Our Squarespace site finally looks like our brand instead of a template. The custom code they added for bookings saved us from a far more expensive rebuild.', who: 'Owner', org: 'Boutique consultancy', loc: 'United States', initials: 'BC', service: 'Squarespace Design' },
  { quote: 'The SEO reports are the first ones I have actually read end to end. Technical fixes were implemented by their own engineers instead of being left in a PDF for us.', who: 'Head of Growth', org: 'E-commerce brand', loc: 'Netherlands', initials: 'HG', service: 'SEO' },
  { quote: 'Senior engineers from day one, clean code, real tests. They took over a messy .NET codebase and made releases predictable within two months.', who: 'CTO', org: 'SaaS platform', loc: 'Germany', initials: 'CT', service: 'Software Engineering' }
];

export const HOME_FAQ = [
  { q: 'What does PrimeLoft do?', a: 'PrimeLoft is a software development studio. We design and build websites, mobile apps and custom software, and we help them grow with SEO, cloud infrastructure and quality assurance. One senior team covers strategy, design, engineering and support.' },
  { q: 'Where are you based and who do you work with?', a: 'We are based in Pakistan and work remotely with clients across the United States, United Kingdom, Europe, Australia and the Gulf. We keep overlapping hours with your time zone and communicate in English via Slack, email and video calls.' },
  { q: 'How do you price projects?', a: 'Most projects are fixed-price with a defined scope and timeline, agreed before work starts. Ongoing work such as SEO, maintenance and managed hosting runs on month-to-month retainers with no long-term lock-in.' },
  { q: 'How quickly can we start?', a: 'You will hear back within one business day, receive a scoped proposal within 48 hours of a discovery call, and most projects kick off within one to two weeks.' },
  { q: 'Will we own everything you build?', a: 'Yes. Source code, designs, domains, hosting and third-party accounts are created in your name and handed over with documentation.' },
  { q: 'Can you take over a project from another agency or freelancer?', a: 'Yes. We start with a technical audit, stabilise what is urgent and give you a clear plan for the rest. Rescue projects are common for us.' }
];

export const PROCESS = [
  { title: 'Discover', desc: 'A short call to understand goals, users and constraints. You get a fixed-price proposal within 48 hours.' },
  { title: 'Design', desc: 'Wireframes and polished UI in Figma, approved by you before any engineering starts.' },
  { title: 'Build', desc: 'Weekly demos on a staging link, automated tests and transparent progress updates.' },
  { title: 'Launch & grow', desc: 'Go-live with performance and SEO checks, then support, SEO and new features as you scale.' }
];

export const WHY = [
  { title: 'Senior people, from day one', desc: 'No juniors learning on your budget. Every engagement is led by people who have shipped this before.' },
  { title: 'Fixed scope, fixed price', desc: 'You know the cost and the timeline before work starts, and change requests are priced transparently.' },
  { title: 'Built to hand over', desc: 'Clean, documented code and accounts in your name, so you are never locked in.' },
  { title: 'Remote-first, time-zone friendly', desc: 'Overlapping hours with the US, UK, Europe, Australia and the Gulf, and a reply within one business day.' }
];
