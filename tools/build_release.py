"""Create an allowlisted static release. Run from the repository root."""
from pathlib import Path
import shutil
import hashlib
import json
import subprocess
ROOT = Path(__file__).resolve().parent.parent
# Regenerate the About bundle only when one of its source stylesheets changes.
css_sources = json.loads((ROOT / 'tools/css-build/about-sources.json').read_text(encoding='utf-8'))
css_source = '\n'.join((ROOT / name).read_bytes().decode('utf-8') for name in css_sources)
css_hash = hashlib.sha256(css_source.encode('utf-8')).hexdigest()[:12]
css_bundle = ROOT / 'css/about.bundle.min.css'
if not css_bundle.exists() or f'source hash {css_hash}.' not in css_bundle.read_text(encoding='utf-8').split('\n', 1)[0]:
    if not (ROOT / 'tools/css-build/node_modules/clean-css').is_dir():
        raise SystemExit('About CSS changed: run npm ci --prefix tools/css-build, then rebuild.')
    subprocess.run(['node', str(ROOT / 'tools/build_about_css.mjs')], cwd=ROOT, check=True)

DEST = ROOT / 'dist'
# Never publish the repository itself, scratch data, tools or local configuration.
DEST.mkdir(exist_ok=True)
for p in ROOT.glob('*.html'):
    shutil.copy2(p, DEST / p.name)
for name in ['_headers', 'CNAME', 'robots.txt', 'sitemap.xml', 'site.webmanifest', 'favicon.svg', 'favicon.ico', 'favicon.png']:
    shutil.copy2(ROOT / name, DEST / name)
for folder in ['css', 'js', 'images', 'animations', 'fonts']:
    for source in (ROOT / folder).rglob('*'):
        if not source.is_file() or source.suffix.lower() in ['.md', '.map']:
            continue
        target = DEST / source.relative_to(ROOT)
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(source, target)
# Remove stale output files only inside the verified generated directory.
assert DEST.resolve() == (ROOT / 'dist').resolve()
for target in DEST.rglob('*'):
    if target.is_file() and not (ROOT / target.relative_to(DEST)).exists():
        target.unlink()
print(f'Release files prepared in {DEST}. Deploy this directory, not the repository root.')
