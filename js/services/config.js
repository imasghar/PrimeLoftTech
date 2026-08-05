/**
 * PrimeLoft Tech - Central Application & Tracking Configuration
 * Contains environment placeholders for GTM, GA4, Clarity, Meta Pixel, LinkedIn Insight Tag, and Turnstile.
 */
export const CONFIG = {
  // Consent Management Configuration
  CONSENT_KEY: 'primeloft_cookie_consent_v1',
  CONSENT_VERSION: 1,

  // Tracking & Analytics Placeholders (Replace with production IDs)
  GTM_ID: 'GTM-XXXXXXX',
  GA_MEASUREMENT_ID: 'G-XXXXXXXXXX',
  CLARITY_PROJECT_ID: 'CLARITY_PROJECT_ID',
  META_PIXEL_ID: 'PIXEL_ID',
  LINKEDIN_PARTNER_ID: 'LINKEDIN_PARTNER_ID',

  // Security & Bot Protection Placeholders
  TURNSTILE_SITE_KEY: '0x4AAAAAAAX...',

  // Studio Metadata
  SITE_URL: 'https://primeloft.tech',
  COMPANY_NAME: 'PrimeLoft Tech',
  CONTACT_EMAIL: 'contact@primeloft.tech',
  CONTACT_PHONE: '+923359873132',
  ADDRESS: {
    streetAddress: 'GardenTown, Multan Road',
    addressLocality: 'Dera Ghazi Khan',
    addressRegion: 'Punjab',
    postalCode: '32200',
    addressCountry: 'PK'
  }
};
