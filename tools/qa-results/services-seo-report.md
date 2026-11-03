# Services overview SEO implementation

Date: 3 November 2026 (Asia/Karachi). Review branch: feature/homepage-seo-review. No commit, merge, deployment or Search Console indexing request.

## A. Initial audit

| Finding | Severity | Outcome |
|---|---|---|
| Generic Services title and Ten services H1 lacked approved commercial positioning | High | Exact approved title/description and recommended visible H1 implemented |
| Engineering row described websites but did not explain shared custom-software scope | Medium | Website and software relationship explicit; existing engineering URL retained |
| Repeated Explore service labels were less useful when scanning links | Medium | Ten descriptive visible service-detail anchors |
| Strategy page existed but was absent from overview discovery | Medium | Supplementary planning link in existing closing section; no eleventh service category created |
| Booking/free-consultation copy led to a normal contact form | Medium | Discuss Your Project and scope-oriented invitation |
| Blanket turnaround and unconditional IP claims in page FAQ | Medium | Scoped estimates and third-party license qualifications, on this page only |
| Only BreadcrumbList represented the page | Opportunity | Breadcrumb retained and linked to CollectionPage and ten-item ItemList |
| External font stylesheet and original 1 MB logo still loaded | Medium | Reused local fonts and optimized logo srcset; no new performance dependency |
| Canonical, one H1, static links, sitemap inclusion, robots permission already correct | Pass | Preserved; services lastmod updated |

Useful original content retained: ten alternating service rows, feature tags, visual scenes, jump navigation, FAQ accordion, shared navigation/footer, delivery context, and contact/WhatsApp paths. No original service offering removed. The supporting Explore Our Development & Digital Services heading was not added because service H2s already provide a useful hierarchy; no hidden or duplicate headings added.

## B. Files modified

- services.html: metadata/social text, hero, ten service descriptions/headings/anchors, jump-link labels, scoped FAQ copy, contact/strategy copy, local font/logo delivery and JSON-LD graph.
- css/services.css: one scoped rule underlines the supplementary strategy link; stylesheet query version incremented on services.html only.
- sitemap.xml: services.html lastmod changed to 2026-11-03; all URL paths and other entries preserved.
- tools/qa-results/services-seo-results.json: rendered checks, service mapping, local HEAD results and Lighthouse metrics.
- tools/qa-results/services-seo-report.md: this report.

Homepage and all individual service-page source content compared unchanged, normalizing Git/Windows line endings. No shared CSS/JavaScript changes, new runtime dependencies, logo artwork changes, schema ratings, marketing statistics or business locations.

## C. Final SEO configuration

Title: Web & Software Development Services | PrimeLoft Tech

Description: Explore PrimeLoft Tech's website development, custom software, mobile apps, WordPress, Squarespace, SEO, AI automation and digital services.

Canonical: https://primeloft.tech/services.html

H1: Web, Software & Digital Services for Your Business

Robots: unrestricted defaults; no noindex meta; robots.txt permits crawling. Local response has no X-Robots-Tag. Public response headers remain unverified.

| Social property | Value |
|---|---|
| og:title / twitter:title | Approved services title above |
| og:description / twitter:description | Approved services description above |
| og:url | https://primeloft.tech/services.html |
| og:site_name | PrimeLoft Tech |
| og:type | website |
| og:image / og:image:secure_url / twitter:image | https://primeloft.tech/images/primeloft-social-20261102.png |
| Image dimensions/type | 1200 × 630, image/png |
| og:image:alt | PrimeLoft Software Solutions (existing branded image alternative) |
| twitter:card | summary_large_image |

One title, description and canonical in both static HTML and rendered DOM. Title and description are unique among local pages. Existing favicons, manifest and branded sharing image preserved. Source uses escaped ampersands/apostrophes where needed; rendered values match the approved copy.

## D. Keyword targeting

Primary theme: web and software development services, placed naturally in the visible hero introduction; title uses &. Homepage's agency positioning is unchanged. Service-specific names appear in their corresponding H2, short description, jump links and detail anchors. Website/software engineering remains one combined destination. No invented demand metrics, hidden keywords, geography stuffing or repeated homepage primary target.

The page addresses commercial service discovery for startups, growing businesses and established teams, while detailed service pages remain responsible for their narrower topics. Their metadata was not rewritten.

## E. Service mapping

| Offering | Existing destination | Visible detail anchor |
|---|---|---|
| UI/UX Design | service-design.html | Explore UI/UX design |
| Website & Software Development | service-engineering.html | Explore websites & software |
| Mobile App Development | service-mobile-app-development.html | Explore mobile app development |
| SEO Services | service-seo.html | Explore SEO services |
| AI & Business Automation | service-ai.html | Explore AI & automation |
| Cloud & DevOps | service-cloud.html | Explore cloud & DevOps |
| Software Testing & QA | service-quality.html | Explore testing & QA |
| Maintenance & Support | service-maintenance.html | Explore maintenance & support |
| WordPress Development | service-wordpress.html | Explore WordPress development |
| Squarespace Development | service-squarespace.html | Explore Squarespace development |

Supplementary existing offering: product strategy service → service-strategy.html, linked from the closing copy and kept outside the ten-row core list. Home links remain index.html; primary inquiry goes to contact.html; WhatsApp destination retained. Every service detail link is an ordinary static HTML anchor. All destinations exist, and 14 local HEAD checks (home, overview, contact, strategy and ten services) returned 200 without redirects or X-Robots-Tag restrictions. Public redirect chains were not tested successfully.

## F. Structured data

The original Home → Services BreadcrumbList is preserved, now with stable @id https://primeloft.tech/services.html#breadcrumb.

Added:

- CollectionPage @id https://primeloft.tech/services.html#webpage, with approved title/description, canonical URL, inLanguage=en, isPartOf referencing the existing https://primeloft.tech/#website entity, breadcrumb reference and mainEntity reference to the service list.
- ItemList @id https://primeloft.tech/services.html#service-list, with ten ListItems whose names, contiguous positions 1–10 and URLs match the visible rows.

Existing SEO JavaScript still injects one Organization as before. Rendered inspection shows one BreadcrumbList, CollectionPage, ItemList and Organization; no conflicting duplicate page/list entities. No FAQPage, ratings or reviews added. JSON-LD parses and list integrity checks pass locally. External Schema.org and Rich Results validators were not run against the unpublished changes; validation and entity accuracy checks remain manual.

## G. Performance

Lighthouse 13.6.0, same local QA server, extension-free Chrome launches and default simulated mobile settings; performance category only:

| Metric | Before | After |
|---|---:|---:|
| Performance | 69 | 81 |
| FCP | 2.86 s | 2.56 s |
| LCP | 3.60 s | 4.21 s |
| Speed Index | 7.68 s | 3.34 s |
| TBT | 373.00 ms | 70.50 ms |
| CLS | 0.00 | 0.00 |

LCP did not improve. Baseline candidate was the first design-service paragraph; final candidate was the header logo. The longer required hero copy and successful local-font delivery alter viewport composition/candidate selection, so score improvement must not be presented as a blanket LCP improvement. Both runs report CLS 0; final mobile LCP remains above 2.5 seconds. This is not field INP/CrUX data or a production performance claim.

The original above-the-fold 1,054,463-byte logo now uses existing WebP variants (26,344/108,068 bytes), with source dimensions and composition preserved. Two targeted font preloads reuse prior cold-test findings; no high priority was applied indiscriminately. Existing stylesheets, JavaScript modules, scene effects and scroll reveals are preserved. Large shared render-blocking CSS and the existing automatic chat prompt remain performance/usability considerations. No CSS purge, blanket deferral or animation removal was attempted.

## H. Quality assurance

Passed:

- python tools/audit_site.py and generated dist audit: 20 HTML files; links, fragments, unique IDs, image alternatives, JSON-LD and JavaScript syntax.
- python tools/build_release.py and git diff --check.
- Static uniqueness/count checks: one exact title, one description, one canonical, no noindex; ten contiguous schema positions and correct visible destination links.
- Rendered metadata and entity counts after existing JavaScript initialization.
- 320, 390, 768, 1024, 1440px: one H1, no document overflow or clipped headings, no broken loaded images.
- First service hover state, scroll reveal trigger, FAQ toggle, mobile menu with Contact Us, Escape close, visible keyboard focus and reduced-motion content visibility.
- No uncaught JavaScript exceptions in the browser checks.
- Fourteen local destination HEAD checks: all 200, no restrictive X-Robots-Tag.
- Mobile/desktop hero screenshots reviewed. No new section or visual component added; existing responsive layout retained.

No unresolved local test failures. Not run: external schema validators, real Safari/iOS/Android, full accessibility/contrast certification, actual inquiry/email transmission, live HTTP/redirect/header verification and field Core Web Vitals. The browsing tool could not retrieve the production services URL. Local 200 responses do not establish production status.

## I. Remaining issues

- Final measured LCP is slower despite improved FCP, Speed Index, TBT and overall performance score. Recheck a production waterfall and LCP candidate after approved publication before further optimization.
- The existing automatic chat prompt overlaps some lower hero jump links in the mobile screenshot. It is dismissible and was preserved as an existing functional component; no intrusive popup was added by this task.
- External validators, production crawl/indexability/headers, canonical selection and actual form delivery require manual verification.
- Historical Discovered - currently not indexed is user-supplied context, not evidence of a current technical defect. No index request was repeated. Legal indexing rules and robots.txt remain unchanged.

## J. Post-deployment actions (after user approval only)

1. Verify deployed View Source shows the exact title/description, one preferred canonical, ten static service links and updated graph. Confirm final response 200 and no HTTP/meta noindex.
2. Open Search Console > URL Inspection for https://primeloft.tech/services.html. Review the existing indexed/inspection state, then Test Live URL to check accessibility and indexability. Do not automatically repeat the indexing request already submitted.
3. When recrawled indexed data is available, compare user-declared and Google-selected canonicals. The live test alone does not establish Google's indexed canonical selection.
4. In Sitemaps, review the existing https://primeloft.tech/sitemap.xml fetch status; services.html remains included with truthful lastmod. Do not create another sitemap or resubmit a healthy one solely because the URL is pending.
5. Validate CollectionPage/ItemList/BreadcrumbList with Schema.org Validator; use Google's Rich Results Test where applicable. Confirm list entries match visible content; do not expect arbitrary page/list markup to guarantee a rich result.
6. Test service links, strategy link, mobile contact navigation and CTA destinations on the deployed site. Inspect local WOFF2/WebP loading and real cache/compression headers.
7. Run mobile/desktop PageSpeed Insights and inspect the LCP candidate. Over subsequent weeks, monitor Search Console performance filtered to /services.html, query and country, separating branded queries from non-branded service discovery. Do not claim a ranking or traffic improvement before sufficient data exists.

Evidence: scratch/services-seo-qa.json; scratch/services-seo-{390,1440}.png; scratch/lighthouse-services-{before,after}.report.{html,json}; tools/qa-results/services-seo-results.json. Source snapshot: scratch/services-seo-before.html.

Primary guidance consulted: https://developers.google.com/search/docs/appearance/structured-data/breadcrumb .
