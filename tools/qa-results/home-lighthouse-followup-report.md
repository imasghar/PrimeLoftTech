# Homepage Lighthouse follow-up

Date: 2026-11-05. Changes are local and have not been committed or deployed.

## Confirmed live findings

A fresh live Lighthouse 13.6.0 run measured performance 84, accessibility 96, best practices 92; FCP 1.84s, LCP 3.84s, TBT 169ms, CLS 0. The user's supplied run was performance 79, FCP 2.5s, LCP 4.2s, TBT 0ms, CLS 0, Speed Index 5.1s. These are different runs with different network/runtime circumstances; neither replaces the other.

The actual errors were CSP blocks on stats.g.doubleclick.net, a Google regional advertising-audience image, Cloudflare's beacon module at static.cloudflareinsights.com, and a Cloudflare-injected inline challenge script. The challenge contains a changing request ray/timestamp, so a fixed source-file hash cannot safely authorize it.

The only Lighthouse color-contrast failure was footer copyright text: #7e89a3 on #f1f5ff, ratio 3.21. The 73KB unused-JavaScript warning was Google's gtag library. Live first-party assets had four-hour browser cache lifetimes. The site is published with GitHub Pages behind Cloudflare; _headers is excluded by _config.yml and cannot change that production cache behavior.

## Applied fixes

1. Footer text now uses the existing --ink-soft color (#56617b), improving contrast to 5.67 without changing layout or typography. Shared CSS and generated About/home bundles were updated.
2. Google tag initialization now sets allow_google_signals:false and allow_ad_personalization_signals:false. This retains Analytics measurement while suppressing the advertising features that generated blocked advertising requests. No ad endpoint allowlist was added. This intentionally disables optional demographic/interest and ad-personalization signals; website page/lead analytics remains active.
3. Recomputed the inline initialization's SHA-256 hash in every HTML meta CSP and _headers: sha256-A5D0XjZE4r8SqdQPxGzhZhmofbbtwldFVZQ5IG5x7j4=. Each of 20 public pages still has one async tag and one config.
4. Permitted the already-injected Cloudflare beacon using exact script-src https://static.cloudflareinsights.com and connect-src https://cloudflareinsights.com. Self-hosted /cdn-cgi/rum is already covered by 'self'. No new beacon was installed and no unsafe-inline, unsafe-eval or unrestricted wildcard was added.
5. Homepage CSS now uses the existing pinned clean-css level 1 normalization with selector sorting disabled, no numeric rounding and no level 2 rule merging/removal. The bundle drops from 216,993 to 205,049 bytes and passes Lighthouse CSS minification. Rule order and animations remain intact.
6. Added a 648x432 hero candidate in AVIF (31,453 bytes) and WebP fallback. The live audit's effective image display requirement was approximately 644x429, which previously selected 768px. The new AVIF is 31% smaller than the 768px version. Existing larger/smaller candidates, high priority, explicit image sizing and eager default loading remain available.

## Verification

- Actual downloaded Google tag tested in Chrome with external collection requests intercepted. page_view, whatsapp_click, email_click and generate_lead each appeared in an intercepted collection request. No advertising requests and no console errors occurred. No events were delivered to production Google collection.
- Form/contact-event regression checks passed with mocked Formspree responses: validation failures, 422, 429, 500 and network errors produce no lead; success produces a lead once; repeated initialization and rapid submission are guarded; denied consent/opt-out stops custom events; dynamic links work.
- Compared 450 DOM elements at 320/390/768/1024/1440 widths: identical geometry, no overflow, only the intended inherited footer text-color change.
- Hero AVIF decodes, remains non-lazy and high priority; entrance animation and Lenis remain active. Menu, mobile Contact entry, Escape dismissal and FAQ toggles passed.
- All 20 pages retain SEO title, description, social metadata, canonical and structured data. Source/dist audits, release build, and diff checks pass.

## Controlled local Lighthouse comparison

One valid before/after pair, same gzip comparison server, mobile simulated throttling, fresh Chrome sessions, 150ms RTT/1638.4Kbps throughput/4x CPU slowdown. The before arm serves committed index.html and its committed CSS bundle; the after arm serves working files. External Google tag loading is blocked in both arms to remove variable third-party network conditions. Google behavior was validated separately as described above.

| Metric | Before | After |
| --- | --- | --- |
| Performance | 96 | 97 |
| Accessibility | 96 | 100 |
| FCP | 1.085s | 0.981s |
| LCP | 2.678s | 2.537s |
| Speed Index | 3.236s | 3.047s |
| TBT | 2ms | 0ms |
| CLS | 0 | 0 |
| Console errors | 0 | 0 |
| CSS minification | Fail | Pass |

An earlier comparison's before run had transient local connection failures and is excluded. The temporary server's request queue was corrected before the valid pair. Local scores are not live PageSpeed predictions; no live after run is available. LCP below 2.5s has not been established. Existing hero animations were preserved.

## Remaining issues requiring different handling

- Cloudflare's changing inline JavaScript Detection injection remains a production CSP conflict. A nonce-aware response-header/edge implementation needs review, or review the relevant bot feature setting with the account owner. Static GitHub Pages cannot generate a per-response nonce. Do not paste a constant nonce, copy a changing request hash, weaken CSP to unsafe-inline, or disable bot protection merely to change Lighthouse. Cloudflare notes JS Detections is automatic and cannot be independently disabled for Bot Fight Mode customers; options depend on the plan/settings.
- Cache TTL requires a Cloudflare cache rule or origin hosting change. Review longer browser TTLs for versioned/fingerprinted assets; keep HTML promptly revalidated and version assets when changing long-lived files. The repository _headers file is not effective on current GitHub Pages hosting. No cache rule was changed, and the four-hour live lifetime is not claimed fixed.
- Google controls its own tag code and cache policy. Its unused JavaScript warning may remain; the library was not removed or delayed to game the audit.
- Initial-viewport unused CSS includes below-fold content, menus, FAQs and chat states. It was not blindly deleted. A dedicated homepage stylesheet partition would require broader interaction coverage and separate review.
- Lighthouse still suggests potential hero down-sizing in the local environment; the correct responsive density and visual quality take precedence over forcing a lower-resolution source. The live 648px selection must be rechecked after deployment.
- The approximately 2KB chatbot minification opportunity remains low priority. Chatbot code was preserved rather than adding a new dependency or a risky manual JavaScript minifier.

## References and evidence

- Google configuration: https://developers.google.com/analytics/devguides/collection/ga4/reference/config
- Cloudflare JavaScript Detections/CSP: https://developers.cloudflare.com/cloudflare-challenges/challenge-types/javascript-detections/
- Cloudflare browser cache TTL: https://developers.cloudflare.com/cache/how-to/edge-browser-cache-ttl/

Machine-readable evidence: home-lighthouse-followup-results.json. Raw reports and browser fixtures remain in ignored scratch/ under lighthouse-home-followup-* and home-perf-layout-followup-*.
