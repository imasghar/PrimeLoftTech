/**
 * PrimeLoft Tech - Cookie Consent UI Controller
 * Controls floating banner, preferences center modal, and toggle interactions.
 */
import { consentService } from './consent-service.js';

export class CookieConsentUI {
  static init() {
    this.banner = document.getElementById('cookieBanner');
    this.modal = document.getElementById('cookieModal');

    // 1. Show banner on first visit if consent is un-set
    if (!consentService.hasConsented()) {
      setTimeout(() => this.showBanner(), 500);
    }

    // 2. Bind Event Listeners
    this.bindEvents();
  }

  static showBanner() {
    if (this.banner) this.banner.style.display = 'block';
  }

  static hideBanner() {
    if (this.banner) this.banner.style.display = 'none';
  }

  static showModal() {
    const current = consentService.getConsent() || { essential: true, analytics: false, marketing: false };
    const chkAnalytics = document.getElementById('chkAnalytics');
    const chkMarketing = document.getElementById('chkMarketing');

    if (chkAnalytics) chkAnalytics.checked = Boolean(current.analytics);
    if (chkMarketing) chkMarketing.checked = Boolean(current.marketing);

    if (this.modal) this.modal.style.display = 'flex';
  }

  static hideModal() {
    if (this.modal) this.modal.style.display = 'none';
  }

  static bindEvents() {
    // Banner Actions
    document.getElementById('btnAcceptCookies')?.addEventListener('click', () => {
      consentService.acceptAll();
      this.hideBanner();
    });

    document.getElementById('btnRejectCookies')?.addEventListener('click', () => {
      consentService.rejectAll();
      this.hideBanner();
    });

    document.getElementById('btnCookiePrefs')?.addEventListener('click', () => {
      this.hideBanner();
      this.showModal();
    });

    // Modal Actions
    document.getElementById('btnCloseCookieModal')?.addEventListener('click', () => this.hideModal());

    document.getElementById('btnSaveCookiePrefs')?.addEventListener('click', () => {
      const chkAnalytics = document.getElementById('chkAnalytics');
      const chkMarketing = document.getElementById('chkMarketing');

      consentService.saveConsent({
        analytics: chkAnalytics ? chkAnalytics.checked : false,
        marketing: chkMarketing ? chkMarketing.checked : false
      });

      this.hideModal();
    });

    document.getElementById('btnAcceptAllModal')?.addEventListener('click', () => {
      consentService.acceptAll();
      this.hideModal();
    });

    document.getElementById('btnRejectAllModal')?.addEventListener('click', () => {
      consentService.rejectAll();
      this.hideModal();
    });

    // Footer "Manage Cookie Preferences" Links
    document.querySelectorAll('.open-cookie-settings').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.showModal();
      });
    });
  }
}
