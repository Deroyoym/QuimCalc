# Revisión editorial — como-calcular-el-ph — 2026-10-24

Artículo: **borrador** `revisiones/borradores/como-calcular-el-ph.md` (todavía sin HTML) · URL prevista: https://quimcalc.com/blog/posts/como-calcular-el-ph.html

Revisores: revisor-tecnico, corrector-estilo y revisor-seo (`.claude/agents/`).

## Resumen

| Área | Críticos | Altos / imprecisos | Menores / sugerencias |
|---|---|---|---|
| Técnica | 2 | 11 (incluye notación) | 5 |
| Estilo | — | 19 (voseo, «nosotros») | 25 |
| SEO | 7 (prioridad alta) | 6 (media) | 3 (baja) |

**Veredicto:** el planteamiento es correcto y el tema es el n.º 3 de `ideas-2026-10-16.md`, pero el borrador tiene errores de fondo y le faltan piezas.

- **Errores técnicos:**
  - El **pH del ácido acético 0,1 M es 2,88, no 2,87**: el 2,87 sale de truncar, no de redondear.
  - Presenta el **H<sub>2</sub>SO<sub>4</sub> como ácido de disociación completa**.
  - Dice que en soluciones muy diluidas basta con la cuadrática, cuando **también hay que sumar el aporte del agua**.
  - Atribuye a la **ISO 3696** algo que esa norma no dice.
- **SEO:** el title supera los 60 caracteres, no hay respuesta directa al principio y no tiene ningún enlace real. Faltan además el ejemplo de base débil, el caso en que falla la aproximación, la tabla ICE, el CTA y la sección de errores comunes.
- **Estilo:** todo el texto está en voseo y primera persona del plural, con notación en texto plano (10-5, H+, Ka).

## 1. Críticos

| # | Fuente | Ubicación | Fragmento | Problema | Corrección |
|---|---|---|---|---|---|
| C1 | Técnico | Fuertes, l. 42 | «el ácido sulfúrico (H2SO4), se disocian completamente… ácido monoprótico» | Solo se disocia por completo la 1.ª etapa; la 2.ª tiene K<sub>a2</sub> ≈ 1,0 × 10<sup>−2</sup> (pK<sub>a</sub> 1,99 en la tabla del sitio). Para H<sub>2</sub>SO<sub>4</sub> 0,01 M el pH es **1,85**, no 2,00 ni 1,70. | Usar HCl, HNO<sub>3</sub> y HClO<sub>4</sub> como ejemplos de ácido fuerte y explicar el H<sub>2</sub>SO<sub>4</sub> aparte. 🔢 |
| C2 | Técnico | Débiles, l. 56 | «extremadamente diluida… debés usar la ecuación cuadrática completa» | Por debajo de ~10<sup>−6</sup> M la cuadrática también falla: hay que sumar los H<sup>+</sup> del agua (K<sub>w</sub>). Por ejemplo, HCl 1,0 × 10<sup>−8</sup> M tiene pH **6,98**, no 8. La aproximación también falla cuando K<sub>a</sub> es grande respecto de C. | Reescribir la frase y agregar la sección «Cuándo falla la aproximación» con números. 🔢 |
| C3 | Técnico (+ SEO, que lo repite) | Ejemplo l. 64, FAQ l. 73 | «pH de 2,87» | −log(1,3229 × 10<sup>−3</sup>) = 2,8785, que redondea a **2,88**. La cuadrática también da 2,88 y la calculadora muestra 2,8785. | Cambiar a 2,88 en todas partes. Las metas que propone SEO también decían 2,87 y quedan corregidas en §2.1. 🔢 |
| C4 | SEO | Title | 66 caracteres con « \| QuimCalc» | Supera el límite de 60. | Alternativas en §2.1. |
| C5 | SEO + estilo | Meta | «Aprendé cómo calcular…» | Voseo y ningún dato concreto. | §2.1. |
| C6 | SEO | Inicio | — | No hay respuesta directa; la keyword no aparece en las primeras 50 palabras y falta el resumen. | Primer párrafo con la fórmula y dos resultados. 🔢 |
| C7 | SEO + estilo | Todo C7 | «ingresando a /herramientas/calculadora-ph.html» | Las rutas están pegadas como texto: no hay ningún enlace real, ni CTA, ni `post-formula`, ni `ejemplo-bloque`. | Enlaces de §2.4 y `div.cta-herramienta`. |

## 2. Importantes

### 2.1 Title y meta

| | Texto | Largo |
|---|---|---|
| Title actual | Cómo calcular el pH de ácidos y bases fuertes y débiles \| QuimCalc | 66 ❌ |
| **Title A (recomendado por SEO)** | Cómo calcular el pH de ácidos y bases: 4 ejemplos \| QuimCalc | 60 |
| Title B | Cómo calcular el pH: fórmulas y 4 ejemplos \| QuimCalc | 53 |
| Title C | Cómo calcular el pH paso a paso, con 4 ejemplos \| QuimCalc | 58 |
| Meta actual | Aprendé cómo calcular el pH de ácidos y bases con fórmulas, la tabla ICE y la aproximación del 5 %. Incluye ejemplos resueltos paso a paso. | 139 (voseo) |
| **Meta B (recomendada, corregida a 2,88)** | El ácido acético 0,1 M tiene pH 2,88, no 1,00. Aprende a calcular el pH de ácidos y bases débiles y fuertes con 4 ejemplos y compruébalo gratis. | 144 |
| Meta A (corregida a 2,88) | Cómo calcular el pH paso a paso: HCl 0,01 M da pH 2,00 y ácido acético 0,1 M, pH 2,88. Fórmulas, criterio del 5 % y 4 ejemplos resueltos. | 137 |
| Meta C | Fórmula del pH para ácidos y bases fuertes y débiles, aproximación √(Ka·C) y cuándo falla. Ejemplos con HCl, NaOH, acético y NH₃ resueltos y calculadora. | 153 |

- El H1 se mantiene.
- Para que «4 ejemplos» sea cierto hay que agregar el ejemplo de NH<sub>3</sub> 0,1 M y pasar el de NaOH a un `ejemplo-bloque`.
- No conviene usar «calculadora» en el title ni en el H1: compite con `calculadora-ph.html`.

### 2.2 Imprecisiones técnicas

| # | Fragmento | Corrección |
|---|---|---|
| H1 | «la suma… siempre es igual a 14,00 (NIST WebBook)» | Vale solo a 25 °C (pK<sub>w</sub> = 13,995). A otras temperaturas cambia: 14,94 a 0 °C y 13,62 a 37 °C. El NIST WebBook no tabula K<sub>w</sub>: hay que citar el CRC u otra fuente. |
| H2 | «el pOH mide la concentración de iones hidroxilo» | Se define de forma análoga a la actividad. Usar «hidróxido» (IUPAC). |
| H4 | «Ka·Kb = 10-14» | Vale solo para un **par conjugado**, y el producto es K<sub>w</sub> (1,0 × 10<sup>−14</sup> a 25 °C). Ejemplo: K<sub>b</sub> del acetato = 5,7 × 10<sup>−10</sup>. 🔢 |
| H5 | «agua destilada… 5,5 y 6,0 (ISO 3696)» | La ISO 3696 solo fija pH 5,0–7,5 para el agua de grado 3. El valor de ≈ 5,6 se explica por el CO<sub>2</sub> del aire. 🔢 |
| H6 | «la mayoría de los reactivos y analitos orgánicos… no se disocian al 100 %» | Corregir a «la mayoría de los ácidos y bases orgánicos son débiles». |
| H7 | «C mucho mayor que Ka» | Criterio cuantitativo: C/K<sub>a</sub> ≳ 400 (con 100, la disociación ya es del 10 %). Verificar siempre que x/C < 0,05. 🔢 |
| H8 | «se cumple perfectamente» | Escribir «la disociación (1,3 %) es menor que el 5 %; la cuadrática da el mismo pH». |
| H9 | «0,01 M → pH 2,00» | Cifras significativas: escribir los datos como 0,0100 M y 0,100 M. |
| H10 | «para verificar este o cualquier otro cálculo» | La calculadora del sitio solo aplica la aproximación: para acético 1,0 × 10<sup>−3</sup> M da 3,88 en lugar de 3,91, y para HCl 1 × 10<sup>−8</sup> M da 8,00. Hay que limitar la frase a «este ejemplo». |
| N1 | «10-5», «H+», «OH-», «H2SO4», «Ka», «-log» | 10<sup>−5</sup>, H<sup>+</sup>, OH<sup>−</sup>, H<sub>2</sub>SO<sub>4</sub>, K<sub>a</sub> y «−log», con las fórmulas en `post-formula`. Agregar la ecuación de equilibrio con estados de agregación. |

### 2.3 Voseo, «nosotros» y regionalismos (estilo + SEO)

- **Tratamiento:** hay 16 formas de voseo (conocés, podés, debés, usá, imaginá, necesitás, agregás, trabajás, calculás, usás…), unas 14 en primera persona del plural (aproximamos, analizamos, veamos, preparamos, obtenemos, «nuestra aproximación»…) y algunas formas de tú (obtendrás, estarás, deberás). Corrección: forma impersonal en el cuerpo y tú en el CTA.
- **Regionalismos:**
  - «mesada» (×2) → «mesa de laboratorio».
  - «pehachímetro» → «pHmetro».
  - «solución» → «solución (o disolución)» en la primera mención.
  - «solución amortiguadora» → «solución amortiguadora (tampón o buffer)».
  - Opcional: «industria aceitera» → un ejemplo más general.
- **Relleno a eliminar:** «Dicho esto… radicalmente», «Veamos primero», el párrafo «Para agilizar tu trabajo diario… herramientas digitales», «el sistema cambiará por completo».

### 2.4 Enlaces internos (SEO)

| Texto del enlace | Destino | Dónde |
|---|---|---|
| calculadora de pH | `../../herramientas/calculadora-ph.html` | Respuesta directa |
| comprueba el resultado con la calculadora de pH | ídem | Ejemplo de ácido fuerte |
| tabla de pKa y Ka de ácidos comunes | `../../herramientas/tabla-pka.html` | Sección de ácidos débiles |
| calculadora de buffers (Henderson-Hasselbalch) | `../../herramientas/calculadora-buffers.html` | Frase final sobre tampones |
| qué es el pKa y cómo usar buffers | `que-es-el-pka-y-como-usar-buffers.html` | Ídem |
| diferencias entre normalidad y molaridad | `normalidad-vs-molaridad.html` | Mención del H<sub>2</sub>SO<sub>4</sub> diprótico |

Además conviene enlazar este post desde `calculadora-ph.html` (en «Para profundizar»), desde `que-es-el-pka-y-como-usar-buffers.html` y desde `errores-comunes-titulacion.html`.

### 2.5 Estructura propuesta

Cada sección lleva su id (entre paréntesis):

1. Respuesta directa
2. Fórmula del pH y del pOH (`formula-ph-poh`)
3. Ácidos y bases fuertes (`acidos-bases-fuertes`), con el H<sub>2</sub>SO<sub>4</sub> como excepción
4. Ácidos débiles: tabla ICE y K<sub>a</sub> (`acidos-debiles`), con la tabla ICE y la cuadrática
5. Bases débiles: el amoníaco (`bases-debiles`)
6. Ejemplos resueltos (`ejemplos-resueltos`): HCl, NaOH, acético y NH<sub>3</sub>
7. Cuándo falla la aproximación (`cuando-falla-la-aproximacion`): acético 1,0 × 10<sup>−3</sup> M y HCl 10<sup>−8</sup> M
8. Errores comunes (`errores-comunes`)
9. Preguntas frecuentes (`preguntas-frecuentes`)
10. Fuentes consultadas (`fuentes-consultadas`)

Datos para `posts.json`: `og_highlight` = «pH 2,88 · ácido acético 0,1 M». La lectura pasa a unos 8 min.

## 3. Menores y sugerencias

- **Técnica:**
  - Mostrar la diferencia entre actividad y concentración (HCl 0,010 M: pH medido ≈ 2,04).
  - Escribir «K<sub>a</sub> = 1,75 × 10<sup>−5</sup> (pK<sub>a</sub> 4,756)» para enlazarlo con la tabla.
  - Citar con capítulo el criterio del 5 % de Harris, o presentarlo como «regla práctica».
- **Estilo:**
  - «El concepto de pH es una medida» → «El pH es una medida».
  - Quitar la redundancia «concentración de [H<sup>+</sup>]».
  - Corregir el gerundio de posterioridad («formando ácido carbónico»).
  - Poner coma antes de «pero».
  - Usar «restar de 14».
  - Escribir «octubre de 2026».
  - Cambiar el H2 «Ejemplos resueltos…» porque hoy tiene un solo ejemplo.
- **SEO:**
  - Alt sin regionalismos que describa la imagen real.
  - `property="article:published_time"`.
  - Tarjeta og propia.
  - Que la FAQ no copie la FAQ de la calculadora.

## 4. Ejemplos recalculados (revisor técnico)

```python
from math import sqrt, log10
-log10(0.01)                       # HCl 0,0100 M → 2,00 ✅
14+log10(0.01)                     # NaOH 0,0100 M → 12,00 ✅
Ka,C=1.75e-5,0.1
x=sqrt(Ka*C); -log10(x); 100*x/C  # 1,3229e-3 · 2,8785 → 2,88 (❌ el borrador dice 2,87) · 1,32 %
(-Ka+sqrt(Ka**2+4*Ka*C))/2         # 1,314e-3 → pH 2,8814 → 2,88
# H2SO4 0,0100 M, Ka2 = 10^-1,99 → [H+] = 0,0142 M → pH 1,85
# HCl 1,0e-8 M con Kw → [H+] = 1,05e-7 → pH 6,98
# NH3 0,10 M, Kb 1,8e-5 → aprox. [OH-] 1,34e-3, pOH 2,87, pH 11,13 (1,34 %); cuadrática pH 11,12
# Acético 1,0e-3 M → aprox. pH 3,88 (13,2 % ❌ no vale); cuadrática pH 3,91 (12,4 %)
# HF 0,10 M (pKa 3,17) → aprox. 2,09 (8,2 %); cuadrática 2,10
# Kb(acetato) = 1e-14/1,75e-5 = 5,7e-10 · umbral del 5 %: C/Ka ≳ 400 · agua con CO2: pH ≈ 5,6
```

**Conflicto entre revisores** (decisión del editor):

- **pH del acético:** el revisor SEO usa **2,87** en sus metas y su FAQ; el revisor técnico verificó **2,88**, que es el valor que se usa.
- **Caso en que falla la aproximación:** SEO propone el acético 1 × 10<sup>−4</sup> M. Lo comprobé y es correcto (34 %; pH 4,47 con la cuadrática frente a 4,38 con la aproximación), pero se prefiere el acético **1,0 × 10<sup>−3</sup> M** (pH 3,91 frente a 3,88), que verificó el revisor técnico.
- **pH del agua destilada:** SEO dice «5,5–6,0»; el revisor técnico calculó ≈ 5,6 y propone redactarlo con ese valor y la aclaración sobre la ISO 3696.

## 5. Correcciones de estilo

La tabla completa (44 filas) está en el informe del corrector, en el registro de la sesión del 2026-10-24. Lo esencial está en §2.3 y §3.

## 6. FAQ propuesta (SEO, corregida con los valores verificados)

1. **¿Cómo se calcula el pH de un ácido fuerte?** [H<sup>+</sup>] = C (ácidos monopróticos) y pH = −log[H<sup>+</sup>]. Por ejemplo, HCl 0,0100 M → pH 2,00. Por debajo de unos 10<sup>−6</sup> M hay que sumar los H<sup>+</sup> del agua.
2. **¿Por qué el pH de un ácido débil no es −log C?** Porque solo se disocia en parte. Para el acético 0,1 M, −log C daría 1,00, pero solo se disocia el 1,3 %: [H<sup>+</sup>] ≈ 1,32 × 10<sup>−3</sup> M y el pH es **2,88**.
3. **¿Cómo se calcula el pH de una base débil como el amoníaco?** Se usa K<sub>b</sub>. Para NH<sub>3</sub> 0,10 M: [OH<sup>−</sup>] = 1,34 × 10<sup>−3</sup> M, pOH 2,87 y pH 11,13. Para un par conjugado, K<sub>b</sub> = K<sub>w</sub>/K<sub>a</sub>.
4. **¿Cuándo no se puede usar [H<sup>+</sup>] = √(K<sub>a</sub>·C)?** Cuando la disociación supera el 5 % (C/K<sub>a</sub> < ~400). En ese caso se resuelve la cuadrática: el acético 1,0 × 10<sup>−3</sup> M tiene pH 3,91, no 3,88.
5. **¿Qué pH tiene el agua destilada?** 7,00 en teoría (a 25 °C). Expuesta al aire, ≈ 5,6 por el CO<sub>2</sub> que absorbe. Por eso no sirve para calibrar un pHmetro: para eso se usan soluciones tampón certificadas.

## 7. Checklist de aplicación (aplicado el 2026-10-24, «Aplicar todo y maquetar», title A + meta B)

- [x] 🔢 C1: H<sub>2</sub>SO<sub>4</sub> como excepción (pH 1,85 para 0,0100 M, ni 2,00 ni 1,70); ácidos fuertes de ejemplo: HCl, HNO<sub>3</sub>, HClO<sub>4</sub>
- [x] 🔢 C2: sección «Cuándo falla la aproximación» (acético 1,0 × 10<sup>−3</sup> M → 3,91 frente a 3,88; HF 0,10 M → 2,10) y aporte del agua (HCl 1,0 × 10<sup>−8</sup> M → 6,98)
- [x] 🔢 C3: 2,88 en el ejemplo, la FAQ, la meta y `og_highlight`
- [x] H1–H10, N1: p<sub>Kw</sub> según la temperatura (14,94 a 0 °C, 13,62 a 37 °C), hidróxido, par conjugado, ISO 3696 (solo grado 3), ácidos orgánicos débiles, C/K<sub>a</sub> ≳ 400, datos con cifras significativas (0,0100 / 0,100 M), notación con sub/sup y «−»; se quitó la cita al NIST WebBook
- [x] Title A (60) + meta B (144), en las 3 copias + JSON-LD + `posts.json`
- [x] 🔢 Respuesta directa, tabla ICE, cuadrática, ejemplos de HCl, NaOH, acético y NH<sub>3</sub> (11,12 exacto / 11,13 por aproximación) en `ejemplo-bloque`
- [x] Estructura de §2.5 con ids cortos, FAQ (5) + `FAQPage`, 5 errores comunes, CTA a la calculadora de pH
- [x] Enlaces: calculadora de pH (2 + CTA), tabla de pKa, calculadora de buffers, 4 posts (molaridad, normalidad, pKa, titulación en la barra lateral)
- [x] Enlaces entrantes: calculadora-ph («Para profundizar»), que-es-el-pka-y-como-usar-buffers (#ka-pka), errores-comunes-titulacion (error 3)
- [x] Español neutro: sin voseo, «nosotros», «mesada» ni «pehachímetro»; relleno eliminado
- [x] **Calculadora de pH corregida y publicada** (decisión del usuario): solución exacta con K<sub>w</sub>, % de disociación, aviso cuando la aproximación no vale; se corrigieron el H<sub>2</sub>SO<sub>4</sub> y la FAQ «C/Ka > 100» de su página
- [x] JSON-LD válido, sin enlaces ni anclas rotas, sin scroll horizontal a 375/1366 px, `sync_indexes.py`
- [ ] **Imagen** `img/como-calcular-el-ph.webp`: pendiente. Al recibirla: `width`/`height`, revisar el alt, `node scripts/build_og_images.mjs como-calcular-el-ph` y publicar en main

## Anexo: criterio de unión

- **Duplicados fusionados:** voseo y notación (estilo + técnico + SEO), rutas como texto (estilo + SEO), alcance de la calculadora (técnico + SEO) y criterio C/K<sub>a</sub> (técnico + SEO).
- **Contradicciones resueltas a favor del revisor técnico:** el pH 2,87 frente a 2,88 y el pH del agua destilada.
- Los informes completos quedaron en el registro de la sesión del 2026-10-24.
