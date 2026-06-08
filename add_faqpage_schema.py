#!/usr/bin/env python3
"""Genera JSON-LD FAQPage a partir de las secciones .faq-item visibles.

Espeja el contenido on-page (requisito de Google) y lo inserta después
del bloque ld+json principal de cada archivo. No toca el HTML visible.
"""

import re
import os
import json
import html as html_lib

BASE = '/home/user/QuimCalc/quimcalc'
DATE_MODIFIED = '2026-06-08'

# Carpetas con páginas que pueden tener FAQ
TARGET_DIRS = [
    os.path.join(BASE, 'herramientas'),
    os.path.join(BASE, 'blog', 'posts'),
]

FAQ_ITEM_RE = re.compile(
    r'<div class="faq-item">(.*?)</div>', re.DOTALL
)
H3_RE = re.compile(r'<h3[^>]*>(.*?)</h3>', re.DOTALL)
TAG_RE = re.compile(r'<[^>]+>')
WS_RE = re.compile(r'\s+')


def limpiar_texto(fragmento):
    """Quita etiquetas, decodifica entidades y colapsa espacios."""
    txt = TAG_RE.sub(' ', fragmento)
    txt = html_lib.unescape(txt)
    txt = WS_RE.sub(' ', txt).strip()
    return txt


def extraer_faqs(content):
    faqs = []
    for bloque in FAQ_ITEM_RE.findall(content):
        h3 = H3_RE.search(bloque)
        if not h3:
            continue
        pregunta = limpiar_texto(h3.group(1))
        # la respuesta es todo lo que sigue al </h3>
        resto = H3_RE.sub('', bloque, count=1)
        respuesta = limpiar_texto(resto)
        if pregunta and respuesta:
            faqs.append((pregunta, respuesta))
    return faqs


def construir_faqpage(faqs, indent='  '):
    obj = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "dateModified": DATE_MODIFIED,
        "mainEntity": [
            {
                "@type": "Question",
                "name": p,
                "acceptedAnswer": {"@type": "Answer", "text": r}
            }
            for p, r in faqs
        ]
    }
    # JSON con sangría de 2, luego reindentamos al nivel del head
    raw = json.dumps(obj, ensure_ascii=False, indent=2)
    raw = '\n'.join(indent + line for line in raw.split('\n'))
    return f'{indent}<script type="application/ld+json">\n{raw}\n{indent}</script>'


def procesar(filepath):
    with open(filepath, encoding='utf-8') as f:
        content = f.read()

    if '"FAQPage"' in content or 'FAQPage' in content:
        return ('skip-ya-tiene', filepath)

    faqs = extraer_faqs(content)
    if not faqs:
        return ('skip-sin-faq', filepath)

    # localizar el primer bloque ld+json para insertar justo después
    m = re.search(
        r'[ \t]*<script type="application/ld\+json">.*?</script>',
        content, re.DOTALL
    )
    if not m:
        return ('skip-sin-ldjson', filepath)

    faqpage = construir_faqpage(faqs)
    insert_at = m.end()
    new_content = content[:insert_at] + '\n' + faqpage + content[insert_at:]

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    return ('ok', filepath, len(faqs))


resultados = {'ok': [], 'skip-sin-faq': [], 'skip-ya-tiene': [], 'skip-sin-ldjson': []}
for d in TARGET_DIRS:
    for fn in sorted(os.listdir(d)):
        if not fn.endswith('.html') or fn == 'PLANTILLA-post.html':
            continue
        res = procesar(os.path.join(d, fn))
        resultados[res[0]].append(res)

print(f"== FAQPage agregado a {len(resultados['ok'])} archivos ==")
for r in resultados['ok']:
    print(f"  [{r[2]} FAQs] {r[1].replace(BASE, '')}")
print(f"\nSin sección FAQ ({len(resultados['skip-sin-faq'])}):")
for r in resultados['skip-sin-faq']:
    print(f"  {r[1].replace(BASE, '')}")
if resultados['skip-ya-tiene']:
    print(f"\nYa tenían FAQPage ({len(resultados['skip-ya-tiene'])}): "
          + ', '.join(r[1].replace(BASE, '') for r in resultados['skip-ya-tiene']))
