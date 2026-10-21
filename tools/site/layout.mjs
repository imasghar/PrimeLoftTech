/**
 * Layout partials shared by every page: <head>, header/navigation, footer, cookie consent, page shell.
 */
import { SITE, NAV } from './data/site.mjs';
import { SERVICES, GROUPS, byGroup } from './data/services.mjs';

export const esc = (s = '') => String(s).replace(/&(?!(amp|lt|gt|quot|#39|#\d+);)/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const stripTags = (s = '') => String(s).replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
export const plain = stripTags;

const LOGO = (lazy = false) => `
        <a href="index.html" class="logo-brand" aria-label="PrimeLoft Software Solutions, home">
          <picture class="logo-img logo-img-light">
            <source srcset="images/logo-light.webp" type="image/webp">
            <img src="images/logo-light.png" class="logo-img" alt="PrimeLoft Software Solutions" width="200" height="66"${lazy ? ' loading="lazy"' : ''}>
          </picture>
          <picture class="logo-img logo-img-dark">
            <source srcset="images/logo-dark.webp" type="image/webp">
            <img src="images/logo-dark.png" class="logo-img" alt="PrimeLoft Software Solutions" width="200" height="66"${lazy ? ' loading="lazy"' : ''}>
          </picture>
        </a>`;

const SOCIAL = {
  whatsapp: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.99c-.002 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662a11.87 11.87 0 005.707 1.456h.005c6.554 0 11.89-5.335 11.893-11.893 0-3.177-1.238-6.164-3.486-8.413z"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.94 5a2 2 0 1 1-4-.002 2 2 0 0 1 4 .002zM7 8.48H3V21h4V8.48zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.68-2.91V8.48z"/></svg>',
  facebook: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H7.5v-3H10V9.69c0-2.47 1.47-3.83 3.72-3.83 1.08 0 2.21.19 2.21.19v2.43h-1.25c-1.22 0-1.6.76-1.6 1.54V12h2.73l-.44 3h-2.29v6.8c4.56-.93 8-4.96 8-9.8z"/></svg>'
};

export const socialRow = () => `
            <div class="social-links-row">
              <a href="${SITE.whatsapp}" target="_blank" rel="noopener noreferrer" class="social-btn wa" aria-label="Chat with PrimeLoft on WhatsApp">${SOCIAL.whatsapp}</a>
              <a href="${SITE.linkedin}" target="_blank" rel="noopener noreferrer" class="social-btn li" aria-label="Follow PrimeLoft on LinkedIn">${SOCIAL.linkedin}</a>
              <a href="${SITE.facebook}" target="_blank" rel="noopener noreferrer" class="social-btn fb" aria-label="Follow PrimeLoft on Facebook">${SOCIAL.facebook}</a>
            </div>`;

export const ARROW = '<span class="btn-arrow" aria-hidden="true"><svg viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>';

/* ---------- <head> ---------- */
export function head(page) {
  const title = page.title;
  const desc = esc(page.description);
  const canonical = `${SITE.url}/${page.file === 'index.html' ? '' : page.file}`;
  const robots = page.noindex ? '<meta name="robots" content="noindex, follow">' : '<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">';
  const schema = (page.schema || []).map((s) => `  <script type="application/ld+json">${JSON.stringify(s)}</script>`).join('\n');
  const preload = page.preloadLottie ? `  <link rel="preload" href="animations/${page.preloadLottie}-light.json" as="fetch" crossorigin>` : '';
  return `<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(title)}</title>
  <meta name="description" content="${desc}">
  ${page.keywords ? `<meta name="keywords" content="${esc(page.keywords)}">` : ''}
  <meta name="author" content="${SITE.legalName}">
  ${robots}
  <link rel="canonical" href="${canonical}">
  <meta property="og:locale" content="en_US">
  <meta property="og:type" content="${page.ogType || 'website'}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${desc}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:site_name" content="${SITE.name}">
  <meta property="og:image" content="${SITE.ogImage}">
  <meta property="og:image:secure_url" content="${SITE.ogImage}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:alt" content="PrimeLoft Software Solutions">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${desc}">
  <meta name="twitter:image" content="${SITE.ogImage}">
  <meta name="theme-color" content="#FAF7F2" media="(prefers-color-scheme: light)">
  <meta name="theme-color" content="#161319" media="(prefers-color-scheme: dark)">
  <meta name="color-scheme" content="light dark">
  <link rel="manifest" href="site.webmanifest">
  <link rel="icon" type="image/x-icon" href="favicon.ico?v=1.0.2">
  <link rel="icon" type="image/png" sizes="32x32" href="images/favicon-32x32.png?v=1.0.2">
  <link rel="icon" type="image/png" sizes="48x48" href="images/favicon-48x48.png?v=1.0.2">
  <link rel="icon" type="image/png" sizes="192x192" href="images/favicon-192x192.png?v=1.0.2">
  <link rel="apple-touch-icon" sizes="180x180" href="images/apple-touch-icon.png?v=1.0.2">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400&family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap">
  <link rel="stylesheet" href="css/style.css?v=${SITE.cssVersion}">
${preload}
  <script>(function(){try{var q=new URLSearchParams(location.search).get('theme');if(q==='dark'||q==='light'){localStorage.setItem('primeloft-theme',q);}var t=localStorage.getItem('primeloft-theme');if(t==='dark'||t==='light'){document.documentElement.setAttribute('data-theme',t);}else if(window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches){document.documentElement.setAttribute('data-theme','dark');}document.documentElement.classList.add('js');}catch(e){}})();</script>
  <script type="module" src="js/main.js?v=${SITE.jsVersion}"></script>
${schema}
</head>`;
}

/* ---------- header / navigation ---------- */
function megaMenu(activeFile) {
  const col = (groups) => groups.map((g) => `
                <div class="mega-group">
                  <div class="mega-group-label">${g.label}</div>
                  ${byGroup(g.key).map((s) => `
                  <a href="${s.slug}" class="mega-item${s.slug === activeFile ? ' active' : ''}" role="menuitem"${s.slug === activeFile ? ' aria-current="page"' : ''}>
                    <span class="mega-icon">${s.icon}</span>
                    <span class="mega-content"><span class="mtitle">${s.short}</span><span class="mdesc">${s.menuDesc}</span></span>
                  </a>`).join('')}
                </div>`).join('');
  const g = Object.fromEntries(GROUPS.map((x) => [x.key, x]));
  return `
          <div class="mega" id="servicesDropdown" role="menu" aria-label="Services menu">
            <div class="mega-grid">
              <div class="mega-col">${col([g.build])}</div>
              <div class="mega-col">${col([g.design, g.grow, g.run])}</div>
            </div>
            <div class="mega-footer">
              <span class="mega-footer-label">${SERVICES.length} services. One senior team.</span>
              <a href="services.html" class="mega-footer-link"><span>View all services</span><svg class="mega-footer-arrow" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></a>
            </div>
          </div>`;
}

export function header(page) {
  const active = page.file;
  const isService = active.startsWith('service');
  const links = NAV.map((n) => {
    const isActive = n.href === active || (n.mega && isService);
    if (n.mega) {
      return `
        <div class="has-mega">
          <a href="${n.href}" class="navlink${isActive ? ' active' : ''}" aria-expanded="false" aria-haspopup="true" aria-controls="servicesDropdown"${isActive ? ' aria-current="page"' : ''}>${n.label}
            <svg class="caret" viewBox="0 0 10 10" fill="none" aria-hidden="true"><path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
          </a>${megaMenu(active)}
        </div>`;
    }
    return `
        <a href="${n.href}" class="navlink${isActive ? ' active' : ''}"${isActive ? ' aria-current="page"' : ''}>${n.label}</a>`;
  }).join('');
  return `
  <a class="skip-link" href="#main-content">Skip to content</a>
  <header class="site-header" id="siteHeader">
    <div class="nav-row">${LOGO()}
      <nav class="primary" id="primaryNav" aria-label="Primary">${links}
        <div class="nav-mobile-extra">
          <a href="contact.html" class="btn btn-primary">Estimate project ${ARROW}</a>
          <a href="${SITE.whatsapp}" target="_blank" rel="noopener noreferrer" class="btn btn-ghost">WhatsApp us</a>
        </div>
      </nav>
      <div class="header-right">
        <button class="theme-toggle" id="themeToggle" type="button" aria-label="Switch between light and dark theme" aria-pressed="false">
          <span class="knob">
            <svg class="icon-sun" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="4.5" stroke="currentColor" stroke-width="1.8"/><path d="M12 2v2.5M12 19.5V22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M2 12h2.5M19.5 12H22M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
            <svg class="icon-moon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>
          </span>
        </button>
        <a href="contact.html" class="btn btn-primary header-cta">Estimate project ${ARROW}</a>
        <button class="mobile-toggle" id="mobileToggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="primaryNav">
          <span class="burger" aria-hidden="true"><span></span><span></span><span></span></span>
        </button>
      </div>
    </div>
  </header>`;
}

/* ---------- footer ---------- */
export function footer(page) {
  const id = page.id || page.file.replace(/\W/g, '');
  const build = byGroup('build');
  const rest = [...byGroup('design'), ...byGroup('grow'), ...byGroup('run')];
  const li = (s) => `<li><a href="${s.slug}">${s.short}</a></li>`;
  return `
  <footer class="site-footer">
    <div class="wrap">
      <div class="footer-top">
        <div class="footer-brand">${LOGO(true)}
          <p>A software development studio building websites, mobile apps and custom software for businesses worldwide. Senior-led, fixed-price, remote-first.</p>${socialRow()}
        </div>
        <div class="footer-col">
          <h3 class="footer-title">Build</h3>
          <ul class="footer-links">${build.map(li).join('')}</ul>
        </div>
        <div class="footer-col">
          <h3 class="footer-title">Design, grow &amp; run</h3>
          <ul class="footer-links">${rest.map(li).join('')}</ul>
        </div>
        <div class="footer-col">
          <h3 class="footer-title">Company</h3>
          <ul class="footer-links">
            <li><a href="about.html">About us</a></li>
            <li><a href="services.html">All services</a></li>
            <li><a href="contact.html">Contact</a></li>
            <li><a href="privacy.html">Privacy policy</a></li>
            <li><a href="terms.html">Terms of service</a></li>
            <li><a href="cookies.html">Cookie policy</a></li>
          </ul>
        </div>
        <div class="footer-col footer-contact">
          <h3 class="footer-title">Get in touch</h3>
          <a href="mailto:${SITE.email}" class="footer-contact-line"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg><span>${SITE.email}</span></a>
          <a href="tel:${SITE.phoneIntl}" class="footer-contact-line"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13 1 .37 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.33 1.8.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg><span>${SITE.phone}</span></a>
          <div class="footer-contact-line"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg><span>${SITE.address.short}</span></div>
          <div class="footer-contact-line"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg><span>${SITE.hours}</span></div>
          <div class="footer-newsletter">
            <h4 class="footer-title">Newsletter</h4>
            <p>Practical notes on web, apps and growth. No spam, unsubscribe anytime.</p>
            <form class="newsletterForm" action="${SITE.formspree}" method="POST" aria-label="Newsletter subscription">
              <input type="hidden" name="_subject" value="New Newsletter Subscription | PrimeLoft Tech">
              <input type="text" name="_gotcha" class="hp-field" tabindex="-1" autocomplete="off" aria-hidden="true">
              <label for="nl-email-${id}" class="sr-only">Email address</label>
              <input type="email" name="email" id="nl-email-${id}" placeholder="Your email address" autocomplete="email" required>
              <button type="submit" aria-label="Subscribe to newsletter">Subscribe</button>
            </form>
            <div class="newsletterStatus" role="status" aria-live="polite"></div>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <span>&copy; ${SITE.year} ${SITE.legalName}. All rights reserved.</span>
        <span class="footer-legal"><a href="privacy.html">Privacy</a> · <a href="cookies.html">Cookies</a> · <a href="terms.html">Terms</a> · <a href="#" class="open-cookie-settings">Cookie preferences</a></span>
        <a href="#main-content" class="back-to-top" aria-label="Back to top"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg></a>
      </div>
    </div>
  </footer>`;
}

/* ---------- cookie consent ---------- */
export function cookieConsent(page) {
  const id = page.id || page.file.replace(/\W/g, '');
  return `
  <div id="cookieBanner" class="cookie-banner" role="dialog" aria-live="polite" aria-label="Cookie consent" hidden>
    <div class="cookie-banner-inner">
      <div class="cookie-text">
        <div class="cookie-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5Z"/><circle cx="8.5" cy="8.5" r="1.5"/><circle cx="11.5" cy="15.5" r="1.5"/><circle cx="15.5" cy="11.5" r="1.5"/></svg>
          <span>We value your privacy</span>
        </div>
        <p>We use cookies to understand how the site is used and to improve it. Essential cookies are always on; analytics and marketing cookies only load with your consent. <a href="cookies.html">Cookie policy</a></p>
      </div>
      <div class="cookie-actions">
        <button type="button" id="btnRejectCookies" class="btn btn-ghost btn-sm">Reject all</button>
        <button type="button" id="btnCookiePrefs" class="btn btn-ghost btn-sm">Customise</button>
        <button type="button" id="btnAcceptCookies" class="btn btn-primary btn-sm">Accept all</button>
      </div>
    </div>
  </div>
  <div id="cookieModal" class="cookie-modal-backdrop" hidden role="dialog" aria-modal="true" aria-labelledby="cookieModalTitle-${id}">
    <div class="cookie-modal-card">
      <div class="cookie-modal-header">
        <h3 id="cookieModalTitle-${id}">Cookie preferences</h3>
        <button type="button" id="btnCloseCookieModal" class="cookie-modal-close" aria-label="Close preferences">&times;</button>
      </div>
      <div class="cookie-modal-body">
        <p>Choose which cookies you are happy for us to use. You can change this at any time from the footer.</p>
        <div class="cookie-option-card">
          <div class="cookie-option-header">
            <div class="cookie-option-info"><strong>Essential</strong><span>Always active</span></div>
            <input type="checkbox" id="chkEssential-${id}" checked disabled aria-label="Essential cookies, always active">
          </div>
          <p class="cookie-option-desc">Needed for security, navigation and remembering your theme choice. Cannot be disabled.</p>
        </div>
        <div class="cookie-option-card">
          <div class="cookie-option-header">
            <div class="cookie-option-info"><strong>Analytics &amp; performance</strong><span>Optional</span></div>
            <label class="switch"><input type="checkbox" id="chkAnalytics" aria-label="Allow analytics cookies"><span class="slider"></span></label>
          </div>
          <p class="cookie-option-desc">Helps us count visits and see which pages are useful so we can improve the site.</p>
        </div>
        <div class="cookie-option-card">
          <div class="cookie-option-header">
            <div class="cookie-option-info"><strong>Marketing &amp; social</strong><span>Optional</span></div>
            <label class="switch"><input type="checkbox" id="chkMarketing" aria-label="Allow marketing cookies"><span class="slider"></span></label>
          </div>
          <p class="cookie-option-desc">Used by social platforms (LinkedIn, Meta) to measure campaigns and show relevant content.</p>
        </div>
      </div>
      <div class="cookie-modal-footer">
        <button type="button" id="btnRejectAllModal" class="btn btn-ghost btn-sm">Reject all</button>
        <button type="button" id="btnSaveCookiePrefs" class="btn btn-primary btn-sm">Save preferences</button>
        <button type="button" id="btnAcceptAllModal" class="btn btn-ghost btn-sm">Accept all</button>
      </div>
    </div>
  </div>`;
}

/* ---------- shell ---------- */
export function renderPage(page) {
  return `${head(page)}
<body class="${page.bodyClass || ''}">${header(page)}

  <main id="main-content" tabindex="-1">${page.main}
  </main>
${footer(page)}
${cookieConsent(page)}
</body>
</html>
`;
}

/* ---------- reusable blocks ---------- */
export const ctaBand = ({ eyebrow = 'Let’s build', title, text, button = 'Estimate project', href = 'contact.html', secondary } = {}) => `
    <section class="cta-wrap">
      <div class="wrap">
        <div class="cta-band reveal">
          <div class="cta-glow cta-glow-a" aria-hidden="true"></div>
          <div class="cta-glow cta-glow-b" aria-hidden="true"></div>
          <div class="eyebrow eyebrow-center">${eyebrow}</div>
          <h2>${title}</h2>
          ${text ? `<p>${text}</p>` : ''}
          <div class="cta-actions">
            <a href="${href}" class="btn btn-primary btn-lg">${button} ${ARROW}</a>
            ${secondary ? `<a href="${secondary.href}" class="btn btn-ghost btn-lg"${secondary.external ? ' target="_blank" rel="noopener noreferrer"' : ''}>${secondary.label}</a>` : ''}
          </div>
        </div>
      </div>
    </section>`;

export const faqBlock = (faqs, { eyebrow = 'FAQ', title = 'Questions we hear a lot', id = 'faq' } = {}) => `
    <section class="faq-section" id="${id}">
      <div class="wrap">
        <div class="faq-grid">
          <div class="section-head reveal">
            <div class="eyebrow">${eyebrow}</div>
            <h2>${title}</h2>
            <p>Not answered here? <a href="contact.html">Ask us directly</a>, we reply within one business day.</p>
          </div>
          <div class="faq-list reveal">
            ${faqs.map((f, i) => `
            <details class="faq-item"${i === 0 ? ' open' : ''}>
              <summary><span>${f.q}</span><span class="faq-icon" aria-hidden="true"></span></summary>
              <div class="faq-answer"><p>${f.a}</p></div>
            </details>`).join('')}
          </div>
        </div>
      </div>
    </section>`;

export const faqSchema = (faqs) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({ '@type': 'Question', name: stripTags(f.q), acceptedAnswer: { '@type': 'Answer', text: stripTags(f.a) } }))
});

export const breadcrumbSchema = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: `${SITE.url}/${it.file === 'index.html' ? '' : it.file}` }))
});

export const breadcrumbHtml = (items) => `
        <nav class="breadcrumb" aria-label="Breadcrumb">
          <ol>${items.map((it, i) => i === items.length - 1 ? `<li aria-current="page">${it.name}</li>` : `<li><a href="${it.file}">${it.name}</a></li>`).join('')}</ol>
        </nav>`;

export const organizationSchema = () => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE.url}/#organization`,
      name: SITE.legalName,
      alternateName: ['PrimeLoft', 'PrimeLoft Software Solutions'],
      url: `${SITE.url}/`,
      logo: { '@type': 'ImageObject', url: `${SITE.url}/images/favicon-192x192.png?v=1.0.2`, width: 192, height: 192 },
      image: SITE.ogImage,
      description: SITE.description,
      email: SITE.email,
      telephone: SITE.phoneIntl,
      address: { '@type': 'PostalAddress', streetAddress: SITE.address.street, addressLocality: SITE.address.city, addressRegion: SITE.address.region, postalCode: SITE.address.postal, addressCountry: SITE.address.country },
      areaServed: ['Worldwide', 'United States', 'United Kingdom', 'European Union', 'Australia', 'United Arab Emirates', 'Saudi Arabia', 'Canada', 'Pakistan'],
      contactPoint: [{ '@type': 'ContactPoint', telephone: SITE.phoneIntl, email: SITE.email, contactType: 'sales', availableLanguage: ['English', 'Urdu'], areaServed: 'Worldwide' }],
      sameAs: [SITE.linkedin, SITE.facebook, SITE.whatsapp],
      knowsAbout: ['Web development', 'Mobile app development', 'WordPress', 'Squarespace', 'SEO', 'UX/UI design', 'Cloud and DevOps', 'Software testing', 'AI integration']
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE.url}/#website`,
      url: `${SITE.url}/`,
      name: SITE.name,
      publisher: { '@id': `${SITE.url}/#organization` },
      inLanguage: 'en'
    }
  ]
});

export const professionalServiceSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': `${SITE.url}/#localbusiness`,
  name: SITE.legalName,
  image: SITE.ogImage,
  url: `${SITE.url}/`,
  telephone: SITE.phoneIntl,
  email: SITE.email,
  priceRange: '$$',
  address: { '@type': 'PostalAddress', streetAddress: SITE.address.street, addressLocality: SITE.address.city, addressRegion: SITE.address.region, postalCode: SITE.address.postal, addressCountry: SITE.address.country },
  geo: { '@type': 'GeoCoordinates', latitude: SITE.geo.lat, longitude: SITE.geo.lng },
  openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '09:00', closes: '18:00' }],
  areaServed: 'Worldwide',
  parentOrganization: { '@id': `${SITE.url}/#organization` }
});

export const serviceSchema = (s) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  '@id': `${SITE.url}/${s.slug}#service`,
  name: s.name,
  serviceType: s.name,
  description: stripTags(s.metaDescription),
  url: `${SITE.url}/${s.slug}`,
  provider: { '@id': `${SITE.url}/#organization` },
  areaServed: 'Worldwide',
  availableChannel: { '@type': 'ServiceChannel', serviceUrl: `${SITE.url}/contact.html`, availableLanguage: 'English' },
  hasOfferCatalog: { '@type': 'OfferCatalog', name: `${s.name} capabilities`, itemListElement: s.capabilities.map((c) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: stripTags(c.title), description: stripTags(c.desc) } })) }
});

/* Service card used on home + related sections */
export const serviceCard = (s, { delay = 0, compact = false } = {}) => `
          <a href="${s.slug}" class="service-card reveal tilt" style="--d:${delay}ms">
            <span class="service-card-icon">${s.icon}</span>
            <span class="service-card-body">
              <span class="service-card-title">${s.name}</span>
              ${compact ? '' : `<span class="service-card-desc">${s.overview}</span>`}
            </span>
            <span class="service-card-arrow" aria-hidden="true"><svg viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
          </a>`;

export const lottie = (name, { className = '', label = '' } = {}) => `<div class="lottie ${className}" data-lottie="${name}" role="img" aria-label="${esc(label)}"></div>`;
