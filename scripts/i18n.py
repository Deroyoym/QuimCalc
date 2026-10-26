#!/usr/bin/env python3
# ============================================================
# i18n.py — Pares de páginas español ↔ inglés
# ------------------------------------------------------------
# Fuente única de qué página en español tiene versión en inglés.
# La usan build_layout.py (selector de idioma en el header) y
# sync_indexes.py (hreflang, sitemap, home en inglés).
#
# Estructura de URLs:
#   ES  /index.html                       ↔ EN  /en/index.html
#   ES  /politicas-de-privacidad.html     ↔ EN  /en/privacy.html
#   ES  /herramientas/<slug>.html         ↔ EN  /en/tools/<en.slug>.html
#   ES  /blog/posts/<slug>.html           ↔ EN  /en/blog/<en.slug>.html
#
# En data/tools.json y data/posts.json, la versión inglesa se declara
# con un objeto opcional:  "en": {"slug": "...", "title": "..."}
# Un par solo cuenta como activo si el archivo inglés EXISTE: así se
# puede declarar el slug antes de traducir sin publicar enlaces rotos.
# ============================================================
import json
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = os.path.join(ROOT, 'quimcalc')
DATA = os.path.join(ROOT, 'data')
DOMINIO = 'https://quimcalc.com'

# Páginas fijas con traducción (ruta ES → ruta EN, relativas a quimcalc/)
FIJAS = {
    'index.html': 'en/index.html',
    'politicas-de-privacidad.html': 'en/privacy.html',
}


def _load(nombre):
    with open(os.path.join(DATA, nombre), encoding='utf-8') as f:
        return json.load(f)


def pares():
    """Devuelve {ruta_es: ruta_en} solo para traducciones existentes."""
    out = {}
    for es, en in FIJAS.items():
        out[es] = en
    for t in _load('tools.json'):
        if t.get('en', {}).get('slug'):
            out[f"herramientas/{t['slug']}.html"] = f"en/tools/{t['en']['slug']}.html"
    for p in _load('posts.json'):
        if p.get('en', {}).get('slug'):
            out[f"blog/posts/{p['slug']}.html"] = f"en/blog/{p['en']['slug']}.html"
    return {es: en for es, en in out.items()
            if os.path.exists(os.path.join(SITE, en)) and os.path.exists(os.path.join(SITE, es))}


def contraparte(ruta):
    """Para una ruta (ES o EN, relativa a quimcalc/) devuelve la del otro idioma o None."""
    p = pares()
    if ruta in p:
        return p[ruta]
    inv = {en: es for es, en in p.items()}
    return inv.get(ruta)


def es_ingles(ruta):
    return ruta.replace(os.sep, '/').startswith('en/')


def url(ruta):
    """URL absoluta canónica de una ruta del sitio (index.html → raíz del directorio)."""
    if ruta == 'index.html':
        return DOMINIO + '/'
    if ruta == 'en/index.html':
        return DOMINIO + '/en/'
    return f'{DOMINIO}/{ruta}'
