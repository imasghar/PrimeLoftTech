# Web3Forms migration

Date: 2026-11-06. Local review branch; no commit, push or deployment.

## Changes

- Replaced Formspree runtime endpoints with Web3Forms at https://api.web3forms.com/submit.
- Added a shared client-side submission helper, using the supplied public access key from config.js. It accepts only HTTP success AND JSON success:true, with a 20-second timeout. Invalid JSON, missing/false success, HTTP errors and network errors are failures.
- Updated Contact form action, hidden access_key/subject and botcheck checkbox. Required fields, labels, service preselection, budget behavior, retry handling and accessible statuses remain intact.
- Migrated the dynamically generated project-guide form, including its name/email/service/stage/timeline/notes fields and consent check. Failed submissions retain the form for retry; successful submissions advance once.
- Migrated the dormant newsletter handler; no published HTML currently contains a newsletterForm. No newsletter subscription platform or new UI was added.
- Contact generate_lead remains tied to provider-confirmed success. No analytics parameters were added and the project guide retains its existing tracking behavior.
- Updated form-action/connect-src permissions in all 20 public HTML meta policies and _headers, preserving existing analytics/security destinations. No unsafe-inline/eval changes.
- Updated the privacy-policy provider reference. Bumped main.js to 3.4.0, chatbot to 4.2.0, and versioned new helper/config imports to prevent old cached Formspree code from being reused.

## Files

All 20 root HTML pages (CSP and main-script cache version; Contact also has form fields/action; Privacy also has provider wording), _headers, js/main.js, js/services/chatbot.js, js/services/config.js, new js/services/form-submission.js, this report and web3forms-migration-results.json.

## Checks

- Browser tests with intercepted requests: contact confirmed success/reset/one lead, HTTP 400/429/500, network failure, HTTP 200 with success:false, malformed JSON, duplicate submission guard, invalid input and honeypot blocking.
- Project guide tests: consent required, HTTP/provider/malformed/network failure retries, confirmed success advances, rapid repeated submissions create one request.
- Captured multipart payloads contain access_key, subject and service; legacy _subject is normalized. Personal fields are sent only to the form provider, never added to GA4 event payloads.
- All 11 service-page contact navigations and their unique contact targets select the expected option; query parameters/hash, SEO-specific budgets, defaults and form reset passed.
- All 20 policies permit Web3Forms. No Formspree endpoints remain in published runtime source. SEO titles/descriptions/canonicals/structured data remain unchanged.
- Source and dist audits, release build and git diff --check pass. No new dependency or stylesheet change.

## Limits

No actual inbox messages or production analytics events were sent. The account's recipient address, access-key activation, quota and email delivery are not independently verified. Confirm key setup and perform an authorized real delivery test before retiring Formspree. Existing Formspree submission history is not transferred. The public key is intentionally included in client-side configuration and the Contact HTML fallback; rotate/update both if changing keys.

References: https://docs.web3forms.com/getting-started/api-reference and https://docs.web3forms.com/how-to-guides/html-and-javascript.
