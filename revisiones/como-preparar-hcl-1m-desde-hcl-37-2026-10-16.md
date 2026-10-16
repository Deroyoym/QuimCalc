# Revisión editorial — como-preparar-hcl-1m-desde-hcl-37 — 2026-10-16

Artículo: **borrador** `revisiones/borradores/como-preparar-hcl-1m-desde-hcl-37.md` (todavía sin HTML) · URL prevista: https://quimcalc.com/blog/posts/como-preparar-hcl-1m-desde-hcl-37.html

Revisores: revisor-tecnico, corrector-estilo y revisor-seo (subagentes de `.claude/agents/`).

## Resumen

| Área | Críticos | Altos / imprecisos | Menores / sugerencias |
|---|---|---|---|
| Técnica | 6 | 9 | 5 |
| Estilo | — | 14 (voseo, «nosotros», regionalismos) | 27 |
| SEO | 7 (prioridad alta) | 7 (media) | 2 (baja) |

**Veredicto:** el tema es el n.º 1 de `ideas-2026-10-16.md`, pero el borrador no se puede publicar así. Hay tres motivos:

- **El cálculo central está mal.** El ácido al 37 % es **12,08 M**, no 12,06 M. Por eso el volumen correcto es **41,4 mL** y no 41,5 mL; la calculadora del sitio da 41,40 mL y el lector va a ver la diferencia.
- **Hay errores conceptuales y una cita incorrecta.** El texto habla de «porcentaje molar», dice que el ácido es una solución «saturada» y cita ISO 17025 para las campanas de extracción.
- **Le falta lo que lo diferenciaría de la competencia.** No tiene respuesta directa al principio, ni enlaces reales, ni tabla de reactivos, ni las variantes «salfumán» y «ácido muriático». Además, todo el texto está en voseo.

## 1. Críticos

| # | Fuente | Ubicación | Fragmento | Problema | Corrección |
|---|---|---|---|---|---|
| C1 | Técnico | C7 «Cálculos» y «Ejemplo» | «equivale a 12,06 M» | 1,19 × 37 × 10 / 36,46 = **12,076 mol/L** | «≈ 12,1 M» (o 12,08 M si se quieren cuatro cifras) 🔢 |
| C2 | Técnico | C7 «Ejemplo» | «= 41,46 mL» / «medir exactamente 41,5 mL» | 500 / 12,076 = **41,40 mL**. La etiqueta admite entre 36 y 38 %, así que el volumen real va de 40,3 a 42,9 mL y «exactamente» no tiene sentido. | «= 41,4 mL»; «medir unos 41,4 mL», y aclarar que la concentración exacta se obtiene al valorar 🔢 |
| C3 | Técnico + estilo | C7 «Cálculos» | «vincula la masa volumétrica con el porcentaje molar» | El 37 % es un porcentaje **en masa**; la fracción molar de HCl es 0,225. | «relaciona la densidad con el porcentaje en masa (% p/p)» |
| C4 | Técnico | C7 «Por qué…» | «solución acuosa saturada del gas cloruro de hidrógeno» | Es falso: a 20 °C la saturación está en torno al 42 % p/p. | «solución acuosa concentrada de cloruro de hidrógeno, cerca del máximo práctico a temperatura ambiente» |
| C5 | Técnico | C7 «Seguridad» + C10 | «campana… con flujo de aire verificado (ISO 17025)» | ISO 17025 no regula las campanas. | Citar EN 14175 o ANSI/ASHRAE 110, o quitar la cita; también hay que sacar ISO 17025 de las fuentes. |
| C6 | Técnico + SEO | C7 «Cálculos», último párrafo | «a partir de sólidos o líquidos… solución desde sólido con pureza» | Esa calculadora no tiene campo de densidad, así que no sirve para un ácido líquido. | Quitar el párrafo y enlazar `masa-molar` / `concentracion-pp`. |
| C7 | SEO | Title | 68 caracteres, contando el « \| QuimCalc» que agrega la plantilla | Supera el límite de 60. | Usar una alternativa de §2.1. |
| C8 | SEO | Inicio | — | No hay respuesta directa ni resumen, y la keyword no aparece en las primeras 50 palabras. | Agregar un resumen y un primer párrafo con «8,3 mL por cada 100 mL» 🔢 (ver §4). |
| C9 | SEO | Todo C7 | «usá **X** en QuimCalc» ×4 | Ninguna mención es un enlace (`<a>`), son `<strong>`, y además falta el CTA. | Enlaces contextuales (§2.4) y `div.cta-herramienta`. |
| C10 | SEO | Esquema | — | Faltan la tabla de reactivos, el ejemplo con H<sub>2</sub>SO<sub>4</sub>, la sección de estandarización, las variantes salfumán/muriático y las FAQ reales (hay 2; la guía pide de 3 a 5). | Ver §2.5. |

## 2. Importantes

### 2.1 Title y meta

| | Texto | Largo |
|---|---|---|
| Title actual | Cómo preparar HCl 1 M a partir de HCl concentrado al 37 % \| QuimCalc | 68 ❌ |
| **Title A (recomendado por SEO)** | Preparar HCl 1 M desde HCl al 37 %: paso a paso \| QuimCalc | 58 |
| Title B | HCl 1 M desde HCl 37 %: cálculo y calculadora \| QuimCalc | 56 |
| Title C | HCl 1 M desde HCl 37 %: 8,3 mL por cada 100 mL \| QuimCalc | 57 |
| Meta actual | Aprende a preparar y diluir ácido clorhídrico concentrado al 37 % p/p a 1 M paso a paso. Incluye fórmula, cálculos resueltos y precauciones de laboratorio. | 155 (justo en el límite; no da ningún dato) |
| **Meta A (recomendada por SEO)** | Para 100 mL de HCl 1 M se toman 8,3 mL de HCl al 37 % (d = 1,19 g/mL). Fórmula, ejemplo resuelto, seguridad y calculadora gratis. | 129 |
| Meta B | Calcula cuántos mL de HCl al 37 % necesitas para preparar HCl 1 M o 0,1 M. Fórmula con densidad, tabla de reactivos y calculadora online. | 137 (exige la tabla) |
| Meta C | Calcula el volumen de HCl al 37 % para preparar HCl 1 M paso a paso. Sirve también para salfumán o ácido muriático: fórmula, ejemplo y calculadora. | 147 |

El H1 puede quedar como en el campo 1. Los largos están verificados con Python. El valor «8,3 mL» del title C y de la meta A está verificado: 100 / 12,076 = 8,28 mL 🔢.

### 2.2 Imprecisiones técnicas

| # | Fragmento | Corrección |
|---|---|---|
| T7 | «razones de estabilidad sintética y presión de vapor» | «el ~37 % es el máximo práctico: por encima, la presión de vapor de HCl hace que el frasco pierda gas rápidamente» |
| T8 | «reacción de hidratación… provocará proyecciones violentas» | Es calor de dilución, con un efecto moderado en HCl (≈ +4–6 K). El riesgo principal son los vapores; las proyecciones son típicas del H<sub>2</sub>SO<sub>4</sub>. |
| T9 | «altera la expansión volumétrica del vidrio» | Lo que domina es la dilatación de la **solución** (≈ 0,5 mL con ΔT = 5 K, frente a 0,03 mL del vidrio). |
| T10 | «completá hasta la marca… con agua destilada fría» | Aforar con agua a ≈ 20 °C, después de que la solución se haya enfriado. |
| T11 | «molaridad exacta garantiza titulaciones confiables» | Contradice la FAQ 1: la solución preparada **se valora** después. |
| T12 | «pipeta graduada o bureta» para 41,5 mL | Mejor una **probeta de 50 mL** dentro de la campana, que es también lo que dice la calculadora. Si se usa pipeta, siempre con propipeta. |
| T13 | Fórmula sin unidades | Indicar d en g/mL, % como número y MM en g/mol, y explicar de dónde sale el factor 10 (1000 mL/L ÷ 100). |
| T14 | Enlace al conversor de temperatura para «estimar variaciones térmicas» | El conversor solo cambia de unidad: quitar el enlace o reformularlo. |
| T15 | FAQ 1: «su concentración real varía continuamente» | «Sí, si se va a usar en análisis cuantitativo». Agregar ≈ 1,3 g de Na<sub>2</sub>CO<sub>3</sub> por cada 25 mL de HCl 1 M 🔢 y aclarar que para ajustar el pH no hace falta valorarla. |

### 2.3 Voseo, «nosotros» y regionalismos (estilo + SEO)

- **Tratamiento mezclado:** el texto alterna voseo (14 formas: usá, podés, preferís, agregá, verté, completá, recordá, trabajás, necesitás), «nosotros» (aplicamos, obtenemos, imaginemos…), impersonal y tú (la meta). Hay que pasar el cuerpo a impersonal y dejar tú en la meta y en los CTA.
- **Sintaxis rota:** «podés consultar la herramienta usá **solución desde sólido**».
- **Regionalismos:**
  - «campana de extracción» → agregar «(vitrina de gases en España)»
  - «titulaciones confiables» → «valoraciones (titulaciones) fiables»
  - «atemperar» → «dejar que vuelva a 20 °C»
  - «HDPE» → «PEAD (HDPE)»
  - «agua de red» → «agua potable (de la red)»
- **Terminología:** usar «aforar» en lugar de «enrase» (×3), y «densidad» y «% p/p» siempre con el mismo nombre.

### 2.4 Enlaces internos (SEO)

En un post, las rutas se escriben `../../herramientas/<slug>.html`.

| Anchor | Destino | Dónde |
|---|---|---|
| calcula el volumen exacto con la calculadora de dilución desde reactivo comercial | `diluciones-reactivo-comercial.html` | Primer párrafo (calculadora principal) |
| introduce el % y la densidad de tu frasco… | ídem | H2 de la fórmula |
| comprobar con la calculadora de diluciones C<sub>1</sub>V<sub>1</sub> = C<sub>2</sub>V<sub>2</sub> | `calculadora-diluciones.html` | Ejemplo resuelto |
| masa molar del HCl | `masa-molar.html` | Fórmula |
| porcentaje en masa (% p/p) | `concentracion-pp.html` | Fórmula o tabla |
| factor de corrección de la valoración | `calculadora-titulacion.html` | Sección de estandarización |
| qué es la molaridad y cómo se calcula | `que-es-la-molaridad.html` | Fórmula |
| diferencia entre normalidad y molaridad | `normalidad-vs-molaridad.html` | H<sub>2</sub>SO<sub>4</sub> / FAQ 1 N |
| cómo aforar y preparar soluciones estándar | `como-preparar-soluciones-estandar-correctamente.html` | Paso de aforo |

Al publicar, también hay que enlazar este post desde `que-es-la-molaridad.html` (Ejemplo 2) para que los dos artículos se enlacen entre sí.

### 2.5 Estructura propuesta (SEO, con ids cortos)

| H2 | id |
|---|---|
| Cuánto HCl al 37 % se necesita para 1 L de HCl 1 M | `respuesta-rapida` |
| Cómo calcular la molaridad del HCl al 37 % | `molaridad-hcl-37` |
| Ejemplo resuelto: 500 mL de HCl 1 M | `ejemplo-hcl-1m` |
| Ejemplo: H<sub>2</sub>SO<sub>4</sub> 0,5 M desde ácido sulfúrico al 98 % | `ejemplo-h2so4` |
| Tabla de reactivos concentrados comerciales | `tabla-reactivos` |
| Seguridad: siempre el ácido sobre el agua (procedimiento en `<ol>`) | `seguridad` |
| Por qué hay que estandarizar el HCl preparado | `estandarizar` |
| Preguntas frecuentes | `preguntas-frecuentes` |
| Fuentes consultadas | `fuentes-consultadas` |

Además:

- **Fórmulas y ejemplos:** fórmulas en `div.post-formula` y ejemplos en `.ejemplo-bloque`.
- **Línea suelta:** hay que borrar la línea «#preguntas-frecuentes — Preguntas frecuentes» que quedó dentro del cuerpo.
- **Imagen:** el archivo `img/como-preparar-hcl-1m-desde-hcl-37.webp` no existe. El prompt se contradice («labeled HCl» y «no text» a la vez) y conviene escribir el alt cuando la imagen esté hecha.

## 3. Menores y sugerencias

- **Técnica:**
  - Citar la masa molar según IUPAC (36,46, que es correcta).
  - La densidad de la etiqueta suele ser «1,18–1,19 g/mL a 20 °C».
  - Escribir «1,00 M» si se busca precisión.
  - Verificar la cita de Skoog para el rango 36–38 % (o citar ACS/Ph. Eur.).
  - Agregar «etiquetar con concentración valorada y fecha».
- **Estilo:**
  - «Dicho fórmula» → «La fórmula es».
  - «ronda entre» → «oscila entre».
  - «industrias como… el análisis de efluentes» → «sectores como…».
  - «solución HCl 1 M» → «solución de HCl 1 M».
  - «vidrio borosilicato» → «vidrio de borosilicato».
  - Corregir las mayúsculas en la fórmula y los nombres de herramientas.
  - Evitar el doble paréntesis en la FAQ 1.
  - El alt dice «frasco reactivo», que es un calco del inglés: cambiar por «frasco de reactivo».
  - Expresiones a cambiar: «axioma», «valor madre», «física detrás de», «en fase líquida», «trabajo fino».
- **Párrafos a dividir:**
  - En «Seguridad», el procedimiento debe ir como lista de 4 pasos (agua → ácido despacio → enfriar a 20 °C → aforar); hoy la secuencia del texto se contradice.
  - Hay que partir en dos la oración de 36 palabras sobre cómo medir.
- **SEO (baja):**
  - Fechas ISO con día.
  - `article:published_time` debe usar `property=`.
  - Título corto para la miga de pan: «Preparar HCl 1 M».
  - Alta en `posts.json` y correr `sync_indexes.py`.
  - og:image específica del post.
  - HowTo es opcional: solo tiene sentido si el procedimiento va como `<ol>` visible.

## 4. Ejemplos recalculados

Revisor técnico:

```python
d,w,M=1.19,37,36.46
d*w*10/M                      # 12.0762 mol/L ❌ el borrador dice 12,06
500/12.06                     # 41.459 (reproduce el borrador, con C1 erróneo)
500/(d*w*10/M)                # 41.404 mL ❌ el borrador dice 41,46 / 41,5
for w,d in [(36,1.18),(37,1.18),(37,1.19),(38,1.19)]: 500/(d*w*10/36.46)
                              # 42.91 / 41.75 / 41.40 / 40.31 mL
nH=37/36.46; nW=63/18.015; nH/(nH+nW)   # 0.225 (fracción molar, no 0,37)
0.025*1/2*105.99              # 1.32 g Na2CO3 para 25 mL de HCl 1 M
```

La calculadora `diluciones-reactivo-comercial.js` usa la misma fórmula y devuelve 12,0762 mol/L y 41,40 mL: **la calculadora está bien; el borrador, no**.

Coordinador, para los valores que proponen la SEO y la meta:

```python
100/12.0762    # 8.28 mL por cada 100 mL de HCl 1 M  → «8,3 mL» ✅
1000/12.0762   # 82.81 mL por litro → «82,8 mL» (la FAQ del revisor SEO dice 82,9 con 12,06: ❌)
1.19*370       # 440.3 g/L de HCl ✅
```

**Conflicto entre revisores:** la FAQ propuesta por SEO calcula con 12,06 mol/L y obtiene 82,9 mL. El valor correcto es **82,8 mL**, que es el que usa la §6.

**Pendiente de verificación técnica antes de publicar** (valores que calculé como coordinador para la tabla y el ejemplo de H<sub>2</sub>SO<sub>4</sub>; el revisor técnico todavía no los revisó):

| Reactivo | % p/p | d (g/mL) | M aprox. |
|---|---|---|---|
| HCl | 37 | 1,19 | 12,1 |
| H<sub>2</sub>SO<sub>4</sub> | 98 | 1,84 | 18,4 |
| HNO<sub>3</sub> | 65 | 1,40 | 14,4 |
| NH<sub>3</sub> (aq) | 25 | 0,91 | 13,4 |
| Ácido acético glacial | 99,8 | 1,05 | 17,5 |

Ejemplo de H<sub>2</sub>SO<sub>4</sub> 0,5 M: unos 27,2 mL de H<sub>2</sub>SO<sub>4</sub> al 98 % por litro.

**Valores verificados por el revisor técnico (se pueden usar):**

- 12,08 / 12,1 M
- 41,4 mL
- Rango de 40,3 a 42,9 mL según la etiqueta
- 36,46 g/mol
- Fracción molar 0,225
- 1,32 g de Na<sub>2</sub>CO<sub>3</sub>
- ΔT ≈ +4 a +6 K
- 440,3 g/L

## 5. Correcciones de estilo

La tabla completa de 41 filas (fragmento → corrección → motivo) está en el informe del corrector de estilo, en el registro de la sesión del 2026-10-16. Lo esencial está resumido en §2.3 y §3.

## 6. FAQ propuesta (SEO, corregida con los valores verificados)

1. **¿Qué molaridad tiene el HCl al 37 %?** Unos 12 mol/L (12,1 M con d = 1,19 g/mL y una masa molar de 36,46 g/mol; cada litro contiene unos 440 g de HCl). Depende del lote: la riqueza real varía entre el 36 y el 38 %, así que conviene usar los datos de la etiqueta.
2. **¿Cuántos mL de HCl al 37 % se necesitan para 1 L de HCl 1 M?** Unos 83 mL (1000 mL × 1 M / 12,08 M = 82,8 mL). Para 100 mL de HCl 1 M, o para 1 L de HCl 0,1 M, se necesitan unos 8,3 mL. El ácido se añade sobre agua ya colocada en el matraz y después se afora.
3. **¿Es lo mismo 1 N que 1 M?** Para el HCl sí, porque cede un solo protón. Para el H<sub>2</sub>SO<sub>4</sub> no: 1 N equivale a 0,5 M en reacciones ácido-base.
4. **¿Se puede usar salfumán o ácido muriático?** Sirve para limpieza o ajustes aproximados, no para análisis cuantitativo. Es HCl de grado técnico, a menudo de menor riqueza y con impurezas. Hay que usar el % de la etiqueta y valorar la solución (falta verificar la riqueza típica).
5. **¿Hay que estandarizar el HCl 1 M preparado?** Sí, si se va a usar como titulante. Se valora frente a Na<sub>2</sub>CO<sub>3</sub> anhidro secado (≈ 1,3 g por cada 25 mL) y se calcula su factor. Para ajustar el pH no hace falta.

Hay que conservar la FAQ del borrador sobre almacenamiento en PEAD (HDPE) o vidrio de borosilicato, con su etiqueta. Es correcta.

## 7. Checklist de aplicación (aplicado el 2026-10-16, opción «Aplicar todo y maquetar»)

- [x] 🔢 C1–C2: 12,08 M (≈ 12,1) y 41,4 mL, con el rango de 40,3 a 42,9 mL y la nota de valoración
- [x] C3–C4: % p/p (no molar); «concentrado», no «saturado»
- [x] C5: se quitó ISO 17025; se citan EN 14175 y ANSI/ASHRAE 110 (también en las fuentes)
- [x] C6 + T14: fuera solucion-desde-solido y conversor-temperatura
- [x] T7–T13, T15: presión de vapor, calor de dilución moderado en HCl, dilatación de la solución, aforo a 20 °C, probeta de 50 mL + propipeta, unidades y factor 10, estandarización
- [x] Title A (58) + Meta A (129), en las 3 copias + `posts.json`
- [x] 🔢 Resumen y primer párrafo con «8,3 mL por cada 100 mL»
- [x] Estructura de §2.5 con ids cortos, `post-formula`, `.ejemplo-bloque`, `<ol>` y tablas
- [x] 🔢 Ejemplo de H<sub>2</sub>SO<sub>4</sub> 0,5 M (27,2 mL) y tabla de 6 reactivos, **verificados en una segunda pasada del revisor técnico**. Ajustes que pidió: HNO<sub>3</sub> d 1,39; acético 17,4 M; H<sub>2</sub>SO<sub>4</sub> 17,8–18,4 M; se agregó H<sub>3</sub>PO<sub>4</sub>; nota sobre el NH<sub>3</sub> al 28–30 %
- [x] Salfumán y muriático: sin rango numérico (no hay fuente); se dejó la redacción que propuso el revisor técnico
- [x] Estandarización: Na<sub>2</sub>CO<sub>3</sub> 1,32 g y TRIS 3,03 g por cada 25 mL, verificados
- [x] Enlaces internos (5 calculadoras + 3 artículos), CTA a diluciones-reactivo-comercial y barra lateral podada
- [x] FAQ: 6 preguntas (las 5 de §6 + almacenamiento), visibles y en el JSON-LD
- [x] Español neutro: sin voseo ni «nosotros»; «aforar», «vitrina de gases», «PEAD (HDPE)»
- [x] HTML desde la plantilla, alta en `data/posts.json`, `sync_indexes.py`, JSON-LD válido, sin enlaces ni anclas rotas
- [x] Enlace desde `que-es-la-molaridad.html` (Ejemplo 2) hacia este post
- [x] CSS: `.post-layout > article { min-width: 0 }`, para que una tabla ancha no provoque scroll horizontal (detectado a 375 px)
- [x] Imagen `img/como-preparar-hcl-1m-desde-hcl-37.webp` (1672×941, 130 KB), aportada por el autor; alt reescrito según la imagen real. Publicado en main el 2026-10-16
- [ ] Opcional: og:image propia y HowTo (no aplicados)

## Anexo: criterio de unión

- Se fusionaron los hallazgos repetidos: porcentaje molar (técnico + estilo), solución desde sólido y conversor de temperatura (técnico + SEO + estilo), voseo (estilo + SEO) y estandarización (técnico + SEO).
- Los informes completos de los tres revisores quedaron en el registro de la sesión del 2026-10-16.
