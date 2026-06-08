#!/usr/bin/env python3
"""Inserta bloque Open Graph + Twitter Card en todos los HTML de QuimCalc."""

import re
import os

BASE = '/home/user/QuimCalc/quimcalc'

SKIP_FILES = {'google3c7b1d6ccb347f0a.html', 'offline.html'}
SKIP_DIRS  = {'admin', 'js', 'node_modules', 'assets', 'descargas'}


def og_type(filepath):
    if '/blog/posts/' in filepath:
        return 'article'
    return 'website'


def og_url(filepath):
    rel = filepath.replace(BASE + '/', '')
    if rel == 'index.html':
        return 'https://quimcalc.com/'
    return 'https://quimcalc.com/' + rel


def build_og_block(title, description, url, otype, indent='  '):
    lines = [
        f'<meta property="og:type" content="{otype}">',
        f'<meta property="og:url" content="{url}">',
        f'<meta property="og:title" content="{title}">',
        f'<meta property="og:description" content="{description}">',
        f'<meta property="og:image" content="https://quimcalc.com/assets/android-chrome-512x512.png">',
        f'<meta name="twitter:card" content="summary_large_image">',
        f'<meta name="twitter:title" content="{title}">',
        f'<meta name="twitter:description" content="{description}">',
        f'<meta name="twitter:image" content="https://quimcalc.com/assets/android-chrome-512x512.png">',
    ]
    return '\n'.join(indent + l for l in lines)


def process(filepath):
    with open(filepath, encoding='utf-8') as f:
        content = f.read()

    if 'property="og:title"' in content:
        return None  # ya tiene OG

    title_m = re.search(r'<title>(.*?)</title>', content, re.DOTALL)
    desc_m  = re.search(r'<meta name="description" content="([^"]*)"', content)

    if not title_m or not desc_m:
        return None

    title       = title_m.group(1).strip()
    description = desc_m.group(1).strip()
    url         = og_url(filepath)
    otype       = og_type(filepath)

    og_block = build_og_block(title, description, url, otype)

    # detectar indentación de la línea del meta description para igualarla
    desc_line = desc_m.group(0)
    line_match = re.search(r'^( *)<meta name="description"', content, re.MULTILINE)
    indent = line_match.group(1) if line_match else '  '
    og_block = build_og_block(title, description, url, otype, indent=indent)

    # insertar DESPUÉS de la línea completa del meta description
    def replacer(m):
        return m.group(0) + '\n' + og_block

    new_content = re.sub(
        r'<meta name="description" content="[^"]*">',
        replacer,
        content,
        count=1
    )

    if new_content == content:
        return None

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)

    return filepath.replace(BASE, '')


updated = []
for dirpath, dirnames, filenames in os.walk(BASE):
    dirnames[:] = [d for d in sorted(dirnames) if d not in SKIP_DIRS]
    for fn in sorted(filenames):
        if not fn.endswith('.html') or fn in SKIP_FILES:
            continue
        result = process(os.path.join(dirpath, fn))
        if result:
            updated.append(result)

print(f"Archivos actualizados: {len(updated)}")
for p in updated:
    print(f"  {p}")
