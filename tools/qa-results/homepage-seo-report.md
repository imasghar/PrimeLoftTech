# Homepage SEO implementation report

Date: 3 November 2026 (Asia/Karachi). Local implementation only; no deployment, commit, push, or indexing request.

## A. Initial SEO audit

| Finding | Severity | Outcome |
|---|---|---|
| Existing title and description did not match the approved strategy | High | Fixed in initial HTML and sharing metadata |
| Generic H1 and introduction did not identify agency positioning | Medium | Recommended H1 implemented; primary keyword used naturally in visible introduction |
| Site-name/schema descriptions used inconsistent digital-commerce positioning and an HTML entity inside JSON | Medium | Unified WebSite name and descriptions; valid JSON characters |
| Organization logo differed from visible brand logo | Medium | Uses existing Primeloft Arc Logo.png; dimensions verified locally |
| Booking CTA opened contact.html, with no booking interface | Medium | Replaced with Discuss Your Project; closing copy no longer promises a scheduled call |
| Software offering was not explicit in engineering link labels | Medium | Clarified existing engineering links; URLs preserved |
| Hero PNG is 2,035,917 bytes; brand logo PNG is 1,054,463 bytes | Medium | Outstanding compression/responsive delivery opportunity; original artwork preserved |
| Canonical, robots.txt, sitemap, static service links and one H1 already correct | Pass | Preserved |
| Organization injection already checks org-schema before adding an entity | Pass | Preserved; rendered test confirms no duplicates |
| Public URLs, redirects and headers could not be fetched | Unverified | Browser web fetch failed; direct network requests denied by environment sockets |

User-provided Search Console baseline: homepage indexed, nine indexed URLs, eleven exclusions, and services.html live inspection passed with indexing already requested. These are supplied facts, not newly retrieved results. No exclusion was automatically treated as an error, and no indexing request was repeated.

## B. Files modified in this task

- index.html: metadata, H1 and introduction, CTA copy, descriptive service anchors, footer description and existing JSON-LD.
- tools/qa-results/homepage-seo-report.md: this report, evidence and manual follow-up.

All other working-tree modifications existed before this task and were preserved, including service FAQ changes, shared styling and sitemap.xml. Local scripts/results/screenshots are in excluded scratch/. The allowlisted build produced ignored dist/. No CSS, JavaScript, service pages, URLs, legal indexing rules, logos, animations or dependencies were changed by this task.

## C. Final homepage metadata

Title: Web & Software Development Agency | PrimeLoft Tech

Description: PrimeLoft Tech builds custom websites, mobile apps and business software. Explore WordPress, Squarespace, SEO and digital development services.

Canonical: https://primeloft.tech/

Robots: no restrictive meta directive; normal indexing/following defaults. robots.txt allows all user agents and references the existing sitemap. Local _headers contains no X-Robots-Tag. Live HTTP headers remain unverified.

| Sharing property | Value |
|---|---|
| og:type | website |
| og:title / twitter:title | Web & Software Development Agency | PrimeLoft Tech |
| og:description / twitter:description | Approved meta description above |
| og:url | https://primeloft.tech/ |
| og:site_name | PrimeLoft Tech |
| og:image / og:image:secure_url / twitter:image | https://primeloft.tech/images/primeloft-social-20261102.png |
| og:image:width / height / type | 1200 / 630 / image/png |
| og:image:alt / twitter:image:alt | PrimeLoft Tech — websites, mobile apps and custom software |
| twitter:card | summary_large_image |

Existing sharing image visually reviewed: correct branding, readable text and contrast; 124,422 bytes, 1200 × 630. It retains its earlier general tagline, which is compatible with the offering. No image was generated. Public delivery must be verified after deployment.

## D. Structured data

Existing WebSite and Organization updated in-place with stable IDs, linked publisher, accurate descriptions and the visible brand logo. Existing ItemList retained and its navigation descriptions clarified. Existing LinkedIn/Facebook/WhatsApp references and contact details were retained; remote identity/profile verification remains outstanding. No new profiles, locations, reviews, ratings, awards, FAQPage or LocalBusiness were added.

Updated entities:

```json
[
  {
    "@type": "WebSite",
    "@id": "https://primeloft.tech/#website",
    "url": "https://primeloft.tech/",
    "name": "PrimeLoft Tech",
    "alternateName": [
      "PrimeLoft"
    ],
    "description": "Web and software development agency building websites, mobile apps and custom business software.",
    "publisher": {
      "@id": "https://primeloft.tech/#organization"
    }
  },
  {
    "@type": "Organization",
    "@id": "https://primeloft.tech/#organization",
    "name": "PrimeLoft Tech",
    "url": "https://primeloft.tech/",
    "logo": {
      "@type": "ImageObject",
      "url": "https://primeloft.tech/images/Primeloft%20Arc%20Logo.png",
      "width": 1254,
      "height": 1254
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+923359873132",
      "contactType": "customer service",
      "email": "contact@primeloft.tech",
      "availableLanguage": [
        "English"
      ]
    },
    "sameAs": [
      "https://www.linkedin.com/company/primloft/",
      "https://www.facebook.com/share/1UUv6vvFdu/",
      "https://wa.me/923359873132"
    ],
    "description": "PrimeLoft Tech provides custom website and software development, mobile apps, UI/UX design, SEO, automation and technical support."
  }
]
```

JSON-LD parses locally. After JavaScript execution there is exactly one Organization and one WebSite. Schema.org Validator and Google's Rich Results Test were not run against the unpublished code; manual checks are listed below. Organization/WebSite data does not guarantee a rich result.

## E. Keyword implementation

- Exact approved title uses &; visible hero introduction uses “web and software development agency”.
- H1: “Websites, Apps & Software Built Around Your Business”.
- Visible introduction names startups, growing businesses, websites, mobile apps and custom software.
- Existing FAQ answers explain audience fit, business problems and service scope.
- Navigation/footer identify websites and software, mobile app development, WordPress, Squarespace and SEO.
- Homepage stays broad; individual service-page targets were not changed. No hidden text, keyword meta tag, geography stuffing or invented demand/ranking data.

## F. Internal linking

Checked existing HTML destinations: services.html, service-engineering.html (websites and software), service-mobile-app-development.html, service-wordpress.html, service-squarespace.html, service-design.html, service-seo.html, service-ai.html, service-cloud.html, service-quality.html, service-maintenance.html and contact.html. All exist locally; no broken local links or anchors in the 20-page audit. These ten service destinations plus services overview are all in the existing sitemap.

service-strategy.html is included in the sitemap and remains unchanged; it is not a direct homepage service-menu destination. No service URL was invented or redirected. Live HTTP status/redirect chains were not verified.

## G. Technical SEO

- Metadata and content are available in static HTML; main navigation is ordinary anchor links.
- JavaScript preserves an existing canonical and skips duplicate Organization injection.
- One static canonical and one rendered canonical point to the preferred HTTPS non-www root.
- Sitemap parses as XML: 18 unique canonical-domain URLs; homepage and important service destinations included. Legacy primeloft.html redirect URL excluded.
- Legal-page indexing behavior unchanged. No sitemap replacement or indexing request.
- Domain is configured in CNAME as primeloft.tech. Local QA server returns 200 for homepage/assets. Public HTTP/HTTPS/www redirect behavior, live 200 status, X-Robots-Tag and deployment headers are unverified because network testing failed. This is not evidence the site is offline or deindexed.
- Existing correct favicons, manifest, language, viewport, skip link and document landmarks retained.

## H. Performance

Unthrottled local Chromium observations, roughly 1.7 seconds after each navigation, not Lighthouse, field data or a before/after improvement claim:

| Viewport | LCP observation | CLS observation | Resource body bytes recorded |
|---|---|---|---|
| 390px | 72 ms | 0 | 3,474,492 |
| 1440px | 88 ms | 0 | 3,495,116 |

Local cached/loopback timings do not predict production performance or 75th-percentile Core Web Vitals. INP was not measured. Resource-byte totals reflect available Resource Timing entries and the observation window, not a complete cold-load waterfall. Real-user LCP/INP/CLS remain unknown.

Hero remains high-priority and is not lazy loaded; explicit dimensions reserve its aspect ratio. Below-the-fold media keeps existing lazy loading. Main scripts are modules; external fonts use display=swap. Motion uses the existing CSS/WAAPI/pointer controllers; no active GSAP/Three.js dependencies were removed. No extra preload or dependency was introduced.

Remaining performance priorities: responsive compressed versions of the 2 MB hero and 1 MB logo, measured under mobile throttling and reviewed for visual quality; evaluate font/CSS blocking using a real waterfall. No production performance score is claimed.

## I. Quality assurance

Passed:

- python tools/audit_site.py: 20 HTML files, internal resources/fragments, image alternatives, unique IDs, JSON-LD and JavaScript syntax.
- python tools/build_release.py and python tools/audit_site.py dist: local release generated and audited.
- git diff --check.
- Browser at 320/390/768/1024/1440: one H1, no horizontal overflow, no clipped headings, loaded hero and no broken loaded images.
- Rendered exact title; single title/description/canonical; no duplicate entities or JavaScript exceptions.
- FAQ opens/closes; mobile menu opens and Escape closes it; keyboard Tab exposes visible focus; reduced motion leaves reveal content visible.
- Desktop/mobile hero screenshots visually reviewed; existing palette, typography, art and layout components retained. Existing script tags unchanged.

Failed/blocked external checks: public-site and profile retrieval (tool fetch failure and denied network sockets). No local implementation test failed.

Not run: Lighthouse (not installed), PageSpeed Insights/CrUX, field INP, external schema validators, real Safari/iOS/Android testing, full screen-reader/contrast certification, real contact submission or email delivery. Local responsive/keyboard checks are not a full accessibility conformance audit. Small label text, touch-target spacing and full-page contrast still warrant a dedicated audit.

Evidence: scratch/homepage-seo-qa.json, scratch/homepage-seo-network.json, scratch/homepage-seo-390.png and scratch/homepage-seo-1440.png. Original source snapshot: scratch/seo-before.html.

## J. Post-deployment checklist (manual; do not deploy automatically)

1. Open https://primeloft.tech/ and View Source. Verify the exact approved title/description, one canonical, sharing tags and initial JSON-LD. Check rendered DOM again for duplicates. Inspect HTTP headers for unintended noindex.
2. Check http://primeloft.tech/, https://www.primeloft.tech/ and /index.html. Confirm intended permanent redirects or equivalent canonical behavior without loops or unnecessary chains, HTTPS certificate validity and final 200 response.
3. In Search Console URL Inspection, inspect https://primeloft.tech/ and run Test Live URL. Confirm crawling/indexing allowed. Do not repeat the already submitted services.html request merely because it is still pending.
4. In the indexed homepage inspection, compare user-declared and Google-selected canonical. Recheck after recrawl because live inspection alone does not establish Google's indexed canonical selection.
5. Open Search Console > Sitemaps. Check https://primeloft.tech/sitemap.xml fetch status and discovered URLs. Review exclusion reasons individually rather than treating all exclusions as errors. Do not resubmit a successful sitemap without cause.
6. Run https://validator.schema.org/ and https://search.google.com/test/rich-results using the new homepage URL or pasted unpublished source. Verify entity accuracy as well as syntax. Confirm the brand logo and existing LinkedIn/Facebook profile URLs load and belong to PrimeLoft.
7. Run https://pagespeed.web.dev/ for mobile and desktop. Separate Lighthouse lab results from field data. Assess 75th-percentile LCP ≤2.5 s, INP ≤200 ms and CLS ≤0.1 where enough real-user data exists. Repeat on real iOS Safari and Android Chrome.
8. Inspect social previews and image retrieval. Test one real contact submission only when authorized, and confirm delivery.
9. Record today's Search Console baseline. Over the following 4–8 weeks, compare 28-day periods by homepage, query and country. Filter out PrimeLoft brand variants and owner test queries; track non-branded impressions/clicks and qualified inquiries. Do not claim growth before sufficient data is available.

References: Google site-name guidance https://developers.google.com/search/docs/appearance/site-names ; Core Web Vitals definitions https://web.dev/articles/vitals .
