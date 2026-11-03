# Custom website and software development SEO implementation

Date: 3 November 2026 (Asia/Karachi). Target URL unchanged: https://primeloft.tech/service-engineering.html . Branch feature/homepage-seo-review. No commit, merge, deployment or indexing request performed by this task. Previously committed local UI/UX work is preserved.

## 1. Baseline audit

| Finding | Severity | Outcome |
|---|---|---|
| Relevant existing metadata did not match the proposed targeting/brand wording | Medium | Proposed title/description and matching sharing metadata applied |
| Brand-led H1 did not explicitly identify the development offering | Medium | Proposed visible H1 applied using current type and blue accent |
| Existing definition distinguished website/app but emphasized websites | Medium | Existing section now concisely distinguishes website, web application and business software |
| Seven useful project types already covered most requested offerings | Pass | All retained; no extra service category or section added |
| Design and maintenance were not linked contextually in body copy | Opportunity | Added relevant links in existing process/FAQ text |
| Closing Book a Discovery Call opened a normal contact form | Medium | Discuss Your Development Project label now reflects the action |
| Contact query Custom%20Website already matched form option | Pass | Preserved and verified; not reported as a repaired query |
| Inline provider Organization plus shared injected Organization | Medium | One stable explicit Organization and existing org-schema guard |
| Two schema blocks lacked linked page/service identities | Opportunity | Consolidated connected graph; existing breadcrumb, Service and FAQ kept |
| External font CSS and original 1,054,463-byte logo remained | Medium | Reused existing self-hosted fonts and responsive logos |
| Canonical, sitemap inclusion and indexability already correct | Pass | Preserved; target lastmod updated |

Before title: Custom Website & Software Development | PrimeLoft

Before description: Custom website and software development for business sites, ecommerce, SaaS, portals and internal tools. Explore design, development and support from PrimeLoft.

Before H1: Your business. Your next move. Built for the web.

Existing sections: hero with HTML/CSS browser/application illustration; website/software definition; seven project-type disclosures; engineering foundations; four-stage delivery process; six FAQs; project inquiry banner; shared navigation/footer. Existing supported offerings include corporate sites, landing pages, ecommerce, SaaS/web apps, portals, business workflow software, website/app improvements and qualified API integrations. No broken local route was found by executed audits; live status remains unverified.

Original main heading hierarchy:

- H1: Your business. Your next move. Built for the web.
- H2: What is custom website development?
- H2: A different purpose. A different kind of website.
- H3: Business & corporate websites
- H3: Landing pages & campaign sites
- H3: Ecommerce websites
- H3: SaaS & web applications
- H3: Portals & booking platforms
- H3: Custom business software
- H3: Website redesign & modernization
- H2: The details that make the whole thing work.
- H3: Easy to use
- H3: Connected to your tools
- H3: Ready to manage
- H3: Tested before release
- H2: Build in stages. Review as we go.
- H3: Define the scope
- H3: Design the experience
- H3: Develop and connect
- H3: Test, launch and hand over
- H2: Before we build.
- H2: What should your website do next?

Baseline Lighthouse 13.6.0 mobile: performance 84, FCP/LCP 2.75 s, Speed Index 7.95 s, TBT 0 ms, CLS 0. The actual LCP element is #pageTitle (H1), not a hero image. The hero illustration is native HTML/CSS/SVG; the only img elements are the header/footer logos. No pointless SVG raster conversion or new hero image was introduced. Baseline font stylesheet was an external blocking dependency; large shared CSS also remains blocking. Layout problems were checked after implementation rather than assuming a baseline multi-width pass.

## 2. Keyword-to-section mapping

| Theme | Placement / scope |
|---|---|
| Custom software development services (primary) | Exact phrase in visible hero introduction; service-focused H1 and Service entity |
| Custom website development services (secondary) | First paragraph in the existing definition section |
| Web application development | Definition paragraph and existing SaaS/web-app project type |
| Custom web / responsive business website development | Hero, public-website definition, corporate site/landing/ecommerce types and responsive FAQ |
| Business software development | Third definition paragraph, existing custom-business-software disclosure and scoped inquiry action |
| Software engineering services | Existing engineering foundations and four-stage build/test/handoff process; not forced as a repeated keyword phrase |
| SaaS application development | Existing SaaS/web-app type retained; release features scoped |
| API integrations | Existing integration foundation/FAQ and qualified definition language |
| Workflow automation | Existing internal approvals, reporting and process-handoff examples; no new AI capability claim |
| CMS | Existing publishing/platform discussion, now with contextual WordPress/Squarespace links |
| Legacy modernization | No new blanket legacy-software claim; only existing website/application redesign and modernization scope retained |

Homepage agency positioning and overview service-discovery positioning remain unchanged. No keyword volumes, ranking claims, certifications, fabricated project evidence or guaranteed business outcomes.

## 3. Metadata before and after

Final title: Custom Web & Software Development | PrimeLoft Tech

Final description: PrimeLoft Tech builds custom websites, web applications and business software tailored to your needs. Explore our development services and discuss your project.

Final H1: Custom Website & Software Development Services

Canonical: https://primeloft.tech/service-engineering.html

One title, meta description, canonical and primary H1 are present in initial HTML and rendered checks. Normal indexing defaults preserved; no robots meta restrictions introduced. Local HTTP responses have no X-Robots-Tag. Public headers/redirects were not verified.

OG/Twitter titles and descriptions match the new metadata, og:url is the canonical, og:site_name is PrimeLoft Tech, og:type remains website, twitter:card remains summary_large_image. Existing branded sharing image https://primeloft.tech/images/primeloft-social-20261102.png is preserved at 1200 × 630. OG and Twitter image alternatives added: PrimeLoft Tech — websites, mobile apps and software. Favicon, manifest, brand logo source and colors unchanged.

## 4. Content changes

- Hero identifies custom software development plus responsive websites/web applications. Primary action is Discuss Your Development Project; existing project-type jump link remains.
- Existing definition now uses three short paragraphs: public website content and inquiries; browser-based accounts/tasks/data; internal business workflows and conditional integrations.
- Existing type heading now asks what the business needs to build. All seven disclosures remain: business/corporate websites; landing/campaign pages; ecommerce; SaaS/web apps; portals/booking; custom business software; website redesign/modernization.
- Portal description now explicitly includes staff alongside customers/partners. Seven repeated project actions now identify the project type.
- Existing design stage links to UI/UX design services; original four-step delivery workflow is preserved.
- Six existing FAQs retained. First answer distinguishes all three product types; cost question covers websites/software; platform names link to their actual pages; after-launch answer links to scoped maintenance/support.
- Closing heading covers website or software and uses the proposed inquiry CTA. No invented prices, universal timeline, guarantee or new section.

## 5. Structured-data changes

Original BreadcrumbList and Service/FAQ graph consolidated into one connected JSON-LD graph:

- Organization: https://primeloft.tech/#organization, PrimeLoft Tech, verified existing site and logo URL. Script id=org-schema uses the existing runtime guard to prevent a second Organization.
- WebPage: https://primeloft.tech/service-engineering.html#webpage, with canonical URL, approved title/description, inLanguage=en, existing homepage WebSite reference, breadcrumb and mainEntity Service reference.
- BreadcrumbList: Home → Services → Custom Website & Software Development, stable #breadcrumb ID.
- Service: stable #service ID; seven original serviceType entries retained; accurate description and provider reference added.
- FAQPage: already existed; retained and synchronized with all six visible answers. No new FAQ schema introduced for rich-result eligibility, and no rich-result benefit is claimed.

No prices, ratings, reviews, offers, geographic locations or unsupported claims added. JSON parses; entity counts/references and exact visible FAQ/schema text agree. External schema validators remain a manual step.

## 6. Internal links and contact verification

| Destination | Context |
|---|---|
| services.html | Existing shared services navigation/footer |
| service-design.html | UI/UX design link within the existing design stage |
| service-maintenance.html | Maintenance/support link in after-launch FAQ |
| service-wordpress.html | Existing CMS-platform FAQ |
| service-squarespace.html | Existing CMS-platform FAQ |
| contact.html?service=Custom%20Website | Hero, seven scoped project actions and closing CTA |
| index.html | Existing home navigation/footer |
| #website-types | Existing project-type exploration action |

Eight representative local HEAD checks returned 200, without restrictive X-Robots-Tag. Static audit validates other links and fragments. Contact preselection is Custom Website, the existing development option for this shared offering; no nonexistent Custom Software option was introduced and no contact-page code was changed. No inquiry or email was transmitted.

## 7. Performance comparison

Same local QA URL, Lighthouse 13.6.0, default simulated mobile preset, fresh extension-free Chrome runs. These are local static-server results, not production field/CrUX measurements. The external-font baseline used fallback behavior when the font CDN failed in this environment, so it is not an exact production-font visual comparison.

| Run | Performance | FCP | LCP | Speed Index | TBT | CLS |
|---|---:|---:|---:|---:|---:|---:|
| before | 84 | 2.75 s | 2.75 s | 7.95 s | 0.0 ms | 0.0000 |
| final | 92 | 2.59 s | 2.59 s | 3.45 s | 0.0 ms | 0.0000 |
| repeat | 92 | 2.58 s | 2.58 s | 3.50 s | 0.0 ms | 0.0000 |

H1 remains LCP in the comparable measured before/final runs. After changes LCP is 2.58–2.59 s, slightly above the 2.5 s objective. No passing field Core Web Vitals or production score is claimed. TBT is not INP; field INP was not measured.

Confirmed delivery optimizations: self-hosted existing Geist/Geist Mono/Inter families and weight ranges, with two previously tested above-fold font preloads; header/footer logo references now select existing 26,344/108,068-byte WebP variants instead of the 1,054,463-byte PNG. The original PNG remains. No raster hero exists to optimize. All original SVG markup and external script references compare unchanged; original animation rules remain with only contextual-link styling appended. No unnecessary dependency, CSS purge or wholesale asynchronous styling introduced.

## 8. QA results

Passed:

- python tools/audit_site.py, python tools/build_release.py, python tools/audit_site.py dist, git diff --check.
- Source/rendered metadata counts and canonical; no restrictive robots meta; Organization, WebPage, Service, BreadcrumbList and existing FAQ entity checks.
- Six FAQ/schema questions and answers match exactly; all linked files and srcset assets exist.
- 320, 390, 768, 1024, 1440px: one H1, no horizontal document overflow, no clipped headings or CTA labels, no broken loaded images.
- Project disclosure toggle, FAQ toggle, mobile menu with Contact Us, Escape close, visible keyboard focus, sampled hover and scroll-reveal behavior, reduced-motion visibility.
- Contact query preselects Custom Website after initialization.
- No uncaught JavaScript exceptions in browser checks.
- Eight local HEAD routes return 200; no local X-Robots-Tag restriction.
- Mobile/desktop hero screenshots reviewed. SVG markup and script references compare identical; homepage, overview, contact and other service source content compare unchanged, normalizing Windows/Git line endings.

No unresolved local test failures. Not run: live HTTP/header/redirect verification (production URL inaccessible via browsing tool), external schema validators, actual email delivery, physical iOS Safari/Android, full screen-reader/contrast certification, field performance. This task does not claim those checks passed.

## 9. Files modified

- service-engineering.html — metadata, H1, concise definitions, project/action labels, contextual links, connected schema, existing local font/logo delivery.
- css/web-development.css — scoped blue/underlined contextual links in process/FAQ paragraphs; query version incremented on target page only.
- sitemap.xml — only service-engineering.html lastmod updated to 2026-11-03.
- tools/qa-results/engineering-seo-results.json — measured tests/evidence.
- tools/qa-results/engineering-seo-report.md — this report.

No filename or service URL changes. No new media assets, altered original artwork, shared CSS/JS changes or other-page rewrites.

## 10. Remaining issues

- LCP remains just above 2.5 s in local simulations; existing render-blocking CSS/font/rendering costs warrant production-waterfall inspection before more aggressive changes.
- Production status, redirects, response headers, compression/cache behavior, external validators and field Core Web Vitals remain unverified.
- Contact dropdown still names the combined development offering Custom Website. It works and was preserved; adding a distinct software choice would be a separate contact-flow change.
- Previous UI/UX publishing was blocked by GitHub authentication; this SEO task neither retried publication nor modified that preserved local commit.

## 11. Post-deployment verification (after user approval)

1. Review this branch. Do not automatically commit, merge or deploy.
2. After approved publication, View Source and inspect the rendered document for exact metadata, single canonical/H1, entity IDs, provider references and static links.
3. Verify live HTTP 200, intended HTTPS/domain redirects, no noindex/X-Robots-Tag restriction and unchanged sitemap/robots access. Source allows indexing; live response still needs verification.
4. In Search Console URL Inspection, inspect https://primeloft.tech/service-engineering.html, Test Live URL, and review crawl/index permission. Compare declared and Google-selected canonical after recrawl. Do not blindly repeat an existing pending indexing request.
5. Review sitemap fetch status and the updated engineering lastmod; do not create a new sitemap for this page.
6. Use Schema.org Validator and Google's current Rich Results Test where applicable. Confirm entity accuracy and FAQ text without expecting a FAQ rich-result feature.
7. Cold-load mobile/desktop production DevTools: confirm local fonts, appropriate logo WebP, no duplicate large PNG request, and inspect actual LCP candidate/subparts and host compression/caching. Repeat comparable PageSpeed tests; distinguish lab results from 75th-percentile field data.
8. Check five responsive widths and real iOS Safari/Android. Test project disclosures, FAQ, navigation, contextual links, focus, motion/reduced motion and long CTA labels.
9. Follow the development CTA and confirm Custom Website selection. Test real submission/delivery only with separate authorization.
10. Monitor non-branded custom software/web application inquiries and Search Console queries filtered to the engineering URL over subsequent weeks; no ranking gains are assumed.

Evidence: scratch/engineering-seo-before.html, scratch/engineering-seo-qa.json, scratch/engineering-seo-{390,1440}.png, scratch/lighthouse-engineering-{before,final,repeat}.report.{json,html}, and tools/qa-results/engineering-seo-results.json. The unused intermediate lighthouse-engineering-after artifact is not included in the comparison.
