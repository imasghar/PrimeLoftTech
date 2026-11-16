# Form QA tests

These tests do not send real form submissions. Unit tests stub fetch; browser tests intercept all external requests. Use Node.js 22 or newer. No additional package is needed.

## Unit tests

    node --test tools/tests/web3forms-unit.test.mjs

Anchor scrolling and section URL regression coverage:

    node --test tools/tests/inertia-scroll-unit.test.mjs

## Blog happy path and responsive SEO checks

With the local server and dedicated Chrome below running:

    node tools/tests/blog-browser.test.mjs

This suite clicks Home > Blog > cost guide > table of contents > hiring guide >
SEO service > Blog > hiring guide > Contact. It also checks all three blog pages
at 320, 390, 768 and 1440 pixels, images, canonical URLs, article schema,
navigation, mobile menu, section targets and internal links. All external
traffic is intercepted. Results are in `tools/qa-results/blog-browser.json`.

## Chrome integration/security/accessibility checks

Start the local server in one terminal:

    python tools/qa_server.py

Start a dedicated headless Chrome from PowerShell (do not use a personal profile):

    Start-Process -FilePath 'C:\Program Files\Google\Chrome\Application\chrome.exe' -ArgumentList '--headless=new','--disable-gpu','--no-sandbox','--remote-debugging-port=9346','--user-data-dir=G:\imasghar\PrimeLoftTech\scratch\web3forms-qa-chrome' -WindowStyle Hidden

Run:

    node tools/tests/web3forms-browser.test.mjs

The browser suite requires localhost:8767 and the dedicated debug port 9346. It refuses a public QA_BASE_URL. It adds an isolated newsletter fixture only inside the test browser, because the published site has no newsletter form. It exercises a real 20-second timeout; expect the suite to take roughly 30-45 seconds.

Results are written to tools/qa-results/web3forms-browser-tests.json. Tests and QA evidence are excluded from public releases. Browser tests inspect synthetic reserved-domain data only and do not dump form payloads or the configured public key.

These are client-side tests, not a penetration test of Web3Forms or evidence of inbox delivery. A separate authorized real submission and account-side checks are needed for those.

## Site consistency, footer and consent checks

With the same local server and dedicated Chrome instance running:

    node tools/tests/site-consistency-browser.test.mjs

This suite checks all active pages at four widths, service labels and icons,
the five lower-footer hover states, Contact alignment, new service metadata and
FAQs, legal sidebars, the ARC favicon, and consent behavior including disabled
storage and Global Privacy Control. Run browser suites sequentially because
they share the dedicated Chrome tab. Results are in
`tools/qa-results/site-consistency-browser.json`.
