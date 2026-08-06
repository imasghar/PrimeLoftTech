/**
 * PrimeLoft Tech - SEO & Structured Data Service
 * Injects Organization & LocalBusiness JSON-LD schemas into document head.
 */
import { CONFIG } from './config.js';

export class SeoService {
  static init() {
    this.injectOrganizationSchema();
    if (window.location.pathname.includes('contact') || window.location.pathname.includes('about')) {
      this.injectLocalBusinessSchema();
    }
  }

  static injectOrganizationSchema() {
    if (document.getElementById('org-schema')) return;

    const schema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": CONFIG.COMPANY_NAME,
      "url": CONFIG.SITE_URL,
      "logo": `${CONFIG.SITE_URL}/favicon.ico`,
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": CONFIG.CONTACT_PHONE,
        "contactType": "customer service",
        "email": CONFIG.CONTACT_EMAIL,
        "availableLanguage": ["English"]
      },
      "sameAs": [
        "https://www.linkedin.com/company/primloft/",
        "https://www.facebook.com/primelofttech",
        "https://wa.me/923359873132"
      ]
    };

    const script = document.createElement('script');
    script.id = 'org-schema';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  }

  static injectLocalBusinessSchema() {
    if (document.getElementById('local-business-schema')) return;

    const schema = {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "name": CONFIG.COMPANY_NAME,
      "image": `${CONFIG.SITE_URL}/favicon.ico`,
      "telephone": CONFIG.CONTACT_PHONE,
      "email": CONFIG.CONTACT_EMAIL,
      "address": {
        "@type": "PostalAddress",
        ...CONFIG.ADDRESS
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 30.055,
        "longitude": 70.638
      },
      "url": CONFIG.SITE_URL,
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        "opens": "09:00",
        "closes": "18:00"
      }
    };

    const script = document.createElement('script');
    script.id = 'local-business-schema';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  }
}
