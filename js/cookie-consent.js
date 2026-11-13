/* Optional analytics stays unloaded until consent. This file is shared by all pages. */
(() => {
  const ID = 'G-B2J46QTCHB';
  const KEY = 'primeloft-cookie-consent-v1';
  const MAX_AGE = 180 * 24 * 60 * 60 * 1000;
  let choice = null;
  let loaded = false;
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    if (saved && ['accepted', 'rejected'].includes(saved.choice) && Date.now() - saved.time < MAX_AGE) choice = saved.choice;
  } catch { /* Storage may be unavailable; keep optional analytics disabled. */ }
  if (navigator.globalPrivacyControl === true) choice = 'rejected';
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });

  function apply() {
    const allowed = choice === 'accepted' && navigator.globalPrivacyControl !== true;
    window[`ga-disable-${ID}`] = !allowed;
    window.gtag('consent', 'update', { analytics_storage: allowed ? 'granted' : 'denied' });
    if (allowed && !loaded) {
      loaded = true;
      window.gtag('js', new Date());
      window.gtag('config', ID, { allow_google_signals: false, allow_ad_personalization_signals: false, page_location: location.origin + location.pathname, page_referrer: '' });
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${ID}`;
      document.head.append(script);
    }
    if (!allowed) {
      const domains = [location.hostname, '.' + location.hostname, ''];
      document.cookie.split(';').forEach(cookie => {
        const name = cookie.trim().split('=')[0];
        if (!/^_ga(?:_|$)/.test(name)) return;
        domains.forEach(domain => { document.cookie = `${name}=; Max-Age=0; path=/;${domain ? ` domain=${domain};` : ''} SameSite=Lax`; });
      });
    }
  }
  apply();
  const banner = document.createElement('div');
  banner.className = 'cookie-banner';
  banner.setAttribute('aria-labelledby', 'cookie-title');
  banner.setAttribute('role', 'region');
  banner.hidden = choice !== null;
  banner.innerHTML = '<div class="cookie-heading"><span class="cookie-mark" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-9-9 5 5 0 0 0 9 9Z"/><path d="M7.5 8h.01M8 15h.01M13 17h.01M12 11h.01" stroke-width="3"/></svg></span><div><span class="cookie-kicker">YOUR PRIVACY</span><h2 id="cookie-title">Cookies, your choice.</h2></div></div><p>We remember your cookie choice. With your permission, Google Analytics helps us improve the site. It stays off until you accept.</p><a class="cookie-policy-link" href="cookies.html">Read our cookie policy <span aria-hidden="true">↗</span></a><div class="cookie-actions"><button type="button" data-choice="rejected">Reject analytics</button><button type="button" data-choice="accepted">Accept analytics</button></div><p data-cookie-status role="status"></p>';
  document.body.append(banner);
  let returnFocus;
  banner.addEventListener('click', event => {
    const button = event.target.closest('[data-choice]');
    if (!button) return;
    choice = navigator.globalPrivacyControl === true ? 'rejected' : button.dataset.choice;
    try { localStorage.setItem(KEY, JSON.stringify({ choice, time: Date.now() })); } catch { /* Choice still applies to this page. */ }
    apply();
    banner.hidden = true;
    (returnFocus || document.querySelector('[data-cookie-settings]'))?.focus({ preventScroll: true });
  });
  document.querySelectorAll('[data-cookie-settings]').forEach(button => button.addEventListener('click', event => {
    event.preventDefault();
    returnFocus = button;
    banner.hidden = false;
    banner.querySelector('[data-cookie-status]').textContent = navigator.globalPrivacyControl === true ? 'Your browser’s Global Privacy Control keeps optional analytics disabled.' : choice === 'accepted' ? 'Your current choice: analytics allowed. You can change it using these buttons.' : choice === 'rejected' ? 'Your current choice: analytics off. You can change it using these buttons.' : '';
    banner.querySelector('button').focus();
  }));
  window.addEventListener('storage', event => {
    if (event.key === KEY) location.reload();
  });
})();
