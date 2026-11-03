# SEO services landing page optimization

Date: 3 November 2026 (Asia/Karachi). Target file service-seo.html; canonical https://primeloft.tech/service-seo.html unchanged. Branch feature/homepage-seo-review. No commit, merge, deployment or indexing request performed.

## 1. Initial source audit

Audited the target HTML, css/seo.css, js/seo.js, js/main.js, shared SEO/FAQ/inertia-scroll modules, fonts, images, sitemap and contact-pricing routing. The source snapshot and audit JSON were saved before changes, followed by baseline mobile Lighthouse before edits.

| Finding | Priority | Action |
|---|---|---|
| Comprehensive existing content: definition, nine service topics, methodology, reporting, cost and seven FAQs | Preserve | Retained section structure and all service categories |
| Existing title/description relevant, but not the proposed commercial wording | Medium | Proposed metadata applied consistently |
| Existing H1 brand/question-led | Medium | Explicit proposed business-benefit H1 applied |
| Topic headings answered useful questions but lacked service labels | Opportunity | Audit, research, on-page, technical and local headings clarified |
| WordPress/Squarespace mentioned only briefly in FAQ; reporting did not name tools | Opportunity | Qualified platform tasks and access-dependent reporting clarified |
| Inquiry labels vague; audit available as a separate project | Medium | Primary project CTA and scoped audit inquiry label applied |
| Contact query service=seo already worked case-insensitively | Pass | Preserved and browser-verified SEO selection and budget options |
| Inline Organization provider plus shared injected Organization | Medium | Connected explicit graph and existing injection guard |
| Existing FAQPage and service OfferCatalog present | Preserve | Synchronized existing FAQ; existing nine catalog offers unchanged |
| Unused high-priority animation preload fetched 334,502 transfer bytes | Medium | Removed preload only; asset and all active animation code retained |
| External Google Fonts failed in baseline; original logo PNG 1,054,463 bytes | Medium | Reused existing local fonts and responsive logo assets |
| Canonical, sitemap inclusion and indexability valid locally | Pass | Preserved and target lastmod updated |

The hero search illustration uses HTML/CSS/SVG, not a raster hero. Actual baseline and after LCP is h1#seo-title. Existing valid content already distinguishes crawlability/indexing, native platform limits, eligible local businesses, separately scoped ecommerce/migration and uncertain search outcomes. No fabricated case studies, certification badges or ranking guarantees were found or added. The existing $300–$1,500 pricing was retained; this audit did not independently confirm business pricing or completed client work.

## 2. Keyword clusters, search research and mapping

Reviewed a current search-result sample for technical, on-page, keyword and local SEO services. Competitor pages group services, deliverables, process and reporting, supporting the current page's structure; this is an inference about relevance, not proof of demand. [WebFX's on-page service page](https://www.webfx.com/seo/services/ON-PAGE-SEO/) was opened and reviewed for its deliverables/process/FAQ organization. [Ranknex](https://ranknexllc.com/services/seo) and [Clicky Fyre](https://clickyfyre.com/services/seo) appeared in search snippets with technical, keyword and local service groupings; direct opens failed, so only snippet-level terminology was considered. No competitor text, results, testimonials or promises were copied. No verified search volume, difficulty, CPC or competition data was available.

| Cluster / intent | Existing page destination | Implementation |
|---|---|---|
| Search engine optimization services; SEO services for businesses | Hero/title/H1 | Exact primary phrase in intro, concise commercial title and benefit H1 |
| SEO agency/company/professional services | Organization and service explanation | Provider identity and practical scope; synonyms not forced into repeated text |
| Website SEO audit; newly launched sites; small/service businesses | seo-services, seo-audit | Audience-specific starting points and prioritized findings |
| Technical SEO services/audit; crawling/indexing, canonicals, sitemaps, CWV | technical-seo, seo-audit, indexing FAQ | Explicit heading and retained technical deliverables |
| On-page SEO; metadata, internal links, content and images | on-page-seo | Clear service heading and image-delivery check wording |
| Keyword research; intent, commercial/long-tail, competitor review and mapping | keyword-research | Explicit service heading and concise scope clarification |
| Local SEO; GBP; local visibility | local-seo and local FAQ | Eligible businesses, real service areas, consistency; no Maps guarantee |
| WordPress/Squarespace SEO; ecommerce | Existing platform FAQ and ecommerce-seo | Metadata/content/links/mobile tasks, qualified platform access; existing ecommerce service retained |
| Search Console, GA4 and organic performance reporting | Existing seo-report and reporting FAQ | Access/configuration-dependent measurement, findings and next tasks |

Related technical guidance was checked against [Google's SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide) and [Google's guidance on hiring an SEO](https://developers.google.com/search/docs/fundamentals/do-i-need-seo), which emphasize useful site improvements and realistic expectations. These sources do not verify PrimeLoft's own service delivery.

## 3. Metadata before and after

Before title: SEO Services | Technical, On-Page & Local SEO | PrimeLoft

After title: SEO Services for Businesses | PrimeLoft Tech

Before description: Explore SEO services from PrimeLoft: keyword research, technical SEO, on-page optimization, local and ecommerce SEO. Get a clear plan for your website.

After description: Improve your website's search visibility with PrimeLoft Tech's technical SEO, on-page optimization, keyword research, local SEO and website audits.

Before H1: SEO services. How will your next customer find you?

After H1: SEO Services to Help Your Business Get Found

Exactly one title, description, canonical and H1 verified in rendered DOM. Social title/description now agree, site_name is PrimeLoft Tech, and the existing branded 1200x630 PNG is retained with image alt metadata. No conflicting robots directive or local X-Robots-Tag found. Filename and URL unchanged; no additional canonical injected. Target sitemap lastmod changed from 2026-11-02 to 2026-11-03.

## 4. Content changes by section

- Hero: primary phrase and clearer scope, proposed benefit heading, Discuss Your SEO Project CTA. Existing internal service-exploration link retained.
- Definition and service overview: definition retained; starting-point wording now explicitly includes new sites and small service businesses.
- Audit: concise explicit audit heading; existing crawl/index/content findings and prioritized recommendations retained.
- Keyword research: service heading, commercial/long-tail intent, competitor search-result review and mapping clarified.
- On-page: explicit service heading; image delivery checks complement existing metadata, headings, descriptive image text and internal linking.
- Technical: explicit heading; existing redirect/canonical/sitemap/robots/CWV/structured-data scope retained and linked to implementation service.
- Local: explicit heading, eligible Business Profile optimization and useful local-page scope; added accurate commercial FAQ.
- Ecommerce, off-page, migration and international: retained useful qualified content without adding new categories or claims.
- Methodology/reporting: existing reporting block names Search Console and GA4 conditionally, explains completed work/limitations/next tasks and avoids attributing every metric change to SEO.
- Cost: existing pricing and focused/ongoing engagements retained; audit inquiry label and maintenance link added.
- FAQs: retained seven, expanded platform answer, added local services, measurement and non-indexed-site questions. Ten visible answers match the existing FAQ schema.

## 5. Internal links and conversion

Added descriptive contextual links to service-engineering.html, service-maintenance.html, service-wordpress.html and service-squarespace.html. services.html remains linked in breadcrumb/navigation/footer. Primary hero and closing buttons say Discuss Your SEO Project. Existing cost-section inquiry link now says Request an SEO Audit, supported by the existing separate-audit FAQ; it opens the normal SEO inquiry form, not an automated/free audit or booking calendar.

Preserved contact.html?service=seo: actual browser value is SEO and SEO budget options remain available. All three visible inquiry buttons/links are unobstructed at all five viewport widths. The existing aside contact link remains desktop-only. Local HEAD checks for all six relevant HTML destinations and font/logo/social resources returned 200. No form submitted or WhatsApp message sent.

## 6. Structured data

Connected one Organization, WebPage, Service and BreadcrumbList using stable canonical @ids and homepage WebSite reference. id=org-schema engages the shared guard, preventing duplicate Organization injection. The original nine-entry hasOfferCatalog is unchanged, with no invented offer or price. Existing FAQPage retained and synchronized with all ten visible answers; it is not added to pursue rich results. No aggregate ratings, reviews, awards, new locations or pricing schema introduced. Local JSON parsing, graph inspection, rendered entity count and visible-answer equivalence pass; external schema validator was not run.

## 7. Trust and credibility

Preserved the existing no-number-one-ranking guarantee, variable outcomes/timelines, qualified implementation responsibility and prohibition of ranking-link schemes. Local FAQ explicitly avoids Maps ranking guarantees and removal of genuine negative reviews. Non-indexed-site FAQ explains that indexing remains a search-engine decision. Analytics reporting depends on access and configured measurement. No case studies, traffic gains, endorsements, certifications, partnership claims, locations or new prices invented. Existing prices and service statements remain owner-supplied source content, not independently audited business evidence.

## 8. Performance before and after

Lighthouse 13.6.0, fresh extension-free headless Chrome, default simulated mobile throttling, same localhost URL and performance-only category. One cold baseline and two after runs:

| Run | Performance | FCP | LCP | Speed Index | TBT | CLS |
|---|---:|---:|---:|---:|---:|---:|
| before | 83 | 2.876s | 2.876s | 7.581s | 0.0ms | 0 |
| after | 91 | 2.760s | 2.760s | 3.346s | 0.0ms | 0 |
| repeat | 91 | 2.836s | 2.836s | 2.836s | 0.0ms | 0 |

H1 remains the measured LCP element. LCP stays above 2.5 seconds; that objective is not met. The baseline Google Fonts request failed (status -1), so fallback font timing and geometry limit comparison with successful local-font rendering after changes. Scores are local lab measurements, not field CWV, traffic gains or ranking forecasts. TBT is not INP; INP was not measured. Existing shared render-blocking CSS and hero entrance animations remain.

Optimizations: reused original families/weights through css/fonts.css, preloaded only existing Latin Geist/Inter WOFF2, reused responsive original-logo WebPs (256px 26,344 bytes; 512px 108,068 bytes) with 144px sizes and explicit dimensions; footer remains lazy. Original 1,054,463-byte logo PNG retained. Removed only unused seo-light.json preload: source has no matching Lottie container; baseline request was high-priority 334,502 transferred bytes, repeat run makes zero requests for it. Original animation JSON, all JS files, CSS animation rules and HTML/SVG hero artwork retained. No new images, dependencies or runtime library.

## 9. QA outcomes

| Check | Outcome |
|---|---|
| 320, 390, 768, 1024, 1440px | No document overflow; headings and CTA labels fit; one H1; loaded images valid |
| Visible inquiry CTA hit tests | All three centers unobstructed at all five widths |
| 390px visual inspection | Logo, hamburger, H1, CTA and original search illustration render correctly |
| Sticky/compact index | Opens on desktop, collapses on mobile, all targets exist; mobile click closes and updates current technical section |
| Index hash | Existing Lenis scrolling prevents default hash navigation; current-section tracking works; behavior preserved |
| FAQs | All ten open/close, schema text and labelled regions match |
| Keyboard | Space opens FAQ; focus remains on button with visible solid outline |
| Mobile navigation | Contact Us present; Escape closes menu |
| Hero hover | Original result card translates upward 5px |
| Reduced motion | Preference active, no hidden reveal targets and no hero animations |
| Runtime exceptions | None captured |
| Contact selection | SEO selected; existing SEO budget options present |
| Source and generated release audits | PASS: 20 HTML files, links/fragments, image alt, IDs, JSON-LD and JavaScript syntax |
| Build | python tools/build_release.py PASS; dist audit PASS |
| Whitespace | git diff --check PASS |

This is targeted functional/accessibility QA, not a complete WCAG conformance review. Existing brand/text colors were retained; screen-reader and real-device Safari checks remain manual. No production form submission performed. Preservation comparisons and all unrelated HTML comparisons are retained in the machine-readable evidence.

## 10. Files modified

- service-seo.html: metadata, copy, graph, links, CTAs, local font/logo references and removal of unused preload.
- css/seo.css: scoped contextual-link underline in existing brand blue; version 1.1.1. Existing rules retained.
- sitemap.xml: only target SEO-page lastmod changed.
- tools/qa-results/seo-service-report.md: this report.
- tools/qa-results/seo-service-results.json: retained measurements and browser/source evidence.

Ignored scratch directory contains baseline HTML/audit, QA scripts, screenshots and full before/after/repeat Lighthouse reports. dist is generated and ignored. No other service page or homepage metadata changed.

## 11. Remaining issues and limits

LCP remains approximately 2.76–2.84 seconds. Shared CSS and original animation timing remain potential work areas requiring a separate measured change to preserve rendering. External schema validation, complete accessibility audit, real-device testing, Search Console coverage/field data and verified commercial demand metrics were not available. Public-page open failed through the web tool; that does not establish live unavailability or an indexing problem. Existing prices should remain maintained by the business. No production verification or deployment performed.

## 12. Post-deployment verification

After explicit approval: commit on the review branch, merge approved changes to main and verify the successful Pages workflow. Check public HTTP status, canonical/indexability, social image and metadata, sitemap lastmod and all asset requests. Confirm one rendered Organization, correct ten FAQ answers, SEO preselection, mobile menu, compact index, keyboard activation, reduced motion and preserved animations on a real device. Validate schema externally, inspect the canonical in Search Console and assess production Lighthouse and field CWV when enough data exists. Request indexing only if useful and authorized. Do not infer guaranteed visibility or leads from local checks.

Preservation comparisons: `{"sectionCount": true, "sectionIds": true, "heroArtwork": true, "scriptSources": true, "existingCatalog": true, "originalCssRules": true}`. All unrelated HTML unchanged: `True`.
