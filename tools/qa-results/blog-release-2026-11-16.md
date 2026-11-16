# Blog release QA — 16 November 2026

Local verification passed:

- 33 unit tests: form transport, provider responses, timeout handling, section
  fragment history, invalid links and header scroll offsets.
- Blog happy path: Home → Blog → cost guide → contents → hiring guide → SEO
  service → Blog → hiring guide → Contact.
- All three blog pages at 320, 390, 768 and 1440 pixels: images, navigation,
  mobile menu, single H1, canonical URL, structured data and section targets.
- 17 form browser test groups, including success, provider/network failures,
  timeout, retry, duplicate submission prevention, consent and Guide flows.
  All 29 submissions were intercepted locally; no production inquiries sent.
- 17 site regression groups covering service navigation, consent, existing
  pages, legal pages, mobile layouts, icons, images and Guide behavior.
- Static audit passed for 25 HTML pages, internal links, anchors, image alt
  attributes, unique IDs, JSON-LD and JavaScript syntax.

Issues resolved during this pass:

- In-page smooth scrolling now preserves a shareable section URL fragment.
- Blog same-site links use root-relative paths for working local previews.
- Browser tests resolve the current Guide module from the application import,
  avoiding a second module instance after cache-version changes.

Machine-readable browser reports are adjacent to this file. Actual provider
delivery and Google indexing are outside these local test results.
