# Service catalog and site consistency

`service-catalog.json` records the 13 public service names, section IDs and page URLs.
Run `python tools/sync_service_catalog.py` after editing shared names. Add new service
pages, overview cards, Guide questions and Contact query aliases when adding a service.
Run `node tools/tests/site-consistency-browser.test.mjs` to check parity between the
catalog, navigation, footer, overview cards, structured data, Contact and Guide.

Browser QA uses the local server and dedicated Chrome port described in
`tools/tests/README.md`. It intercepts external requests and does not submit live
forms. The existing form suite also covers the revised service names and consent.

`node tools/render_favicons.mjs` rasterizes the existing root ARC SVG using that
local server and Chrome instance, and writes PNG variants and the ICO fallback.
The root PNG is 512×512; the ICO contains a 256×256 PNG entry.

`css/site-fixes.css` is loaded after existing page styles. The cookie card uses a
div with a labelled region role, so global page-section padding does not affect it.
Analytics remains unloaded until consent. The footer's Cookie settings link
allows consent to be changed; browser storage failures and Global Privacy Control
are covered by browser QA.
