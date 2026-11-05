# About-page CSS build

The About page uses css/about.bundle.min.css. Sources and cascade order are recorded in about-sources.json. All original stylesheets remain editable and are used unchanged by other pages.

After editing a source stylesheet, run from the repository root:

    npm ci --prefix tools/css-build
    node tools/build_about_css.mjs

The builder uses pinned clean-css 5.3.3 at level 0 (formatting only), without rebasing URLs or removing rules. It updates the generated bundle and its source-hash query string in about.html. Refresh the local preview after rebuilding; editing a source file alone does not update an already generated bundle.

python tools/build_release.py checks the source hash and rebuilds automatically when needed. A fresh checkout needs npm ci only when the generated bundle is stale. No Node dependency is shipped to website visitors; tools/ is excluded from hosting.

## Homepage CSS build

The homepage uses `css/home.bundle.min.css`. Its seven original stylesheets and cascade order are recorded in `home-sources.json`. After editing one of those stylesheets, run:

    node tools/build_home_css.mjs

This uses the same pinned clean-css dependency and level 0 formatting-only settings as the About bundle. It retains every rule and animation, updates the homepage source-hash URL, and is checked automatically by `python tools/build_release.py`. Original files remain in use on other pages.
