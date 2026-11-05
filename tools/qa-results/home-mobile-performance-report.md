# Homepage mobile performance audit

Date: 2026-11-05. Scope: homepage, with shared styles preserved for all service pages. No commit or deployment performed.

## Findings

The actual LCP candidate is the project-agenda hero image in the live Lighthouse run and most local runs. One local baseline identifies the header logo instead, so both images were investigated. The live baseline returned 200 without a redirect, used text compression, and reported an observed server response of 168ms (navigation TTFB breakdown 493ms). Server configuration was not changed.

Seven render-blocking stylesheets totalled 262,258 source bytes. The 256px logo was 26,344 bytes; the selected 768px hero WebP was 82,224 bytes. Fonts were already self-hosted, used font-display: swap, and preloaded the two Latin fonts. Main and theme scripts were already modules; Google Analytics was async. Below-fold images already used lazy loading. There was no evidence justifying additional font preloads, GA delays, or JavaScript rewrites.

## Changes

- Combined the seven homepage stylesheets in their original cascade order using the existing pinned clean-css 5.3.3 dependency at level 0, formatting only. No selector/rule pruning, URL rebasing, animation changes or new dependencies. Generated CSS is 216,993 bytes including its header (approximately 17% smaller), in one request instead of seven.
- Added a source-hash URL and a release-build freshness check so future source edits regenerate the bundle. Original shared stylesheets stay available for other pages.
- Added responsive AVIF alternatives, keeping existing WebP fallbacks: hero 480/768/1024/1536 and logo 256/512. The 768px hero is 45,504 bytes (45% smaller); the 256px logo is 2,585 bytes (90% smaller).
- Set high fetch priority on the header logo. The hero retains high priority, existing sizes/srcset fallbacks, explicit dimensions, and eager default loading. No speculative preload was added: measured resource discovery delay was already small.
- Converted the below-fold client logo from PNG (20,712 bytes) to WebP (3,766 bytes), preserving its dimensions and lazy loading.
- Reserved the hero picture's existing 3:2 aspect ratio before decoding, avoiding layout movement introduced by the format fallback wrapper.

## Comparable measurements

Lighthouse 13.6.0, headless Chrome, mobile simulated throttling: RTT 150ms, throughput 1638.4Kbps, CPU slowdown 4x. Fresh Lighthouse sessions and disabled storage reuse. Two runs before and two after, executed serially, with unchanged test configuration.

A temporary local comparison server served the committed homepage and working homepage with identical gzip handling. The baseline used committed index.html and original home-motion.css; all other original dependencies/assets remained available. The server and its fixtures live only in ignored scratch/. This comparison is more representative of production compression than the default uncompressed QA server, but it does not simulate CDN latency.

| Metric | Compressed before, 2 runs | Compressed after, 2 runs |
| --- | --- | --- |
| Performance | 93 / 93 | 96 / 96 |
| FCP | 1.376s / 1.366s | 1.088s / 1.238s |
| LCP | 3.064s / 3.039s | 2.682s / 2.603s |
| Speed Index | 3.236s / 3.185s | 3.018s / 2.832s |
| TBT | 0ms / 0ms | 0ms / 86.68ms |
| CLS | 0 / 0 | 0 / 0 |

The uncompressed QA comparison also improved: baseline scores 76/78, FCP 2.734/2.738s, LCP 4.901/4.908s; final score 85, FCP 1.985s, LCP 4.028s, TBT 0ms and CLS 0. These values must not be compared with compressed results or the live score.

A separate live pre-change run measured performance 92, FCP 1.595s, LCP 2.926s, Speed Index 3.547s, TBT 131ms, CLS 0. This did not reproduce the user's supplied 78 / 2.6s / 4.2s / 60ms / 0 / 5.1s exactly; geographic/network/device conditions and audit time differ. No live after result exists because the work is not deployed.

## Validation

- Source and dist audits pass for 20 HTML pages, internal files/fragments, image alt attributes, unique IDs, JSON-LD and JavaScript syntax.
- Release build and git diff --check pass; a repeat build does not regenerate an unchanged homepage bundle.
- Compared computed styles and geometry of 450 elements at widths 320, 390, 768, 1024 and 1440. All styles match; geometry differs by at most 0.03px; no horizontal overflow. Mobile and desktop screenshots were inspected.
- Hero entrance animation observed with normal motion, Lenis initialized, FAQ open/close passed, mobile Contact link present, menu opens, Escape closes.
- AVIF decodes and is selected responsively; hero is not lazy-loaded and retains high priority. Legacy WebP paths remain valid.
- SEO titles, descriptions, social metadata, canonicals, structured data, headings, anchor hrefs, sitemap.xml, robots.txt and all JavaScript are unchanged.

## Limits and next steps

LCP remains above the requested 2.5s threshold in the comparable compressed runs. The after trace reports substantial element render delay (about 1.4s in one run), with the existing 1.1s staggered entrance and 1.6s image animation retained. No visual element, animation or timing was removed to meet a score. Further work on that delay needs visual review rather than a promise that more image compression will solve it.

TBT varies between runs; no TBT improvement is claimed. Local Lighthouse did not download the external Google tag (status -1, zero transfer) in either comparison arm; the live run loaded it. This limits prediction of production scores and main-thread cost. No field Core Web Vitals or INP measurements were available. Intermediate picture experiments produced CLS 0.102; the reserved aspect ratio corrected this and those experiments are excluded from the final table. The first attempted baseline failed because the local server was not running; it is excluded.

After deployment, repeat mobile PageSpeed Insights/Lighthouse on the live URL with comparable conditions and check real-user Core Web Vitals when sufficient field data exists. No automatic deployment was performed.

## Files

Modified: index.html; css/home-motion.css; tools/build_release.py; tools/css-build/README.md.

Added: css/home.bundle.min.css; tools/build_home_css.mjs; tools/css-build/home-sources.json; images/client-native-tech.webp; images/primeloft-agenda-hero-{480,768,1024,1536}.avif; images/primeloft-arc-logo-{256,512}.avif; this report; home-mobile-performance-results.json.

Raw Lighthouse HTML/JSON and screenshots are retained in ignored scratch/ under lighthouse-home-* and home-perf-*. Machine-readable evidence is in home-mobile-performance-results.json.
