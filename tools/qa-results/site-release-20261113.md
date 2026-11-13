# Site consistency release audit — 13 November 2026

Publishing target: existing GitHub Pages source, `main` at repository root,
custom domain `primeloft.tech`. The source was verified through the GitHub API.
Internal tools, scratch files, generated output and QA reports remain excluded
from Pages through `_config.yml`.

## Checks completed

- Source and generated release: 22 HTML files; internal resource and fragment
  links, image alternatives, unique IDs, JSON-LD parsing and JavaScript syntax.
- 27 form transport unit tests.
- 17 form browser test groups, including validation, failures, real timeout,
  duplicate-submit prevention, successful resets, Guide journey and consent.
  All 29 simulated submissions were intercepted; no live inquiry was sent.
- Site browser suite checks service catalog parity, all 13 dropdown icons,
  Guide launcher behavior, cookie controls and analytics gating, hero contrast,
  repeated Services loads, Contact alignment and SEO service/budget preselection.
- Every active page checked at 320, 390, 768 and 1440 pixels for overflow;
  loaded local images and uncaught JavaScript exceptions checked.
- All five lower-footer links compared with a service link under forced hover:
  blue color, underline, arrow mask, opacity and transform match.
- E-commerce and API Integration pages checked for six scope sections, three
  use cases, delivery steps, eight working FAQs, unique metadata and matching
  Service/WebPage/BreadcrumbList structured data.
- Terms, Privacy and Cookie Policy sidebars checked for sticky desktop layout,
  mobile layout, collapse/expand, valid section links and active-section state.
- Cookie controls checked with rejected/accepted consent, withdrawal, blocked
  browser storage and Global Privacy Control.
- ARC PNG dimensions and refreshed icon URL checked. PNG/ICO and touch/manifest
  icons were rasterized from the existing ARC SVG.
- Desktop/mobile screenshots reviewed for cookie card, Contact, new service
  pages and Terms. Residual Contact reveal transform was found and corrected.
- `git diff --check` passed.

## Scope and limits

No fabricated rankings, client results, prices or delivery times were added.
The one-hour inquiry response promise and Native Tech name were confirmed by
the owner. Working days/hours were not supplied and have not been invented.
The Terms cover payment, refunds, ownership, liability and termination and defer
project-specific commitments to the written agreement.

Automated browser checks use Chromium, local content and intercepted external
requests. They do not verify real email delivery, provider account settings or
physical-device Safari behavior. Post-publish checks are recorded separately.
