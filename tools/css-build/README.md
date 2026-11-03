# About-page CSS build

The About page uses css/about.bundle.min.css. Sources and cascade order are recorded in about-sources.json. All original stylesheets remain editable and are used unchanged by other pages.

After editing a source stylesheet, run from the repository root:

    npm ci --prefix tools/css-build
    node tools/build_about_css.mjs

The builder uses pinned clean-css 5.3.3 at level 0 (formatting only), without rebasing URLs or removing rules. It updates the generated bundle and its source-hash query string in about.html. Refresh the local preview after rebuilding; editing a source file alone does not update an already generated bundle.

python tools/build_release.py checks the source hash and rebuilds automatically when needed. A fresh checkout needs npm ci only when the generated bundle is stale. No Node dependency is shipped to website visitors; tools/ is excluded from hosting.
