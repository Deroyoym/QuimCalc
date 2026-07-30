#!/usr/bin/env python3
# ============================================================
# build_layout.py — Inyecta header y footer canónicos
# ------------------------------------------------------------
# El <header class="header"> y el <footer class="footer"> son
# idénticos en todo el sitio salvo por (a) el prefijo de ruta
# (según la profundidad de la página) y (b) el link `activo`
# (según la sección). Este script los regenera desde una única
# definición, evitando la duplicación a mano en ~48 archivos.
#
# Uso:
#   python scripts/build_layout.py           # dry-run (muestra diff)
#   python scripts/build_layout.py --write    # escribe los cambios
#
# Excluidos: admin/ (fuera del deploy) y offline.html (header y
# footer reducidos, sin nav).
# ============================================================
import os
import re
import sys
import difflib

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = os.path.join(ROOT, 'quimcalc')


def rel(from_dir, target):
    """Ruta relativa desde el directorio de la página hasta un archivo del sitio."""
    return os.path.relpath(os.path.join(SITE, target), from_dir).replace(os.sep, '/')


def build_header(file_abs):
    d = os.path.dirname(file_abs)
    rel_site = os.path.relpath(file_abs, SITE).replace(os.sep, '/')

    is_root_index = (rel_site == 'index.html')
    in_herramientas = rel_site.startswith('herramientas/')
    in_blog = rel_site == 'blog/index.html' or rel_site.startswith('blog/posts/')

    logo     = rel(d, 'index.html')
    # En el index raíz, "Herramientas" apunta al ancla local de la misma página.
    herr     = '#herramientas' if is_root_index else rel(d, 'index.html') + '#herramientas'
    blog     = rel(d, 'blog/index.html')
    sobre    = rel(d, 'sobre-el-proyecto.html')
    contacto = rel(d, 'contacto.html')

    a_herr  = ' class="activo"' if in_herramientas else ''
    a_blog  = ' class="activo"' if in_blog else ''
    a_sobre = ' class="activo"' if rel_site == 'sobre-el-proyecto.html' else ''
    a_cont  = ' class="activo"' if rel_site == 'contacto.html' else ''

    return (
        '  <header class="header">\n'
        '    <div class="contenedor">\n'
        '      <div class="header__inner">\n'
        f'        <a href="{logo}" class="header__logo">Quim<span>Calc</span></a>\n'
        '        <nav class="header__nav" aria-label="Navegación principal">\n'
        f'          <a href="{herr}"{a_herr}>Herramientas</a>\n'
        f'          <a href="{blog}"{a_blog}>Blog</a>\n'
        f'          <a href="{sobre}"{a_sobre}>Sobre el proyecto</a>\n'
        f'          <a href="{contacto}"{a_cont}>Contacto</a>\n'
        '        </nav>\n'
        '      </div>\n'
        '    </div>\n'
        '  </header>'
    )


def build_footer(file_abs):
    d = os.path.dirname(file_abs)
    sobre = rel(d, 'sobre-el-proyecto.html')
    priv  = rel(d, 'politicas-de-privacidad.html')
    term  = rel(d, 'terminos-de-uso.html')

    return (
        '  <footer class="footer">\n'
        '    <div class="contenedor">\n'
        '      <div class="footer__inner">\n'
        '        <p class="footer__texto">© 2026 QuimCalc — Herramientas para laboratorio químico.</p>\n'
        '        <nav class="footer__links" aria-label="Links del pie de página">\n'
        f'          <a href="{sobre}">Sobre el proyecto</a>\n'
        f'          <a href="{priv}">Privacidad</a>\n'
        f'          <a href="{term}">Términos de uso</a>\n'
        '        </nav>\n'
        '      </div>\n'
        '    </div>\n'
        '  </footer>'
    )


HEADER_RE = re.compile(r'[ \t]*<header class="header">.*?</header>', re.S)
FOOTER_RE = re.compile(r'[ \t]*<footer class="footer">.*?</footer>', re.S)


def target_files():
    files = []
    for dirpath, dirnames, filenames in os.walk(SITE):
        parts = dirpath.split(os.sep)
        if 'admin' in parts or 'node_modules' in parts:
            continue
        for fn in filenames:
            if fn.endswith('.html') and fn != 'offline.html':
                files.append(os.path.join(dirpath, fn))
    return sorted(files)


def process(write=False):
    changed = 0
    for f in target_files():
        t = open(f, encoding='utf-8').read()
        if '<header class="header">' not in t:
            continue
        new = HEADER_RE.sub(lambda m: build_header(f), t, count=1)
        new = FOOTER_RE.sub(lambda m: build_footer(f), new, count=1)
        if new != t:
            changed += 1
            rel_f = os.path.relpath(f, ROOT)
            if write:
                open(f, 'w', encoding='utf-8').write(new)
            else:
                diff = difflib.unified_diff(
                    t.splitlines(), new.splitlines(),
                    fromfile=rel_f, tofile=rel_f + ' (nuevo)', lineterm='')
                print('\n'.join(diff))
                print()
    print(f'=== {"ESCRITO" if write else "DRY-RUN"}: {changed} archivo(s) con cambios ===')


if __name__ == '__main__':
    process(write='--write' in sys.argv)
