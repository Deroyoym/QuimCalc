# Guía editorial del blog de QuimCalc

Referencia obligatoria para escribir y revisar artículos de `quimcalc/blog/posts/`. La usan los subagentes de `.claude/agents/` y los comandos `/revisar-articulo` e `/ideas-blog`.

---

## 1. Público y mercados

- **Quién lee:** estudiantes de química, bioquímica, farmacia e ingeniería, y técnicos y analistas de laboratorio (control de calidad, aguas, alimentos, industria).
- **Dónde está:** el tráfico principal viene de **España**, después **México, Perú, Chile y Argentina**. Un texto que solo se entiende en un país pierde lectores en los demás.
- **Qué busca:** una respuesta concreta (una fórmula, un valor, un procedimiento) y, si puede, calcularlo en el momento. Cada artículo existe para resolver una duda y llevar a una calculadora.

## 2. Español neutro

### 2.1 Tratamiento
- Sin voseo. Nada de «calculá», «tenés», «podés», «usá», «fijate», «necesitás».
- Preferir construcciones impersonales o con «se»: «se pesa», «hay que aforar», «conviene usar».
- Cuando haga falta dirigirse al lector, usar **tú** en todo el artículo, sin mezclarlo con usted: «calcula», «tienes», «puedes». En los botones y CTA alcanza con el infinitivo o el imperativo de tú: «Calcular la masa», «Calcula tu dilución».

### 2.2 Regionalismos
Si un término cambia entre España y LATAM, se mencionan ambos la primera vez y después se usa el más extendido.

| Evitar (regional) | Usar | Nota |
|---|---|---|
| canilla | grifo (ES) / llave (LATAM) | «agua del grifo o de la llave» |
| heladera | nevera (ES) / refrigerador (LATAM) | |
| birome | bolígrafo | |
| pileta (de laboratorio) | fregadero / pila | |
| frasco gotero | gotero | |
| enrasar / aforar | aforar (o «llevar a volumen») | «enrasar» es común en España; se puede mencionar |
| pipetear | pipetear / tomar con pipeta | aceptado en ambos |
| tester | multímetro | |
| nafta | gasolina | |
| ácido muriático | ácido clorhídrico (comercial: «salfumán» en ES, «ácido muriático» en LATAM) | |
| lavandina | lejía (ES) / cloro (LATAM) | hipoclorito de sodio |

- No usar expresiones coloquiales locales («re», «posta», «che», «ahorita», «vale»).
- Las referencias a normas o lugares concretos (Código Alimentario Argentino, Gran Rosario) son válidas si el tema lo exige. En ese caso conviene nombrar el equivalente de otros países cuando exista (RD 3/2023 en España, NOM-127 en México, etc.).

## 3. Unidades y notación química

### 3.1 Unidades SI
- Símbolos del SI sin punto y con espacio entre el número y la unidad: «25 mL», «0,1 mol/L», «298,15 K», «20 °C». Excepción: «%», que también lleva espacio según el SI (ISO 80000), aunque «95%» se tolera en títulos.
- Litro: **L** mayúscula (mL, µL). Mol: **mol** (nunca «moles/L» como unidad). Molaridad: «mol/L» o **M** («0,1 M»).
- Masa molar en **g/mol**. Densidad en **g/mL** o **g/cm³**. Concentración másica en **g/L** o **mg/L**.
- Usar «µ» (micro) y no «u» en el texto visible: «µg/L», «µL».
- Prefijos y unidades nunca en plural ni con punto: «5 g», no «5 grs.» ni «5 gr».

### 3.2 Números
- **Coma decimal** («0,25 g»). Los miles se separan con espacio fino (`&#8239;`) o sin separador: «1500 mL», «10&#8239;000 ppm». Nunca punto de miles: es ambiguo para el público de España y México.
- Notación científica: «6,022 × 10<sup>23</sup> mol<sup>−1</sup>» (signo × y signo menos real «−»).
- **Cifras significativas:** el resultado no puede tener más precisión que el dato menos preciso. Si se pesó con una balanza de 0,1 mg, se informan 4 decimales en gramos, no 7.

### 3.3 Fórmulas y reacciones
- Subíndices y superíndices con HTML: H<sub>2</sub>SO<sub>4</sub>, Ca<sup>2+</sup>, SO<sub>4</sub><sup>2−</sup>. Nunca «H2SO4» en el texto visible (en `<title>`, meta y JSON-LD sí va texto plano o caracteres Unicode: H₂SO₄).
- Flechas: reacción completa **→**, equilibrio **⇌**. No usar «->» ni «=».
- Estados de agregación en las ecuaciones: (s), (l), (g), (ac) (o (aq), pero siempre la misma en el artículo).
- Ecuaciones balanceadas, con las cargas cuadrando.
- Constantes: usar valores CODATA/IUPAC y citarlas con sus cifras (N<sub>A</sub> = 6,022 140 76 × 10<sup>23</sup> mol<sup>−1</sup>; R = 8,314 J·mol<sup>−1</sup>·K<sup>−1</sup>). Masas atómicas de IUPAC (Na 22,990; Cl 35,45; C 12,011; H 1,008; O 15,999; N 14,007; S 32,06; Ca 40,078; K 39,098).
- Fórmulas destacadas dentro de `<div class="post-formula" role="note" aria-label="…">`.

## 4. Tono

- **Didáctico y directo:** explicar como un buen docente de laboratorio. Primero la respuesta, después el porqué.
- Frases cortas; párrafos de **3–4 oraciones** (máximo ~90 palabras).
- Cada término técnico se define la primera vez que aparece.
- Ejemplos **realistas**: masas que se pueden pesar (no 0,000 01 g ni 3 kg para 100 mL), volúmenes de material existente (matraces de 50, 100, 250, 500, 1000 mL; pipetas de 1, 5, 10, 25 mL), reactivos y purezas comerciales (NaOH 98–99 %, HCl 37 % d = 1,19 g/mL, H<sub>2</sub>SO<sub>4</sub> 95–98 % d = 1,84 g/mL).
- Nada de relleno («en el apasionante mundo de la química…»), ni promesas exageradas, ni frases genéricas que podrían ir en cualquier artículo.
- Seguridad: si el procedimiento lo requiere (ácidos concentrados, NaOH sólido, solventes), una advertencia breve («siempre el ácido sobre el agua»).

## 5. Estructura recomendada de un artículo

1. **`<title>`** ≤ 60 caracteres, con la keyword al principio. **Meta description** ≤ 155, con un beneficio concreto (fórmula, ejemplo, calculadora) y sin repetir el title.
2. **H1** (`post-header__titulo`): la pregunta o la keyword principal, uno solo por página.
3. **Resumen** (`post-header__resumen`): 1–2 oraciones.
4. **Primer párrafo:** respuesta directa en ≤ 50 palabras, con la keyword principal. Es lo que Google puede mostrar como fragmento destacado.
5. **H2: definición / concepto.**
6. **H2: fórmula** en un `post-formula`, con cada variable explicada y su unidad.
7. **H2: ejemplo resuelto paso a paso**, con datos realistas y el resultado con las cifras significativas correctas. Enlace a la calculadora para comprobarlo.
8. **H2: errores comunes / consejos de laboratorio** (H3 por error).
9. **H2: preguntas frecuentes**, 3–5 preguntas reales de búsqueda, con H3 por pregunta. Las mismas preguntas y respuestas en el JSON-LD `FAQPage`.
10. **CTA** (`div.cta-herramienta`) hacia la calculadora principal.
11. Sidebar con artículos relacionados (la genera la plantilla).

Los H2 llevan `id` en minúsculas y con guiones (`id="ejemplo-resuelto"`). No saltar niveles (H2 → H4).

## 6. SEO técnico

- `<link rel="canonical">` absoluto a `https://quimcalc.com/blog/posts/<slug>.html`.
- Meta description repetida **igual** en `description`, `og:description` y `twitter:description`; el title igual en `og:title` y `twitter:title`.
- JSON-LD `Article` (headline = H1, `datePublished`, `dateModified` actualizado si hay cambios de contenido) + `FAQPage` si hay FAQ. `HowTo` solo si el artículo es un procedimiento con pasos numerados reales.
- Imágenes en `.webp`, con `alt` descriptivo (qué se ve, no «imagen 1»), `width`/`height` y `loading="lazy"` salvo la principal.
- Los metadatos del post también están en `data/posts.json` (title, description, image_alt). Si se cambian en el HTML, hay que cambiarlos ahí y correr `python3 scripts/sync_indexes.py`.

## 7. Enlazado interno

### 7.1 Reglas
- **Calculadora principal:** al menos **un enlace contextual** dentro de los dos primeros H2, más el CTA final. El anchor describe la acción: «calcula la masa con la [calculadora de molaridad](…)», no «haz clic aquí».
- **Calculadoras secundarias:** 1–3 enlaces donde el texto las mencione de forma natural.
- **Otros artículos:** 2–3 enlaces a posts relacionados, con anchors que describan el tema del destino.
- No repetir el mismo destino más de 2 veces en el cuerpo. No enlazar el mismo anchor a dos destinos distintos.
- Rutas relativas desde un post: `../../herramientas/<slug>.html` y `<slug>.html` para otros posts. Comprobar que el archivo existe.

### 7.2 Mapa de calculadoras (`quimcalc/herramientas/`)

| Calculadora | Temas que deben enlazarla |
|---|---|
| `calculadora-molaridad.html` | molaridad, preparar soluciones, masa a pesar |
| `solucion-desde-solido.html` | soluciones desde sólido con pureza o hidratos |
| `calculadora-diluciones.html` | C<sub>1</sub>V<sub>1</sub> = C<sub>2</sub>V<sub>2</sub>, diluir |
| `diluciones-reactivo-comercial.html` | ácidos/bases concentrados (% p/p + densidad) |
| `diluciones-seriadas.html` | diluciones seriadas, estándares de calibración, microbiología |
| `conversor-ppm-mgl.html` | ppm, mg/L, ppb |
| `conversor-concentracion.html` | mol/L ↔ g/L ↔ mg/dL y otras |
| `concentracion-pp.html` | % p/p, % p/v, % v/v |
| `masa-molar.html` | masa molar, peso molecular |
| `calculadora-ph.html` | pH de ácidos y bases |
| `calculadora-buffers.html` | buffers, Henderson-Hasselbalch |
| `tabla-pka.html` | pKa, elección de buffer |
| `tabla-indicadores.html` | indicadores, punto final |
| `calculadora-titulacion.html` | titulación, volumetría, factor |
| `curva-calibracion.html` | curva de calibración/calibrado, regresión, Beer-Lambert |
| `lod-loq.html` | límite de detección/cuantificación |
| `incertidumbre.html` | incertidumbre de medición, GUM |
| `estadistica-laboratorio.html` | media, desviación, CV, outliers (Grubbs, Dixon) |
| `recuperacion-error.html` | % recuperación, exactitud, validación |
| `dureza-agua.html` | dureza, CaCO<sub>3</sub>, EDTA |
| `calculadora-rendimiento.html` | rendimiento de reacción, reactivo limitante |
| `conversor-temperatura.html` | °C, K, °F |
| `tabla-periodica.html`, `tabla-solubilidad.html` | consulta de elementos y sales |

La lista completa y actual está en `data/tools.json`, y la de artículos en `data/posts.json`.
