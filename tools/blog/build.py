"""Render the supplied Drive drafts as crawlable static blog pages."""
from pathlib import Path
import html
import hashlib
import json
import re
import sys

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / 'scratch/blog-deps'))
import markdown

SITE = 'https://primeloft.tech'
DATE = '2026-11-16'
BLOG_CSS_VERSION = hashlib.sha256((ROOT / 'css/blog.css').read_text(encoding='utf-8').encode()).hexdigest()[:12]
POSTS = [
    dict(source='cost', slug='small-business-website-cost-2026', category='Pricing guides',
         image='blog-01-cost-hero.webp',
         alt='Small business owner reviewing a website design and cost chart on a laptop',
         summary='Compare website costs, understand what a quote includes, and plan for hosting, maintenance and ownership.'),
    dict(source='agency', slug='choose-web-design-agency-dera-ghazi-khan', category='Hiring guides',
         image='blog-02-agency-hero.webp',
         alt='Founders shaking hands in a web design agency office, with website designs on a laptop',
         summary='Ten questions to ask before hiring a web agency, from live work and timelines to support and ownership.'),
]

def plain(value):
    return re.sub(r'\\([\\`*{}_\[\]()#+.!$|:>\-])', r'\1', value).strip()

def esc(value):
    return html.escape(str(value), quote=True)

home = (ROOT / 'index.html').read_text(encoding='utf-8')
head = home.split('<head>', 1)[1].split('</head>', 1)[0]
head = re.sub(r'\s*<script type="application/ld\+json".*?</script>', '', head, flags=re.S)
head = re.sub(r'\s*<script[^>]*home-motion[^>]*></script>', '', head)
header = re.search(r'<header class="pl-header">.*?</header>', home, re.S)[0]
header = header.replace('navlink active', 'navlink')
header = header.replace('href="/blog/" class="navlink"', 'href="/blog/" class="navlink active" aria-current="page"')
footer = re.search(r'<footer class="pl-footer">.*?</footer>', home, re.S)[0]

def root_paths(text):
    # Shared header/footer assets were authored for root-level HTML pages.
    text = re.sub(r'((?:href|src)=["\'])(?![a-z]+:|/|#)([^"\']+)', r'\1/\2', text)
    return re.sub(r'(srcset=")([^"]+)', lambda m: m[1] + ', '.join('/' + item.strip() if not item.strip().startswith('/') else item.strip() for item in m[2].split(',')), text)

def page(title, description, path, main, graph, image=None, alt=None):
    h = re.sub(r'<title>.*?</title>', '<title>' + esc(title) + '</title>', head)
    h = re.sub(r'(<meta name="description" content=")[^"]*', lambda m: m[1] + esc(description), h)
    h = re.sub(r'(<link rel="canonical" href=")[^"]*', lambda m: m[1] + SITE + path, h)
    for name, value in [('og:title', title), ('twitter:title', title), ('og:description', description), ('twitter:description', description), ('og:url', SITE + path)]:
        h = re.sub(r'(<meta (?:property|name)="' + name + r'" content=")[^"]*', lambda m: m[1] + esc(value), h)
    if image:
        h = h.replace('content="website"', 'content="article"')
        h = h.replace(SITE + '/images/primeloft-social-20261103.png', SITE + '/images/blog/' + image)
        h = h.replace('content="1200"', 'content="2352"').replace('content="630"', 'content="1008"')
        h = h.replace('content="image/png"', 'content="image/webp"').replace('content="PrimeLoft Tech logo"', 'content="' + esc(alt) + '"')
        h += f'\n  <meta property="article:published_time" content="{DATE}T09:00:00+05:00">\n  <meta property="article:author" content="PrimeLoft Tech">\n'
    h += f'\n  <link rel="stylesheet" href="/css/blog.css?v={BLOG_CSS_VERSION}">\n'
    graph.insert(0, {'@type': 'Organization', '@id': SITE + '/#organization', 'name': 'PrimeLoft Tech', 'url': SITE + '/', 'logo': {'@type': 'ImageObject', 'url': SITE + '/images/primeloft-arc-logo-512.webp'}})
    h += '<script type="application/ld+json" id="org-schema">' + json.dumps({'@context': 'https://schema.org', '@graph': graph}, ensure_ascii=False).replace('</', '<\\/') + '</script>\n'
    return '<!DOCTYPE html>\n<html lang="en" data-theme="light">\n<head>' + root_paths(h) + '</head>\n<body class="pl pl-page-blog">\n<a class="pl-skip" href="#main-content">Skip to content</a>\n' + root_paths(header) + '\n<div class="pl-top-space" aria-hidden="true"></div>\n<main id="main-content">' + main + '</main>\n' + root_paths(footer) + '\n</body>\n</html>\n'

def crumbs(title=None, path=None):
    items = [{'@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': SITE + '/'}, {'@type': 'ListItem', 'position': 2, 'name': 'Blog', 'item': SITE + '/blog/'}]
    if title:
        items.append({'@type': 'ListItem', 'position': 3, 'name': title, 'item': SITE + path})
    return {'@type': 'BreadcrumbList', 'itemListElement': items}

for post in POSTS:
    draft = (ROOT / 'tools/blog/content' / (post['source'] + '.md')).read_text(encoding='utf-8')
    post['meta_title'] = plain(re.search(r'\*\*Meta title:\*\* (.*)', draft)[1])
    post['description'] = plain(re.search(r'\*\*Meta description:\*\* (.*)', draft)[1])
    body = re.split(r'\n---\s*\n', draft, maxsplit=1)[1].strip()
    body = re.sub(r'^!\[.*?\]\(.*?\)\s*', '', body)
    post['title'] = re.search(r'^# (.+)', body)[1]
    body = re.sub(r'^# .+\n', '', body, count=1).strip()
    # Fix old service destinations to the dedicated pages already on this site.
    body = re.sub(r'(\[(?:E-commerce website development|e-commerce development)\])\(https://primeloft.tech/service-engineering.html\)', r'\1(https://primeloft.tech/service-ecommerce.html)', body)
    body = body.replace('[API integration](https://primeloft.tech/service-engineering.html)', '[API integration](https://primeloft.tech/service-integrations.html)')
    for other in POSTS:
        body = body.replace(SITE + '/blog/' + other['slug'] + ')', SITE + '/blog/' + other['slug'] + '/)')
    # Preserve the exact draft prose; link unlinked service phrases once.
    service_links = [('WordPress development', 'wordpress'), ('Squarespace development', 'squarespace'), ('mobile app development', 'mobile-app-development'), ('AI automation', 'ai'), ('custom software development', 'engineering'), ('API Integration', 'integrations'), ('Product Strategy', 'strategy'), ('Cloud & DevOps', 'cloud'), ('QA & Testing', 'quality'), ('Maintenance & Support', 'maintenance'), ('E-commerce Development', 'ecommerce')]
    for label, slug in service_links:
        body = re.sub(r'(?<![\w\[])' + re.escape(label) + r'(?![\w\]])', '[' + label + '](https://primeloft.tech/service-' + slug + '.html)', body, count=1)
    md = markdown.Markdown(extensions=['tables', 'toc', 'sane_lists'])
    rendered = md.convert(body)
    # Same-site links work on local previews as well as the production domain.
    rendered = rendered.replace('href="' + SITE + '/', 'href="/')
    def image_tag(match):
        alt, filename = html.unescape(match[1]), match[2]
        return '<figure class="blog-inline-image"><img src="/images/blog/' + filename + '" alt="' + esc(alt) + '" width="1600" height="1600" loading="lazy" decoding="async"></figure>'
    rendered = re.sub(r'<p><img alt="([^"]*)" src="(blog-[^"]+\.webp)"\s*/?></p>', image_tag, rendered)
    rendered = rendered.replace('<table>', '<div class="blog-table" role="region" aria-label="Website cost comparison" tabindex="0"><table>').replace('</table>', '</table></div>')
    post['minutes'] = max(1, round(len(re.findall(r'\b\w+\b', body)) / 220))
    post['rendered'] = rendered
    post['toc'] = '<ul>' + ''.join('<li><a href="#' + esc(t['id']) + '">' + t['name'] + '</a></li>' for t in md.toc_tokens if t['level'] == 2) + '</ul>'

def card(post, number):
    url = '/blog/' + post['slug'] + '/'
    return f'<article class="blog-card"><a class="blog-card-image" href="{url}" tabindex="-1" aria-hidden="true"><img src="/images/blog/{post["image"]}" alt="" width="2352" height="1008" loading="lazy" decoding="async"></a><div class="blog-card-copy"><div class="blog-meta"><span>{esc(post["category"])}</span><span>{post["minutes"]} min read</span></div><h2><a href="{url}">{esc(post["title"])}</a></h2><p>{esc(post["summary"])}</p><div class="blog-card-bottom"><time datetime="{DATE}">16 November 2026</time><a href="{url}" aria-label="Read {esc(post["title"])}">Read guide <span aria-hidden="true">&#8599;</span></a></div></div></article>'

for i, post in enumerate(POSTS):
    path = '/blog/' + post['slug'] + '/'
    other = POSTS[1-i]
    main = '<div class="blog-shell"><nav class="blog-breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><a href="/blog/">Blog</a><span aria-hidden="true">/</span><span>' + esc(post['category']) + '</span></nav>'
    main += f'<div class="blog-article-head"><span class="blog-kicker">{esc(post["category"])}</span><h1>{esc(post["title"])}</h1><div class="blog-byline"><span>By PrimeLoft Tech</span><time datetime="{DATE}">16 November 2026</time><span>{post["minutes"]} min read</span></div></div>'
    main += '<figure class="blog-hero-image"><img src="/images/blog/' + post['image'] + '" alt="' + esc(post['alt']) + '" width="2352" height="1008" fetchpriority="high" decoding="async"></figure>'
    main += '<div class="blog-reading-layout"><aside class="blog-toc"><details open><summary>On this page</summary><nav aria-label="Article contents">' + post['toc'] + '</nav></details></aside><article class="blog-prose">' + post['rendered'] + '</article></div>'
    main += '<section class="blog-related" aria-labelledby="relatedTitle"><div><span class="blog-kicker">Keep reading</span><h2 id="relatedTitle">The next step for your website</h2><p>' + esc(other['summary']) + '</p><a class="blog-related-link" href="/blog/' + other['slug'] + '/">' + esc(other['title']) + ' <span aria-hidden="true">&#8599;</span></a></div><a href="/blog/" class="pl-btn pl-btn--dark">All articles</a></section></div>'
    article = {'@type': 'BlogPosting', '@id': SITE + path + '#article', 'headline': post['title'], 'description': post['description'], 'image': {'@type': 'ImageObject', 'url': SITE + '/images/blog/' + post['image'], 'width': 2352, 'height': 1008}, 'datePublished': DATE + 'T09:00:00+05:00', 'dateModified': DATE + 'T09:00:00+05:00', 'author': {'@type': 'Organization', '@id': SITE + '/#organization', 'name': 'PrimeLoft Tech', 'url': SITE + '/about.html'}, 'publisher': {'@id': SITE + '/#organization'}, 'mainEntityOfPage': {'@type': 'WebPage', '@id': SITE + path}, 'articleSection': post['category'], 'inLanguage': 'en', 'isPartOf': {'@id': SITE + '/blog/#blog'}}
    dest = ROOT / 'blog' / post['slug'] / 'index.html'
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(page(post['meta_title'], post['description'], path, main, [article, crumbs(post['title'], path)], post['image'], post['alt']), encoding='utf-8')

main = '<div class="blog-shell"><nav class="blog-breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><span aria-current="page">Blog</span></nav><div class="blog-index-head"><span class="blog-kicker">The PrimeLoft blog</span><h1>Make better decisions<br>about your next website.</h1><p>Practical guides to website costs, choosing a development team and keeping ownership of what you build.</p></div><section class="blog-list" aria-labelledby="latestTitle"><div class="blog-list-heading"><h2 id="latestTitle">Latest guides</h2><span>02 articles</span></div><div class="blog-cards">' + ''.join(card(p, i) for i,p in enumerate(POSTS)) + '</div></section></div>'
blog = {'@type': 'Blog', '@id': SITE + '/blog/#blog', 'url': SITE + '/blog/', 'name': 'PrimeLoft Tech Blog', 'description': 'Website pricing and agency hiring guides for startups and small businesses.', 'publisher': {'@id': SITE + '/#organization'}, 'blogPost': [{'@type': 'BlogPosting', '@id': SITE + '/blog/' + p['slug'] + '/#article', 'url': SITE + '/blog/' + p['slug'] + '/', 'headline': p['title']} for p in POSTS]}
(ROOT / 'blog/index.html').write_text(page('Website & Web Design Guides | PrimeLoft Tech Blog', blog['description'], '/blog/', main, [blog, crumbs()]), encoding='utf-8')
print('Built blog index and two complete articles.')
