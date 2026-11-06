# Form QA tests

These tests do not send real form submissions. Unit tests stub fetch; browser tests intercept all external requests. Use Node.js 22 or newer. No additional package is needed.

## Unit tests

    node --test tools/tests/web3forms-unit.test.mjs

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
