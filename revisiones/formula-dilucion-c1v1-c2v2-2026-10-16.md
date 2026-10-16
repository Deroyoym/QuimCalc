# Revisión editorial — formula-dilucion-c1v1-c2v2 — 2026-10-16

Artículo: **borrador** `revisiones/borradores/formula-dilucion-c1v1-c2v2.md` (todavía no es HTML) · URL prevista: https://quimcalc.com/blog/posts/formula-dilucion-c1v1-c2v2.html

Revisores: revisor-tecnico, corrector-estilo y revisor-seo (`.claude/agents/`).

## Resumen

| Área | Críticos | Altos / imprecisos | Menores / sugerencias |
|---|---|---|---|
| Técnica | 2 | 10 | 6 |
| Estilo | — | 14 (voseo, «nosotros», regionalismos) | 20 |
| SEO | 6 (prioridad alta) | 8 (media) | 3 (baja) |

**Veredicto:** el borrador explica bien la idea central (unidades coherentes) y la cuenta del ejemplo es correcta: 25 mL. Antes de publicarlo hay que corregir cuatro cosas:

- **Uso del reactivo:** el ejemplo usa **HCl 0,1 M para medir la acidez libre del aceite**, pero ese ensayo se titula con **NaOH o KOH**.
- **Calculadora equivocada:** para pasar de molaridad a ppm enlaza una calculadora que no hace esa conversión.
- **Falta una advertencia:** no aclara que la fórmula **no sirve con % p/p**.
- **Tema repetido:** el único ejemplo (HCl) se superpone con el post de HCl recién publicado.

Además le faltan la respuesta directa, la FAQ, el CTA, los enlaces reales y el factor de dilución (1:10), y tiene voseo en la meta y en el cuerpo.

## 1. Críticos

| # | Fuente | Ubicación | Fragmento | Problema | Corrección |
|---|---|---|---|---|---|
| C1 | Técnico | Ejemplo, l. 40 | «HCl 0.1 M para determinar la acidez libre en muestras de aceite de soja» | La acidez libre (ácidos grasos libres) se titula con **NaOH/KOH** en etanol neutralizado (ISO 660, AOCS Ca 5a-40), no con HCl. | Cambiar el uso o el ejemplo (ver §2.5). |
| C2 | Técnico + SEO | §Unidades, l. 36–37 + C9 | «Si C1 está en molaridad y deseás hallar C2 en ppm… usá conversor-ppm-mgl» | `conversor-ppm-mgl` solo hace ppm ↔ mg/L y M ↔ N. La conversión mol/L ↔ mg/L ↔ ppm la hace `conversor-concentracion`. | Enlazar `conversor-concentracion.html` ahí y en la barra lateral. |
| C3 | SEO + estilo | Meta | «…y calculá tus volúmenes en segundos» | Voseo mezclado con tú («Aprende»). | Meta A/B/C (§2.1). |
| C4 | SEO | Todo C7 | «usá <strong>calculadora-diluciones</strong> en QuimCalc» ×4 | Ninguna mención es un enlace y el texto ancla es el nombre técnico de la página. Falta el CTA. | Enlaces con texto descriptivo (§2.4) y `div.cta-herramienta`. |
| C5 | SEO | Estructura | — | Faltan el resumen, una respuesta directa con un número, `post-formula`, la FAQ con su `FAQPage`, el factor de dilución y los ejemplos del esquema. | §2.5 y §6. |
| C6 | SEO | Ejemplo | HCl 2,0 M → 0,1 M y «botellas comerciales» | Compite con `como-preparar-hcl-1m-desde-hcl-37.html` por la misma búsqueda. | Usar otros ejemplos y enlazar al post de HCl. |

## 2. Importantes

### 2.1 Title y meta

| | Texto | Largo |
|---|---|---|
| Title actual | Fórmula de dilución C1V1 = C2V2: guía y ejemplos \| QuimCalc | 59 ✅ |
| **Title A (recomendado por SEO)** | Fórmula de dilución C1V1 = C2V2: 3 ejemplos \| QuimCalc | 54 (requiere 3 ejemplos) |
| Title B | Fórmula de dilución C1V1 = C2V2 paso a paso \| QuimCalc | 54 |
| Title C | C1V1 = C2V2: fórmula de dilución y calculadora \| QuimCalc | 57 (descartado: compite con la calculadora) |
| Meta actual | Aprende a aplicar la fórmula de dilución C1V1 = C2V2 con ejemplos resueltos en laboratorio y calculá tus volúmenes en segundos. | 127 (voseo) |
| **Meta A (recomendada)** | Para 100 mL de un estándar de 10 mg/L desde uno de 1000 mg/L se toma 1 mL. Fórmula C1V1 = C2V2, ejemplos y calculadora gratis. | 126 |
| Meta B | C1V1 = C2V2 explicado: qué volumen de solución madre tomar, unidades que no se pueden mezclar y 3 ejemplos. Calcula tu dilución gratis. | 135 |
| Meta C | Cómo calcular cuánto tomar de la solución madre con C1V1 = C2V2: ejemplos con mol/L y mg/L, errores frecuentes y calculadora online. | 132 |

H1 sugerido: «Fórmula de dilución C<sub>1</sub>V<sub>1</sub> = C<sub>2</sub>V<sub>2</sub>: qué es, cómo se usa y ejemplos». Los largos están verificados con Python.

### 2.2 Imprecisiones técnicas

| # | Fragmento | Corrección |
|---|---|---|
| T3 | «molaridad, % p/v o ppm» | Solo vale con concentraciones **por volumen** (mol/L, g/L, mg/L, % p/v). ppm únicamente si equivale a mg/L (soluciones acuosas diluidas). **No vale con % p/p**: con volúmenes da 3,7 % cuando el valor real es ≈ 4,3 %. En ese caso hay que pasar a mol/L con la densidad, con la calculadora de reactivo comercial. |
| T4 | «variaciones drásticas… contracción volumétrica severa» | Si V<sub>2</sub> es el volumen final aforado, la contracción no afecta. Solo falla si V<sub>2</sub> se calcula como V<sub>1</sub> + V(agua), porque los volúmenes no son aditivos. |
| T5 | «un resultado exacto de 25 mL» | 🔢 Escribir los datos como 0,100 M y 2,00 M, el resultado como V<sub>1</sub> = 25,0 mL, y quitar «exacto». |
| T6 | «esta relación asegura exactitud» | La exactitud depende del material volumétrico y, si es un titulante, de que se estandarice después. |
| T7 | «medir 25 mL… y llevar a volumen» | Orden seguro: primero agua en el matraz, luego el ácido con pipeta y propipeta; aforar a 20 °C, tapar e invertir. |
| T8 | «reacciones exotérmicas» | Es una dilución exotérmica, no una reacción. Es relevante con H<sub>2</sub>SO<sub>4</sub> concentrado y despreciable al pasar de HCl 2 M a 0,1 M. |
| T9 | «se propaga… (ISO 17025:2017)» | La ISO/IEC 17025 exige evaluar la incertidumbre; el método de propagación es la GUM (JCGM 100:2008). Agregarla a las fuentes. |
| T10 | «la masa o cantidad de sustancia» | Aclarar: se conservan los moles si C está en mol/L, y la masa si está en g/L o % p/v. |
| T11 | «soluciones madre o patrones primarios» | Un patrón primario es un sólido que se pesa: aquí corresponde «soluciones patrón». |
| T12 | «la adición correcta del solvente… homogeneidad… Siempre se debe enrasar con la parte inferior del menisco» | La homogeneidad se logra invirtiendo el matraz tapado. En soluciones opacas se afora por el borde superior del menisco. |

### 2.3 Voseo, «nosotros» y regionalismos (estilo + SEO)

- **Tratamiento mezclado:** el texto alterna voseo (13 formas: calculá, agregás, necesitás, usá ×4, podés ×2, deseás, tenés, solés), primera persona del plural (aplicamos, obtenemos, pasemos, veamos, revisemos) y tú. Corrección: forma impersonal en el cuerpo y tú en la meta y los CTA.
- **Regionalismos:**
  - «mesón» (×3, incluido el H2) → «laboratorio» o «mesa de trabajo»
  - «depósito» → «almacén de reactivos»
  - «Gran Rosario» → quitarlo
  - «soja» → «soja (soya)»
  - «solvente» → «disolvente (solvente)»
  - «falla»/«fallo» → «error»
- **Transiciones de relleno:** quitar las 3 frases de enlace entre secciones y los 2 «Dicho esto».

### 2.4 Enlaces internos

| Texto ancla | Destino | Dónde |
|---|---|---|
| calcula V<sub>1</sub> con la calculadora de diluciones C<sub>1</sub>V<sub>1</sub> = C<sub>2</sub>V<sub>2</sub> | `calculadora-diluciones.html` | Primer párrafo (calculadora principal) |
| comprueba el resultado con la calculadora de diluciones | ídem | Final del ejemplo |
| convertir mol/L a mg/L | `conversor-concentracion.html` | Sección de unidades |
| diluciones seriadas | `diluciones-seriadas.html` | Sección de factor de dilución |
| dilución desde reactivo comercial + cómo preparar HCl 1 M desde HCl al 37 % | `diluciones-reactivo-comercial.html` + `como-preparar-hcl-1m-desde-hcl-37.html` | Una frase sobre el % p/p |
| qué es la molaridad / qué son las ppm | `que-es-la-molaridad.html` / `que-son-las-ppm-y-como-convertirlas.html` | Sección de unidades |
| cómo aforar sin error de paralaje | `como-preparar-soluciones-estandar-correctamente.html` | Sección de errores |

La calculadora de incertidumbre pasa a la barra lateral.

**Enlaces entrantes:** cuando se publique, conviene enlazar este post desde `como-preparar-hcl-1m-desde-hcl-37.html` (la frase «relación de dilución C<sub>1</sub>V<sub>1</sub> = C<sub>2</sub>V<sub>2</sub>»), `espectrofotometria-curva-calibracion.html` y `que-son-las-ppm-y-como-convertirlas.html`.

### 2.5 Estructura y ejemplos (SEO + técnico)

**Estructura propuesta** (los ids van entre paréntesis):

1. Respuesta directa
2. Qué es (`que-es`)
3. Fórmula y variables, en `post-formula` (`formula`)
4. Unidades (`unidades`)
5. Ejemplos resueltos (`ejemplos-resueltos`)
6. Factor de dilución y notación 1:10 (`factor-de-dilucion`)
7. Errores comunes, con H3 (`errores-comunes`)
8. Preguntas frecuentes (`preguntas-frecuentes`)
9. Fuentes consultadas (`fuentes-consultadas`)

**Ejemplos.** La propuesta 2 de `ideas-2026-10-16.md` pide dos:

- un estándar de 10 mg/L preparado desde uno de 1000 mg/L;
- NaOH 0,1 M preparado desde NaOH 1 M.

**Qué hacer con el ejemplo de HCl** (decisión del editor):

- Opción (a): HCl 0,5 M para el índice de saponificación (valoración por retroceso) → V<sub>1</sub> = 125 mL. 🔢 Verificado.
- Opción (b): HCl 0,01 M para jabón residual en el aceite → V<sub>1</sub> = 2,5 mL. 🔢 Verificado.
- Opción (c): mantener HCl 0,1 M sin atarlo a ningún ensayo.
- Opción (d), recomendada por SEO: reemplazarlo por los ejemplos del esquema. Así no compite con el post de HCl.

En las opciones (a) y (b) las normas se citaron de memoria: el autor debe confirmarlas.

**Imagen.** El prompt pide una micropipeta y un líquido azul. Eso no encaja con medir 25 mL, y el HCl es incoloro. Conviene pedir una pipeta aforada con propipeta y un líquido incoloro, y que el alt describa la imagen final.

## 3. Menores y sugerencias

- **Técnica:**
  - Citar la ISO 648 para las pipetas.
  - Tolerancias de clase A: pipeta de 25 mL ±0,03 mL; matraz de 500 mL ±0,25 mL.
  - La calculadora de reactivo comercial recomienda «probeta si >10 mL», lo que contradice la pipeta aforada del texto: hay que avisar al responsable de la calculadora.
- **Estilo:**
  - Erratas y notación: «analytico» → «analítico»; coma decimal; «×» en lugar de «x»; subíndices en el H2.
  - Expresiones: «cuándo aplica» → «cuándo se aplica»; «llevar a volumen hasta» → «llevar a 500 mL»; «análisis traza» → «análisis de trazas».
  - Intensificadores a quitar: «fundamental», «estrictamente», «indispensable», «severo», «destruye».
  - Nombres en las fuentes y la barra lateral: «ISO/IEC 17025»; los nombres de herramientas en minúscula y tal como aparecen en `tools.json`.
- **SEO (baja):**
  - ids cortos.
  - `property="article:published_time"`.
  - Rutas `../../herramientas/…` en la barra lateral.
  - Tarjeta para compartir con `og_highlight`, por ejemplo «1 mL de patrón de 1000 mg/L para 100 mL de 10 mg/L».
  - Miga de pan: «Fórmula de dilución».

## 4. Ejemplos recalculados

Revisor técnico:

```python
C1,C2,V2=2.0,0.1,500
C2*V2/C1        # 25.0 mL ✅ (presentar como 25,0 mL con 0,100 M y 2,00 M)
C2*V2/1000      # 0.05 mol HCl
# Contraejemplo % p/p: 10 mL de HCl 37 % (d 1,19) → 100 mL (d final ≈1,019)
0.37*10*1.19/(100*1.019)*100   # 4.32 % p/p real
37*10/100                      # 3.7 % con C1V1/V2 ❌ (−14 %)
0.5*500/2.0, 0.01*500/2.0      # 125.0 mL ; 2.5 mL (opciones a y b)
```

**Valores verificados por el revisor técnico:**

- 25 mL (25,0 mL)
- 0,050 mol
- 125 mL / 2,5 mL
- HCl 37 % ≈ 12,08 M → 4,14 mL para 500 mL de 0,100 M
- 3,7 % frente a ≈ 4,3 % (contraejemplo ilustrativo)
- 20 °C (ISO 1042)

**Pendientes de verificación técnica** (valores de la FAQ y los ejemplos que propone el revisor SEO; los calculé yo, como coordinador):

- 10 mg/L × 100 mL / 1000 mg/L = 1 mL
- NaOH 0,1 M × 500 mL / 1 M = 50 mL
- FD = 250 / 5 = 50

## 5. Correcciones de estilo

La tabla completa de 34 filas está en el informe del corrector, en el registro de la sesión del 2026-10-16. Lo esencial está en §2.3 y §3.

## 6. FAQ propuesta (SEO)

La FAQ se corrigió con el hallazgo T3 del revisor técnico: ppm solo vale si equivale a mg/L.

1. **¿Sirve C1V1 = C2V2 con porcentajes y ppm?** Sí, siempre que C<sub>1</sub> y C<sub>2</sub> estén en la misma unidad **por volumen**: mol/L, mg/L o % p/v. En el caso de las ppm, solo cuando equivalen a mg/L (soluciones acuosas diluidas). No sirve con el % p/p de un reactivo concentrado, porque la densidad cambia: primero hay que pasarlo a molaridad.
2. **¿Qué significa diluir 1:10?** En la notación habitual es 1 parte llevada a 10 partes de volumen final (factor 10), por ejemplo 10 mL llevados a 100 mL. Algunos laboratorios escriben 1:10 para «1 + 10» (factor 11), así que conviene indicar qué notación se usa.
3. **¿V2 es el volumen de agua que hay que añadir?** No: es el volumen final. El agua que se añade es aproximadamente V<sub>2</sub> − V<sub>1</sub>, porque los volúmenes no siempre son aditivos. En la práctica se completa hasta la marca de aforo.
4. **¿Cuándo no se puede usar C1V1 = C2V2?** Cuando el soluto reacciona, cuando se mezclan dos soluciones del mismo soluto (en ese caso C<sub>1</sub>V<sub>1</sub> + C<sub>2</sub>V<sub>2</sub> = C<sub>f</sub>V<sub>f</sub>) y cuando no se lleva a un volumen final medido.
5. **¿Cómo se calcula el factor de dilución?** FD = V<sub>2</sub>/V<sub>1</sub> = C<sub>1</sub>/C<sub>2</sub>. Por ejemplo, 5 mL llevados a 250 mL dan FD = 50 🔢. En diluciones sucesivas, los factores se multiplican.

## 7. Checklist de aplicación

- [ ] C1: corregir el ejemplo o el uso del HCl (decisión del editor: opción a, b, c o d)
- [ ] C2: enlazar `conversor-concentracion` en lugar de `conversor-ppm-mgl` para pasar de molaridad a ppm
- [ ] T3: advertencia sobre ppm y % p/p, con el contraejemplo y el enlace a reactivo comercial y al post de HCl
- [ ] T4–T12: contracción, cifras significativas 🔢, estandarización, procedimiento seguro, «patrón», menisco y GUM
- [ ] Title (A/B) y meta (A/B/C)
- [ ] 🔢 Respuesta directa, ejemplos de 10 mg/L y de NaOH 0,1 M, y sección de factor de dilución (**verificar antes de aplicar**)
- [ ] Estructura de §2.5, `post-formula`, FAQ + `FAQPage`, CTA y enlaces de §2.4
- [ ] Voseo, «nosotros», regionalismos y frases de relleno
- [ ] Imagen (con un prompt corregido) y alt
- [ ] HTML desde la plantilla, entrada en `posts.json` con `og_highlight`, tarjeta para compartir, `sync_indexes.py` y validación
- [ ] Enlaces entrantes desde el post de HCl, espectrofotometría y ppm

## Anexo: criterio de unión

- **Hallazgos fusionados:** conversor equivocado (técnico + SEO), voseo y regionalismos (estilo + SEO), imagen con micropipeta (técnico + SEO) y notación (técnico + estilo).
- **Decisión del editor:** técnico y SEO proponen salidas distintas para el ejemplo del HCl.
- **Informes completos:** quedaron en el registro de la sesión del 2026-10-16.
