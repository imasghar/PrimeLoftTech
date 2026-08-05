/**
 * PrimeLoft Tech - Cookie Consent Service (GDPR / CCPA Compliant)
 * Manages versioned consent preferences in localStorage.
 */
import { CONFIG } from './config.js';

export class ConsentService {
  constructor() {
    this.storageKey = CONFIG.CONSENT_KEY;
    this.version = CONFIG.CONSENT_VERSION;
    this.listeners = [];
  }

  /**
   * Retrieves current consent object from localStorage or null if unset
   */
  getConsent() {
    try {
      const item = localStorage.getItem(this.storageKey);
      if (!item) return null;
      const parsed = JSON.parse(item);
      if (parsed.version !== this.version) {
        return null; // Force re-consent if schema version changes
      }
      return parsed;
    } catch (err) {
      console.warn('ConsentService: Error reading consent state', err);
      return null;
    }
  }

  /**
   * Checks if user has already made a consent decision
   */
  hasConsented() {
    return this.getConsent() !== null;
  }

  /**
   * Saves consent state and broadcasts change event
   */
  saveConsent({ analytics = false, marketing = false }) {
    const payload = {
      version: this.version,
      essential: true,
      analytics: Boolean(analytics),
      marketing: Boolean(marketing),
      timestamp: new Date().toISOString()
    };

    try {
      localStorage.setItem(this.storageKey, JSON.stringify(payload));
    } catch (err) {
      console.error('ConsentService: Failed to save consent', err);
    }

    this.notify(payload);
    window.dispatchEvent(new CustomEvent('primeloft_consent_updated', { detail: payload }));
    return payload;
  }

  /**
   * Convenience helpers for bulk consent actions
   */
  acceptAll() {
    return this.saveConsent({ analytics: true, marketing: true });
  }

  rejectAll() {
    return this.saveConsent({ analytics: false, marketing: false });
  }

  /**
   * Subscription pattern for consent updates
   */
  onConsentChange(callback) {
    if (typeof callback === 'function') {
      this.listeners.push(callback);
      const current = this.getConsent();
      if (current) callback(current);
    }
  }

  notify(consentData) {
    this.listeners.forEach(fn => {
      try { fn(consentData); } catch (e) { console.error(e); }
    });
  }
}

export const consentService = new ConsentService();
