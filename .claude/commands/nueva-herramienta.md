---
description: Crea una herramienta nueva (calculadora o tabla) siguiendo el checklist de QuimCalc, con pruebas y revisión
argument-hint: <nombre o idea de la herramienta, p. ej. «calculadora de Karl Fischer»>
---

Crea la herramienta: **$ARGUMENTS**

## 1. Diseño (antes de escribir código)
- Si `$ARGUMENTS` está vacío, pregunta qué herramienta crear y detente.
- Revisa que no exista ya algo parecido en `data/tools.json`. Lee también la última propuesta en `revisiones/herramientas-*.md` y `revisiones/ideas-*.md`.
- Define y muestra al usuario, en una tabla corta:
  - slug (en español, sin tildes);
  - title (≤ 60 caracteres con « | QuimCalc»);
  - meta description (≤ 155 caracteres);
  - entradas con sus unidades;
  - salidas;
  - fórmulas con su fuente (norma, libro o farmacopea);
  - 3 ejemplos resueltos con Python;
  - posts del blog y herramientas a enlazar.
- Pregunta con AskUserQuestion si el diseño está bien antes de seguir.

## 2. Construcción
Toma como plantilla una herramienta parecida y reciente (por ejemplo `quimcalc/herramientas/diluciones-reactivo-comercial.html` con su JS). Respeta:
- **Estructura:** header y footer los pone `python3 scripts/build_layout.py --write`. Usa breadcrumb, bloque `.calculadora`, botón `#btn-calcular` con clase `btn--primario` y resultado en `#resultado`, `#resultado-etiqueta`, `#resultado-valor` y `#resultado-formula`.
- **Scripts compartidos, en este orden:**
  - `../js/entrada-decimal.js` (defer): coma decimal, validación estricta y Enter para calcular;
  - `../js/formato-numero.js`, antes del JS propio: **todo número visible pasa por `QCFormato.num`, `.masa` o `.volumen`; nada de `toFixed` en resultados**;
  - el JS propio en `herramientas/js/<slug>.js`;
  - `historial.js`, `copiar-resultado.js`, `compartir.js`, `pwa-register.js` e `init-speed-insights.js` (module), como en las demás páginas.
- **Masas atómicas:** si la herramienta las necesita, carga `herramientas/js/masas-atomicas.js`. No dupliques tablas de datos.
- **Validación:** errores claros para vacíos, ceros, negativos y valores fuera de rango, nunca un resultado silencioso. Avisos (⚠️), no errores, cuando el resultado es posible pero sospechoso.
- **Contenido educativo:** explicación breve, fórmula, un ejemplo resuelto (de los verificados en el paso 1), FAQ de 3–5 preguntas con JSON-LD `FAQPage` idéntico y JSON-LD `WebApplication`.
- **Texto:** español neutro según `.claude/guia-editorial.md`, con coma decimal y unidades SI.

## 3. Registro e índices
- Agrega la entrada en `data/tools.json` con slug, title, description y categoría, siguiendo el formato de las demás.
- Corre `python3 scripts/build_layout.py --write` y `python3 scripts/sync_indexes.py`, que actualizan portada, sitemap y caché.
- Enlaza la herramienta desde los posts relacionados, y los posts desde la herramienta (bloque «Para profundizar»).

## 4. Pruebas
- Agrega a `CASOS` en `scripts/test_calculadoras.mjs` al menos:
  - los 3 ejemplos del diseño;
  - un valor muy chico;
  - una entrada inválida con error.
- Corre `node scripts/test_calculadoras.mjs <slug>` y, al final, la batería completa. Las dos deben dar 0 fallos.

## 5. Revisión
- Corre `/revisar-herramienta <slug>`, que lanza `auditor-calculadoras` y `revisor-seo`. Aplica lo que el usuario apruebe.
- Muestra al usuario un resumen:
  - qué hace la herramienta;
  - los ejemplos verificados;
  - el resultado de las pruebas;
  - los enlaces agregados.
- Pregunta antes de publicar (merge a `main`).
