/**
 * Page builders. Each returns a page object consumed by layout.renderPage().
 */
import { SITE, MARQUEE, TESTIMONIALS, HOME_FAQ, PROCESS, WHY } from './data/site.mjs';
import { SERVICES, GROUPS, byGroup, bySlug } from './data/services.mjs';
import { ARROW, ctaBand, faqBlock, faqSchema, breadcrumbSchema, breadcrumbHtml, organizationSchema, professionalServiceSchema, serviceSchema, serviceCard, lottie, socialRow, plain } from './layout.mjs';

const T = (t) => `${t} | ${SITE.titleSuffix}`;

/* ═══════════════════════════ HOME ═══════════════════════════ */
export function home() {
  const main = `
    <!-- HERO -->
    <section class="hero hero-home" aria-labelledby="heroHeading">
      <div class="hero-bg" aria-hidden="true">
        <div class="hero-grid-dots"></div>
        <div class="hero-blob blob-1"></div>
        <div class="hero-blob blob-2"></div>
      </div>
      <div class="wrap hero-layout">
        <div class="hero-copy">
          <div class="eyebrow hero-eyebrow"><span class="eyebrow-pulse" aria-hidden="true"></span>Software development studio · Working worldwide</div>
          <h1 id="heroHeading" class="hero-title">
            <span class="line"><span>We design, build &amp; grow</span></span>
            <span class="line"><span>websites, apps &amp; <span class="script">software</span></span></span>
            <span class="line"><span>for businesses worldwide.</span></span>
          </h1>
          <p class="lead">PrimeLoft is a senior-led software studio. Custom web development, mobile apps, WordPress and Squarespace sites, SEO and cloud, delivered at a fixed price with weekly demos, for clients across the US, UK, Europe, Australia and the Gulf.</p>
          <div class="hero-ctas">
            <a href="contact.html" class="btn btn-primary btn-lg">Estimate your project ${ARROW}</a>
            <a href="services.html" class="btn btn-ghost btn-lg">Explore services</a>
          </div>
          <ul class="hero-trust" aria-label="Why clients choose PrimeLoft">
            <li><svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8.5l3 3 7-7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>Fixed-price proposals in 48h</li>
            <li><svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8.5l3 3 7-7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>Senior engineers only</li>
            <li><svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8.5l3 3 7-7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>You own the code &amp; accounts</li>
          </ul>
        </div>
        <div class="hero-stage" aria-hidden="true">
          <div class="stage-ring stage-ring-a"></div>
          <div class="stage-ring stage-ring-b"></div>
          <div class="stage-lottie" data-depth="0.35">${lottie('hero', { className: 'lottie-hero', label: 'Illustration of a website, mobile app and growth chart being built' })}</div>
          <div class="float-card fc-kickoff" data-depth="0.9">
            <span class="fc-icon fc-icon-red"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="9"/></svg></span>
            <span class="fc-text"><strong>Proposal sent</strong><small>Fixed scope · 48h turnaround</small></span>
          </div>
          <div class="float-card fc-perf" data-depth="0.7">
            <span class="fc-ring"><svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="16" class="fc-ring-bg"/><circle cx="20" cy="20" r="16" class="fc-ring-val"/></svg><strong>98</strong></span>
            <span class="fc-text"><strong>Performance</strong><small>Lighthouse score</small></span>
          </div>
          <div class="float-card fc-deploy" data-depth="1.1">
            <span class="fc-dot"></span>
            <span class="fc-text"><strong>Deployed to production</strong><small>v2.4 · just now</small></span>
          </div>
        </div>
      </div>
      <a href="#services" class="hero-scroll" aria-label="Scroll to services"><span>Scroll</span><span class="stick"></span></a>
    </section>

    <!-- TECH MARQUEE -->
    <section class="marquee-section" aria-label="Technologies and platforms we work with">
      <div class="wrap marquee-head"><span class="eyebrow">Platforms &amp; technologies we work with every day</span></div>
      <div class="marquee" data-marquee>
        <div class="marquee-track">
          ${[...MARQUEE, ...MARQUEE].map((t) => `<span class="marquee-item">${t}</span>`).join('')}
        </div>
      </div>
    </section>

    <!-- SERVICES -->
    <section id="services" class="services-section">
      <div class="wrap">
        <div class="section-head section-head-row reveal">
          <div>
            <div class="eyebrow">What we do</div>
            <h2>Eleven services. One senior team that owns the outcome.</h2>
          </div>
          <p>Pick one service or combine them. The same people take you from the first sketch to launch and beyond, so nothing gets lost between agencies.</p>
        </div>
        <div class="services-grid">
          ${SERVICES.map((s, i) => serviceCard(s, { delay: (i % 4) * 70 })).join('')}
          <a href="services.html" class="service-card service-card-all reveal" style="--d:280ms">
            <span class="service-card-body">
              <span class="service-card-title">See how the services fit together</span>
              <span class="service-card-desc">Build, design, grow and run, explained with examples.</span>
            </span>
            <span class="service-card-arrow" aria-hidden="true"><svg viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
          </a>
        </div>
      </div>
    </section>

    <!-- PROCESS -->
    <section class="process-section">
      <div class="wrap">
        <div class="section-head reveal">
          <div class="eyebrow">How we work</div>
          <h2>A simple process that keeps you in control</h2>
          <p>No black boxes. You see real progress every week and know the price before we start.</p>
        </div>
        <ol class="process-steps" data-process>
          ${PROCESS.map((p, i) => `
          <li class="process-step reveal" style="--d:${i * 110}ms">
            <span class="process-num"><span>0${i + 1}</span></span>
            <h3>${p.title}</h3>
            <p>${p.desc}</p>
          </li>`).join('')}
        </ol>
      </div>
    </section>

    <!-- WHY -->
    <section class="why-section">
      <div class="wrap why">
        <div class="why-copy reveal">
          <div class="eyebrow">Why PrimeLoft</div>
          <h2>A studio built around outcomes, not deliverables</h2>
          <p>We embed with your team, learn the metrics that matter to your business, and stay accountable to them long after launch. Steady, senior craft from strategy through to scale.</p>
          <div class="why-stats">
            <div class="why-stat"><span class="num" data-count="24" data-prefix="&lt;" data-suffix="h">0</span><span>Reply to every enquiry</span></div>
            <div class="why-stat"><span class="num" data-count="48" data-suffix="h">0</span><span>To a fixed-price proposal</span></div>
            <div class="why-stat"><span class="num" data-count="100" data-suffix="%">0</span><span>Senior-led delivery</span></div>
            <div class="why-stat"><span class="num" data-count="${SERVICES.length}">0</span><span>Services under one roof</span></div>
          </div>
        </div>
        <div class="why-list reveal">
          ${WHY.map((w, i) => `
          <div class="why-item"><div class="wnum">0${i + 1}</div><div><h3>${w.title}</h3><p>${w.desc}</p></div></div>`).join('')}
        </div>
      </div>
    </section>

    <!-- TESTIMONIALS -->
    <section class="testi-section">
      <div class="wrap">
        <div class="section-head section-head-row reveal">
          <div>
            <div class="eyebrow">Client words</div>
            <h2>What it is like to work with us</h2>
          </div>
          <div class="testi-controls">
            <button type="button" class="testi-btn" data-testi-prev aria-label="Previous testimonial"><svg viewBox="0 0 16 16" fill="none"><path d="M13 8H3M7 4 3 8l4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
            <button type="button" class="testi-btn" data-testi-next aria-label="Next testimonial"><svg viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
          </div>
        </div>
      </div>
      <div class="testi-slider reveal" data-testi>
        <div class="testi-track" tabindex="0" aria-label="Testimonials, scroll horizontally">
          ${TESTIMONIALS.map((t) => `
          <figure class="testi-card">
            <div class="testi-stars" aria-label="5 out of 5 stars">${'<svg viewBox="0 0 20 20" aria-hidden="true"><path d="m10 1.8 2.5 5.3 5.8.7-4.3 4 1.1 5.8L10 14.8l-5.1 2.8 1.1-5.8-4.3-4 5.8-.7z"/></svg>'.repeat(5)}</div>
            <blockquote><p>${t.quote}</p></blockquote>
            <figcaption>
              <span class="testi-avatar" aria-hidden="true">${t.initials}</span>
              <span class="testi-who"><strong>${t.who}, ${t.org}</strong><small>${t.loc} · ${t.service}</small></span>
            </figcaption>
          </figure>`).join('')}
        </div>
        <div class="testi-dots" data-testi-dots aria-hidden="true"></div>
      </div>
    </section>

    ${faqBlock(HOME_FAQ, { eyebrow: 'FAQ', title: 'Straight answers before you get in touch' })}

    ${ctaBand({ eyebrow: 'Ready when you are', title: 'Tell us what you are building. We will tell you how we would build it.', text: 'A short brief is enough. You will hear from a senior partner within one business day, with questions and a suggested approach.', button: 'Estimate your project', secondary: { label: 'Chat on WhatsApp', href: SITE.whatsapp, external: true } })}`;

  return {
    file: 'index.html',
    id: 'home',
    title: 'PrimeLoft | Software Solutions | Web, Mobile App & Software Development',
    description: 'Software studio building custom websites, mobile apps, WordPress and Squarespace sites, SEO and cloud solutions for businesses worldwide. Fixed-price, senior-led.',
    keywords: 'software development company, custom web development, mobile app development, WordPress development, Squarespace design, SEO services, software studio Pakistan, hire developers',
    bodyClass: 'page-home',
    preloadLottie: 'hero',
    schema: [organizationSchema(), faqSchema(HOME_FAQ)],
    main
  };
}

/* ═══════════════════════════ SERVICES OVERVIEW ═══════════════════════════ */
export function services() {
  const block = (s, i) => `
      <article class="service-block reveal${i % 2 ? ' service-block-flip' : ''}" id="s-${s.key}">
        <div class="service-block-copy">
          <div class="sb-icon-lg">${s.icon}</div>
          <h3><a href="${s.slug}">${s.name}</a></h3>
          <p>${s.overview}</p>
          <ul class="sb-points">${s.capabilities.slice(0, 3).map((c) => `<li>${c.title}</li>`).join('')}</ul>
          <div class="sb-tags">${s.tags.slice(0, 4).map((t) => `<span>${t}</span>`).join('')}</div>
          <a href="${s.slug}" class="btn btn-ghost">Explore ${s.short} ${ARROW}</a>
        </div>
        <div class="sb-media">
          ${lottie(s.key, { label: `${s.name} illustration` })}
        </div>
      </article>`;

  let i = 0;
  const groups = GROUPS.map((g) => `
    <section class="service-group" id="${g.key}">
      <div class="wrap">
        <div class="service-group-head reveal">
          <div class="eyebrow">${g.label}</div>
          <h2>${g.blurb}</h2>
        </div>
        ${byGroup(g.key).map((s) => block(s, i++)).join('')}
      </div>
    </section>`).join('');

  const main = `
    <section class="page-hero">
      <div class="wrap">
        ${breadcrumbHtml([{ name: 'Home', file: 'index.html' }, { name: 'Services', file: 'services.html' }])}
        <div class="page-hero-inner reveal">
          <div class="eyebrow eyebrow-center">What we do</div>
          <h1>Every service you need to <span class="script">launch</span> and grow online</h1>
          <p class="lead">Build it, design it, grow it, run it. Choose a single service or combine several; the same senior team stays with you from the first call to long after launch.</p>
          <nav class="group-jump" aria-label="Service groups">
            ${GROUPS.map((g) => `<a href="#${g.key}" class="group-pill">${g.label}<span>${byGroup(g.key).length}</span></a>`).join('')}
          </nav>
        </div>
      </div>
    </section>
    ${groups}
    ${ctaBand({ eyebrow: 'Not sure where to start?', title: 'Tell us the problem. We will scope the right mix of services.', text: 'Most projects combine two or three services. A short call is enough to map it out and give you a fixed price.', button: 'Estimate your project' })}`;

  return {
    file: 'services.html',
    id: 'services',
    title: T('Web, Mobile, WordPress & SEO Services'),
    description: 'Custom web development, mobile apps, WordPress and Squarespace sites, UX/UI design, SEO, strategy, AI, cloud and QA from one senior team at fixed prices.',
    keywords: 'software development services, web development services, mobile app development services, WordPress services, Squarespace designer, SEO services, UX design services',
    bodyClass: 'page-services',
    schema: [
      breadcrumbSchema([{ name: 'Home', file: 'index.html' }, { name: 'Services', file: 'services.html' }]),
      { '@context': 'https://schema.org', '@type': 'ItemList', name: 'PrimeLoft services', itemListElement: SERVICES.map((s, idx) => ({ '@type': 'ListItem', position: idx + 1, name: s.name, url: `${SITE.url}/${s.slug}` })) }
    ],
    main
  };
}

/* ═══════════════════════════ SERVICE DETAIL ═══════════════════════════ */
export function serviceDetail(s) {
  const crumbs = [{ name: 'Home', file: 'index.html' }, { name: 'Services', file: 'services.html' }, { name: s.name, file: s.slug }];
  const related = s.related.map(bySlug).filter(Boolean);
  const main = `
    <section class="service-hero">
      <div class="wrap">
        ${breadcrumbHtml(crumbs)}
        <div class="service-hero-grid">
          <div class="service-hero-copy reveal">
            <div class="eyebrow">${s.eyebrow}</div>
            <h1>${s.h1}</h1>
            <p class="lead">${s.lead}</p>
            <div class="service-hero-actions">
              <a href="contact.html" class="btn btn-primary btn-lg">${s.cta.button} ${ARROW}</a>
              <a href="#capabilities" class="btn btn-ghost btn-lg">What you get</a>
            </div>
            <div class="sb-tags">${s.tags.map((t) => `<span>${t}</span>`).join('')}</div>
          </div>
          <div class="service-hero-media reveal" style="--d:120ms">
            <div class="stage-ring stage-ring-a" aria-hidden="true"></div>
            ${lottie(s.key, { label: `${s.name} illustration` })}
          </div>
        </div>
      </div>
    </section>

    <section class="facts-section">
      <div class="wrap">
        <div class="facts-strip reveal">
          ${s.facts.map((f) => `<div class="fact"><div class="fact-value">${f.value}</div><div class="fact-label">${f.label}</div></div>`).join('')}
        </div>
      </div>
    </section>

    <section id="capabilities" class="capabilities-section">
      <div class="wrap">
        <div class="section-head section-head-center reveal">
          <div class="eyebrow eyebrow-center">What you get</div>
          <h2>${s.capabilitiesTitle}</h2>
          <p>${s.capabilitiesIntro}</p>
        </div>
        <div class="capabilities-grid">
          ${s.capabilities.map((c, i) => `
          <article class="capability-card reveal tilt" style="--d:${(i % 2) * 90}ms">
            <span class="cap-num">0${i + 1}</span>
            <h3>${c.title}</h3>
            <p>${c.desc}</p>
            <ul class="cap-deliverables">${c.items.map((it) => `<li>${it}</li>`).join('')}</ul>
          </article>`).join('')}
        </div>
      </div>
    </section>

    <section class="process-section process-section-alt">
      <div class="wrap">
        <div class="section-head section-head-center reveal">
          <div class="eyebrow eyebrow-center">How it works</div>
          <h2>From first call to launch, without surprises</h2>
        </div>
        <ol class="process-steps" data-process>
          ${s.process.map((p, i) => `
          <li class="process-step reveal" style="--d:${i * 110}ms">
            <span class="process-num"><span>0${i + 1}</span></span>
            <h3>${p.title}</h3>
            <p>${p.desc}</p>
          </li>`).join('')}
        </ol>
        <div class="stack-row reveal">
          <div class="eyebrow eyebrow-center">Tools &amp; technology</div>
          <div class="tech-stack-row">${s.stack.map((t) => `<span class="tech-tag">${t}</span>`).join('')}</div>
        </div>
      </div>
    </section>

    ${faqBlock(s.faqs, { eyebrow: 'FAQ', title: `${s.name}: questions clients ask first` })}

    <section class="related-section">
      <div class="wrap">
        <div class="section-head section-head-row reveal">
          <div>
            <div class="eyebrow">Often combined with</div>
            <h2>Related services</h2>
          </div>
          <a href="services.html" class="btn btn-ghost">All services ${ARROW}</a>
        </div>
        <div class="services-grid services-grid-3">
          ${related.map((r, i) => serviceCard(r, { delay: i * 80 })).join('')}
        </div>
      </div>
    </section>

    ${ctaBand({ eyebrow: s.cta.eyebrow, title: s.cta.title, text: s.cta.text, button: s.cta.button, secondary: { label: 'Chat on WhatsApp', href: SITE.whatsapp, external: true } })}`;

  return {
    file: s.slug,
    id: s.key.replace(/\W/g, ''),
    title: T(s.metaTitle),
    description: s.metaDescription,
    keywords: s.keywords,
    bodyClass: 'page-service',
    preloadLottie: s.key,
    schema: [breadcrumbSchema(crumbs), serviceSchema(s), faqSchema(s.faqs)],
    main
  };
}

/* ═══════════════════════════ ABOUT ═══════════════════════════ */
export function about() {
  const crumbs = [{ name: 'Home', file: 'index.html' }, { name: 'About', file: 'about.html' }];
  const values = [
    { title: 'Senior by default', desc: 'Every project is staffed by people who could run it alone. Collaboration is a choice, not a crutch.' },
    { title: 'Honest scoping', desc: 'We would rather talk you out of a feature than bill you for one you do not need. Fixed prices keep us honest.' },
    { title: 'Built to hand over', desc: 'Clean code, documentation and accounts in your name. You should be able to leave us and keep everything.' },
    { title: 'Craft over churn', desc: 'We would rather keep a client for five years than collect ten logos for a slide.' }
  ];
  const remote = [
    { title: 'Overlapping hours', desc: 'We schedule core hours to overlap with your morning or afternoon, whether you are in New York, London, Berlin, Dubai or Sydney.' },
    { title: 'One channel, written updates', desc: 'A shared Slack channel or email thread, a weekly written update and a demo link. No chasing for status.' },
    { title: 'Your tools, your accounts', desc: 'GitHub, Jira, Figma, hosting and app-store accounts are set up in your company name from day one.' },
    { title: 'Simple international payments', desc: 'Clear milestone invoices payable by bank transfer, Wise or card, with contracts that respect your jurisdiction.' }
  ];
  const main = `
    <section class="page-hero page-hero-split">
      <div class="wrap">
        ${breadcrumbHtml(crumbs)}
        <div class="about-hero-grid">
          <div class="reveal">
            <div class="eyebrow">About PrimeLoft</div>
            <h1>A small studio of <span class="script">senior</span> builders, working with clients worldwide</h1>
            <p class="lead">PrimeLoft started as a two-person freelance practice and grew into a software studio without losing the habit of showing up like it is still just the two of us. Small teams, senior people, close to the outcome.</p>
            <div class="hero-ctas">
              <a href="contact.html" class="btn btn-primary btn-lg">Work with us ${ARROW}</a>
              <a href="services.html" class="btn btn-ghost btn-lg">What we do</a>
            </div>
          </div>
          <div class="about-hero-media reveal" style="--d:120ms">
            <div class="stage-ring stage-ring-a" aria-hidden="true"></div>
            ${lottie('about', { label: 'Illustration of a remote team collaborating across time zones' })}
          </div>
        </div>
      </div>
    </section>

    <section class="story-section">
      <div class="wrap story-grid">
        <div class="section-head reveal">
          <div class="eyebrow">Our story</div>
          <h2>Started by engineers who were tired of agency hand-offs</h2>
        </div>
        <div class="story-copy reveal" style="--d:100ms">
          <p>We began as freelancers building .NET and Angular systems and React Native apps for clients abroad. The pattern we kept seeing was the same: a sales team promises, a junior team builds, and the client ends up with something nobody wants to maintain.</p>
          <p>PrimeLoft is our answer. The people who scope the project are the people who build it. We keep the team small, bring in vetted specialists only when a project genuinely needs them, and measure ourselves on whether the thing we shipped is still running and growing a year later.</p>
          <p>Today we work with startups, small and mid-sized businesses and agencies across the United States, the United Kingdom, Europe, Australia and the Gulf, from our studio in Dera Ghazi Khan, Pakistan.</p>
        </div>
      </div>
    </section>

    <section class="values-section">
      <div class="wrap">
        <div class="section-head reveal">
          <div class="eyebrow">How we work</div>
          <h2>Four principles we do not negotiate on</h2>
        </div>
        <div class="values-grid">
          ${values.map((val, i) => `
          <div class="value-card reveal tilt" style="--d:${i * 80}ms">
            <span class="value-num">0${i + 1}</span>
            <h3>${val.title}</h3>
            <p>${val.desc}</p>
          </div>`).join('')}
        </div>
      </div>
    </section>

    <section class="team-section">
      <div class="wrap">
        <div class="section-head reveal">
          <div class="eyebrow">The team</div>
          <h2>The people behind the work</h2>
        </div>
        <div class="team-grid">
          <div class="team-card reveal">
            <div class="team-photo">
              <picture>
                <source srcset="images/team-1.webp" type="image/webp">
                <img src="images/team-1.jpg" alt="Ghulam Asghar, co-founder and full-stack .NET and Angular engineer at PrimeLoft" class="team-img" width="400" height="500" loading="lazy">
              </picture>
            </div>
            <div class="team-info"><h3>Ghulam Asghar</h3><div class="role">Co-founder · Full-stack .NET &amp; Angular</div><p>Leads architecture, APIs and web platforms. The person who scopes your project is the person who builds it.</p></div>
          </div>
          <div class="team-card reveal" style="--d:90ms">
            <div class="team-photo">
              <picture>
                <source srcset="images/team-2.webp" type="image/webp">
                <img src="images/team-2.jpg" alt="Ajmal Riaz, co-founder and React Native mobile specialist at PrimeLoft" class="team-img" width="400" height="500" loading="lazy">
              </picture>
            </div>
            <div class="team-info"><h3>Ajmal Riaz</h3><div class="role">Co-founder · Mobile &amp; React Native</div><p>Owns mobile product delivery from UX to store release, with a focus on performance and clean, maintainable apps.</p></div>
          </div>
          <div class="team-card team-card-bench reveal" style="--d:180ms">
            <div class="team-bench">
              <div class="bench-avatars" aria-hidden="true"><span>UX</span><span>QA</span><span>SEO</span><span>+</span></div>
              <h3>A vetted bench of specialists</h3>
              <p>Designers, QA engineers, SEO and cloud specialists we have worked with for years join projects when they are needed, always led by a founder.</p>
              <a href="contact.html" class="btn btn-ghost">Talk to a founder ${ARROW}</a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="remote-section">
      <div class="wrap">
        <div class="section-head section-head-row reveal">
          <div>
            <div class="eyebrow">Working with clients abroad</div>
            <h2>Remote-first, and built for it</h2>
          </div>
          <p>Most of our clients are six to ten time zones away. Here is how we make that feel close.</p>
        </div>
        <div class="remote-grid">
          ${remote.map((r, i) => `
          <div class="remote-item reveal" style="--d:${i * 80}ms">
            <span class="remote-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${['<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', '<path d="M4 5h16v11H8l-4 4z"/><path d="M8 9h8M8 12h5"/>', '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M9 20V9"/>', '<rect x="2" y="6" width="20" height="12" rx="2"/><path d="M2 10h20M7 14h3"/>'][i]}</svg></span>
            <h3>${r.title}</h3>
            <p>${r.desc}</p>
          </div>`).join('')}
        </div>
      </div>
    </section>

    <section class="map-section">
      <div class="wrap">
        <div class="section-head reveal">
          <div class="eyebrow">Studio</div>
          <h2>Where we are</h2>
        </div>
        <div class="hq-card reveal">
          <div class="hq-map-wrapper">
            <iframe title="PrimeLoft Tech studio location map" src="https://maps.google.com/maps?q=GardenTown,+Multan+Road,+Dera+Ghazi+Khan,+Pakistan&t=&z=15&ie=UTF8&iwloc=&output=embed" width="100%" height="440" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
          </div>
          <div class="hq-info-banner">
            <div class="hq-info-grid">
              <div class="hq-info-item"><div class="hq-icon-box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg></div><div class="hq-details"><span class="hq-label">Address</span><span class="hq-val">${SITE.address.short}</span></div></div>
              <div class="hq-info-item"><div class="hq-icon-box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg></div><div class="hq-details"><span class="hq-label">Hours</span><span class="hq-val">${SITE.hours}</span><span class="hq-sub">Flexible overlap with your time zone</span></div></div>
              <div class="hq-info-item"><div class="hq-icon-box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg></div><div class="hq-details"><span class="hq-label">Email</span><a class="hq-val-link" href="mailto:${SITE.email}">${SITE.email}</a><span class="hq-sub">Reply within one business day</span></div></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    ${ctaBand({ eyebrow: 'Let’s talk', title: 'Want a team that treats your product like its own?', text: 'Tell us what you are building and where you are stuck. A founder replies within one business day.', button: 'Start a conversation' })}`;

  return {
    file: 'about.html',
    id: 'about',
    title: T('About Us'),
    description: 'Meet PrimeLoft, a senior-led software studio in Pakistan working remotely with clients in the US, UK, Europe, Australia and the Gulf. Our story and how we work.',
    keywords: 'about PrimeLoft, software development studio Pakistan, remote software team, offshore development team, senior developers',
    bodyClass: 'page-about',
    preloadLottie: 'about',
    schema: [breadcrumbSchema(crumbs), professionalServiceSchema(), { '@context': 'https://schema.org', '@type': 'AboutPage', name: 'About PrimeLoft', url: `${SITE.url}/about.html`, mainEntity: { '@id': `${SITE.url}/#organization` } }],
    main
  };
}

/* ═══════════════════════════ CONTACT ═══════════════════════════ */
export function contact() {
  const crumbs = [{ name: 'Home', file: 'index.html' }, { name: 'Contact', file: 'contact.html' }];
  const main = `
    <section class="page-hero">
      <div class="wrap">
        ${breadcrumbHtml(crumbs)}
        <div class="page-hero-inner reveal">
          <div class="eyebrow eyebrow-center">Get in touch</div>
          <h1>Tell us what you are <span class="script">building</span></h1>
          <p class="lead">Share a few details and a senior partner will reply within one business day with questions, a suggested approach and next steps.</p>
        </div>
      </div>
    </section>

    <section class="contact-section">
      <div class="wrap contact-grid">
        <div class="contact-aside reveal">
          <div class="contact-info-item">
            <div class="contact-lottie-box"><div class="contact-lottie-icon contact-email-lottie" data-lottie="contact-email" aria-hidden="true"></div></div>
            <div class="contact-info-text"><span class="contact-info-label">Email</span><span class="contact-info-val"><a href="mailto:${SITE.email}">${SITE.email}</a></span></div>
          </div>
          <div class="contact-info-item">
            <div class="contact-lottie-box"><div class="contact-lottie-icon" data-lottie="contact-phone" aria-hidden="true"></div></div>
            <div class="contact-info-text"><span class="contact-info-label">Phone &amp; WhatsApp</span><span class="contact-info-val"><a href="tel:${SITE.phoneIntl}">${SITE.phone}</a></span></div>
          </div>
          <div class="contact-info-item">
            <div class="contact-lottie-box"><div class="contact-lottie-icon" data-lottie="contact-address" aria-hidden="true"></div></div>
            <div class="contact-info-text"><span class="contact-info-label">Studio</span><span class="contact-info-val">${SITE.address.short}</span></div>
          </div>
          <div class="contact-info-item">
            <div class="contact-lottie-box"><div class="contact-lottie-icon" data-lottie="contact-response" aria-hidden="true"></div></div>
            <div class="contact-info-text"><span class="contact-info-label">Response time</span><span class="contact-info-val">Within one business day</span><span class="contact-info-sub">${SITE.hours}, flexible to your time zone</span></div>
          </div>
          <a href="${SITE.whatsapp}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.99c-.002 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662a11.87 11.87 0 005.707 1.456h.005c6.554 0 11.89-5.335 11.893-11.893 0-3.177-1.238-6.164-3.486-8.413z"/></svg>
            Chat on WhatsApp
          </a>
          <div class="next-steps">
            <h2 class="next-steps-title">What happens next</h2>
            <ol>
              <li><span><strong>We reply within one business day</strong> with a few questions to understand scope.</span></li>
              <li><span><strong>A 30-minute call</strong> to walk through goals, examples and constraints.</span></li>
              <li><span><strong>A fixed-price proposal within 48 hours</strong> of the call, with timeline and team.</span></li>
            </ol>
          </div>
        </div>

        <div class="contact-form-card reveal" style="--d:120ms">
          <form id="contactForm" class="contact-form" action="${SITE.formspree}" method="POST" novalidate>
            <input type="hidden" name="_subject" value="New project enquiry | PrimeLoft Tech">
            <input type="text" name="_gotcha" class="hp-field" tabindex="-1" autocomplete="off" aria-hidden="true">
            <div class="form-row">
              <div class="form-field">
                <label for="contact-name">Your name</label>
                <input type="text" id="contact-name" name="name" placeholder="Jane Smith" autocomplete="name" required>
              </div>
              <div class="form-field">
                <label for="contact-email">Work email</label>
                <input type="email" id="contact-email" name="email" placeholder="you@company.com" autocomplete="email" required>
              </div>
            </div>
            <div class="form-row">
              <div class="form-field">
                <label for="contact-company">Company <span class="optional">(optional)</span></label>
                <input type="text" id="contact-company" name="company" placeholder="Company or project name" autocomplete="organization">
              </div>
              <div class="form-field">
                <label for="contact-country">Country <span class="optional">(optional)</span></label>
                <input type="text" id="contact-country" name="country" placeholder="e.g. United States" autocomplete="country-name">
              </div>
            </div>
            <div class="form-row">
              <div class="form-field">
                <label for="contact-service">What do you need?</label>
                <div class="select-wrap">
                  <select id="contact-service" name="service" required>
                    <option value="" disabled selected>Choose a service</option>
                    ${SERVICES.map((s) => `<option value="${s.name}">${s.name}</option>`).join('')}
                    <option value="Not sure yet">Not sure yet, help me decide</option>
                  </select>
                </div>
              </div>
              <div class="form-field">
                <label for="contact-budget">Budget range <span class="optional">(optional)</span></label>
                <div class="select-wrap">
                  <select id="contact-budget" name="budget">
                    <option value="" selected>Prefer not to say</option>
                    <option>Under $2,000</option>
                    <option>$2,000 to $5,000</option>
                    <option>$5,000 to $15,000</option>
                    <option>$15,000 to $50,000</option>
                    <option>$50,000+</option>
                    <option>Ongoing monthly retainer</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="form-field">
              <label for="contact-message">Project details</label>
              <textarea id="contact-message" name="message" placeholder="What are you building, who is it for, and when do you need it? Links to examples or your current site help a lot." required minlength="20"></textarea>
            </div>
            <div id="formStatus" class="form-status" role="status" aria-live="polite" hidden></div>
            <div class="form-footer">
              <button type="submit" id="btnSubmitContact" class="btn btn-primary btn-lg">
                <span>Send message</span>
                <span class="contact-btn-lottie" data-lottie="contact-send" aria-hidden="true"></span>
              </button>
              <p class="form-privacy">We only use your details to reply to this enquiry. See our <a href="privacy.html">privacy policy</a>.</p>
            </div>
          </form>
        </div>
      </div>
    </section>`;

  return {
    file: 'contact.html',
    id: 'contact',
    title: T('Contact Us'),
    description: 'Contact PrimeLoft for web development, mobile apps, WordPress, Squarespace, SEO or cloud projects. Reply within one business day, fixed-price proposal in 48 hours.',
    keywords: 'contact software development company, get a quote web development, hire app developers, PrimeLoft contact',
    bodyClass: 'page-contact',
    schema: [breadcrumbSchema(crumbs), professionalServiceSchema(), { '@context': 'https://schema.org', '@type': 'ContactPage', name: 'Contact PrimeLoft', url: `${SITE.url}/contact.html`, mainEntity: { '@id': `${SITE.url}/#organization` } }],
    main
  };
}

/* ═══════════════════════════ LEGAL ═══════════════════════════ */
function legalPage({ file, id, title, h1, eyebrow, intro, sections, description, updated = 'October 21, 2026' }) {
  const crumbs = [{ name: 'Home', file: 'index.html' }, { name: h1, file }];
  const main = `
    <section class="page-hero page-hero-left">
      <div class="wrap">
        ${breadcrumbHtml(crumbs)}
        <div class="reveal">
          <div class="eyebrow">${eyebrow}</div>
          <h1>${h1}</h1>
          <p class="lead">${intro}</p>
          <p class="legal-updated">Last updated: ${updated}</p>
        </div>
      </div>
    </section>
    <section class="legal-section">
      <div class="wrap legal-content reveal">
        ${sections.map((s, i) => `
        <div class="legal-block">
          <h2>${i + 1}. ${s.h}</h2>
          ${s.body}
        </div>`).join('')}
      </div>
    </section>`;
  return { file, id, title: T(title), description, bodyClass: 'page-legal', schema: [breadcrumbSchema(crumbs)], main };
}

export const privacy = () => legalPage({
  file: 'privacy.html', id: 'privacy', title: 'Privacy Policy', h1: 'Privacy Policy', eyebrow: 'Legal',
  description: 'How PrimeLoft Tech collects, uses and protects personal data, including cookies and your rights under GDPR and CCPA.',
  intro: 'PrimeLoft Tech is committed to safeguarding your personal information and privacy rights. This policy explains what we collect, why, and the choices you have.',
  sections: [
    { h: 'Information we collect', body: '<p>We collect personal information you voluntarily provide when contacting us by email, phone, WhatsApp or the contact form, such as your name, work email, company and project requirements. With your consent we also collect non-identifying technical data about how the website is used.</p>' },
    { h: 'How we use your information', body: '<p>Your information is used only to respond to enquiries, deliver and invoice services you have engaged us for, improve the website (with consent), and keep the site secure. We do not sell personal data.</p>' },
    { h: 'Cookies and tracking consent', body: '<p>In line with GDPR, the UK GDPR and CCPA, non-essential scripts (Google Analytics 4, Microsoft Clarity, Meta Pixel, LinkedIn Insight Tag) load only after you grant consent in our cookie preferences. See the <a href="cookies.html">cookie policy</a> for details and how to change your choice.</p>' },
    { h: 'Third-party processors', body: '<p>Contact and newsletter forms are processed by Formspree. The website is hosted on Cloudflare Pages. Fonts are served by Google Fonts. Maps are embedded from Google Maps. Each processor handles data under its own privacy policy.</p>' },
    { h: 'Data retention', body: '<p>Enquiry data is kept for as long as needed to respond and, where a project follows, for the duration of the engagement plus statutory record-keeping periods. You can ask us to delete it at any time.</p>' },
    { h: 'Your rights', body: `<p>You can access, correct, export or request deletion of your personal data at any time by emailing <a href="mailto:${SITE.email}">${SITE.email}</a>. We respond within 30 days.</p>` }
  ]
});

export const cookies = () => legalPage({
  file: 'cookies.html', id: 'cookies', title: 'Cookie Policy', h1: 'Cookie Policy', eyebrow: 'Legal',
  description: 'How PrimeLoft Tech uses cookies and similar technologies, the categories we use and how to manage your preferences.',
  intro: 'This policy explains how PrimeLoft Tech uses cookies and similar technologies when you visit our website, and how you can control them.',
  sections: [
    { h: 'What cookies are', body: '<p>Cookies are small text files placed on your device when you visit a website. They help us recognise your browser and remember your preferences, such as your light or dark theme choice.</p>' },
    { h: 'Cookie categories', body: '<ul><li><strong>Essential:</strong> always on. Required for navigation, security, theme preference and remembering your consent choice.</li><li><strong>Analytics and performance:</strong> optional. Measure traffic sources, page views and performance so we can improve the site.</li><li><strong>Marketing and social:</strong> optional. Used by platforms such as Meta and LinkedIn to measure campaigns and show relevant content.</li></ul>' },
    { h: 'Managing your preferences', body: '<p>You can change your cookie preferences at any time by clicking <a href="#" class="open-cookie-settings">Cookie preferences</a> in the website footer. You can also clear or block cookies in your browser settings.</p>' },
    { h: 'Contact', body: `<p>Questions about cookies? Email <a href="mailto:${SITE.email}">${SITE.email}</a>.</p>` }
  ]
});

export const terms = () => legalPage({
  file: 'terms.html', id: 'terms', title: 'Terms of Service', h1: 'Terms of Service', eyebrow: 'Legal',
  description: 'Terms governing the use of the PrimeLoft Tech website and the general terms under which we provide software development services.',
  intro: 'Please read these terms before using the PrimeLoft Tech website or engaging our services. Project-specific terms are set out in each proposal and agreement.',
  sections: [
    { h: 'Acceptance of terms', body: '<p>By accessing this website or engaging PrimeLoft Tech for services, you agree to these terms and our <a href="privacy.html">privacy policy</a>. Individual projects are governed by a written proposal or agreement that takes precedence where it differs.</p>' },
    { h: 'Services and proposals', body: '<p>Scope, price, timeline and deliverables are defined in a written proposal. Work starts once the proposal is accepted and any agreed deposit is received. Changes to scope are documented and priced before being carried out.</p>' },
    { h: 'Intellectual property', body: '<p>On full payment, you own the deliverables created for you, including source code and design files, unless a proposal states otherwise. PrimeLoft Tech retains rights to pre-existing tools, libraries and know-how, and to the content and branding of this website.</p>' },
    { h: 'Payments', body: '<p>Invoices are issued per milestone or monthly for retainers and are payable within 14 days unless agreed otherwise. Accepted methods include bank transfer, Wise and card.</p>' },
    { h: 'Liability', body: '<p>We deliver services with reasonable skill and care. To the extent permitted by law, our total liability under any engagement is limited to the fees paid for that engagement, and we are not liable for indirect or consequential loss.</p>' },
    { h: 'Contact', body: `<p>Questions about these terms? Email <a href="mailto:${SITE.email}">${SITE.email}</a>.</p>` }
  ]
});

/* ═══════════════════════════ 404 ═══════════════════════════ */
export function notFound() {
  const popular = ['service-web-development.html', 'service-mobile-app-development.html', 'service-wordpress-development.html', 'service-seo.html'].map(bySlug);
  const main = `
    <section class="error-section">
      <div class="wrap error-grid">
        <div class="reveal">
          <div class="eyebrow">404 · Page not found</div>
          <h1>This page has <span class="script">wandered</span> off</h1>
          <p class="lead">The link may be out of date or the page may have moved. Try one of the pages below, or head back home.</p>
          <div class="hero-ctas">
            <a href="index.html" class="btn btn-primary btn-lg">Back to homepage ${ARROW}</a>
            <a href="contact.html" class="btn btn-ghost btn-lg">Contact us</a>
          </div>
          <div class="error-links">
            <span class="eyebrow">Popular pages</span>
            <ul>${popular.map((s) => `<li><a href="${s.slug}">${s.name}</a></li>`).join('')}<li><a href="services.html">All services</a></li><li><a href="about.html">About PrimeLoft</a></li></ul>
          </div>
        </div>
        <div class="error-media reveal" style="--d:120ms">${lottie('404', { label: 'Illustration of a browser window searching for a missing page' })}</div>
      </div>
    </section>`;
  return {
    file: '404.html', id: 'notfound', title: T('Page Not Found'),
    description: 'The page you requested could not be found. Return to the PrimeLoft homepage or browse our services.',
    bodyClass: 'page-404', noindex: true, schema: [], main
  };
}
