---
description: Revisión completa de una herramienta (cálculos, datos, pruebas y SEO) con informe priorizado
argument-hint: <slug de la herramienta, p. ej. calculadora-molaridad>
---

Coordina la revisión de la herramienta: **$ARGUMENTS**

## 1. Preparación
- Si `$ARGUMENTS` está vacío, lista las herramientas de `data/tools.json` (slug y título), pregunta cuál revisar y detente.
- Acepta el slug o la ruta (`quimcalc/herramientas/<slug>.html`). Comprueba que el archivo existe.
- Obtén la fecha de hoy (`date +%F`).
- Corre la batería solo para esa herramienta: `node scripts/test_calculadoras.mjs <slug>`. Si Playwright no está instalado, anótalo y sigue.

## 2. Revisión en paralelo
Lanza **en un solo mensaje, en paralelo**, dos subagentes con la herramienta Agent:
- `auditor-calculadoras`: cálculos, datos, entradas inválidas, sección educativa y casos nuevos para la batería.
- `revisor-seo`: title, meta, H1, FAQ y schema de la página, y enlaces entre la herramienta y los posts del blog. Aclárale que es una página de herramienta, no un artículo.

A cada uno pásale la ruta y pídele su informe completo en el formato de su definición. Recuérdales que no deben editar archivos.

## 3. Informe unificado
Une los dos informes y el resultado de la batería en **un solo documento priorizado**:

```
# Revisión de herramienta — <slug> — <fecha>

Página: `quimcalc/herramientas/<slug>.html` · URL: https://quimcalc.com/herramientas/<slug>.html

## Resumen
| Área | Críticos | Altos | Medios / bajos |
|---|---|---|---|
| Cálculos y datos | | | |
| SEO | | | |
Batería: N/N. Veredicto en 2–3 oraciones.

## 1. Críticos
## 2. Altos
## 3. Medios y bajos
## 4. Casos recalculados (del auditor, con el código Python)
## 5. Casos nuevos para la batería
## 6. Checklist de aplicación
- [ ] …  (una línea por cambio; marca con 🔢 los que tocan un número, una fórmula o un dato)

## Anexos: informes originales
<details><summary>Auditor de calculadoras</summary> … </details>
<details><summary>Revisor SEO</summary> … </details>
```

Reglas al unir:
- Sin duplicados.
- Si hay contradicciones, muestra ambas posturas y marca «decisión del editor».
- No inventes hallazgos.

Guárdalo en `revisiones/herramienta-<slug>-<fecha>.md`. Si ya existe, agrega un sufijo `-2`, `-3`…

## 4. Mostrar y preguntar
Muestra el **Resumen** y los **Críticos**, con la ruta del informe. Después pregunta con AskUserQuestion si aplica las correcciones:
- Aplicar todo
- Solo críticos y altos
- Elegir una por una
- No aplicar nada

## 5. Aplicar (solo si el usuario dijo que sí)
- **Nunca edites sin la confirmación explícita del usuario.**
- **Nunca cambies una fórmula, constante o dato** que el auditor no haya verificado con su fuente o recalculado.
- Usa `QCFormato` (`quimcalc/js/formato-numero.js`) para todo número que se muestre; nada de `toFixed` para resultados.
- Agrega a `CASOS` en `scripts/test_calculadoras.mjs` un caso por cada bug corregido, para que no vuelva a aparecer.
- Si cambia el title o la description, actualiza `data/tools.json` y corre `python3 scripts/sync_indexes.py`. Si la herramienta tiene versión en inglés, aplica el mismo arreglo de cálculo allí.
- Al final:
  - corre `node scripts/test_calculadoras.mjs` completo, que debe dar 0 fallos;
  - valida el JSON-LD con Python.
- Marca en el checklist del informe lo aplicado y lo omitido (con el motivo) y resume los cambios al usuario.
