const MEASUREMENT_ID = 'G-B2J46QTCHB';
const STATE_KEY = Symbol.for('primeloft.leadAnalytics');
const state = window[STATE_KEY] ||= { initialized: false, responses: new WeakSet() };

function analyticsAllowed() {
  if (typeof window.gtag !== 'function' || window[`ga-disable-${MEASUREMENT_ID}`] === true || navigator.globalPrivacyControl === true) return false;
  // No CMP currently exists. Honor explicit Google consent commands if introduced.
  let analyticsStorage;
  for (const command of window.dataLayer || []) {
    if (command?.[0] === 'consent' && ['default', 'update'].includes(command[1]) && command[2]?.analytics_storage) {
      analyticsStorage = command[2].analytics_storage;
    }
  }
  return analyticsStorage !== 'denied';
}

function track(name) {
  try {
    if (!analyticsAllowed()) return;
    window.gtag('event', name, {
      send_to: MEASUREMENT_ID,
      // Never include contact destinations, prefilled messages or URL query data.
      page_location: window.location.origin + window.location.pathname,
      page_referrer: '',
    });
  } catch {
    // Analytics must never interrupt navigation or a successful submission.
  }
}

export function trackConfirmedLead(response) {
  if (!response?.ok || state.responses.has(response)) return;
  state.responses.add(response);
  track('generate_lead');
}

export function initLeadAnalytics() {
  if (state.initialized) return;
  state.initialized = true;
  document.addEventListener('click', event => {
    if (event.button !== 0) return;
    const link = event.target instanceof Element ? event.target.closest('a[href]') : null;
    if (!link) return;
    let url;
    try { url = new URL(link.getAttribute('href'), window.location.href); } catch { return; }
    if (url.protocol === 'mailto:') {
      // Restrict email tracking to PrimeLoft's business domain.
      let recipients;
      try { recipients = decodeURIComponent(url.pathname).split(/[;,]/); } catch { return; }
      if (recipients.length && recipients.every(address => /^[^@\s]+@primeloft\.tech$/i.test(address))) track('email_click');
    } else if (url.protocol === 'https:' && ['wa.me', 'api.whatsapp.com', 'web.whatsapp.com', 'www.whatsapp.com', 'whatsapp.com'].includes(url.hostname)) {
      track('whatsapp_click');
    } else if (url.protocol === 'whatsapp:') {
      track('whatsapp_click');
    }
  }, true);
}
