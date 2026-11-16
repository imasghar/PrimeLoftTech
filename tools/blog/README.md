# Blog publishing

The original Drive drafts, including editor-only instructions, are in `content/`.
They are excluded from the public site by the existing `tools` exclusion.

Install the renderer with `python -m pip install -r tools/blog/requirements.txt`
(or into `scratch/blog-deps` with `--target`), then run
`python tools/blog/build.py` from the repository root. This generates `/blog/`
and one directory with `index.html` per article, using shared site navigation
and footer from the homepage. GitHub Pages serves these as directory URLs.

Keep canonical URLs, internal links, the listing and sitemap in sync when adding
articles. Editor instructions are never rendered. The source Markdown remains
unchanged; only Markdown escaping, image paths and existing service links are
normalized during rendering. The source's accidental `3093` prefix is outside
the public article body and is not used as the article title.

After a verified live deployment, update Drive's blog log with actual publication
dates and request Search Console indexing. Do not mark a local build as live.
