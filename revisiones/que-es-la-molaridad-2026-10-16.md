# Revisión editorial — que-es-la-molaridad — 2026-10-16

Artículo: `quimcalc/blog/posts/que-es-la-molaridad.html` · URL: https://quimcalc.com/blog/posts/que-es-la-molaridad.html

Revisores: revisor-tecnico, corrector-estilo y revisor-seo (definidos en `.claude/agents/`).

## Resumen

| Área | Críticos | Altos / imprecisos | Menores / sugerencias |
|---|---|---|---|
| Técnica | 4 | 7 | 3 |
| Estilo | — | 15 (voseo, regionalismos, terminología) | 24 |
| SEO | 5 (prioridad alta) | 8 (media) | 4 (baja) |

**Veredicto:** el artículo está bien orientado. La definición y las fórmulas principales son correctas, y 3 de los 4 ejemplos numéricos dan bien. Pero tiene un dato erróneo justo en la FAQ de hidratos: la masa molar del decahidrato está mal y la sal anhidra figura como «anión sulfato». Además dice que la molaridad «es parte del SI», falta la advertencia de seguridad con el H<sub>2</sub>SO<sub>4</sub> y el cuerpo no tiene ni un enlace interno. Para el CTR, el title es plano, la meta no incluye «molaridad» y no hay una sección sobre la búsqueda principal, que es calcular la molaridad a partir de gramos.

## 1. Críticos (corregir antes de cualquier otra cosa)

| # | Fuente | Ubicación | Fragmento | Problema | Corrección |
|---|---|---|---|---|---|
| C1 | Técnico (+ SEO, estilo) | FAQ hidratos, L265 y JSON-LD L76 | «el PM que ingresás en la fórmula es 322.04 g/mol» | El valor es incorrecto. Con las masas de la IUPAC, Na<sub>2</sub>SO<sub>4</sub>·10H<sub>2</sub>O = 142,036 + 10 × 18,015 = **322,19 g/mol**. | «322,19 g/mol», en el cuerpo y en el JSON-LD. 🔢 |
| C2 | Técnico | Ídem | «no el del anión sulfato (142.04 g/mol)» | 142,04 g/mol es la masa del Na<sub>2</sub>SO<sub>4</sub> **anhidro**. El anión SO<sub>4</sub><sup>2−</sup> tiene 96,06 g/mol. | «no el de la sal anhidra Na<sub>2</sub>SO<sub>4</sub> (142,04 g/mol)» |
| C3 | Técnico | Definición, L167 | «La molaridad es parte del Sistema Internacional de Unidades y su unidad es mol/L» | Es falso. La unidad SI es mol/m³; el mol/L se acepta para usar con el SI. | «Su unidad habitual es el mol/L, aceptada para su uso con el SI (la unidad SI coherente es mol/m³)». |
| C4 | Técnico | Ejemplo 2, L200–203 | (preparación desde H<sub>2</sub>SO<sub>4</sub> concentrado) | Falta la advertencia de seguridad. | «Siempre el ácido sobre el agua: se pone agua en el matraz y se agrega el ácido despacio, agitando y en campana». |
| C5 | SEO | Cuerpo | — | No hay enlaces contextuales: ni a la calculadora principal en los dos primeros H2, ni a calculadoras secundarias, ni a otros artículos. | Ver §3.4. |
| C6 | SEO | Meta (3 copias) y `data/posts.json` | «Guía completa sobre la concentración molar…» | No contiene «molaridad» ni tiene CTA. La versión de `posts.json` es distinta y mide 160 caracteres. | Alternativas en §2.1. Hay que unificar el HTML y `posts.json`. |
| C7 | SEO | Title | «¿Qué es la molaridad y cómo se calcula? \| QuimCalc» (50) | Correcto, pero sin gancho: no promete ejemplos, ni calculadora, ni «paso a paso». | Alternativas en §2.1. |
| C8 | SEO | Estructura | — | Falta la intención principal de «cómo calcular la molaridad»: pasar de gramos y volumen a M. | H2 nuevo `id="calcular-molaridad"`, con M = m / (MM × V) y un ejemplo (4,00 g de NaOH en 250 mL → 0,400 M, verificado 🔢). |

## 2. Importantes

### 2.1 Title y meta (elegir una alternativa)

| | Texto | Largo |
|---|---|---|
| Title actual | ¿Qué es la molaridad y cómo se calcula? \| QuimCalc | 50 |
| **Title A (recomendado)** | Molaridad: qué es, fórmula y ejemplos resueltos \| QuimCalc | 58 |
| Title B | Molaridad: fórmula, cálculo de masa y calculadora \| QuimCalc | 60 |
| Title C | Molaridad: cómo calcularla paso a paso, con ejemplos | 52 |
| Meta actual | Guía completa sobre la concentración molar: definición, fórmula, ejemplos resueltos y errores comunes en la preparación de soluciones de laboratorio. | 149 |
| **Meta A (recomendada)** | La molaridad es moles de soluto por litro (M = n/V). Aprende a calcular cuántos gramos pesar con 2 ejemplos resueltos y usa la calculadora gratis. | 146 |
| Meta B | Fórmula de la molaridad, corrección por pureza y ejemplos con NaOH y H₂SO₄. Evita los 4 errores más comunes y calcula la masa a pesar al instante. | 146 |
| Meta C | ¿Cuántos gramos pesar para una solución 0,1 M? Aprende la fórmula de la molaridad paso a paso y comprueba el resultado con nuestra calculadora. | 143 |

Largos verificados con Python.

### 2.2 Imprecisiones técnicas

| # | Ubicación | Fragmento | Corrección |
|---|---|---|---|
| T5 | Ej. 2 / CTA | «se trabaja con la densidad y el % en masa…» | La calculadora de molaridad no usa la densidad. Para este caso hay que enlazar `diluciones-reactivo-comercial.html`. |
| T6 | Ej. 2, L202 | «= 5.004 g» | El H<sub>2</sub>SO<sub>4</sub> concentrado se mide en volumen. Hay que agregar «≈ 2,72 mL (d = 1,84 g/mL)». 🔢 verificado |
| T7 | Ej. 1 y 2 | «2.0619 g» / «5.004 g» | Tienen más cifras significativas que los datos. Se pueden escribir los datos como 0,1000 M y 500,0 mL, o redondear (≈ 2,06 g; ≈ 5,00 g). |
| T8 | Ej. 1, L189/196 | «pesar 2.0619 g de NaOH…» | El NaOH no es patrón primario. Hay que agregar que la solución se valora (por ejemplo, con biftalato de potasio). |
| T9 | L213 | «Para H₂SO₄: 1 M = 2 N.» | Agregar «en reacciones ácido-base (ambos protones)». |
| T10 | L216 | «ppm / mg/L: miligramos de soluto por litro» | Corregir a «ppm (mg/kg); en soluciones acuosas diluidas ≈ mg/L». |
| T11 | L201 | «PM(H₂SO₄) = 98.08 g/mol» | Según la IUPAC es 98,07. El resultado no cambia. 🔢 verificado |

### 2.3 Voseo y regionalismos (estilo + SEO)

Tratamiento detectado: **mezcla**. Se usan voseo, tú, «nosotros» e impersonal. Hay que unificar en impersonal en el cuerpo y tú en el CTA.

| Original | Corrección | Ubicación |
|---|---|---|
| «Si usás Na₂SO₄·10H₂O» | «Si se usa Na<sub>2</sub>SO<sub>4</sub>·10H<sub>2</sub>O» | L265 + JSON-LD L76 |
| «el PM que ingresás en la fórmula» | «la masa molar que se introduce en la fórmula» | L265 + JSON-LD L76 |
| «Si preparás una solución de 0.1 M…» | «Si se prepara una solución 0,1 M…» | L233 |
| «Si aforás con la solución caliente» | «Si se lleva a volumen con la solución caliente» | L238 |
| «Esperá a que la solución llegue…» | «Hay que esperar a que la solución alcance…» | L238 |
| «¿Cuántos gramos tenés que pesar…?» | «¿Cuántos gramos tienes que pesar…?» | CTA L271 |
| «agua de la canilla» | «agua del grifo (o de la llave)» | H3 L249 + JSON-LD L57 |
| «preparación de buffers» | «preparación de soluciones amortiguadoras (tampones o buffers)» | L214 |
| «solución» (1.ª mención) | «solución (disolución, en España)» | L163 |
| «necesitamos / usamos / corregimos / mezclamos» | Forma impersonal | L179, L189, L221 |

### 2.4 Enlaces internos faltantes (SEO)

| Anchor | Destino | Dónde |
|---|---|---|
| calculadora de molaridad | `../../herramientas/calculadora-molaridad.html` | `#calcular-masa`, después del Ejemplo 1 (**prioritario**) |
| calcular la masa molar del compuesto | `../../herramientas/masa-molar.html` | `#calcular-masa`, donde se menciona el PM |
| preparar una solución desde un sólido con pureza o hidratos | `../../herramientas/solucion-desde-solido.html` | Factor de pureza o FAQ de hidratos |
| dilución desde reactivo comercial | `../../herramientas/diluciones-reactivo-comercial.html` | Ejemplo 2 |
| diferencias entre normalidad y molaridad | `normalidad-vs-molaridad.html` | `#diferencias`, ítem Normalidad |
| qué son las ppm y cómo convertirlas | `que-son-las-ppm-y-como-convertirlas.html` | `#diferencias`, ítem ppm |
| cómo preparar soluciones estándar correctamente | `como-preparar-soluciones-estandar-correctamente.html` | `#errores`, error 1 |

### 2.5 Otros hallazgos SEO de prioridad media

- **Imagen:** el artículo no tiene ninguna `<img>`, aunque existe `img/post-molaridad.webp` y su `image_alt` está en `posts.json`. Hay que agregar una `<figure>` después del header.
- **H2:** «¿Cómo se calcula cuánto pesar?» debería pasar a «Cómo calcular la masa para preparar una solución molar», con los ejemplos como H3.
- **JSON-LD:** `dateModified` no coincide entre `Article` (2026-04-03) y `FAQPage` (2026-06-08). A `Article` le faltan `inLanguage`, `image`, `mainEntityOfPage` y `publisher.logo`.
- **og:image:** es la genérica del sitio. Faltan `og:image:alt` y `og:locale`.
- **Canibalización:** `normalidad-vs-molaridad.html` tiene un H2 idéntico («¿Qué es la molaridad?») que no enlaza a este artículo.

## 3. Menores y sugerencias

- **Notación:** coma decimal en todo el texto («0,1 M», «2,0619 g»), «97 %», «20–25 °C», «0,1 mol» (sin plural) y `<sub>` en lugar de Unicode en el texto visible. Pasar a coma decimal no cambia ningún número verificado.
- **Gramática:** «menor/mayor **que** la nominal»; «análisis **en los que** se use»; «que **se** enfríe»; «8 min **de** lectura»; «**un** matraz aforado»; «vs.» → «frente a».
- **Puntuación:** comillas tipográficas; «donde» sin dos puntos; punto y coma en L217; inciso entre comas en L228; sobran comas en L144 y L258.
- **Claridad:** la frase «más usada en química analítica» se repite en el resumen y en L163. Hay frases de más de 35 palabras en L233 y L258. Además: «vaso» → «vaso de precipitados»; el H3 «Agregar agua al volumen…» es confuso; el botón dice «Calcular con la calculadora» → «Calcular la masa con la calculadora…».
- **Terminología:** «masa molar» en lugar de «peso molecular»/PM (mencionar «peso molecular» una vez); «llevar a volumen (aforar)»; «carbonato **de sodio**».
- **Técnica:** «los moles son una unidad abstracta» → «el mol no se mide directamente en la balanza». Falta la fuente para la afirmación sobre «20–25 °C».
- **SEO (baja):**
  - `article:published_time` usa `name` en lugar de `property`.
  - Falta `BreadcrumbList`.
  - En el sidebar, cambiar `dureza-agua-gran-rosario` por posts afines.
  - `date_sort` en `posts.json` (2026-04-01) y `datePublished` (2026-04-03) no coinciden.

## 4. Ejemplos recalculados (revisor técnico)

```python
Na,S,O,H = 22.990, 32.06, 15.999, 1.008
# Ej. 1: NaOH 0,1 M, 500 mL, 97 %
(0.1*0.5*40.00)/0.97          # 2.0619 g   ✅
# Ej. 2: H2SO4 0,05 M, 1 L, 98 %
(0.05*1*98.08)/0.98           # 5.004 g    ✅ (con 98,07 da 5,004 igual); 5.004/1.84 = 2.72 mL
# Error por pureza
0.1*0.97                      # 0.097 M, error 3 %  ✅
# Hidrato
2*Na+S+4*O                    # 142.04 (Na2SO4 anhidro)
2*Na+S+4*O + 10*(2*H+O)       # 322.19  ❌ el artículo dice 322.04
S+4*O                         # 96.06 (SO4 2−)
```

**Valores verificados que se pueden editar con seguridad:**
- 40,00
- 2,0619 g
- 98,07/98,08
- 5,004 g
- 2,72 mL
- 0,097 M
- 3 %
- 142,04 (sal anhidra)
- 322,19
- 96,06
- 18,015
- 4,00 g en 250 mL → 0,400 M

**Conflicto entre revisores:** la FAQ que propone el revisor SEO da 322,20 g/mol para el decahidrato. El valor verificado es **322,19 g/mol** y es el que se usa.

## 5. FAQ propuesta (SEO, corregida con los valores verificados)

1. **¿Cómo se calcula la molaridad a partir de gramos?** Primero se convierten los gramos de soluto a moles, dividiendo por la masa molar (n = m / MM). Después se divide por el volumen de la solución en litros (M = n / V). Por ejemplo, 4,00 g de NaOH (40,00 g/mol) son 0,100 mol; llevados a 250 mL dan una solución 0,400 M.
2. **¿Qué significa que una solución sea 1 M?** Que contiene 1 mol de soluto por litro de solución. Para el NaCl (58,44 g/mol), se pesan 58,44 g, se disuelven y se llevan a 1 L en un matraz aforado. No es lo mismo que agregar 1 L de agua.
3. **¿Cuál es la diferencia entre molaridad y molalidad?** La molaridad es mol por litro de solución; la molalidad es mol por kilogramo de solvente. La molalidad no depende de la temperatura y se usa en propiedades coligativas.
4. **¿Cómo se pasa de molaridad a g/L?** g/L = M × MM. Por ejemplo, NaOH 0,1 M equivale a 4,00 g/L. El enlace va al conversor de concentración.
5. **¿Qué masa molar se usa si el reactivo es un hidrato?** La del hidrato completo: Na<sub>2</sub>SO<sub>4</sub>·10H<sub>2</sub>O = 322,19 g/mol, no 142,04 g/mol.

Esta FAQ reemplaza a la de «canilla» y conserva la de hidratos. Hay que replicarla igual en el JSON-LD `FAQPage`.

## 6. Checklist de aplicación (aplicado el 2026-10-16, elección una por una)

- [x] 🔢 C1–C2: decahidrato 322,19 g/mol / sal anhidra 142,04 (cuerpo + JSON-LD)
- [x] C3: frase del SI corregida
- [x] C4: advertencia «ácido sobre agua»
- [x] 🔢 T6 + T5: ≈ 2,72 mL y enlace a dilución desde reactivo comercial
- [x] T8: nota de valoración (NaOH y H<sub>2</sub>SO<sub>4</sub>)
- [x] T9, T10: normalidad y ppm aclaradas
- [x] 🔢 T11: 98,07 g/mol (resultado 5,004 g sin cambios)
- [x] T7: datos con más cifras (0,1000 M · 500,0 mL; 0,05000 M · 1,000 L)
- [x] Title A (58) en 3 copias. En `posts.json` el `title` es el H1 de la tarjeta, así que no se cambió
- [x] Meta A (146) en 3 copias + JSON-LD + `posts.json`
- [x] 🔢 C8: H2 «Cómo calcular la molaridad a partir de gramos» (0,400 M) + TOC
- [x] Enlaces internos: calculadora de molaridad, masa-molar, solucion-desde-solido, diluciones-reactivo-comercial, conversor-concentracion, normalidad-vs-molaridad, que-son-las-ppm, como-preparar-soluciones-estandar
- [x] Voseo y regionalismos (también en el JSON-LD); tratamiento impersonal + tú en el CTA
- [x] FAQ: 6 preguntas (las 5 propuestas + la de temperatura, reescrita sin la afirmación sin fuente); se quitó la de «canilla»
- [x] Imagen `post-molaridad.webp` (1536×1024) con alt
- [x] JSON-LD: `dateModified` 2026-10-16 en ambos; `Article` con inLanguage, image, mainEntityOfPage y publisher.logo
- [x] Notación: coma decimal, %, °C, `<sub>`
- [x] Gramática, puntuación, claridad y terminología («masa molar», «llevar a volumen (aforar)»)
- [x] `sync_indexes.py`, JSON-LD validado, largos verificados, enlaces internos existentes, sin scroll horizontal a 375 px
- [ ] No elegidos (pendientes): renombrar el H2 «¿Cómo se calcula cuánto pesar?», og:image propia + og:locale, enlace desde `normalidad-vs-molaridad.html`, `article:published_time` con `property`, BreadcrumbList, cambiar el post del sidebar, unificar `date_sort`

## Anexo: criterio de unión

- Se fusionaron los hallazgos duplicados: hidrato (técnico + SEO + estilo), voseo y canilla (estilo + SEO), subíndices y coma decimal (técnico + estilo).
- Los informes completos de cada revisor quedaron en el registro de la sesión del 2026-10-16. Este documento conserva todos sus hallazgos, agrupados por prioridad.
