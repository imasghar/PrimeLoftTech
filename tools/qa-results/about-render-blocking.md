# About-page render-blocking optimization

3 November 2026. Branch feature/homepage-seo-review. No commit, merge or deployment.

The supplied audit lists about.css and the external Google Fonts URL, identifying the unoptimized About-page loading path rather than the already optimized homepage. Extension warnings in the supplied screenshot mean its score should not be directly compared with a separate browser/profile run. Duration rows are overlapping request durations, not a sum of guaranteed LCP savings.

## Changes

- about.html now uses the existing local Geist/Geist Mono/Inter declarations, with only the two already measured above-the-fold font preloads. External Google Fonts stylesheet and preconnects removed from this page.
- Both About-page logos now use the existing 256/512 WebP srcset, avoiding the 1,054,463-byte original PNG request. Original image and artwork retained.
- css/about.bundle.min.css combines fonts.css, style.css, theme.css, chat.css, project-banner.css and about.css in their original cascade order. Level-0 minification changes formatting only; no rules or dynamic selectors were deleted or deferred.
- Local CSS reduced from 237,780 to 194,965 bytes (18.0%), across six source stylesheets to one stylesheet request. The new font stylesheet is included in those six sources.
- tools/build_about_css.mjs and tools/css-build/ provide the pinned development-only clean-css 5.3.3 generator, source list, lockfile and instructions. No runtime dependency ships to browsers.
- tools/build_release.py verifies the generated CSS source hash and regenerates stale output; tools remain excluded from public hosting.

Some essential CSS remains render blocking deliberately. Blindly deferring every stylesheet can cause an unstyled first paint, shifts or unusable menus. No inline onload handlers or unsafe CSP exceptions were added. Styles used by other pages remain unchanged.

## Clean-profile local Lighthouse 13.6.0 mobile results

Same local QA URL and default simulated mobile preset, fresh Lighthouse Chrome sessions without installed extensions:

| Metric | Before | After |
|---|---:|---:|
| Performance | 76 | 85 |
| FCP | 3.01 s | 2.57 s |
| LCP | 3.54 s | 3.32 s |
| Speed Index | 7.64 s | 3.27 s |
| TBT | 166.6 ms | 194 ms |
| CLS | 0 | 0 |

LCP is the About H1, #pageTitle, in both runs. Logo savings improve total image delivery; the logo was not incorrectly assumed to be the LCP element. CSS/font/reveal rendering remains the critical path. TBT did not improve and varied upward in this sample; no JavaScript work was changed. These are local measurements without a production CDN/compression stack, not promised live scores.

## Validation

- Bundled CSS versus its original source CSS: zero differences in sampled display, position, size, typography, colors, spacing, grids and border-radius properties across header/main/footer elements at 320, 390, 768, 1024 and 1440px. Normal transition settling was allowed before comparison.
- No horizontal overflow at those widths. About details and FAQ controls toggle correctly. Original animation sources unchanged.
- Fonts load locally; zero Google Fonts links on About. SEO metadata, schema and external script references compare unchanged with the pre-task source.
- Source and generated-release audits pass across 20 HTML files. git diff --check passes.
- Still required: physical-device/Safari checks and production waterfall/compression/cache-header verification. No broad accessibility or best-practices score remediation was attempted from the supplied screenshots alone.

## Editing and previewing

Edit the original CSS files, then run from the repo root:

    npm ci --prefix tools/css-build
    node tools/build_about_css.mjs

Refresh Live Server after rebuilding. The builder updates the bundle query hash in about.html. The release builder also regenerates when a source hash changes; a fresh checkout needs the development dependency installed only if rebuilding is necessary. Do not edit the generated bundle directly.

## Recheck

Open the current review-branch about.html in a clean Chrome profile or an extension-free incognito session. Disable cache and rerun Lighthouse with the same device/throttling settings. Confirm requests use about.bundle.min.css, local WOFF2 and logo WebP, with no fonts.googleapis.com request. Essential CSS may still be listed as blocking; evaluate FCP/LCP rather than requiring an empty warning list. Verify cache lifetime and compression on the production host after an approved deployment, not only Live Server.

Full Lighthouse reports: scratch/lighthouse-about-{before,after}.report.{json,html}. Computed-style evidence: scratch/about-css-qa.json. Summary: tools/qa-results/about-render-blocking.json.

Reference: https://developer.chrome.com/docs/performance/insights/render-blocking .
