# Production QA and security review

Date: 2 November 2026 (Asia/Karachi)

## Verdict

**AMBER: ready for staging and deployment review; not yet cleared for public production.**
The local site passes the checks below. Production-specific controls and actual email delivery remain unverified. Public read-only requests to https://primeloft.tech/ and /contact.html returned HTTP 403 during this review. This does not establish that ordinary visitors are blocked, nor does it verify the production security headers.

## Verified locally

- Static checks: 20 HTML files (19 active pages plus the legacy URL redirect), internal resources and fragment links, image alt attributes, unique IDs, JSON-LD parsing, and JavaScript syntax passed.
- Chrome checks: all 19 active pages at 320, 390, 768 and 1440 pixels; no horizontal document overflow, uncaught JavaScript exceptions, broken loaded images, or empty unnamed links detected. Each active page has one H1.
- Repeated browser checks with the proposed Content-Security-Policy enforced as an HTTP response header: no security-policy errors recorded.
- Contact form: service preselection and SEO budget range, simulated successful submission/reset, simulated server error/re-enabled submit button, and honeypot suppression passed. Responses were mocked locally; no inquiry or email was sent.
- Chatbot: a user string containing an image/onerror payload remained literal text and created no image element. Existing escaped interpolations reviewed. This is a targeted XSS regression, not proof against every possible attack.
- Mobile menu: all 10 links, two-column layout and Escape close checked.
- Native FAQ: expand/collapse and reduced-motion behavior checked.
- Footer: stationary observer wrapper triggers the bottom-to-top reveal, reaches its final transform, and resets after scrolling away. Reduced motion makes the text immediately visible.
- Credential-pattern scan of application HTML/JavaScript found no matches for the tested private-key, AWS-key, GitHub-token and API-key patterns. This is not a complete secret-history scan.
- Allowlisted release output in dist also passed the static checks.

## Fixes made

1. Removed script-src unsafe-inline and unrelated tracking/CDN origins. Scripts now load from this site. Restricted network connections to same-origin and Formspree, image sources to same-origin/data, and frames to the Google Maps hosts actually used.
2. Added object-src none, base-uri none, form-action limited to Formspree and frame-ancestors none. Changed X-Frame-Options to DENY. Retained HTTPS, MIME-sniffing and referrer controls. Inline styles remain allowed because this site uses them; removing them would require a separate style refactor.
3. Fixed malformed hash fragments interrupting initialization, and safe fragment resolution in smooth-scroll links.
4. Preserved explicitly configured canonical URLs instead of replacing them with preview-host URLs.
5. Added 20-second submission timeouts and repeated-submit guards to contact and chatbot submissions.
6. Removed the unused placeholder Turnstile key. No claim is made that CAPTCHA/server-side bot protection is active.
7. Removed obsolete contact stepper code and replaced the legacy duplicate application at primeloft.html with a homepage redirect/link.
8. Removed unused GSAP/orbit/reveal controllers and two unused vendor bundles; current CSS/WAAPI animations remain.
9. Removed nine unreferenced old assets (legacy logos, alternate OG art, old SEO art, team photographs and bot animation; 440,514 bytes total). Preserved manifest icons, licenses and image provenance.
10. Removed unused floating WhatsApp styles; added private environment/key patterns to .gitignore.
11. Fixed service-menu current-page indicators and clarified actual third-party font/map/form services in the privacy page.
12. Repaired footer motion with its own stationary clipping frame, replay on re-entry and more visible lettering.

## Required before a production GO

1. Deploy **dist/** using a host that supports the supplied _headers file, or configure equivalent HTTP headers at the hosting/CDN layer. This file is not automatically honored by every static host. Verify CSP, X-Frame-Options, nosniff, referrer policy and HTTPS behavior on actual responses.
2. Verify the domain is accessible to intended visitors, HTTPS redirects/certificate, real 404 status and the Google Map. Resolve or explain the 403 observed by the audit client.
3. Confirm the Formspree project/account belongs to PrimeLoft, its recipient is verified, and one approved real inquiry reaches the intended inbox from both contact and chatbot flows.
4. Confirm Formspree's server-side spam controls/rate limits and domain restrictions as supported by the account. The public form endpoint and client-side honeypot are not an authentication or abuse-prevention boundary. Never add secret credentials to this static frontend.
5. Test the deployed page on a real iPhone/Safari and Android/Chrome. The automated responsive tests used Chromium emulation, not those physical devices.
6. Keep a rollback release and ensure .git, scratch, tools, environment files and local reports are not published. Use the allowlisted build directory.

## Optional improvements

- Optimize the approximately 2 MB homepage hero into responsive compressed formats before investing in more visual sections.
- Add real, approved case studies and testimonials when available; do not invent metrics or client claims.
- Measure real deployed Core Web Vitals and run a dedicated keyboard/screen-reader/contrast audit. The checks here do not constitute WCAG certification, a Lighthouse score, a penetration test, or a server/infrastructure audit.

## Reproduce

- `python tools/audit_site.py`
- `python tools/build_release.py`
- `python tools/audit_site.py dist`
- `python tools/qa_server.py` serves the site with production security headers on 127.0.0.1:8767 for browser verification.
- Browser evidence: tools/qa-results/browser-security-qa.json and interaction-qa.json.

Security guidance: https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html and https://cheatsheetseries.owasp.org/cheatsheets/Web_Frontend_Security_Cheat_Sheet.html

No deployment, commit or push was performed in this review.

## GitHub Pages release preparation

The user authorized deployment after this review. Existing publishing source confirmed as main / (root), with custom domain primeloft.tech. The generated dist directory was removed as requested. _config.yml excludes tools, QA reports, scratch and generated output from the existing Jekyll publishing process. All HTML pages now carry a meta CSP compatible with GitHub Pages; frame-ancestors, HSTS and other response-only headers still require hosting/CDN support. The _headers file is retained for compatible hosts but is not applied by GitHub Pages. Form delivery and provider-side anti-spam verification remain outstanding.
