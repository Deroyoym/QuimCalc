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

Uso:
  python scripts/sync_indexes.py

Cuando agregar una entrada:
  • Post  → agregar objeto a data/posts.json y ejecutar este script
  • Tool  → agregar objeto a data/tools.json y ejecutar este script
"""

import json
import re
import os
from datetime import date
from collections import Counter

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
              <a href="posts/{p['slug']}.html" class="post-card">
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


def update_blog_index(posts):
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
        r'<div class="lista-posts">.*?</div>(?=\s*</section>)',
        new_lista,
        content,
        flags=re.DOTALL,
    )

    # Actualizar contadores de categorías en sidebar
    counts = Counter(p['category'] for p in posts)
    for cat, count in counts.items():
        content = re.sub(
            rf'({re.escape(cat)}\s*<span class="count">)\d+(</span>)',
            rf'\g<1>{count}\g<2>',
            content,
        )

    write(path, content)
    print(f'✓ blog/index.html  — {len(posts)} posts, categorías actualizadas')


# ── 2. sitemap.xml ────────────────────────────────────────────────
def update_sitemap(posts, tools):
    today = date.today().strftime('%Y-%m-%d')

    static = [
        ('https://quimcalc.com/', '1.0', 'weekly'),
        ('https://quimcalc.com/blog/index.html', '0.8', 'weekly'),
        ('https://quimcalc.com/sobre-el-proyecto.html', '0.5', 'monthly'),
        ('https://quimcalc.com/contacto.html', '0.3', 'monthly'),
        ('https://quimcalc.com/politicas-de-privacidad.html', '0.3', 'monthly'),
        ('https://quimcalc.com/terminos-de-uso.html', '0.3', 'monthly'),
    ]

    tool_urls = [
        (f'https://quimcalc.com/herramientas/{t["slug"]}.html', '0.9', 'monthly')
        for t in tools
    ]

    post_urls = [
        (f'https://quimcalc.com/blog/posts/{p["slug"]}.html', '0.7', 'monthly')
        for p in posts
    ]

    all_urls = static + tool_urls + post_urls

    entries = '\n'.join(
        f'  <url>\n'
        f'    <loc>{loc}</loc>\n'
        f'    <lastmod>{today}</lastmod>\n'
        f'    <changefreq>{freq}</changefreq>\n'
        f'    <priority>{priority}</priority>\n'
        f'  </url>'
        for loc, priority, freq in all_urls
    )

    sitemap = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + entries
        + '\n</urlset>\n'
    )

    write(os.path.join(SITE, 'sitemap.xml'), sitemap)
    print(f'✓ sitemap.xml      — {len(all_urls)} URLs, lastmod={today}')


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

    # Ordenar posts por fecha descendente
    posts.sort(key=lambda p: p.get('date_sort', ''), reverse=True)

    update_blog_index(posts)
    update_sitemap(posts, tools)
    update_sw(tools)

    print('\nListo. Todos los índices sincronizados.')


if __name__ == '__main__':
    main()
