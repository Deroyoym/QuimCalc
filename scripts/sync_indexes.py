#!/usr/bin/env python3
"""
sync_indexes.py — QuimCalc
=============================
Regenera automáticamente los índices del sitio a partir de
data/posts.json y data/tools.json.

Qué actualiza:
  - blog/index.html   → lista de posts + contadores de categorías en sidebar
  - sitemap.xml       → todas las URLs con fecha de hoy
  - sw.js             → PRECACHE_URLS + incrementa versión de caché
  - hreflang          → <link rel="alternate"> en cada par español ↔ inglés
  - en/index.html     → lista de herramientas traducidas (si existe)

Uso:
  python scripts/sync_indexes.py

Cuando agregar una entrada:
  • Post  → agregar objeto a data/posts.json y ejecutar este script
  • Tool  → agregar objeto a data/tools.json y ejecutar este script
"""

import json
import re
import os
import sys
from datetime import date
from collections import Counter

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import i18n  # noqa: E402  (pares español ↔ inglés)

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = os.path.join(ROOT, 'quimcalc')
DATA = os.path.join(ROOT, 'data')


def load(filename):
    with open(os.path.join(DATA, filename), encoding='utf-8') as f:
        return json.load(f)


def read(path):
    with open(path, encoding='utf-8') as f:
        return f.read()


def write(path, content):
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)


# ── 1. blog/index.html ────────────────────────────────────────────
def build_post_card(p):
    cat_style = f' style="color: {p["category_color"]};"' if p.get('category_color') else ''
    return f"""\
            <article>
              <a href="posts/{p['slug']}.html" class="post-card" data-categoria="{p['category']}">
                <img src="../blog/posts/{p['image']}" alt="{p['image_alt']}" class="post-card__imagen" loading="lazy" width="600" height="200">
                <span class="post-card__categoria"{cat_style}>{p['category']}</span>
                <h2 class="post-card__titulo">{p['title']}</h2>
                <p class="post-card__resumen">
                  {p['description']}
                </p>
                <div class="post-card__meta">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  <span>{p['date']}</span>
                  <span>·</span>
                  <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  <span>{p['minutes']} min lectura</span>
                </div>
                <span class="post-card__leer-mas">Leer artículo →</span>
              </a>
            </article>"""


def build_sidebar_categorias(posts, categorias):
    """Genera la lista de categorías del sidebar desde data/categorias.json.
       Incluye una opción 'Todas' para resetear el filtro (ver js/blog-filtro.js)."""
    counts = Counter(p['category'] for p in posts)
    items = [
        '              <li>\n'
        f'                <a href="#" data-categoria="">Todas <span class="count">{len(posts)}</span></a>\n'
        '              </li>'
    ]
    for c in categorias:
        nombre = c['nombre']
        items.append(
            '              <li>\n'
            f'                <a href="#" data-categoria="{nombre}">{nombre} '
            f'<span class="count">{counts.get(nombre, 0)}</span></a>\n'
            '              </li>'
        )
    return (
        '<ul class="categorias-lista" role="list">\n'
        + '\n'.join(items)
        + '\n            </ul>'
    )


def update_blog_index(posts, categorias):
    path = os.path.join(SITE, 'blog', 'index.html')
    content = read(path)

    # Reemplazar bloque de posts entre marcadores
    cards = '\n\n'.join(build_post_card(p) for p in posts)
    new_lista = (
        '          <div class="lista-posts">\n\n'
        + cards
        + '\n\n          </div>'
    )
    content = re.sub(
        # [ \t]* incluye la sangría previa: si no, cada corrida le suma 10 espacios
        r'[ \t]*<div class="lista-posts">.*?</div>(?=\s*</section>)',
        new_lista,
        content,
        flags=re.DOTALL,
    )

    # Regenerar la lista de categorías del sidebar desde categorias.json
    content = re.sub(
        r'<ul class="categorias-lista".*?</ul>',
        build_sidebar_categorias(posts, categorias),
        content,
        flags=re.DOTALL,
    )

    write(path, content)
    print(f'✓ blog/index.html  — {len(posts)} posts, sidebar de categorías regenerado')


def update_cms(categorias):
    """Regenera el <select> de categorías y el mapa COLORES del CMS
       (admin/index.html) desde data/categorias.json — fuente única."""
    path = os.path.join(SITE, 'admin', 'index.html')
    content = read(path)

    # <option> del selector de categoría
    options = '\n'.join(
        f'              <option value="{c["nombre"]}" data-color="{c["color"]}">{c["nombre"]}</option>'
        for c in categorias
    )
    content = re.sub(
        r'<select id="f-categoria">.*?</select>',
        '<select id="f-categoria">\n' + options + '\n            </select>',
        content,
        flags=re.DOTALL,
    )

    # Objeto JS COLORES
    colores = 'const COLORES = {\n' + '\n'.join(
        f"  '{c['nombre']}': '{c['color']}'," for c in categorias
    ) + '\n};'
    content = re.sub(r'const COLORES = \{.*?\};', colores, content, flags=re.DOTALL)

    write(path, content)
    print(f'✓ admin/index.html — {len(categorias)} categorías (select + COLORES)')


# ── 2. sitemap.xml ────────────────────────────────────────────────
def update_sitemap(posts, tools):
    today = date.today().strftime('%Y-%m-%d')

    # Cada URL lleva su propio lastmod. Los posts usan su date_sort
    # (fecha de publicación) en vez de "hoy" uniforme.
    static = [
        ('https://quimcalc.com/', '1.0', 'weekly', today),
        ('https://quimcalc.com/blog/index.html', '0.8', 'weekly', today),
        ('https://quimcalc.com/sobre-el-proyecto.html', '0.5', 'monthly', today),
        ('https://quimcalc.com/contacto.html', '0.3', 'monthly', today),
        ('https://quimcalc.com/politicas-de-privacidad.html', '0.3', 'monthly', today),
        ('https://quimcalc.com/terminos-de-uso.html', '0.3', 'monthly', today),
    ]

    tool_urls = [
        (f'https://quimcalc.com/herramientas/{t["slug"]}.html', '0.9', 'monthly', today)
        for t in tools
    ]

    post_urls = [
        (f'https://quimcalc.com/blog/posts/{p["slug"]}.html', '0.7', 'monthly',
         p.get('date_sort') or today)
        for p in posts
    ]

    # Versiones en inglés existentes, con la misma prioridad que su par
    pares = i18n.pares()
    url_en = {i18n.url(es): i18n.url(en) for es, en in pares.items()}
    en_urls = [(url_en[loc], pr, fq, lm) for loc, pr, fq, lm in static + tool_urls + post_urls
               if loc in url_en]

    all_urls = static + tool_urls + post_urls + en_urls

    # Cada par lleva sus alternates (es, en, x-default → español)
    alt_de = {}
    for es_u, en_u in url_en.items():
        bloque = (f'    <xhtml:link rel="alternate" hreflang="es" href="{es_u}"/>\n'
                  f'    <xhtml:link rel="alternate" hreflang="en" href="{en_u}"/>\n'
                  f'    <xhtml:link rel="alternate" hreflang="x-default" href="{es_u}"/>\n')
        alt_de[es_u] = alt_de[en_u] = bloque

    entries = '\n'.join(
        f'  <url>\n'
        f'    <loc>{loc}</loc>\n'
        + alt_de.get(loc, '') +
        f'    <lastmod>{lastmod}</lastmod>\n'
        f'    <changefreq>{freq}</changefreq>\n'
        f'    <priority>{priority}</priority>\n'
        f'  </url>'
        for loc, priority, freq, lastmod in all_urls
    )

    sitemap = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" '
        'xmlns:xhtml="http://www.w3.org/1999/xhtml">\n'
        + entries
        + '\n</urlset>\n'
    )

    write(os.path.join(SITE, 'sitemap.xml'), sitemap)
    print(f'✓ sitemap.xml      — {len(all_urls)} URLs, lastmod={today}')


# ── 2b. hreflang en cada par español ↔ inglés ──────────────────────
HREF_RE = re.compile(r'\n?[ \t]*<!-- hreflang -->.*?<!-- /hreflang -->', re.S)


def update_hreflang():
    pares = i18n.pares()
    rutas = {}
    for es, en in pares.items():
        rutas[es] = rutas[en] = (es, en)
    n = 0
    for dirpath, _, files in os.walk(SITE):
        if 'admin' in dirpath.split(os.sep) or 'node_modules' in dirpath.split(os.sep):
            continue
        for fn in files:
            if not fn.endswith('.html'):
                continue
            f = os.path.join(dirpath, fn)
            ruta = os.path.relpath(f, SITE).replace(os.sep, '/')
            t = read(f)
            nuevo = HREF_RE.sub('', t)
            if ruta in rutas:
                es, en = rutas[ruta]
                bloque = ('\n  <!-- hreflang -->\n'
                          f'  <link rel="alternate" hreflang="es" href="{i18n.url(es)}">\n'
                          f'  <link rel="alternate" hreflang="en" href="{i18n.url(en)}">\n'
                          f'  <link rel="alternate" hreflang="x-default" href="{i18n.url(es)}">\n'
                          '  <!-- /hreflang -->')
                m = re.search(r'<link rel="canonical"[^>]*>', nuevo)
                if not m:
                    print(f'  ⚠ {ruta}: sin canonical, no se agregó hreflang')
                    continue
                nuevo = nuevo[:m.end()] + bloque + nuevo[m.end():]
            if nuevo != t:
                write(f, nuevo)
                n += 1
    print(f'✓ hreflang         — {len(pares)} pares, {n} archivo(s) actualizados')


# ── 2c. Home en inglés: lista de herramientas traducidas ───────────
def update_en_home(tools):
    path = os.path.join(SITE, 'en', 'index.html')
    if not os.path.exists(path):
        return
    content = read(path)
    items = []
    for t in tools:
        en = t.get('en') or {}
        if not en.get('slug') or not os.path.exists(os.path.join(SITE, 'en', 'tools', en['slug'] + '.html')):
            continue
        items.append(
            f'          <a href="tools/{en["slug"]}.html" class="indice-item" role="listitem">\n'
            f'            <div class="indice-item__icono" aria-hidden="true">\n'
            f'              {t.get("icon_svg", "")}\n'
            f'            </div>\n'
            f'            <span class="indice-item__texto">{en.get("title", en["slug"])}</span>\n'
            f'            <span class="indice-item__flecha" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg></span>\n'
            f'          </a>')
    bloque = '<!-- EN_TOOLS -->\n' + '\n'.join(items) + '\n          <!-- /EN_TOOLS -->'
    content = re.sub(r'<!-- EN_TOOLS -->.*?<!-- /EN_TOOLS -->', bloque, content, flags=re.S)
    write(path, content)
    print(f'✓ en/index.html    — {len(items)} herramienta(s) en inglés')


# ── 3. sw.js ──────────────────────────────────────────────────────
def bump_sw_version(content):
    def _bump(m):
        major, minor = m.group(1), m.group(2)
        return f"'v{major}.{str(int(minor) + 1).zfill(3)}'"
    return re.sub(r"'v(\d+)\.(\d+)'", _bump, content, count=1)


def update_sw(tools):
    path = os.path.join(SITE, 'sw.js')
    content = read(path)

    content = bump_sw_version(content)

    static_urls = [
        "  '/'",
        "  '/index.html'",
        "  '/styles.css'",
        "  '/assets/site.webmanifest'",
        "  '/js/entrada-decimal.js'",
    ]

    tool_htmls = [
        f"  '/herramientas/{t['slug']}.html'"
        for t in tools if t.get('precache')
    ]

    tool_js = [
        "  '/herramientas/js/{}'".format(t['js'])
        for t in tools if t.get('precache') and t.get('js')
    ]

    icons = [
        "  '/assets/android-chrome-192x192.png'",
        "  '/assets/android-chrome-512x512.png'",
        "  '/offline.html'",
    ]

    all_lines = static_urls + tool_htmls + tool_js + icons
    new_precache = 'const PRECACHE_URLS = [\n' + ',\n'.join(all_lines) + ',\n];'

    content = re.sub(
        r'const PRECACHE_URLS = \[.*?\];',
        new_precache,
        content,
        flags=re.DOTALL,
    )

    write(path, content)
    print('✓ sw.js            — PRECACHE actualizado, versión incrementada')


# ── Main ──────────────────────────────────────────────────────────
def main():
    posts = load('posts.json')
    tools = load('tools.json')
    categorias = load('categorias.json')

    # Ordenar posts por fecha descendente
    posts.sort(key=lambda p: p.get('date_sort', ''), reverse=True)

    update_blog_index(posts, categorias)
    update_cms(categorias)
    update_sitemap(posts, tools)
    update_hreflang()
    update_en_home(tools)
    update_sw(tools)

    print('\nListo. Todos los índices sincronizados.')


if __name__ == '__main__':
    main()
