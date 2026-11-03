# Contact page SEO, conversion and form QA

Date: 3 November 2026 (Asia/Karachi). Target contact.html; canonical https://primeloft.tech/contact.html unchanged. Branch feature/homepage-seo-review. No commit, merge, deployment or production test inquiry performed.

## 1. Baseline audit and existing form flow

Inspected contact.html, css/contact.css, main.js contact handler, contact-pricing.js, shared schema/config/FAQ/navigation scripts, privacy/cookie statements, contact methods, sitemap/robots and media. Saved scratch/contact-seo-before.html and scratch/contact-seo-baseline.json and captured baseline Lighthouse before edits.

Existing flow: required name/email/service/message; optional company/country/budget; no phone or separate timeline field. Timeline can be described in the message. Native browser validation precedes submit. URL service parameter is matched case-insensitively to existing options by contact-pricing.js, which also selects existing SEO-specific budget options. Form POST uses the existing HTTPS Formspree action, FormData and Accept: application/json, with a 20-second timeout. Button disabled while pending, response.ok shows success/resets, and errors show a generic message. _subject and _gotcha fields present.

| Finding | Priority | Action |
|---|---|---|
| Honeypot path claimed successful send without a request | High | Generic processing error; no false success or reset |
| Native labels present, required indicators and field-linked errors incomplete | Medium | Required markers, invalid states/descriptions and error text |
| Whitespace-only values and oversized scripted input could pass native checks | Medium | Trim-empty and client-length validation |
| Duplicate prevention/loading already existed through disabled button | Preserve/enhance | Explicit in-flight guard, busy state and changing button label |
| Error handling already existed but no field mapping | Medium | Provider field errors, non-JSON errors, rate/network/timeout handling |
| Metadata lacked full branded wording | Medium | Proposed title/description/H1 and consistent sharing data |
| Inherited FAQ timelines/retainer/ownership claims not established | Trust | Scope/contract-dependent explanations |
| Shared LocalBusiness injection included unverified hours/coordinates | Trust/technical | Existing explicit page opt-out and curated ContactPage graph |
| Placeholder/helper text contrast below 4.5:1 | Accessibility | Reused existing muted ink with sufficient text contrast |
| Original logo PNG/external fonts | Performance | Reused existing local fonts and responsive logos |

Existing layout contains contact story/methods, form panel, three-step next process and six FAQs. No new field or section needed. Baseline LCP is p.contact-summary. No raster hero exists; image elements are two logos. Address remains owner-provided visible source content, not independently verified office evidence.

## 2. Branded keyword mapping

Contact PrimeLoft Tech is used in title, eyebrow, description and intro. H1 focuses on project conversation. Project inquiry intent is supported by the existing form and next-step explanation. Website/software/mobile/SEO/design/automation terms occur naturally in the concise introduction/metadata and existing selector, not repeated service landing-page copy. WordPress/Squarespace and other service inquiry intent is handled by existing URL preselection, not extra keyword sections. No volume, difficulty or ranking data invented.

References checked: [Formspree's AJAX documentation](https://help.formspree.io/articles/building-your-form/submit-forms-with-javascript-ajax/), [honeypot documentation](https://help.formspree.io/articles/building-your-form/honeypot-spam-filtering/) and [Schema.org ContactPage](https://schema.org/ContactPage). These guide implementation, not proof that the production inbox or account configuration works. Public contact-page fetch failed through the web tool; no downtime/deindexing conclusion drawn.

## 3. Metadata before and after

Before title: Contact PrimeLoft | Discuss Your Project

After title: Contact PrimeLoft Tech | Start Your Project

Before description: Get in touch with PrimeLoft. Share your project goals and discuss websites, apps, design, SEO and ongoing support.

After description: Contact PrimeLoft Tech to discuss website development, software, mobile apps, SEO, design or automation. Share your project requirements with our team.

Before H1: Your next project. Let's talk.

After H1: Let's Talk About Your Project

Exactly one title/description/H1/canonical verified in DOM. OG/Twitter agree; site_name/logo labels use PrimeLoft Tech. Existing branded 1200x630 sharing PNG retained with aligned alt metadata. No local noindex/X-Robots-Tag; robots allows /. Filename/canonical unchanged and target sitemap lastmod updated to 2026-11-03.

## 4. Content and trust improvements

Intro identifies new-project and existing-product inquiries. Form introduction requests goals/current site/app and timing/integration needs, explains requirement review and required markers. Existing next steps remain review, conversation and scoped plan; no response-time or consultation-slot promise. Six FAQs retained; unverified named retainers, fixed 2–4/6–12 week ranges and 100% ownership/zero-lock-in promises replaced with proposal/contract-dependent explanations. Existing postlaunch and SEO scope retained. No fabricated price, office, credential or new service.

## 5. Form validation and submission changes

Same form ID, field names, POST action, FormData payload, subject, honeypot, budgets and optional fields. Existing email/name autocomplete retained. Required labels marked *, budget explicitly optional. Client usability limits: name 120, email 254, company 160, country 100 and message 10,000 characters. They are not a substitute for backend validation or rate limiting. Native checks plus trim-empty/length checks identify fields with visible Error text, aria-invalid and aria-describedby; correcting the field clears its custom error.

In-flight guard prevents repeated requests; native disabled button, Sending inquiry label and aria-busy communicate pending state. Confirmed HTTP 2xx response follows Formspree's accepted-response pattern, resets fields and says the inquiry was accepted, not that an email was delivered. Non-2xx field errors are associated with known fields; messages use textContent and are bounded. Non-JSON failure, 429, network failure and timeout preserve entries and restore the button. Network/timeout says receipt could not be confirmed. Honeypot block does not send, reset or claim acceptance. No form contents logged or added to analytics.

Live status remains role=status/aria-live=polite and now aria-atomic=true. Text conveys pending, rejection and acceptance without relying on color. Supporting/error/status text uses existing high-contrast ink. Keyboard focus retains the existing blue border; Tab from Name reaches Email. Form delivery integration is not replaced.

## 6. Service preselection verification

Actual contact query strings were read from each service page; no service page rewritten. All existing mappings pass on mobile, including lower-case variants. Unknown service value safely leaves the placeholder selected.

| Source | Expected option | Actual |
|---|---|---|
| service-engineering.html | Custom Website | Custom Website |
| service-design.html | UX/UI | UX/UI |
| service-mobile-app-development.html | Mobile Application | Mobile Application |
| service-seo.html | SEO | SEO |
| service-ai.html | Automation | Automation |
| service-cloud.html | DevOps | DevOps |
| service-quality.html | Testing & QA | Testing & QA |
| service-maintenance.html | Maintenance | Maintenance |
| service-wordpress.html | WordPress | WordPress |
| service-squarespace.html | Squarespace | Squarespace |

SEO retains the existing $300–$1,500 budget choices; other services retain the existing general options. No new price, parameter name or service taxonomy introduced. Form reset still restores normal default fields/budgets after acceptance.

## 7. Contact-link audit

Repository/config and Contact content agree on contact@primeloft.tech and +923359873132. WhatsApp is https://wa.me/923359873132; LinkedIn https://www.linkedin.com/company/primloft/ and Facebook https://www.facebook.com/share/1UUv6vvFdu/ match the supplied reference and existing links. No new contact detail invented. These are source-consistency checks, not a sent email, telephone call or independent account-ownership verification.

Email mailto, telephone tel and WhatsApp destinations preserved. New-tab links retain noopener and accessible names. Existing services, About and privacy links returned local HEAD 200; local service paths/fragments pass site audit. No external message sent or booking created.

## 8. Security, spam and tracking findings

Existing HTTPS endpoint, restrictive form-action/connect-src and honeypot fields preserved. No credential/token needed or exposed; public form action is unchanged. Client validation improves feedback, not server-side trust. Formspree account-side validation, spam settings, allowed domains, recipient verification, quotas and rate limiting are not inspectable from this static repository and require owner review. No fake client-side rate limit or new CAPTCHA introduced. Existing newsletter/chat handlers were not rewritten.

Status/field messages use textContent, not HTML. Script-like special-character test input stays literal and serialized correctly. No personal inquiry payload console logging found in the changed handler. Existing code/privacy/cookie statements show no optional analytics/advertising installation; none added.

Proposed tracking only, not implemented: after an approved analytics/consent setup, count an aggregate contact_submission_accepted event only in the confirmed provider-success path. Do not include names, email, phone, company or project text. Do not count clicks, loading, client blocks, errors or uncertain timeouts. Any new tracking service/account/consent work requires separate approval; no such dependency created here.

## 9. Structured-data changes

Curated Organization with repository-confirmed email/telephone/reference social URLs and real logo, ContactPage and retained two-level BreadcrumbList. Canonical @ids connect company, page, breadcrumb and existing homepage WebSite. Existing org-schema guard prevents duplicate Organization; Contact now uses the established data-local-business-schema=off opt-out to avoid unverified hours/geo/address injection. No new office, address, rating, review, certification or FAQ schema. Local JSON parsing, entity/reference inspection and rendered count pass; external validator not run.

## 10. Performance comparison

Lighthouse 13.6.0, fresh extension-free headless Chrome, same localhost URL/default simulated mobile throttling, performance-only category. Baseline before edits, then two after runs after mock interaction testing:

| Run | Performance | FCP | LCP | Speed Index | TBT | CLS |
|---|---:|---:|---:|---:|---:|---:|
| before | 80 | 2.557s | 3.532s | 7.210s | 0.0ms | 0 |
| after | 95 | 2.428s | 2.428s | 2.428s | 0.0ms | 0 |
| repeat | 94 | 2.446s | 2.446s | 2.987s | 0.0ms | 0 |

Both recorded after LCPs are below 2.5s. Exact LCP elements retained in JSON. Baseline external Google Fonts fails locally, limiting comparison with intended local fonts; changed heading/intro also alters viewport composition. CLS/TBT remain zero. These are lab results, not field CWV or guaranteed real-user improvement; INP unmeasured. Original reveal/interaction animation code retained.

Reused local Geist/Geist Mono/Inter fonts with two targeted Latin preloads and existing lossless logo WebPs (256px 26,344 bytes; 512px 108,068 bytes) versus original 1,054,463-byte PNG. Responsive srcset/144px sizes, dimensions and footer lazy loading preserved. Original PNG retained. No raster hero, speculative media preload, added library or third-party tracking.

## 11. QA and mock submission results

All Formspree requests were intercepted before network delivery by Chrome Fetch interception and fulfilled/rejected locally. Reserved example.test fixtures used. Zero production test inquiries sent. Final mock run records seven intercepted POST attempts; the entire mock suite was repeated with the same outcome.

| Scenario | Outcome |
|---|---|
| Empty, invalid email, missing service | Zero requests; named field errors and focus |
| Whitespace-only required value | Zero requests; required-field error |
| 10,001-character scripted message | Zero requests; length error |
| Honeypot populated | Zero requests; generic processing rejection, no success/reset |
| Valid special characters/script-like text | Serialized literally; no script execution |
| Rapid repeated submit events | One request, disabled/busy pending state; one accepted-response reset |
| Provider validation 422 | Email error linked/focused; entries retained; retry available |
| Non-JSON 500 / 429 | Error feedback, no false success, entries retained, button restored |
| Network failure / simulated transport timeout | Unconfirmed-receipt error; entries retained; busy state cleared |
| Keyboard/mobile submission | Space on focused button produces one mock request and accepted-response state |
| Ten service mappings and unknown value | Correct options/budgets; unknown remains unselected |
| 320/390/768/1024/1440px | No overflow; headings/fields/labels fit; submit center unobstructed |
| Six FAQs and mobile menu | Open/close pass; Contact Us visible; Escape closes |
| Focus/reduced motion | Tab order and blue border pass; no hidden reveal content |
| Fresh initialization console | No console errors or runtime exceptions |
| Source/build/release | Site audit PASS for 20 HTML files; build PASS; dist audit PASS; diff check PASS |

Contrast calculations: placeholders improve 3.78:1 to 4.74:1 on input background; optional/privacy text 4.48:1 to 4.96:1; status text approximately 14.75:1. Existing muted/ink palette reused. This is targeted accessibility QA, not full WCAG certification. Real-device Safari input/zoom behavior, screen readers and real inbox delivery remain untested. Timeout mock exercises failed transport handling, not an actual 20-second provider wait or backend transaction.

## 12. Files modified

- contact.html: metadata/schema/copy, required indicators/client limits, local fonts/logos and script/style versions.
- css/contact.css: readable field/status feedback and helper contrast within existing palette; version 1.0.1.
- js/main.js: existing Contact handler only; other controller/newsletter/animation code preserved. Contact reference version 3.3.0.
- sitemap.xml: Contact lastmod only.
- tools/qa-results/contact-seo-report.md: this report.
- tools/qa-results/contact-seo-results.json: retained measurements and browser/assertion evidence.

Ignored scratch contains baseline/audit, mock/browser scripts, screenshots, console result and three full Lighthouse reports. dist generated and ignored. All unrelated HTML/homepage/service SEO unchanged. contact-pricing.js and its mappings/budget code unchanged. No new dependency.

## 13. Remaining issues

Actual Formspree acceptance/inbox delivery, recipient/account status, spam rules, backend validation and provider limits require owner-side verification; no production submission was authorized. HTTP acceptance does not prove inbox delivery. Client input limits are not server-side security. Existing visible address remains owner-provided source information without a new verified-office claim. No field INP/CWV, external schema validator, full accessibility audit or real-device testing available. Live fetch failure through web tool is not evidence of outage/deindexing. No analytics, consent rollout or deployment performed.

## 14. Post-deployment checklist

After explicit approval: commit review branch, merge approved changes to main, verify Pages success and public HTTP/metadata/canonical/sitemap/assets. Check fresh and cached clients load main.js?v=3.3.0 and new style version, and rendered graph has one Organization/ContactPage/BreadcrumbList without unverified local fields. Recheck ten service links, budget changes, native validation, keyboard/mobile focus, status announcements, duplicate/error handling and privacy/contact links. Validate schema externally and repeat production Lighthouse. Verify Formspree dashboard settings/recipient and arrange a separately approved real test inquiry before claiming end-to-end inbox delivery. Do not enable tracking or send production tests without approval.

Preservation checks: `{"action": true, "fieldNames": true, "serviceOptions": true, "otherMainLogic": true, "originalCssRules": true, "sectionClasses": true, "svgArtwork": true}`. Assertions all pass: `True`. All unrelated HTML unchanged: `True`.
