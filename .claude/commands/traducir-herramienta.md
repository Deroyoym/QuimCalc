---
description: Traduce al inglés una herramienta de QuimCalc (página en /en/tools/, textos del JS, registro, pruebas y revisión)
argument-hint: <slug en español, p. ej. «calculadora-karl-fischer»>
---

Traduce al inglés la herramienta: **$ARGUMENTS**

## 1. Preparación
- Si `$ARGUMENTS` está vacío, pregunta qué herramienta traducir y detente.
- Comprueba que existe `quimcalc/herramientas/$ARGUMENTS.html` y que no tiene ya un objeto `en` en `data/tools.json`.
- Lee:
  - la sección 6 de `INSTRUCCIONES.md`;
  - el glosario y la tabla de keywords de `revisiones/investigacion-ingles-2026-10-25.md`;
  - una herramienta ya traducida como modelo: `quimcalc/en/tools/lod-loq-calculator.html` y `quimcalc/herramientas/js/lod-loq.js`.
- Propón al usuario, en una tabla corta:
  - slug inglés (descriptivo, con la keyword principal, p. ej. `karl-fischer-water-content-calculator`);
  - title (≤ 60 caracteres con « | QuimCalc»);
  - meta description (≤ 155 caracteres);
  - keyword principal y competencia, según la investigación (si no figura, búscala con WebSearch).
- Pregunta con AskUserQuestion si está bien antes de seguir.

## 2. Página
Crea `quimcalc/en/tools/<slug-en>.html` a partir de la página en español:
- `<html lang="en">`, `og:locale` `en_US` y rutas con `../../`.
- Deja `<header class="header"></header>` y `<footer class="footer"></footer>` vacíos: los completa el script. No escribas los `hreflang` a mano: los agrega `sync_indexes.py`.
- **No cargues `entrada-decimal.js`:** en inglés el decimal es el punto. Mantén el mismo JS de la herramienta (`../../herramientas/js/<archivo>.js`) y los scripts compartidos.
- Traduce todo:
  - texto visible;
  - `alt`, `aria-label`, `placeholder` y `title`;
  - FAQ y JSON-LD (`WebApplication` con `inLanguage: "en"`, `FAQPage` idéntico al FAQ visible, `BreadcrumbList` con Home → Tools).
- **Estilo:** inglés técnico de laboratorio (US), oraciones cortas, punto decimal y unidades SI (mL, mol/L, °C).
  - Usa los términos de farmacopeas y normas en inglés (USP, Ph. Eur., ISO, ICH, Eurachem).
  - Es una adaptación, no una traducción literal: los ejemplos y las FAQ deben sonar naturales para un analista angloparlante.
- **Enlaces:**
  - a otras herramientas en inglés si existen;
  - si no existen, a la versión en español con `hreflang="es"` y la aclaración «(in Spanish)»;
  - nunca a posts del blog en español sin esa aclaración.

## 3. JavaScript
- Si el JS de la herramienta todavía no es bilingüe:
  - agrega `const EN = document.documentElement.lang === 'en';`;
  - pasa todos los textos (resultados, errores, avisos, etiquetas creadas por JS) a un objeto `T` con las dos versiones.
- **Números:** en inglés, punto decimal.
  - Si el JS usa `QCFormato` (`js/formato-numero.js`), no hay que hacer nada: lee `<html lang>` y en inglés usa punto decimal y coma de miles («12,345.6»).
  - Si usa `conComa()`, ya devuelve el número sin cambios en inglés.
- La página en español no debe cambiar en nada visible: corre su parte de la batería antes y después.

## 4. Registro e índices
- En `data/tools.json`, agrega a la herramienta `"en": {"slug": "<slug-en>", "title": "<title corto>"}`.
- Corre `python3 scripts/build_layout.py --write` y `python3 scripts/sync_indexes.py`. Así se agregan:
  - el selector ES/EN en las dos páginas;
  - los `hreflang`;
  - el sitemap con alternates;
  - la tarjeta en `/en/index.html`;
  - la caché del service worker.
- Revisa que la tarjeta y la descripción de la portada inglesa se lean bien.

## 5. Pruebas
- En `CASOS` de `scripts/test_calculadoras.mjs`, agrega con la ruta `'en/tools/<slug-en>'`:
  - los mismos casos que tiene la versión en español, con punto decimal en las entradas y en lo esperado;
  - al menos un error de entrada inválida.
- La batería ya controla sola, en todas las páginas de `/en/`:
  - que no queden restos en español (tildes, ñ, palabras frecuentes) en el texto, los atributos, el title, la description ni el JSON-LD;
  - que ningún resultado tenga coma decimal (la coma de miles está permitida).
- Corre `node scripts/test_calculadoras.mjs <slug-en>`, después `node scripts/test_calculadoras.mjs $ARGUMENTS` y al final la batería completa. Todas deben dar 0 fallos.

## 6. Revisión y publicación
- Lanza `revisor-seo` sobre la página inglesa (title, description, H1/H2, schema, hreflang, canonical) y aplica lo que el usuario apruebe.
- Muestra un resumen al usuario:
  - URL nueva;
  - keyword;
  - cambios en el JS;
  - pruebas.
- Pregunta antes de publicar (merge a `main`).
