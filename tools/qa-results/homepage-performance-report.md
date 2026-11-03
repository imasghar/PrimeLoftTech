# PrimeLoft homepage mobile performance report

Date: 3 November 2026 (Asia/Karachi). Branch: feature/homepage-seo-review. Not committed, merged, pushed or deployed by this task.

## 1. Baseline and test conditions

User-supplied live baseline: performance 69, FCP 1.7 s, LCP 15.4 s, Speed Index 6.1 s, TBT 0 ms, CLS 0. That run was not reproduced against production because the public request timed out.

Lighthouse 13.6.0 was installed only in excluded scratch/performance with image-processing tools. No application package or runtime dependency was added. Local site was served with tools/qa_server.py, applying the existing security headers. Lighthouse used the default simulated mobile preset and the desktop preset, performance category, normal motion, fresh audits. Reports include their exact throttling and screen configurations. This is a static local approximation, without verified production CDN/compression/TTFB behavior. The baseline external Google Fonts stylesheet did not deliver successfully in this environment; final fonts are local. That difference limits direct font-rendering comparisons with production.

## 2. Confirmed LCP and root cause

Both baseline Lighthouse and two cold, directly throttled CDP runs identify the existing hero artwork as LCP: main#main-content > section.pl-hero > div.pl-showcase > img, originally images/primeloft-agenda-hero.png. Final Lighthouse identifies the responsive version of the same artwork as LCP. Candidate identity can vary with viewport and loading stage; one intermediate self-hosting run reported the cropped header logo.

Direct CDP comparison: 390 × 844, DPR 1, 1.6 Mbps download, 150 ms emulated latency, 4× CPU slowdown, disabled browser cache, 28-second observation windows, two mobile runs per stage. The first baseline breakdown was:

| LCP subpart | Measured time |
|---|---:|
| HTML TTFB | 9.1 ms |
| Resource start delay after TTFB | 255.6 ms |
| Hero resource load duration (fetch start through response end) | 18,072.7 ms |
| Response-end to LCP render | 18.6 ms |

Baseline mobile LCP: 18.356 s and 18.608 s, CLS 0 in both. Hero download (2,035,917 bytes) and header logo download (1,054,463 bytes) competed on the throttled connection. The raw breakdown supports transfer cost as the dominant baseline bottleneck. Lighthouse's simulated LCP and its observed insight breakdown are different datasets and must not be summed together.

The external Google Fonts stylesheet was also on the blocking dependency chain (roughly 3.1 seconds in the baseline observed trace). Main stylesheets were render blocking. No full-screen loader was found. The hero has existing CSS entrance motion and a WAAPI entrance on its container; the original image finished after those entrances in the directly throttled baseline, leaving little final render delay. Animation therefore was not removed to chase a score. The active homepage uses CSS/WAAPI/pointer effects; technology labels mentioning GSAP/Three.js were not treated as evidence of executing those libraries.

## 3. Optimizations implemented

- Four quality-90 WebP hero variants: 480, 768, 1024 and 1536 pixels wide; responsive srcset and sizes select an appropriate resource.
- Two losslessly encoded resized WebP logo variants: 256 and 512 pixels wide; both homepage logo instances share the same srcset and 144px display-size hint.
- Kept original PNG assets as backups. Artwork, composition, logo geometry and sRGB presentation retained. The original logo is opaque RGB; optimized logos are opaque RGB too, so no original alpha channel was discarded.
- Kept hero fetchpriority=high, explicit dimensions and eager loading; no speculative image preload or extra high-priority images added.
- Self-hosted the already configured Geist, Geist Mono and Inter normal variable font families. Existing family names, requested weight ranges, font-display:swap, colors and layout rules retained. Latin and Latin Extended subsets and original licenses included. No new font family introduced.
- Replaced the homepage's external Google Fonts stylesheet and its now-unused preconnects with css/fonts.css.
- Added only two font preloads, for above-the-fold Geist and Inter Latin. A longer cold test caught a font-swap CLS regression of 0.103–0.105 before preloading. Final cold tests returned CLS 0; resource checks confirm each font downloads once.
- Updated the allowlisted release copier to include fonts/. Existing animation and application scripts are unchanged.

## 4. Image sizes before and after

| Asset | Bytes |
|---|---:|
| Original hero PNG | 2,035,917 |
| Hero 480 WebP | 41,474 |
| Hero 768 WebP | 82,224 |
| Hero 1024 WebP | 126,928 |
| Hero 1536 WebP | 227,474 |
| Original logo PNG | 1,054,463 |
| Logo 256 WebP | 26,344 |
| Logo 512 WebP | 108,068 |

The selected DPR-1 mobile hero+logo total falls from 3,090,380 bytes to 67,818 bytes (about 97.8% smaller). Other pixel densities select larger variants. The original artwork remains available unchanged. Final direct mobile observations recorded 573,348 resource-body bytes, versus multiple megabytes originally; these totals are for the observation window and are not a production compressed waterfall.

## 5. Lighthouse before and after

All times in seconds except TBT in milliseconds. Final means the version with fonts preloaded, not an intermediate run.

| Run | Performance | FCP | LCP | Speed Index | TBT | CLS |
|---|---:|---:|---:|---:|---:|---:|
| baseline mobile | 63 | 2.88 | 16.41 | 7.88 | 0.0 | 0.000000 |
| images only mobile | 75 | 2.74 | 4.16 | 7.77 | 0.0 | 0.000000 |
| self-hosted mobile | 77 | 2.73 | 4.86 | 3.64 | 0.0 | 0.000000 |
| self-hosted repeat mobile | 77 | 2.74 | 4.87 | 3.73 | 0.0 | 0.000000 |
| final mobile | 76 | 2.75 | 4.87 | 3.97 | 1.5 | 0.000000 |
| baseline desktop | 77 | 0.60 | 2.95 | 2.61 | 0.0 | 0.000000 |
| final desktop | 97 | 0.61 | 1.13 | 0.98 | 0.0 | 0.000000 |

Final directly throttled mobile LCP: 3.272 s and 3.484 s, CLS 0 in both. Final direct desktop LCP: 0.724 s, CLS 0. Do not compare directly throttled CDP times numerically with Lighthouse's simulated timings as if they were the same method. INP/real-user 75th-percentile Core Web Vitals were not measured. TBT is not INP. Final mobile simulated LCP remains above 2.5 seconds; the task does not establish that production passes Core Web Vitals.

## 6. Files changed by this performance task

- index.html: homepage responsive image references and local font delivery/preloads only. Existing mobile Contact Us changes preserved.
- css/fonts.css: six subset declarations for the existing font families.
- fonts/: six WOFF2 files, three original license texts and font provenance README.
- images/primeloft-agenda-hero-{480,768,1024,1536}.webp: four derivatives.
- images/primeloft-arc-logo-{256,512}.webp: two derivatives.
- tools/build_release.py: include fonts in the static release allowlist.
- tools/qa-results/homepage-performance-results.json: machine-readable Lighthouse and cold-browser evidence.
- tools/qa-results/homepage-performance-report.md: this report.

Other modified HTML files and css/theme.css were already changed for the preceding mobile-contact-menu fix and were not rewritten by this task. No homepage redesign, SEO metadata/schema change, service URL change, JavaScript change, security-policy relaxation, analytics activation or hosting-setting change.

## 7. Visual and functional validation

Passed source and generated-release audits over 20 HTML files: local links, fragment links, unique IDs, image alternatives, structured JSON and JavaScript syntax. Explicitly validated all srcset files, font stylesheet resources and release font inclusion. Byte-for-byte source comparisons confirm meta tags, title, canonical, JSON-LD and script references unchanged from the start of this task. git diff --check passes.

Chromium layout checks at 320, 390, 768, 1024 and 1440px: no document overflow or clipped headings; hero loads; loaded images valid. Mobile/desktop screenshots and WebP derivatives reviewed. Colors, layout components and animation source remain unchanged. The same font families now load locally; baseline Google Fonts failure had used fallback fonts, so its line wrapping is not an exact production visual reference. Existing responsive CTA wrapping is retained.

FAQ expansion/collapse, mobile menu and Escape behavior, visible keyboard focus and reduced-motion content visibility pass. Contact form success/reset, server-error recovery and honeypot behavior pass using intercepted local fetch responses; no real email or inquiry was sent. Existing chatbot escaping test passes. No JavaScript exceptions in the visual checks. Final cold resource traces show no duplicate font/hero requests and no requests for the old large homepage hero/logo PNGs.

The only regression found was late font-swap layout shift during an intermediate cold run. The targeted font preloads corrected it in both final cold mobile runs and desktop. Full screen-reader/contrast certification, physical-device Safari/Android checks and real delivery were not run.

## 8. Cloudflare, CSP and delivery

Production HTML/header retrieval timed out. Therefore Cloudflare cache status, Brotli/gzip, live redirects, TTFB and actual injected beacon were not verified. The local QA server does not reproduce a real CDN or content compression, so lab scores are not production promises.

The repository has no Cloudflare Insights snippet. Existing CSP deliberately restricts script-src to self. A dashboard-injected beacon can explain the reported browser warning, but whether Web Analytics is intentionally enabled cannot be determined from these files. No wildcard, unsafe script allowance or speculative analytics permission was added. No Cloudflare dashboard settings were changed.

In the Cloudflare dashboard, check Web Analytics > Manage Site (automatic setup) or the Pages project's Metrics > Web Analytics. If the beacon is intentional, verify its actual script and collection endpoints and align both effective response-header and meta CSP with only those origins; otherwise disable unintended injection. Existing GitHub Pages configuration means _headers is not automatically an effective header configuration at that origin. Verify the actual response rather than assuming it is applied.

## 9. Remaining bottlenecks and limits

- Mobile Lighthouse LCP is still 4.87 s. Roughly 250 KB of existing CSS remains blocking locally; Lighthouse flags substantial unused CSS across shared files. It was not deleted based on one viewport's coverage because menus, chat, responsive states and service pages depend on those styles.
- Remaining rendering cost includes fonts, styling and preserved entrance animations. Further work should first confirm a production waterfall and consider a dedicated homepage CSS delivery strategy with broad interaction coverage.
- Public caching/compression and analytics intent require host/account verification. Original large PNG assets still exist for other pages and schema/social references; this task changes homepage delivery only.
- Real field INP/LCP/CLS and mobile performance under production fonts/CDN remain unverified. Font coverage added is Latin/Latin Extended, matching current English homepage content; other scripts use existing fallback stacks.

## 10. Post-deployment verification (after user approval)

1. Review this branch and preview screenshots before merging. Do not deploy automatically.
2. After an approved deployment, cold-load mobile DevTools with cache disabled. Confirm a WebP srcset candidate for hero/logo, no duplicate PNG download, local WOFF2 success and no font errors.
3. Verify CSS/font/image MIME types, Cache-Control, Content-Encoding, CF-Cache-Status/Age where present and HTTPS redirects on actual responses. Choose caching rules appropriate to versioned asset filenames; do not apply immutable caching to unversioned HTML.
4. Run three mobile and three desktop PageSpeed/Lighthouse tests under comparable settings; compare medians with a production baseline. Inspect exact LCP element and subparts rather than assuming it is unchanged.
5. Check final appearance, font families and weights, motion/reduced motion, menu Contact Us link, FAQs, chat and a separately authorized real contact delivery on iOS Safari and Android Chrome.
6. Resolve Cloudflare analytics intent and effective CSP at the actual hosting layer; do not weaken script-src just to silence warnings.
7. Review Search Console/CrUX field data after sufficient real traffic. Good lab values alone do not prove good 75th-percentile Core Web Vitals.

Evidence: full HTML/JSON Lighthouse reports are in scratch/lighthouse-*.report.*; screenshots in scratch/performance-visual-{390,1440}.png; raw browser traces in scratch/performance-{baseline,images,final,preloaded}.json. Reproduction uses node scratch/performance/node_modules/lighthouse/cli/index.js http://127.0.0.1:8767/ --only-categories=performance --chrome-flags="--headless=new --no-sandbox" --output=json --output=html --output-path=<path>; add --preset=desktop for desktop. Image tool: sharp 0.35.5, resize to stated width, WebP quality 90/effort 6 for hero and lossless/effort 6 for logos.

Primary references: https://developer.chrome.com/docs/performance/insights/lcp-breakdown and https://developers.cloudflare.com/web-analytics/get-started/ .
