/**
 * PrimeLoft service catalogue — single source of truth for navigation, the services overview,
 * every service detail page, footer links, sitemap and structured data.
 * Edit here, then run `npm run build` to regenerate the HTML.
 */

const ICONS = {
  web: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="M3 9h18M8 6.5h.01M11 6.5h.01"/><path d="m9 17 2-2.5L9 12M13 17h3"/></svg>',
  mobile: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="6.5" y="2.5" width="11" height="19" rx="2.5"/><path d="M10 5.5h4M11 18.5h2"/></svg>',
  engineering: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/></svg>',
  wordpress: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="8" height="8" rx="2"/><rect x="13" y="3" width="8" height="8" rx="2"/><rect x="3" y="13" width="8" height="8" rx="2"/><path d="M17 14v6M14 17h6"/></svg>',
  squarespace: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M3 9.5h18M9.5 9.5V21"/></svg>',
  design: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19.5 4.5 12 12 4.5l7.5 7.5z"/><circle cx="12" cy="12" r="2.2"/></svg>',
  seo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m20 20-4.4-4.4M7.5 12.5l2-2.5 2 1.5 2.5-3"/></svg>',
  strategy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2"/><path d="M12 3v2M21 12h-2"/></svg>',
  ai: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="7" width="10" height="10" rx="2.5"/><path d="M10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4"/></svg>',
  cloud: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M7 18.5a4.5 4.5 0 0 1-.6-8.96A6 6 0 0 1 18 8.5a4 4 0 0 1 .5 7.97"/><path d="M12 12v8M9 15l3-3 3 3"/></svg>',
  quality: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 3v5.5c0 4.4-3 8.2-7 9.5-4-1.3-7-5.1-7-9.5V6z"/><path d="m9 12 2 2 4-4.5"/></svg>'
};

export const GROUPS = [
  { key: 'build', label: 'Build', blurb: 'Websites, apps and software built by senior engineers.' },
  { key: 'design', label: 'Design', blurb: 'Interfaces people understand at a glance.' },
  { key: 'grow', label: 'Grow', blurb: 'Traffic, strategy and intelligence that compound.' },
  { key: 'run', label: 'Run', blurb: 'Infrastructure and quality that keep it all reliable.' }
];

const COMMON_FACTS = [
  { value: '48h', label: 'Scoped proposal with fixed price and timeline' },
  { value: '100%', label: 'Senior-led delivery, no hand-off to juniors' },
  { value: 'Weekly', label: 'Demos and written progress updates' },
  { value: 'Yours', label: 'Code, accounts and IP stay fully in your name' }
];

export const SERVICES = [
  /* ───────────────────────── BUILD ───────────────────────── */
  {
    slug: 'service-web-development.html',
    key: 'web-development',
    group: 'build',
    name: 'Custom Web Development',
    short: 'Custom Web Development',
    menuDesc: 'Bespoke websites and web apps',
    icon: ICONS.web,
    metaTitle: 'Custom Web Development Company',
    metaDescription: 'Custom web development for startups and growing businesses: fast, secure, SEO-ready websites and web applications built with React, Angular, Next.js and .NET.',
    keywords: 'custom web development, web application development company, hire web developers, Next.js development, Angular development',
    eyebrow: 'Build · Custom Web Development',
    h1: 'Custom <span class="script">web development</span> built around your business',
    lead: 'Marketing sites, customer portals and full web applications engineered from scratch. No bloated templates, no plugin roulette: clean code that loads fast, ranks well and is easy to extend.',
    tags: ['Next.js & React', 'Angular & .NET', 'Headless CMS', 'E-commerce', 'Web portals'],
    overview: 'Bespoke websites and web applications that load fast, rank well and scale with you.',
    facts: COMMON_FACTS,
    capabilitiesTitle: 'Everything a modern website or web app needs',
    capabilitiesIntro: 'We handle the full stack, from the pixel-perfect front end to the database and hosting.',
    capabilities: [
      { title: 'Marketing & corporate websites', desc: 'High-performing company sites with a CMS your team can actually use, built for Core Web Vitals and search from day one.', items: ['Custom design implementation, pixel-accurate', 'Headless CMS (Sanity, Strapi, Contentful) or static', 'Lighthouse 90+ performance on launch'] },
      { title: 'Web applications & portals', desc: 'Customer portals, dashboards, booking systems and SaaS products with authentication, roles and reporting.', items: ['React, Angular or Next.js front ends', '.NET or Node.js APIs with PostgreSQL / SQL Server', 'Role-based access, audit trails, exports'] },
      { title: 'E-commerce storefronts', desc: 'Shopify, WooCommerce or fully headless storefronts with payments, shipping and tax handled properly.', items: ['Shopify / Hydrogen and WooCommerce builds', 'Stripe, PayPal and regional payment gateways', 'Checkout optimisation and analytics events'] },
      { title: 'Integrations & automation', desc: 'Connect your website to the tools you already run: CRMs, ERPs, email platforms, payment and booking systems.', items: ['HubSpot, Salesforce, Zoho, Mailchimp', 'REST / GraphQL API development', 'Webhooks, scheduled jobs and sync services'] }
    ],
    process: [
      { title: 'Discovery & scope', desc: 'A short workshop to map pages, user flows, integrations and success metrics. You get a fixed-price proposal within 48 hours.' },
      { title: 'Design & architecture', desc: 'Wireframes and UI design in Figma, then the technical plan: stack, hosting, CMS model and SEO structure.' },
      { title: 'Build in sprints', desc: 'Weekly demos on a staging URL. You review real pages, not slide decks, and change requests are handled transparently.' },
      { title: 'Launch & support', desc: 'Performance and accessibility checks, analytics, redirects and DNS, then a 30-day care window included with every build.' }
    ],
    stack: ['Next.js', 'React', 'Angular', 'TypeScript', '.NET', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'Sanity', 'Shopify', 'Vercel', 'Cloudflare'],
    faqs: [
      { q: 'How much does a custom website cost?', a: 'Most marketing websites land between $3,000 and $15,000 depending on page count, design complexity and integrations. Web applications and portals are scoped per feature set; you receive a fixed price before any work starts.' },
      { q: 'How long does a custom web development project take?', a: 'A typical 5 to 10 page business website takes 4 to 6 weeks from kickoff to launch. Web applications usually run 8 to 16 weeks, delivered in weekly sprints with a staging link you can review at any time.' },
      { q: 'Do you work with clients outside Pakistan?', a: 'Yes, almost all of our clients are in the United States, United Kingdom, Europe, Australia and the Gulf. We keep overlapping working hours with your time zone and communicate in English over Slack, email or calls.' },
      { q: 'Will I own the code and the accounts?', a: 'Always. Hosting, domain, CMS and repository accounts are created in your name, and all source code is handed over with documentation when we ship.' }
    ],
    related: ['service-design.html', 'service-seo.html', 'service-engineering.html'],
    cta: { eyebrow: 'Start your build', title: 'Tell us what the website needs to do', text: 'Share your goals, examples you like and a rough budget. A senior engineer replies within one business day with next steps.', button: 'Get a web development quote' }
  },
  {
    slug: 'service-mobile-app-development.html',
    key: 'mobile-app',
    group: 'build',
    name: 'Mobile App Development',
    short: 'Mobile App Development',
    menuDesc: 'iOS & Android apps, one codebase',
    icon: ICONS.mobile,
    metaTitle: 'Mobile App Development Company',
    metaDescription: 'Cross-platform mobile app development with React Native and Flutter. We design, build, test and publish iOS and Android apps for startups and businesses worldwide.',
    keywords: 'mobile app development company, React Native developers, Flutter app development, iOS and Android app development, hire app developers',
    eyebrow: 'Build · Mobile App Development',
    h1: 'iOS &amp; Android apps from <span class="script">one</span> codebase',
    lead: 'We design, build and ship mobile apps with React Native and Flutter, so you launch on both stores at once without paying for two teams. From MVP to App Store release and beyond.',
    tags: ['React Native', 'Flutter', 'App Store & Play release', 'Push & payments', 'Offline-first'],
    overview: 'Native-feeling iOS and Android apps built with React Native or Flutter and shipped to both stores.',
    facts: [
      { value: '2 stores', label: 'iOS and Android from a single shared codebase' },
      { value: '100%', label: 'Senior-led delivery, no hand-off to juniors' },
      { value: 'Weekly', label: 'TestFlight / Play beta builds you can install' },
      { value: 'Yours', label: 'Developer accounts, code and IP in your name' }
    ],
    capabilitiesTitle: 'From first screen to store listing',
    capabilitiesIntro: 'One team owns product thinking, UI, engineering, QA and publishing, so nothing falls between the gaps.',
    capabilities: [
      { title: 'MVP & startup apps', desc: 'Validate the idea with a focused first release that feels finished, then grow it feature by feature with real user feedback.', items: ['Scope workshop and clickable prototype', 'Core feature set in 8 to 12 weeks', 'Analytics and crash reporting from day one'] },
      { title: 'Cross-platform engineering', desc: 'React Native or Flutter, chosen for your use case, with native modules where performance demands it.', items: ['Smooth 60fps UI with platform conventions', 'Camera, maps, biometrics, Bluetooth, background tasks', 'Offline sync and secure local storage'] },
      { title: 'Backend, APIs & payments', desc: 'Everything behind the app: authentication, databases, push notifications, subscriptions and admin panels.', items: ['.NET / Node.js APIs or Firebase & Supabase', 'In-app purchases, Stripe and subscriptions', 'Admin dashboard to manage users and content'] },
      { title: 'Release & growth', desc: 'We handle store listings, review guidelines and release pipelines, then keep the app healthy as OS versions change.', items: ['App Store and Google Play submission', 'CI/CD with automated builds and OTA updates', 'Ongoing maintenance and feature roadmap'] }
    ],
    process: [
      { title: 'Product discovery', desc: 'User stories, screen map and technical choices (React Native vs Flutter, backend options) captured in a fixed-price proposal.' },
      { title: 'UX & UI design', desc: 'Wireframes, then polished screens following Apple and Material guidelines, prototyped in Figma for your sign-off.' },
      { title: 'Build & test', desc: 'Two-week sprints with installable beta builds. Automated tests plus manual QA on real devices.' },
      { title: 'Publish & iterate', desc: 'Store submission, launch monitoring and a roadmap for the next releases based on analytics.' }
    ],
    stack: ['React Native', 'Flutter', 'Expo', 'TypeScript', 'Swift', 'Kotlin', 'Firebase', 'Supabase', '.NET', 'Node.js', 'Stripe', 'Fastlane'],
    faqs: [
      { q: 'React Native or Flutter: which should I choose?', a: 'Both ship excellent apps from one codebase. We usually recommend React Native when you already have a web team or want to share logic with a React web app, and Flutter for highly custom, animation-heavy interfaces. We advise during discovery based on your roadmap, not our preference.' },
      { q: 'How much does it cost to build a mobile app?', a: 'A focused MVP typically starts around $8,000 to $20,000. Apps with payments, real-time features or complex backends range higher. You receive an itemised, fixed-price proposal before kickoff.' },
      { q: 'Do you publish the app to the App Store and Google Play?', a: 'Yes. We prepare listings, screenshots and privacy declarations, handle review feedback and release under developer accounts created in your company name.' },
      { q: 'Can you take over an existing app?', a: 'We regularly inherit codebases. We start with a technical audit, stabilise crashes and build pipelines, then continue feature development with full documentation.' }
    ],
    related: ['service-design.html', 'service-web-development.html', 'service-quality.html'],
    cta: { eyebrow: 'Build your app', title: 'Ready to put your product in people’s pockets?', text: 'Send us a short description of the app and its users. We reply within one business day with a suggested approach and estimate.', button: 'Get an app development quote' }
  },
  {
    slug: 'service-engineering.html',
    key: 'engineering',
    group: 'build',
    name: 'Software Engineering',
    short: 'Software Engineering',
    menuDesc: 'SaaS, APIs & custom systems',
    icon: ICONS.engineering,
    metaTitle: 'Custom Software Development',
    metaDescription: 'Senior software engineering for SaaS products, APIs, internal tools and legacy modernisation. .NET, Node.js, Angular and React teams shipping tested code.',
    keywords: 'custom software development, software engineering services, SaaS development, API development, .NET development company, legacy modernization',
    eyebrow: 'Build · Software Engineering',
    h1: 'Software <span class="script">engineering</span> for products that have to keep working',
    lead: 'SaaS platforms, APIs, internal tools and modernisation of ageing systems. Typed code, automated tests and clear documentation, delivered by engineers who have run production systems before.',
    tags: ['SaaS products', 'API design', 'System modernisation', '.NET & Node.js', 'Angular & React'],
    overview: 'SaaS platforms, APIs, internal tools and modernisation of legacy systems, engineered to last.',
    facts: COMMON_FACTS,
    capabilitiesTitle: 'Engineering that holds up under real use',
    capabilitiesIntro: 'We favour boring, proven technology, strong typing and tests over novelty, so your product stays maintainable.',
    capabilities: [
      { title: 'SaaS product development', desc: 'Multi-tenant platforms with billing, roles and reporting, built to onboard your first and your thousandth customer.', items: ['Multi-tenant architecture and data isolation', 'Subscriptions, invoicing and usage metering', 'Admin consoles and customer self-service'] },
      { title: 'APIs & integrations', desc: 'Well-documented REST and GraphQL APIs that other teams and partners can build on with confidence.', items: ['OpenAPI specs, versioning and auth (OAuth, JWT)', 'Third-party integrations and webhooks', 'Rate limiting, caching and observability'] },
      { title: 'Internal tools & automation', desc: 'Replace spreadsheets and manual processes with purpose-built tools your operations team will actually enjoy.', items: ['Back-office portals and approval workflows', 'Reporting dashboards and exports', 'Scheduled jobs, ETL and notifications'] },
      { title: 'Modernisation & rescue', desc: 'Move legacy .NET Framework, PHP or jQuery systems to modern stacks without stopping the business.', items: ['Code audit and risk-ranked roadmap', 'Incremental "strangler" migration', 'Test coverage added before refactors'] }
    ],
    process: [
      { title: 'Technical discovery', desc: 'We map requirements, data and integrations, then propose architecture and a sprint plan with a fixed price.' },
      { title: 'Foundations', desc: 'Repository, CI pipeline, environments, data model and API contracts set up in the first sprint so everything after is fast.' },
      { title: 'Sprints & demos', desc: 'Two-week sprints, pull-request reviews, automated tests and a demo of working software every week.' },
      { title: 'Release & handover', desc: 'Deployment runbooks, documentation and knowledge transfer so your own team can own the system.' }
    ],
    stack: ['.NET 8', 'C#', 'Node.js', 'TypeScript', 'Angular', 'React', 'PostgreSQL', 'SQL Server', 'Redis', 'Docker', 'GitHub Actions', 'Azure'],
    faqs: [
      { q: 'Which technologies do you specialise in?', a: 'Our core stack is .NET and Node.js on the backend with Angular, React and Next.js on the front end, on PostgreSQL or SQL Server. We choose per project and are happy to work inside an existing stack.' },
      { q: 'Can you work with our in-house developers?', a: 'Yes. We can lead a project end to end or embed senior engineers into your team, following your repositories, code review rules and ceremonies.' },
      { q: 'How do you ensure code quality?', a: 'Strict typing, linting, automated unit and integration tests, pull-request reviews and CI checks on every change. You can see the test reports and pipelines yourself.' },
      { q: 'Do you offer ongoing maintenance?', a: 'Every build includes a 30-day care window. After that we offer monthly retainers for monitoring, updates and new features at a predictable cost.' }
    ],
    related: ['service-cloud.html', 'service-quality.html', 'service-ai.html'],
    cta: { eyebrow: 'Talk to an engineer', title: 'Let’s review your specs together', text: 'Send a brief, a repository or just a problem statement. A principal engineer replies within one business day with questions and a plan.', button: 'Book a technical review' }
  },
  {
    slug: 'service-wordpress-development.html',
    key: 'wordpress',
    group: 'build',
    name: 'WordPress Development',
    short: 'WordPress Development',
    menuDesc: 'Custom themes, plugins & WooCommerce',
    icon: ICONS.wordpress,
    metaTitle: 'WordPress Development Services',
    metaDescription: 'Custom WordPress website development: hand-built themes, Gutenberg blocks, WooCommerce stores, speed optimisation, migrations and ongoing maintenance.',
    keywords: 'WordPress development company, custom WordPress theme development, WooCommerce development, WordPress speed optimization, WordPress maintenance',
    eyebrow: 'Build · WordPress Development',
    h1: 'WordPress sites that are <span class="script">fast</span>, secure and easy to edit',
    lead: 'Custom themes and Gutenberg blocks built from your design, not a page-builder bolted onto a template. Your team edits content with confidence, and the site stays fast as it grows.',
    tags: ['Custom themes', 'Gutenberg blocks', 'WooCommerce', 'Speed & security', 'Migrations'],
    overview: 'Hand-built WordPress themes, Gutenberg blocks and WooCommerce stores that stay fast and easy to edit.',
    facts: COMMON_FACTS,
    capabilitiesTitle: 'WordPress done properly',
    capabilitiesIntro: 'Lean code, only the plugins that earn their place, and an editing experience your marketing team will love.',
    capabilities: [
      { title: 'Custom theme development', desc: 'Your Figma design turned into a bespoke, lightweight theme with custom Gutenberg blocks for every section.', items: ['Block-based editing with locked layouts', 'Advanced Custom Fields and custom post types', 'Responsive, accessible, Core Web Vitals ready'] },
      { title: 'WooCommerce stores', desc: 'Online stores with the product, shipping, tax and payment setup done right for your market.', items: ['Product configuration, variations and bundles', 'Stripe, PayPal and local gateways', 'Checkout customisation and conversion tracking'] },
      { title: 'Speed, security & SEO', desc: 'Make an existing WordPress site fast and safe without a rebuild.', items: ['Caching, image and script optimisation', 'Hardening, backups and malware clean-up', 'Technical SEO fixes and schema'] },
      { title: 'Migrations & maintenance', desc: 'Move from Wix, Squarespace, Webflow or an old theme, then keep everything updated monthly.', items: ['Content and SEO-safe migrations with redirects', 'Managed hosting setup (Kinsta, WP Engine, Cloudways)', 'Monthly updates, uptime and security monitoring'] }
    ],
    process: [
      { title: 'Audit or brief', desc: 'For new sites we map content and templates; for existing sites we audit speed, plugins and security first.' },
      { title: 'Design & blocks', desc: 'Page designs are approved in Figma, then built as reusable blocks so every future page matches the system.' },
      { title: 'Build & content load', desc: 'Theme development on staging, content migration, forms, analytics and a walkthrough so your team can edit.' },
      { title: 'Launch & care', desc: 'DNS, SSL, redirects and performance checks at go-live, then optional monthly maintenance.' }
    ],
    stack: ['WordPress', 'Gutenberg', 'ACF Pro', 'WooCommerce', 'PHP 8', 'Timber / Twig', 'Tailwind CSS', 'Elementor (when required)', 'WP Rocket', 'Cloudflare', 'Kinsta', 'WP Engine'],
    faqs: [
      { q: 'Do you build with page builders like Elementor?', a: 'We build custom Gutenberg blocks by default because they are faster and easier to maintain. If your team already relies on Elementor we can work with it, keeping the page weight under control.' },
      { q: 'Can you speed up my existing WordPress site?', a: 'Yes. A performance audit identifies slow plugins, unoptimised images and hosting bottlenecks. Most sites reach good Core Web Vitals scores within one to two weeks of fixes.' },
      { q: 'Will you migrate my current site without losing SEO?', a: 'We map every URL, set up 301 redirects, migrate metadata and verify in Google Search Console after launch, so rankings are protected.' },
      { q: 'What does WordPress maintenance include?', a: 'Core, theme and plugin updates on a staging copy first, daily backups, security and uptime monitoring, monthly reports and a block of hours for small changes.' }
    ],
    related: ['service-seo.html', 'service-web-development.html', 'service-design.html'],
    cta: { eyebrow: 'WordPress, done right', title: 'Need a WordPress site you can rely on?', text: 'Tell us whether it is a new build, a redesign or a rescue. We reply within one business day with a clear recommendation.', button: 'Get a WordPress quote' }
  },
  {
    slug: 'service-squarespace-design.html',
    key: 'squarespace',
    group: 'build',
    name: 'Squarespace Website Design',
    short: 'Squarespace Design',
    menuDesc: 'Polished sites launched in weeks',
    icon: ICONS.squarespace,
    metaTitle: 'Squarespace Website Design',
    metaDescription: 'Professional Squarespace website design for small businesses, creatives and startups: custom layouts, Squarespace Commerce, custom code, SEO setup and fast launches.',
    keywords: 'Squarespace website designer, Squarespace developer, Squarespace custom code, Squarespace commerce setup, Squarespace SEO',
    eyebrow: 'Build · Squarespace Design',
    h1: 'Squarespace websites that look <span class="script">custom</span>, launched in weeks',
    lead: 'Perfect when you need a beautiful, easy-to-manage site quickly. We design within Squarespace’s strengths, extend it with custom code where it matters, and hand you a site you can update yourself.',
    tags: ['Custom layouts', 'Squarespace Commerce', 'Custom CSS & code injection', 'SEO setup', 'Scheduling & members'],
    overview: 'Beautiful, easy-to-manage Squarespace sites with custom code where it counts, launched fast.',
    facts: [
      { value: '2-4 wks', label: 'Typical timeline from brief to live site' },
      { value: '100%', label: 'Designed and built by senior designers' },
      { value: 'Editable', label: 'Built so you can update pages yourself' },
      { value: 'Yours', label: 'Squarespace account and domain in your name' }
    ],
    capabilitiesTitle: 'More than a template',
    capabilitiesIntro: 'Squarespace is a great platform when someone who understands design and code sets it up properly.',
    capabilities: [
      { title: 'Custom site design', desc: 'A bespoke look built on Squarespace 7.1 with Fluid Engine, tailored typography, imagery and layouts.', items: ['Brand-matched design system within Squarespace', 'Mobile-first layouts and image optimisation', 'Portfolio, blog, galleries and forms'] },
      { title: 'Squarespace Commerce', desc: 'Stores, bookings and digital products using Squarespace Commerce, Acuity Scheduling and Member Sites.', items: ['Product setup, shipping and tax rules', 'Acuity Scheduling and member areas', 'Checkout customisation and email receipts'] },
      { title: 'Custom code & integrations', desc: 'When the platform stops short, we add custom CSS, JavaScript and third-party embeds the safe way.', items: ['Custom CSS, animations and interactions', 'Code injection for tools like HubSpot, Calendly, Klaviyo', 'Advanced forms and conditional content'] },
      { title: 'SEO, launch & training', desc: 'Every site launches with the technical SEO basics done and a recorded training session for your team.', items: ['Metadata, redirects, sitemap and Search Console', 'Analytics and conversion tracking', 'Recorded walkthrough and written guide'] }
    ],
    process: [
      { title: 'Brief & sitemap', desc: 'We confirm pages, content and features (store, bookings, members) and recommend the right Squarespace plan.' },
      { title: 'Design', desc: 'Homepage concept for approval, then the remaining templates, all designed around your actual content.' },
      { title: 'Build & content', desc: 'Site assembled on a trial, content loaded, custom code added and tested across devices.' },
      { title: 'Launch & training', desc: 'Domain connection, SEO checklist, analytics and a training session so you are self-sufficient.' }
    ],
    stack: ['Squarespace 7.1', 'Fluid Engine', 'Squarespace Commerce', 'Acuity Scheduling', 'Member Sites', 'Custom CSS', 'JavaScript', 'Google Analytics', 'Search Console', 'Zapier'],
    faqs: [
      { q: 'Squarespace or WordPress: which is right for me?', a: 'Squarespace suits small businesses, creatives and service companies that want a beautiful site with minimal maintenance. WordPress is better when you need complex content structures, large stores or deep integrations. We will tell you honestly which fits.' },
      { q: 'Can you redesign my existing Squarespace site?', a: 'Yes. We can refresh the design in place or rebuild on a new template, preserving your content, URLs and SEO.' },
      { q: 'Can you add features Squarespace does not offer out of the box?', a: 'Often, yes, through custom code injection and integrations such as advanced forms, calculators, booking tools or CRM connections. We will confirm feasibility during the brief.' },
      { q: 'How much does a Squarespace website cost?', a: 'Most Squarespace projects range from $1,500 to $6,000 depending on page count, commerce features and custom code, plus your Squarespace subscription.' }
    ],
    related: ['service-wordpress-development.html', 'service-seo.html', 'service-design.html'],
    cta: { eyebrow: 'Launch fast', title: 'Want a professional site live in a few weeks?', text: 'Share your current site or brand assets and the pages you need. We reply within one business day with a timeline and price.', button: 'Get a Squarespace quote' }
  },

  /* ───────────────────────── DESIGN ───────────────────────── */
  {
    slug: 'service-design.html',
    key: 'design',
    group: 'design',
    name: 'Product & UX/UI Design',
    short: 'UX/UI Design',
    menuDesc: 'Research, prototypes, design systems',
    icon: ICONS.design,
    metaTitle: 'UX/UI & Product Design Services',
    metaDescription: 'UX research, UI design, prototyping and design systems for websites, web apps and mobile apps. Interfaces that are clear, accessible and built to convert.',
    keywords: 'UX UI design services, product design agency, website design, mobile app UI design, design system, Figma prototyping',
    eyebrow: 'Design · Product & UX/UI',
    h1: 'Product &amp; <span class="script">UX/UI</span> design people understand instantly',
    lead: 'Research-led design for websites, web apps and mobile apps. We turn messy requirements into clear flows, polished interfaces and a design system your developers can build from without guesswork.',
    tags: ['UX research', 'UI design', 'Prototyping', 'Design systems', 'Accessibility'],
    overview: 'Research-led UX and UI design, prototypes and design systems your developers can build from directly.',
    facts: [
      { value: '48h', label: 'Scoped proposal with fixed price and timeline' },
      { value: 'Figma', label: 'Editable source files and prototypes handed over' },
      { value: 'WCAG', label: 'Accessibility considered in every screen' },
      { value: 'Dev-ready', label: 'Specs and tokens engineers can implement 1:1' }
    ],
    capabilitiesTitle: 'Design that reduces friction, not just adds polish',
    capabilitiesIntro: 'Every decision is tied to a user task or a business metric, and documented so it survives handover.',
    capabilities: [
      { title: 'UX research & strategy', desc: 'Understand what users actually need before drawing a single screen.', items: ['Stakeholder and user interviews', 'Journey maps, personas and competitor teardowns', 'Information architecture and user flows'] },
      { title: 'Website & app UI design', desc: 'Interfaces with clear hierarchy, strong typography and brand character, designed for real content.', items: ['Responsive web and native-feeling mobile screens', 'Empty, loading and error states included', 'Micro-interactions and motion specs'] },
      { title: 'Prototyping & testing', desc: 'Clickable prototypes to validate flows with users and stakeholders before engineering starts.', items: ['High-fidelity Figma prototypes', 'Moderated usability sessions', 'Iteration based on findings, not opinions'] },
      { title: 'Design systems', desc: 'Reusable components, tokens and guidelines so every future screen is consistent and faster to ship.', items: ['Component library with variants', 'Colour, type and spacing tokens', 'Documentation for designers and developers'] }
    ],
    process: [
      { title: 'Discover', desc: 'Goals, users, constraints and content audit. We agree on the scope and the metrics that define success.' },
      { title: 'Structure', desc: 'Sitemaps, flows and low-fidelity wireframes to settle layout and logic early, when changes are cheap.' },
      { title: 'Design', desc: 'High-fidelity UI, prototypes and a design system, reviewed with you in weekly sessions.' },
      { title: 'Hand over', desc: 'Annotated files, tokens and a walkthrough with your engineers, plus design QA during the build.' }
    ],
    stack: ['Figma', 'FigJam', 'Maze', 'Hotjar', 'Adobe CC', 'Lottie', 'Storybook', 'Zeroheight', 'WCAG 2.2', 'Material 3', 'Apple HIG'],
    faqs: [
      { q: 'Do you only design, or build as well?', a: 'Both. Many clients hire us for design and development together so nothing is lost in handover, but we are equally happy delivering design files to your in-house team.' },
      { q: 'What do we receive at the end of a design project?', a: 'Editable Figma files, a clickable prototype, a component library with tokens, exported assets and a short recorded walkthrough.' },
      { q: 'Can you redesign an existing product without starting over?', a: 'Yes. We usually begin with a UX audit, then prioritise the changes with the highest impact on usability and conversion.' },
      { q: 'How long does UX/UI design take?', a: 'A marketing website design takes 2 to 4 weeks; a web or mobile app with 20 to 40 screens usually takes 4 to 8 weeks including prototyping.' }
    ],
    related: ['service-web-development.html', 'service-mobile-app-development.html', 'service-squarespace-design.html'],
    cta: { eyebrow: 'Design with us', title: 'Let’s make your product easier to use', text: 'Send a link to your current site or app and what frustrates you about it. A senior designer replies within one business day.', button: 'Request a design consultation' }
  },

  /* ───────────────────────── GROW ───────────────────────── */
  {
    slug: 'service-seo.html',
    key: 'seo',
    group: 'grow',
    name: 'SEO Services',
    short: 'SEO',
    menuDesc: 'Technical, on-page & content SEO',
    icon: ICONS.seo,
    metaTitle: 'SEO Services & Technical SEO',
    metaDescription: 'SEO services that earn qualified organic traffic: technical SEO audits, on-page optimisation, content strategy, local and international SEO, transparent reporting.',
    keywords: 'SEO services, technical SEO audit, on-page SEO, SEO agency for small business, international SEO, local SEO',
    eyebrow: 'Grow · Search Engine Optimisation',
    h1: 'SEO that earns <span class="script">qualified</span> traffic, not vanity rankings',
    lead: 'Technical fixes engineers can actually ship, pages written for real search intent and reporting you can read in five minutes. We focus on the keywords that bring customers, not just visitors.',
    tags: ['Technical SEO', 'On-page & content', 'Local & international', 'Core Web Vitals', 'Monthly reporting'],
    overview: 'Technical, on-page and content SEO that earns qualified organic traffic with transparent reporting.',
    facts: [
      { value: '48h', label: 'Initial audit summary with prioritised fixes' },
      { value: 'Monthly', label: 'Plain-English reports tied to leads and revenue' },
      { value: 'In-house', label: 'Engineers on the team to implement technical fixes' },
      { value: 'No lock-in', label: 'Month-to-month engagements, cancel anytime' }
    ],
    capabilitiesTitle: 'The full SEO stack under one roof',
    capabilitiesIntro: 'Because we build websites too, technical recommendations do not sit in a PDF; they get implemented.',
    capabilities: [
      { title: 'Technical SEO', desc: 'Make sure search engines can crawl, render and index every important page quickly.', items: ['Full crawl audit, indexation and canonical fixes', 'Core Web Vitals and page speed improvements', 'Structured data, sitemaps and international hreflang'] },
      { title: 'On-page & content', desc: 'Pages that match what people search for and answer it better than competitors.', items: ['Keyword research by intent and funnel stage', 'Title, meta, heading and internal link optimisation', 'Content briefs and SEO copywriting'] },
      { title: 'Local & international SEO', desc: 'Win in the cities and countries you serve, whether that is one storefront or ten markets.', items: ['Google Business Profile optimisation', 'Country and language targeting', 'Citations and review strategy'] },
      { title: 'Measurement & reporting', desc: 'Dashboards that connect rankings and traffic to enquiries and sales.', items: ['GA4, Search Console and Looker Studio setup', 'Conversion tracking and lead attribution', 'Monthly report with next-month priorities'] }
    ],
    process: [
      { title: 'Audit & benchmark', desc: 'Technical crawl, content gap and competitor analysis, with a prioritised list ranked by impact and effort.' },
      { title: 'Fix the foundations', desc: 'Our engineers implement the technical fixes directly, or hand your developers precise tickets.' },
      { title: 'Build authority', desc: 'Content calendar, on-page improvements and link-worthy assets published every month.' },
      { title: 'Measure & iterate', desc: 'Monthly reporting on rankings, traffic and leads, with the plan adjusted to what is working.' }
    ],
    stack: ['Google Search Console', 'GA4', 'Ahrefs', 'Semrush', 'Screaming Frog', 'Looker Studio', 'PageSpeed Insights', 'Schema.org', 'Google Business Profile', 'Cloudflare'],
    faqs: [
      { q: 'How long until SEO shows results?', a: 'Technical fixes often improve visibility within weeks. Meaningful growth in qualified organic traffic usually takes three to six months, depending on competition and your starting point. We set expectations in the audit.' },
      { q: 'Do you guarantee first-page rankings?', a: 'No reputable agency can. We commit to a transparent plan, measurable progress and reporting that ties work to leads and revenue.' },
      { q: 'Can you do SEO for sites built on WordPress, Shopify or Squarespace?', a: 'Yes. We work on every major platform and know the technical limits and workarounds of each.' },
      { q: 'What does an SEO engagement cost?', a: 'One-off technical audits start around $900. Ongoing SEO retainers typically range from $800 to $3,000 per month depending on scope, with no long-term contracts.' }
    ],
    related: ['service-web-development.html', 'service-wordpress-development.html', 'service-strategy.html'],
    cta: { eyebrow: 'Grow organic traffic', title: 'Find out what is holding your site back', text: 'Send your domain and your main competitors. We reply within one business day with the first findings from a quick audit.', button: 'Request an SEO audit' }
  },
  {
    slug: 'service-strategy.html',
    key: 'strategy',
    group: 'grow',
    name: 'Digital Strategy & Consulting',
    short: 'Digital Strategy',
    menuDesc: 'Roadmaps, platform selection, audits',
    icon: ICONS.strategy,
    metaTitle: 'Digital Strategy & Consulting',
    metaDescription: 'Digital strategy and technology consulting: product roadmaps, platform selection, technical audits and digital transformation plans your team can execute.',
    keywords: 'digital strategy consulting, technology consulting, product roadmap, platform selection, digital transformation consulting, technical audit',
    eyebrow: 'Grow · Strategy & Consulting',
    h1: 'Digital <span class="script">strategy</span> you can actually execute',
    lead: 'Independent advice on what to build, what to buy and in what order. We turn ambiguous ambition into a sequenced roadmap with budgets and risks your leadership can sign off on.',
    tags: ['Product roadmaps', 'Platform selection', 'Technical audits', 'Digital transformation', 'Fractional CTO'],
    overview: 'Roadmaps, platform selection and technical audits that turn ambition into a plan your team can execute.',
    facts: [
      { value: '2-3 wks', label: 'Typical discovery engagement from kickoff to roadmap' },
      { value: 'Vendor-neutral', label: 'We recommend tools we would use ourselves' },
      { value: 'Senior', label: 'Led by engineers who have shipped what they advise' },
      { value: 'Actionable', label: 'Roadmaps with scope, budget ranges and risks' }
    ],
    capabilitiesTitle: 'Clarity before commitment',
    capabilitiesIntro: 'Most expensive mistakes happen before a line of code is written. We help you avoid them.',
    capabilities: [
      { title: 'Discovery & product roadmaps', desc: 'From idea to a prioritised, estimated roadmap with milestones your investors and team understand.', items: ['Stakeholder workshops and goal alignment', 'Feature prioritisation and MVP definition', 'Phased roadmap with budget ranges'] },
      { title: 'Platform & vendor selection', desc: 'Shopify or custom? WordPress or Squarespace? Build or buy? We compare options against your real requirements.', items: ['Requirements matrix and scoring', 'Total cost of ownership over three years', 'Migration and integration considerations'] },
      { title: 'Technical & UX audits', desc: 'An honest assessment of an existing product: code quality, security, performance, usability and SEO.', items: ['Code and infrastructure review', 'Risk register with severity and effort', '90-day remediation plan'] },
      { title: 'Fractional CTO & advisory', desc: 'Senior technical leadership for startups that are not ready for a full-time CTO.', items: ['Architecture and hiring guidance', 'Vendor and agency oversight', 'Monthly leadership sessions'] }
    ],
    process: [
      { title: 'Listen', desc: 'Interviews with founders, stakeholders and, where possible, customers to understand goals and constraints.' },
      { title: 'Analyse', desc: 'Review of your current systems, market and competitors, plus options analysis for the key decisions.' },
      { title: 'Recommend', desc: 'A clear written strategy and roadmap, presented and debated with your leadership team.' },
      { title: 'Support', desc: 'We can stay on to execute the roadmap or oversee other vendors, keeping the plan honest.' }
    ],
    stack: ['Miro', 'Notion', 'Figma', 'Jira', 'Linear', 'Google Analytics', 'Hotjar', 'Lighthouse', 'Cloud cost calculators', 'OWASP'],
    faqs: [
      { q: 'Do we have to build with you after the strategy work?', a: 'No. Roadmaps and audits are standalone deliverables designed to be executed by any competent team. Many clients do continue with us, but there is no obligation.' },
      { q: 'What does a discovery engagement include?', a: 'Workshops, research, a written strategy document, a prioritised roadmap with estimates and a presentation to your leadership team, usually over two to three weeks.' },
      { q: 'Can you review proposals from other agencies?', a: 'Yes. We regularly act as an independent reviewer of quotes, architectures and contracts to help clients choose with confidence.' },
      { q: 'How do you charge for consulting?', a: 'Discovery and audits are fixed-price. Fractional CTO and advisory work is a monthly retainer with a defined number of hours.' }
    ],
    related: ['service-engineering.html', 'service-web-development.html', 'service-seo.html'],
    cta: { eyebrow: 'Get clarity', title: 'Not sure what to build first?', text: 'Book a free 30-minute call. We will ask the hard questions and tell you honestly whether you need us at all.', button: 'Book a strategy call' }
  },
  {
    slug: 'service-ai.html',
    key: 'ai',
    group: 'grow',
    name: 'AI & Data Solutions',
    short: 'AI & Data',
    menuDesc: 'LLM features, automation, analytics',
    icon: ICONS.ai,
    metaTitle: 'AI Development & Data Solutions',
    metaDescription: 'Practical AI and data solutions: LLM-powered assistants, document automation, recommendations and analytics pipelines integrated into your product, on your data.',
    keywords: 'AI development company, LLM integration, AI chatbot development, AI automation, data analytics solutions, machine learning consulting',
    eyebrow: 'Grow · AI & Data',
    h1: 'AI &amp; data features that <span class="script">earn</span> their place in your product',
    lead: 'Assistants, document automation, recommendations and analytics built on your data with modern language models. We integrate AI where it saves time or makes money, and skip it where it does not.',
    tags: ['LLM integration', 'AI assistants', 'Document automation', 'Recommendations', 'Analytics pipelines'],
    overview: 'LLM-powered assistants, document automation, recommendations and analytics built on your own data.',
    facts: [
      { value: '1-2 wks', label: 'Proof of concept on your real data before you commit' },
      { value: 'Private', label: 'Your data stays in your cloud with access controls' },
      { value: 'Measured', label: 'Every feature ships with accuracy and cost metrics' },
      { value: 'Yours', label: 'Prompts, pipelines and models documented and owned by you' }
    ],
    capabilitiesTitle: 'Applied AI, not science projects',
    capabilitiesIntro: 'We start with a narrow, valuable use case, prove it on real data, then productionise with monitoring and guardrails.',
    capabilities: [
      { title: 'LLM assistants & copilots', desc: 'Customer support assistants, internal knowledge bots and in-app copilots grounded in your own content.', items: ['Retrieval-augmented generation (RAG) on your documents', 'Guardrails, citations and human hand-off', 'Claude, OpenAI or open-source models, your choice'] },
      { title: 'Document & workflow automation', desc: 'Extract, classify and route invoices, contracts, forms and emails without manual data entry.', items: ['OCR and structured extraction', 'Validation rules and review queues', 'Integration with ERPs, CRMs and spreadsheets'] },
      { title: 'Personalisation & recommendations', desc: 'Relevant products, content and offers for e-commerce and content platforms.', items: ['Recommendation engines and search ranking', 'Customer segmentation and churn signals', 'A/B testing of models in production'] },
      { title: 'Data platforms & analytics', desc: 'Clean, trustworthy data pipelines and dashboards so decisions are based on facts.', items: ['ETL/ELT pipelines and warehouses', 'Dashboards in Power BI, Looker Studio or Metabase', 'Forecasting and anomaly alerts'] }
    ],
    process: [
      { title: 'Use-case selection', desc: 'We score candidate use cases by value, feasibility and risk, and pick one to prove first.' },
      { title: 'Proof of concept', desc: 'A working prototype on your real data within one to two weeks, with accuracy and cost measured.' },
      { title: 'Productionise', desc: 'Security, monitoring, evaluation sets, rate limits and a clean integration into your product.' },
      { title: 'Operate & improve', desc: 'Ongoing evaluation, prompt and model updates and cost optimisation as usage grows.' }
    ],
    stack: ['Claude API', 'OpenAI', 'LangChain', 'Python', 'FastAPI', '.NET', 'PostgreSQL + pgvector', 'Pinecone', 'Azure OpenAI', 'AWS Bedrock', 'Power BI', 'dbt'],
    faqs: [
      { q: 'Is our data safe when you build AI features?', a: 'Yes. Data stays in your cloud accounts, we use providers with zero-retention options, and access is controlled and logged. We can also run open-source models privately where required.' },
      { q: 'Do we need a lot of data to get started?', a: 'Not for most LLM-based features. Assistants and document automation work well with your existing documents and processes. Forecasting and recommendations benefit from more history, which we assess upfront.' },
      { q: 'How do you measure whether an AI feature works?', a: 'We build an evaluation set with real examples and track accuracy, latency and cost per request before and after each change, and report them to you.' },
      { q: 'What does an AI proof of concept cost?', a: 'Most proof-of-concept engagements are fixed-price between $3,000 and $8,000 and take one to two weeks, so you can decide with evidence rather than hype.' }
    ],
    related: ['service-engineering.html', 'service-cloud.html', 'service-strategy.html'],
    cta: { eyebrow: 'Explore AI', title: 'Have a use case in mind? Let’s test it on real data', text: 'Describe the process you want to automate or the feature you want to add. We reply within one business day with a feasibility view.', button: 'Discuss an AI project' }
  },

  /* ───────────────────────── RUN ───────────────────────── */
  {
    slug: 'service-cloud.html',
    key: 'cloud',
    group: 'run',
    name: 'Cloud & DevOps',
    short: 'Cloud & DevOps',
    menuDesc: 'Hosting, CI/CD, monitoring',
    icon: ICONS.cloud,
    metaTitle: 'Cloud & DevOps Services',
    metaDescription: 'Cloud architecture, DevOps and managed hosting: AWS, Azure and Cloudflare setups, CI/CD pipelines, monitoring, backups and cost optimisation for web and mobile.',
    keywords: 'cloud consulting, DevOps services, AWS consulting, Azure DevOps, CI/CD pipeline setup, managed cloud hosting, cloud cost optimization',
    eyebrow: 'Run · Cloud & DevOps',
    h1: 'Cloud &amp; DevOps that stay <span class="script">quiet</span> under load',
    lead: 'Infrastructure, deployment pipelines and monitoring set up once and properly, so releases are boring and outages are rare. Right-sized for startups, ready for scale.',
    tags: ['AWS & Azure', 'CI/CD pipelines', 'Monitoring & alerts', 'Backups & security', 'Cost optimisation'],
    overview: 'Cloud architecture, CI/CD pipelines, monitoring and managed hosting that keep releases boring.',
    facts: [
      { value: '< 1 wk', label: 'Typical time to a working pipeline and staging environment' },
      { value: 'IaC', label: 'Everything as code: reproducible and reviewable' },
      { value: '24/7', label: 'Uptime monitoring with alerting to your channels' },
      { value: 'Yours', label: 'Cloud accounts and credentials owned by you' }
    ],
    capabilitiesTitle: 'Reliable foundations without the enterprise bill',
    capabilitiesIntro: 'We set up the minimum infrastructure that is secure, observable and easy to grow, then run it for you if you prefer.',
    capabilities: [
      { title: 'Cloud architecture & migration', desc: 'Design or migrate to AWS, Azure or modern hosting platforms with security and cost in mind.', items: ['Landing zone, networking and IAM done right', 'Migrations from shared hosting or on-premises', 'Infrastructure as code with Terraform or Bicep'] },
      { title: 'CI/CD & environments', desc: 'Every change tested and deployed automatically to staging and production with one-click rollback.', items: ['GitHub Actions or Azure DevOps pipelines', 'Preview environments per pull request', 'Blue/green or canary releases'] },
      { title: 'Monitoring, backups & security', desc: 'Know about problems before your customers do, and recover quickly when they happen.', items: ['Uptime, error and performance monitoring', 'Automated backups with tested restores', 'Hardening, secrets management, WAF and SSL'] },
      { title: 'Managed hosting & cost control', desc: 'We can run the platform for you month to month and keep the cloud bill honest.', items: ['Monthly patching, reviews and reports', 'Right-sizing and reserved capacity', 'Incident response with clear SLAs'] }
    ],
    process: [
      { title: 'Assess', desc: 'Review current hosting, risks and costs, and define availability and recovery targets with you.' },
      { title: 'Design', desc: 'Architecture diagram, environment plan and an itemised monthly cost estimate before anything is provisioned.' },
      { title: 'Implement', desc: 'Infrastructure as code, pipelines, monitoring and runbooks, with a migration plan that avoids downtime.' },
      { title: 'Operate', desc: 'Handover to your team with documentation, or ongoing managed operations under a monthly plan.' }
    ],
    stack: ['AWS', 'Azure', 'Cloudflare', 'Vercel', 'Docker', 'Kubernetes', 'Terraform', 'GitHub Actions', 'Azure DevOps', 'Grafana', 'Sentry', 'PostgreSQL'],
    faqs: [
      { q: 'Which cloud provider do you recommend?', a: 'It depends on your stack and team. .NET workloads often fit Azure well, Node and Next.js products often run cheaply on Vercel or AWS with Cloudflare in front. We give a cost comparison for your case.' },
      { q: 'Can you reduce our cloud costs?', a: 'Usually yes. Idle resources, oversized instances and missing caching are common. A cost review typically finds 20 to 40 percent savings without reducing performance.' },
      { q: 'Do you provide ongoing support?', a: 'Yes. Managed operations plans include monitoring, patching, backups, monthly reviews and incident response with defined response times.' },
      { q: 'Will our developers be able to deploy themselves?', a: 'That is the goal. Pipelines are documented and simple: merge to main, tests run, deploy happens. We train your team during handover.' }
    ],
    related: ['service-engineering.html', 'service-quality.html', 'service-web-development.html'],
    cta: { eyebrow: 'Stabilise your platform', title: 'Make deployments boring again', text: 'Tell us what you run and what keeps you up at night. A senior engineer replies within one business day with a plan.', button: 'Book an infrastructure review' }
  },
  {
    slug: 'service-quality.html',
    key: 'quality',
    group: 'run',
    name: 'QA & Testing',
    short: 'QA & Testing',
    menuDesc: 'Manual, automated & performance testing',
    icon: ICONS.quality,
    metaTitle: 'QA & Software Testing Services',
    metaDescription: 'QA and software testing services: manual QA, Playwright and Cypress automation, performance and load testing, and release management for web and mobile apps.',
    keywords: 'software testing services, QA outsourcing, test automation services, Playwright testing, performance testing, mobile app testing',
    eyebrow: 'Run · QA & Testing',
    h1: 'QA &amp; testing so you can <span class="script">ship</span> without holding your breath',
    lead: 'Manual testing, automated test suites and performance testing for websites, web apps and mobile apps. Catch regressions before customers do and release on a schedule you can trust.',
    tags: ['Manual QA', 'Test automation', 'Performance & load', 'Mobile device testing', 'Release management'],
    overview: 'Manual QA, automated test suites and performance testing that catch problems before your customers do.',
    facts: [
      { value: '48h', label: 'Test plan and coverage proposal for your product' },
      { value: 'Real devices', label: 'iOS and Android testing on physical hardware' },
      { value: 'CI-ready', label: 'Automated suites that run on every pull request' },
      { value: 'Readable', label: 'Bug reports with steps, videos and severity' }
    ],
    capabilitiesTitle: 'Quality as a system, not a final step',
    capabilitiesIntro: 'We combine human judgement with automation that pays for itself release after release.',
    capabilities: [
      { title: 'Manual & exploratory testing', desc: 'Experienced testers who think like users and break things on purpose before launch.', items: ['Functional, usability and accessibility checks', 'Cross-browser and real-device coverage', 'Clear reproducible bug reports in your tracker'] },
      { title: 'Test automation', desc: 'Fast, stable automated suites for the flows that matter most, running in your CI pipeline.', items: ['Playwright, Cypress and Detox suites', 'API and contract tests', 'Flake control and maintenance'] },
      { title: 'Performance & load testing', desc: 'Know how your product behaves at ten times the traffic before a campaign or launch.', items: ['Load tests with k6 and JMeter', 'Core Web Vitals and mobile performance', 'Bottleneck analysis with the engineering team'] },
      { title: 'Release management', desc: 'Checklists, staging sign-offs and smoke tests that make every release predictable.', items: ['Release checklists and go/no-go reviews', 'Post-release monitoring and hot-fix process', 'Regression suites for every version'] }
    ],
    process: [
      { title: 'Assess risk', desc: 'We map critical user journeys and past incidents to decide where testing effort matters most.' },
      { title: 'Plan coverage', desc: 'A test plan balancing manual, automated and performance testing with clear ownership.' },
      { title: 'Execute', desc: 'Testing runs alongside development, with automation added to CI and reports after each cycle.' },
      { title: 'Improve', desc: 'Metrics on escaped defects and suite stability drive the next improvements.' }
    ],
    stack: ['Playwright', 'Cypress', 'Detox', 'Appium', 'k6', 'JMeter', 'Postman', 'BrowserStack', 'GitHub Actions', 'Jira', 'TestRail', 'Lighthouse'],
    faqs: [
      { q: 'Can you test a product you did not build?', a: 'Yes. Independent QA is one of our most common engagements. We onboard with your documentation and a short walkthrough, then start with exploratory testing of critical flows.' },
      { q: 'How much automation is enough?', a: 'Enough to cover the journeys that would hurt most if broken, such as sign-up, checkout and core workflows. We avoid automating everything because brittle suites slow teams down.' },
      { q: 'Do you test mobile apps on real devices?', a: 'Yes, on physical iOS and Android devices as well as cloud device farms for broader coverage.' },
      { q: 'How do you report bugs?', a: 'In your tracker (Jira, Linear, GitHub) with steps to reproduce, expected versus actual results, screenshots or videos, environment details and a severity rating.' }
    ],
    related: ['service-engineering.html', 'service-mobile-app-development.html', 'service-cloud.html'],
    cta: { eyebrow: 'Ship with confidence', title: 'Let’s make your next release the calm one', text: 'Share what you are building and when it needs to launch. We reply within one business day with a testing plan.', button: 'Request a QA proposal' }
  }
];

export const byGroup = (key) => SERVICES.filter((s) => s.group === key);
export const bySlug = (slug) => SERVICES.find((s) => s.slug === slug);
