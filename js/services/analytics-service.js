/**
 * PrimeLoft Tech - Unified Analytics Event Tracking Service
 * Tracks user interactions, scroll milestones, outbound clicks, CTAs, and contact form submissions.
 */
import { consentService } from './consent-service.js';

export class AnalyticsService {
  constructor() {
    this.trackedScrollMilestones = new Set();
    this.isInitialized = false;
  }

  init() {
    if (this.isInitialized) return;
    this.isInitialized = true;

    // Track Page View
    this.trackPageView(window.location.pathname);

    // Track Click Events
    this.initClickTracking();

    // Track Scroll Milestones (25%, 50%, 75%, 100%)
    this.initScrollTracking();
  }

  /**
   * Safe dataLayer pusher that respects user analytics consent
   */
  pushEvent(eventName, payload = {}) {
    const consent = consentService.getConsent();
    if (!consent || !consent.analytics) return;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: eventName,
      timestamp: new Date().toISOString(),
      ...payload
    });
  }

  trackPageView(pagePath) {
    this.pushEvent('page_view', {
      page_path: pagePath,
      page_title: document.title
    });
  }

  initClickTracking() {
    document.addEventListener('click', (e) => {
      const anchor = e.target.closest('a');
      const button = e.target.closest('button, .btn');

      if (anchor) {
        const href = anchor.getAttribute('href') || '';
        const linkText = anchor.textContent?.trim() || '';

        // 1. Phone Click
        if (href.startsWith('tel:')) {
          this.pushEvent('phone_click', { phone_number: href.replace('tel:', ''), link_text: linkText });
          return;
        }

        // 2. Email Click
        if (href.startsWith('mailto:')) {
          this.pushEvent('email_click', { email: href.replace('mailto:', ''), link_text: linkText });
          return;
        }

        // 3. WhatsApp Click
        if (href.includes('wa.me') || href.includes('whatsapp.com')) {
          this.pushEvent('whatsapp_click', { url: href, link_text: linkText });
          return;
        }

        // 4. Outbound Link Click
        if (href.startsWith('http') && !href.includes(window.location.hostname)) {
          this.pushEvent('outbound_click', { destination_url: href, link_text: linkText });
          return;
        }

        // 5. Service Card / Anchor Click
        if (anchor.closest('.mega, .expertise-card, .service-card')) {
          this.pushEvent('service_card_click', { destination_url: href, title: linkText });
          return;
        }
      }

      if (button) {
        const buttonText = button.textContent?.trim() || button.getAttribute('aria-label') || '';
        if (button.classList.contains('btn-primary') || button.classList.contains('btn')) {
          this.pushEvent('cta_button_click', { button_text: buttonText });
        }
      }
    });
  }

  initScrollTracking() {
    let timer = null;
    window.addEventListener('scroll', () => {
      if (timer) return;
      timer = setTimeout(() => {
        timer = null;
        this.checkScrollMilestones();
      }, 250);
    }, { passive: true });
  }

  checkScrollMilestones() {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return;

    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollPercent = Math.round((scrollTop / docHeight) * 100);

    const milestones = [25, 50, 75, 100];
    milestones.forEach(m => {
      if (scrollPercent >= m && !this.trackedScrollMilestones.has(m)) {
        this.trackedScrollMilestones.add(m);
        this.pushEvent(`scroll_${m}`, { depth: m, percent: `${m}%` });
      }
    });
  }

  trackFormSubmission(formId, formName = 'Contact Form') {
    this.pushEvent('contact_form_submitted', {
      form_id: formId,
      form_name: formName
    });
  }
}

export const analyticsService = new AnalyticsService();
