# PrimeLoft site tooling

The HTML pages in the repo root are **generated**. Edit the sources here, then rebuild.

```bash
npm run build             # regenerate every HTML page + sitemap.xml from tools/site
npm run build:animations  # regenerate the generated Lottie JSON files in /animations
npm run serve             # local preview at http://127.0.0.1:8765
```

## tools/site (page generator)

| File | What to edit there |
| --- | --- |
| `data/site.mjs` | Company details, contact info, navigation, technology marquee, testimonials, home FAQ, process, "why" list. |
| `data/services.mjs` | The service catalogue. One object per service drives the mega menu, services overview, the service detail page, footer links, sitemap and Service/FAQ structured data. |
| `pages.mjs` | Page builders (home, services, service detail, about, contact, legal pages, 404). |
| `layout.mjs` | Shared head, header + mega menu, footer, cookie consent, schema.org helpers, reusable blocks (CTA band, FAQ, service card). |
| `build.mjs` | Writes the pages to the repo root and regenerates `sitemap.xml`. |

Adding a service: append an object to `SERVICES` in `data/services.mjs` (copy an existing one), add a Lottie scene with the same `key`, run both builds.

Cache busting: bump `cssVersion` / `jsVersion` in `data/site.mjs` after changing `css/style.css` or `js/main.js`.

## tools/lottie (animation generator)

Lottie JSON is generated programmatically with `lib.mjs` (shapes, keyframes, easing, cards, bars, pop/float/draw-on helpers) in light and dark palettes that mirror the CSS tokens.

- `scenes-a.mjs`: hero, web-development, seo, about
- `scenes-b.mjs`: design, wordpress, squarespace
- `scenes-core.mjs`: 404 · `scenes-quality.mjs`: quality
- `build.mjs`: registry of scene keys → `animations/<key>-light.json` and `-dark.json`

Hand-crafted animations that are **not** generated: `engineering`, `strategy`, `ai`, `cloud`, `mobile-app` and the `contact-*` icons.

Pages reference an animation with `<div data-lottie="<key>">`; `js/main.js` lazy-loads it, swaps light/dark on theme change and pauses it off-screen.
