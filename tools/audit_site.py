"""Static QA: internal links, anchors, image alternatives, IDs and structured data."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
from collections import Counter
import json, re, subprocess, sys
ROOT=Path(sys.argv[1]).resolve() if len(sys.argv)>1 else Path(__file__).resolve().parent.parent
class Page(HTMLParser):
    def __init__(self): super().__init__(); self.tags=[]
    def handle_starttag(self, tag, attrs): self.tags.append((tag,dict(attrs)))
pages={}; errors=[]
for path in ROOT.glob('*.html'):
    parser=Page(); parser.feed(path.read_text(encoding='utf-8')); pages[path.name]=parser.tags
for name,tags in pages.items():
    for key,count in Counter(a['id'] for _,a in tags if 'id' in a).items():
        if count>1: errors.append(f'{name}: duplicate ID {key}')
    for tag,a in tags:
        if tag=='img' and 'alt' not in a: errors.append(f'{name}: image missing alt')
        for key in ['src','href']:
            url=a.get(key,''); parsed=urlsplit(url)
            if not url or parsed.scheme or parsed.netloc: continue
            target=ROOT / (unquote(parsed.path) or name)
            if not target.exists(): errors.append(f'{name}: missing {url}')
            elif parsed.fragment and target.name in pages:
                ids={x.get('id') for _,x in pages[target.name]}
                if unquote(parsed.fragment) not in ids: errors.append(f'{name}: missing anchor {url}')
    for block in re.findall(r'<script type="application/ld\+json">(.*?)</script>',(ROOT/name).read_text(encoding='utf-8'),re.S):
        try: json.loads(block)
        except ValueError: errors.append(f'{name}: invalid JSON-LD')
for path in (ROOT/'js').rglob('*.js'):
    result=subprocess.run(['node','--check',str(path)],capture_output=True,text=True)
    if result.returncode: errors.append(f'{path.relative_to(ROOT)}: JavaScript syntax failure')
print('\n'.join(errors) if errors else f'PASS: {len(pages)} HTML files, local links, anchors, image alt attributes, unique IDs, JSON-LD and JavaScript syntax.')
raise SystemExit(bool(errors))
