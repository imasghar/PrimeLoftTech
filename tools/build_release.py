"""Create an allowlisted static release. Run from the repository root."""
from pathlib import Path
import shutil
ROOT = Path(__file__).resolve().parent.parent
DEST = ROOT / 'dist'
# Never publish the repository itself, scratch data, tools or local configuration.
DEST.mkdir(exist_ok=True)
for p in ROOT.glob('*.html'):
    shutil.copy2(p, DEST / p.name)
for name in ['_headers', 'CNAME', 'robots.txt', 'sitemap.xml', 'site.webmanifest', 'favicon.svg', 'favicon.ico', 'favicon.png']:
    shutil.copy2(ROOT / name, DEST / name)
for folder in ['css', 'js', 'images', 'animations']:
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
