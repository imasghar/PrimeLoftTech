/**
 * PrimeLoft Tech - Consent-Aware Tracking Service
 * Dynamically injects GTM, GA4, Clarity, Meta Pixel, and LinkedIn Insight Tag based on user consent.
 */
import { CONFIG } from './config.js';
import { consentService } from './consent-service.js';

export class TrackingService {
  constructor() {
    this.gtmLoaded = false;
    this.clarityLoaded = false;
    this.metaPixelLoaded = false;
    this.linkedInLoaded = false;

    // Initialize dataLayer array
    window.dataLayer = window.dataLayer || [];
  }

  init() {
    consentService.onConsentChange((consent) => this.applyConsent(consent));
  }

  applyConsent(consent) {
    if (!consent) return;

    // 1. Analytics Category Consent (GTM, GA4, Microsoft Clarity)
    if (consent.analytics) {
      this.loadGTM();
      this.loadMicrosoftClarity();
    }

    // 2. Marketing Category Consent (Meta Pixel, LinkedIn Insight Tag)
    if (consent.marketing) {
      this.loadMetaPixel();
      this.loadLinkedInInsightTag();
    }
  }

  /**
   * Inject Google Tag Manager (GTM)
   */
  loadGTM() {
    if (this.gtmLoaded || CONFIG.GTM_ID === 'GTM-XXXXXXX') return;
    this.gtmLoaded = true;

    window.dataLayer.push({
      'gtm.start': new Date().getTime(),
      event: 'gtm.js'
    });

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${CONFIG.GTM_ID}`;
    document.head.appendChild(script);
  }

  /**
   * Inject Microsoft Clarity Placeholder Loader
   */
  loadMicrosoftClarity() {
    if (this.clarityLoaded || CONFIG.CLARITY_PROJECT_ID === 'CLARITY_PROJECT_ID') return;
    this.clarityLoaded = true;

    (function(c,l,a,r,i,t,y){
      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", CONFIG.CLARITY_PROJECT_ID);
  }

  /**
   * Inject Meta Pixel Placeholder Loader
   */
  loadMetaPixel() {
    if (this.metaPixelLoaded || CONFIG.META_PIXEL_ID === 'PIXEL_ID') return;
    this.metaPixelLoaded = true;

    !(function(f,b,e,v,n,t,s){
      if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

    window.fbq('init', CONFIG.META_PIXEL_ID);
    window.fbq('track', 'PageView');
  }

  /**
   * Inject LinkedIn Insight Tag Placeholder Loader
   */
  loadLinkedInInsightTag() {
    if (this.linkedInLoaded || CONFIG.LINKEDIN_PARTNER_ID === 'LINKEDIN_PARTNER_ID') return;
    this.linkedInLoaded = true;

    window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
    window._linkedin_data_partner_ids.push(CONFIG.LINKEDIN_PARTNER_ID);

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = 'https://snap.licdn.com/li.lms-analytics/insight.min.js';
    document.head.appendChild(script);
  }
}

export const trackingService = new TrackingService();
