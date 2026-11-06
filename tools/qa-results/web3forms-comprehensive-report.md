# Web3Forms comprehensive QA report

Date: 2026-11-06. Branch: feature/homepage-seo-review. Scope: uncommitted Web3Forms migration. No commit, push, deployment, real submission or production analytics event was performed.

## Results

- Unit tests: 27 passed, 0 failed.
- Browser integration/security/accessibility groups: 17 passed, 0 failed; 29 submissions intercepted locally.
- Source and dist audits pass for 20 HTML files; release build, JavaScript syntax checks and diff checks pass.

## Unit coverage

Server confirmation contract: HTTP 200/201 success:true accepted; success:false, missing success, truthy string/number, null, array, invalid/empty JSON, HTTP 400/401/403/429/500/503 rejected. Correct HTTPS endpoint, multipart FormData, Accept header, configured key override, exactly one access key, caller data immutability, subject normalization, redirect removal, repeated-field preservation and malicious-looking/Unicode body data covered. Honeypots reject locally before fetch. Network/abort/timeout exceptions propagate rather than generating success. The helper requests a 20-second AbortSignal and respects cancellation. Unexpected HTTP redirects are rejected and cross-site cookies omitted.

## Browser coverage

1. Required name/email/service/message, invalid email and whitespace-only required fields produce no request.
2. All Contact field length limits enforce oversized scripted input.
3. Contact honeypot rejects without a request, reset or false success.
4. HTTP 307/400/401/403/429/500/503, provider success:false/missing/string, malformed JSON and network failure preserve retryable form data and never emit a lead. A 307 Location to an untrusted host was not followed.
5. Provider error HTML is inert text; no injected image executes or appears. Contact errors have aria-invalid/aria-describedby and focus the invalid field.
6. Rapid duplicate Contact submits make one request; pending controls/aria-busy remain active; confirmed success resets and emits one generate_lead.
7. XSS-looking text, quotes, Unicode and emoji remain payload text and never enter analytics parameters or executable DOM.
8. Denied analytics consent preserves form delivery but suppresses the lead event.
9. A deliberately blocked provider CSP fails safely with a retryable form; it is not bypassed.
10. An actual 20-second browser timeout restores controls, retains inputs and emits no success event.
11. At widths 320/390/768/1024/1440: no horizontal overflow; Contact controls have labels; live status role/announcements remain; Tab order is name to email.
12. Keyboard Space submits a valid Contact form once.
13. Full project-guide service -> requirements -> timeline -> guidance -> name -> email -> notes flow works. Invalid/empty/oversized names and emails are rejected; malicious-looking names remain escaped/literal.
14. Guide consent, oversized notes, HTTP/provider/malformed/network failures preserve the retry UI.
15. Guide success advances once; rapid submissions are guarded and user notes render as text.
16. Dormant newsletter fixture validates, rejects honeypots and no longer shows fake success.
17. Newsletter provider errors preserve inputs; confirmed success resets; duplicate submissions make one request.

The migration's existing all-11-service-page navigation and service preselection tests also passed in the previous turn. Their source mapping and dropdown logic were not changed by this QA work.

## Defects found and fixed

- Initial unit run: 25 passed, 2 failed. The shared helper previously accepted non-empty botcheck/_gotcha when called outside the guarded Contact handler. It now rejects either before fetch, keeping the source FormData intact.
- The inherited dormant newsletter honeypot branch reported success and reset without contacting the provider. It now reports an error, retains data, validates natively and guards repeated initialization/in-flight submission.
- Project-guide custom requirements, name, email and notes lacked the Contact form's matching length limits. Added maxlength and JavaScript checks (name 120, email 254, notes/requirements 10,000).
- Added redirect:error and credentials:omit to the fixed-origin provider call, avoiding unintended body forwarding or cross-site cookie attachment.

No CSS, animation, layout, SEO metadata, sitemap or robots changes were introduced by testing. All policies retain exact Web3Forms permissions, with no unrestricted wildcard/unsafe-eval workaround.

## Security boundaries and remaining verification

This is a client-side test suite, not a complete security certification or provider penetration test. Browser validation/honeypots can be bypassed by someone issuing direct requests to a public form API. The access key is deliberately public; it is not a user password or authentication secret.

The actual provider account's key activation, recipient, quota, server-side size/field validation, spam filtering, rate limiting and recipient inbox/spam-folder behavior were not independently verified. No flood, load or spam testing was performed against the external API. SQL-looking input was tested as inert serialized text; Web3Forms' database/security implementation is outside this codebase.

A read-only OPTIONS probe from PowerShell returned HTTP 403. A subsequent local browser probe did not produce a successful real preflight observation and sent no POST. This does not establish a browser-origin API failure, but real provider CORS access remains unverified. Confirm it with a separate authorized browser submission after checking the receiving account. HTTP/API acceptance still does not guarantee inbox delivery.

Chrome was tested locally using CDP. No Safari/Firefox, real-device or manual screen-reader testing was performed. Automated labels/focus/live regions are not a full WCAG audit. Cloudflare's already documented edge/CSP and cache issues remain separate from this migration.

## Evidence and rerun

- tools/tests/web3forms-unit.test.mjs: reusable dependency-free Node unit suite.
- tools/tests/web3forms-browser.test.mjs: reusable local Chrome suite with all external traffic intercepted.
- tools/tests/README.md: rerun instructions.
- tools/qa-results/web3forms-unit-tests.tap: 27/27 result.
- tools/qa-results/web3forms-browser-tests.json: 17 browser groups and request counts.
- tools/qa-results/web3forms-comprehensive-results.json: concise machine-readable summary.
