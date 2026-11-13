"""Regenerate shared service labels from tools/site/service-catalog.json.

Run after changing catalog names or URLs; write new service page/card content
separately. Browser QA checks the catalog against cards, forms and Guide choices.
"""
from pathlib import Path
import html, json, re
ROOT = Path(__file__).resolve().parent.parent
catalog = json.loads((ROOT/'tools/site/service-catalog.json').read_text(encoding='utf-8'))
for path in ROOT.glob('*.html'):
    text = path.read_text(encoding='utf-8')
    for entry in catalog:
        url, name = re.escape(entry['url']), html.escape(entry['name'])
        text = re.sub(r'(<a href="'+url+r'" class="mega-item"[^>]*>.*?<span class="mtitle">).*?(</span>)', lambda m: m[1]+name+m[2], text, flags=re.S)
        text = re.sub(r'(<h2 id="s-'+re.escape(entry['id'])+r'-title" class="pl-h2">).*?(</h2>)',lambda m:m[1]+name+m[2],text)
    text = re.sub(r'(<div class="pl-footer__services">\s*<h3>Services</h3>\s*<ul>).*?(</ul>)',lambda m:m[1]+''.join(f'<li><a href="{e["url"]}">{html.escape(e["name"])}</a></li>' for e in catalog)+m[2],text,flags=re.S)
    if path.name == 'contact.html':
        text=re.sub(r'(<select id="contact-service"[^>]*>).*?(</select>)',lambda m:m[1]+'<option value="" disabled selected>Choose a service</option>'+''.join(f'<option value="{html.escape(e["name"])}">{html.escape(e["name"])}</option>' for e in catalog)+'<option value="Other / Consultation">Other / Consultation</option>'+m[2],text,flags=re.S)
    if path.name == 'services.html':
        text=re.sub(r'(<nav class="pl-tags pl-tags--center".*?>).*?(</nav>)',lambda m:m[1]+''.join(f'<a class="pl-tag" href="#s-{e["id"]}">{html.escape(e["name"])}</a>' for e in catalog)+m[2],text,flags=re.S)
        def schema(match):
            data=json.loads(match[1])
            for node in data.get('@graph',[]):
                if node.get('@type')=='ItemList':
                    node['numberOfItems']=len(catalog)
                    node['itemListElement']=[{'@type':'ListItem','position':i,'name':e['name'],'url':'https://primeloft.tech/'+e['url']} for i,e in enumerate(catalog,1)]
            return '<script type="application/ld+json">'+json.dumps(data,indent=2)+'</script>'
        text=re.sub(r'<script type="application/ld\+json">(.*?)</script>',schema,text,flags=re.S)
    if text!=path.read_text(encoding='utf-8'): path.write_text(text,encoding='utf-8',newline='\n')
print(f'Synchronized {len(catalog)} static service labels.')
