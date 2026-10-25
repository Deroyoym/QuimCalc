# Investigación: versión en inglés de QuimCalc — 2026-10-25

> **Limitaciones del método:** la herramienta WebSearch usa un índice de EE. UU. y no reproduce el orden exacto de Google, así que «quién rankea» quiere decir «quién aparece de forma sistemática en los primeros resultados». **No encontré datos públicos fiables de volumen** para ninguna keyword (la única cifra que apareció, de seodata.dev, era de otra keyword, «mole to mole ratio calculator» con 1.300/mes en EE. UU., y no sirve para esto). Por eso la demanda es una estimación cualitativa: me baso en cuántos sitios grandes construyeron una página para esa búsqueda, si hay granjas de spam/SEO parasitario (señal de que la keyword vale algo comercialmente) y si es una búsqueda escolar masiva o de nicho de laboratorio. Hay que confirmarla con Google Keyword Planner o con Search Console antes de escalar.

## Resumen ejecutivo

- **Sí conviene un piloto en /en/, acotado.** Los temas escolares masivos (molaridad, masa molar, % de rendimiento, temperatura, tabla periódica) están dominados por Omni, Pearson Channels, Inch Calculator, calculate.co.nz, 8gwifi y Firgelli. Ahí QuimCalc no tiene ventaja.
- **El hueco está en la química analítica / control de calidad (QC):** LOD/LOQ, curva de calibración, Grubbs/Dixon, incertidumbre GUM, recuperación por adición (spike) y dilución desde un ácido comercial con densidad y pureza. En esos temas los primeros resultados son pocas calculadoras de nicho, a menudo de una sola función (lab-training.com, GraphPad para Grubbs), PDFs, paquetes de R, vendedores de plantillas Excel (ISOBudgets) y bastante spam autogenerado.
- Esos son los diferenciales de QuimCalc: varios métodos de LOD en una página, residuales, Grubbs y Dixon juntos con CV% e IC, presupuesto GUM gratis y en el navegador.
- **Piloto recomendado (6):** lod-loq, curva-calibracion, estadistica-laboratorio, incertidumbre, diluciones-reactivo-comercial y recuperacion-error. **Posts (3):** LOD/LOQ, Dixon vs Grubbs y HCl 1 M desde 37 %.
- **Hoy el riesgo es la autoridad del dominio:** en Search Console, mayo–junio de 2026, la página con más impresiones fue lod-loq.html con 121. Hay que esperar resultados lentos: medir a 8, 12 y 24 semanas antes de decidir si se escala.
- Es necesario implementar bien hreflang (hoy no existe en ninguna página), el sitemap con las URLs /en/, y `build_layout.py`/`sync_indexes.py` con soporte de idioma.

## Tabla de las 24 calculadoras

| Calculadora (slug ES) | Keyword EN principal | Demanda | Competencia (quién rankea) | Hueco / diferencial QuimCalc | Clase |
|---|---|---|---|---|---|
| lod-loq | LOD LOQ calculator / how to calculate LOD and LOQ | Media (nicho, pero sostenida: farma/ICH; hay spam que la apunta) | lab-training.com (solo σ/pendiente), ConductScience, RedCrab (solo fórmulas), BiteSizeBio/thebricks (tutoriales de Excel), PDF de la UPRM, metricgate | Fuerte: 3 métodos (blanco 3σ/10σ, curva ICH, S/N) y paso a paso. Pocos competidores con todo junto | **A** |
| curva-calibracion | calibration curve calculator | Media | calculate.co.nz (pendiente, R², residuales), Omni (solo adición estándar), paquete R chemCal y muchas páginas spam «Free Online Calibration Curve Calculator & Plotter» | Fuerte: regresión + R² + residuales + LOD/LOQ + interpolación de muestras en una sola página. Omni no tiene la calibración externa básica | **A** |
| estadistica-laboratorio | Grubbs test calculator / Dixon Q test calculator | Media (Grubbs), baja-media (Dixon) | Grubbs: GraphPad QuickCalcs (muy fuerte) y SPC for Excel. Dixon: SERP pobre (metricgate, cloudnet.se y mucho spam) | Grubbs y Dixon juntos, más media/DE/CV%/IC 95 % y contexto ISO 5725. Ganable sobre todo con «Dixon Q test calculator» y long tails como «Grubbs and Dixon outlier test» | **A** |
| incertidumbre | measurement uncertainty calculator (GUM) | Media-baja (laboratorios ISO 17025, metrología) | ISOBudgets (plantillas pagas y consultoría), metricgate, simpledecisionmaker, artículos de Westgard/HPS | Claro: presupuesto GUM gratis en el navegador con Tipo A/B, combinada y expandida. Al buscar «ISO 17025 uncertainty budget online» casi todo es de un vendedor | **A** |
| diluciones-reactivo-comercial | concentrated acid dilution calculator / how to prepare 1 M HCl from 37% | Media-alta como pregunta (mucho spam y PDFs parásitos en la SERP = señal de demanda) | Sigma-Aldrich/Merck (calculadora de normalidad/molaridad de ácidos), mason.gmu.edu (tabla), Pearson (soluciones de libro), OpenWetWare, apps pagas | Calcula volumen a tomar desde % p/p + densidad + masa molar para cualquier reactivo (no solo una lista fija). La SERP informativa es débil | **A** |
| recuperacion-error | spike recovery calculator / percent recovery calculator analytical | Baja-media | calculator.academy, handymath, PDFs de USGS, blog de Welch, documentación de Agilent; «percent recovery calculator» genérico = granjas de spam (y se confunde con la recuperación de recristalización) | Claro: recuperación + error absoluto/relativo + CV% con criterios de aceptación. Poca oferta seria | **A** |
| calculadora-ph | pH calculator / pH of weak acid calculator | Alta (escolar) | Pearson Channels (cuadrática), 8gwifi (balance de cargas), LibreTexts, Gonzaga, AAT Bioquest, Omni | Resolver el equilibrio exacto es un diferencial real, pero 8gwifi/Pearson ya lo ofrecen y el volumen es estudiantil, con sitios de mucha autoridad | B |
| calculadora-buffers | Henderson Hasselbalch calculator / buffer pH calculator | Alta (escolar/bio) | Omni, Pearson, calculate.co.nz, RedCrab, Firgelli, miniwebtool | Poco diferencial (relación base/ácido, que ya está en Pearson/Omni) | B |
| calculadora-diluciones | dilution calculator C1V1=C2V2 | Alta | calculate.co.nz, Bio-Techne, ApexBio, Kanaries (multilingüe), Omni, TutorChase | Ninguno fuerte; SERP saturada de proveedores biotecnológicos | B (después del piloto, por enlazado interno) |
| diluciones-seriadas | serial dilution calculator | Media-alta | Omni, AAT Bioquest, calculate.co.nz, Pearson, spam | Tabla de volúmenes por tubo; Omni y AAT ya lo cubren bien | B |
| calculadora-titulacion | titration calculator | Media-alta (escolar) | calculate.co.nz, Firgelli, AAT Bioquest, 8gwifi, TutorChase, PlanetCalc (con incertidumbre) | Muestra sólida con % y masa: diferencial moderado | B |
| conversor-ppm-mgl | ppm to mg/L converter | Alta | Omni e Inch Calculator (ambos ya usan la densidad), Pearson (ppm a molaridad) y spam | El diferencial de la densidad ya lo tienen Omni/Inch, así que el hueco es chico | B |
| concentracion-pp | w/v percent calculator / percent solution calculator | Media | Pearson (varias páginas, incluido un conversor con densidades), molekula, chemicals.co.uk, LabCE | Pearson ya es muy completo | B |
| solucion-desde-solido | how much to weigh molarity purity calculator | Media-baja | Bio-Techne, Biotium, Tocris, Sigma-Aldrich (mass molarity) | La corrección por pureza casi nadie la hace explícita: hay hueco, pero se pisa con la de molaridad. Conviene una sola página EN que combine ambas | B |
| calculadora-molaridad | molarity calculator | Alta | Sigma-Aldrich/Merck, Bio-Techne, Biotium, Tocris, calculate.co.nz, PlanetCalc, Omni | Dominado por marcas de reactivos con mucha autoridad | B (o fusionar con solución desde sólido) |
| conversor-concentracion | mmol/L to mg/dL / mol/L to g/L converter | Alta pero de intención clínica (glucosa, colesterol) | Omni (salud), granjas de spam | La intención no es de laboratorio químico; Omni domina la parte clínica | C (o B baja) |
| dureza-agua | water hardness calculator / gpg to ppm | Media (consumo y tratamiento de agua) | Pearson, vendedores de ablandadores (SoftPro, ITS Europe), calculover | Las 8 unidades más la clasificación son útiles, pero la intención en EN es sobre todo de consumidores (ablandadores) | B |
| tabla-pka | pKa table | Media-alta (orgánica) | Master Organic Chemistry, PDFs universitarios (Chem1, Carey), LibreTexts, pressbooks, Pearson | Buscador con fuentes NIST/CRC: diferencial menor ante sitios con mucha autoridad | B baja / C |
| tabla-indicadores | acid base indicator chart / pH indicator table | Media | Engineering Toolbox, UBC, RSC, PDFs escolares, Kent Chemistry | Tabla con «en qué titulación sirve»: diferencial menor | C (más adelante, si sobra tiempo) |
| tabla-solubilidad | solubility table / solubility rules chart | Alta (escolar) | ChemTeam, LibreTexts, handouts universitarios, flashcards, spam | Ninguno claro | C |
| masa-molar | molar mass calculator | Alta | PlanetCalc, 8gwifi, Kanaries, Pearson, Firgelli, WebQC/Omni | Saturado; casi sin diferencial | C |
| calculadora-rendimiento | percent yield calculator | Alta (escolar) | Inch Calculator, Omni, calculate.co.nz, 8gwifi, Firgelli | Saturado | C |
| conversor-temperatura | celsius to fahrenheit / temperature converter | Muy alta | Google (respuesta directa en la propia SERP), GeeksforGeeks, Symbolab, Vedantu y muchos más | Ninguno; Google responde en la SERP | C |
| tabla-periodica | interactive periodic table | Muy alta | Ptable, RSC, periodictable.com, TED-Ed, CRC, Google | Imposible competir | C |

## Piloto propuesto (6 calculadoras)

Lógica: un grupo temático coherente, «validación de métodos analíticos / QC (ISO 17025, ICH Q2)». Las 6 páginas se enlazan entre sí, la competencia es débil y QuimCalc tiene funciones que la mayoría de los competidores no reúne en una sola página.

| # | Calculadora | Slug EN sugerido | Title EN sugerido (≤60) | Justificación |
|---|---|---|---|---|
| 1 | lod-loq | /en/tools/lod-loq-calculator.html | LOD and LOQ Calculator: 3 Methods (ICH Q2) \| QuimCalc | Es la página con más impresiones en ES. La SERP EN tiene pocas calculadoras y la mayoría usa un solo método |
| 2 | curva-calibracion | /en/tools/calibration-curve-calculator.html | Calibration Curve Calculator: R², Residuals, LOD/LOQ | Mucho spam y una sola calculadora decente (calculate.co.nz); Omni no la cubre |
| 3 | estadistica-laboratorio | /en/tools/grubbs-dixon-outlier-test.html | Grubbs & Dixon Q Test Calculator: Mean, SD, CV% | GraphPad domina Grubbs, pero Dixon y la combinación de ambos tienen SERP pobre |
| 4 | incertidumbre | /en/tools/measurement-uncertainty-calculator.html | Measurement Uncertainty Calculator (GUM, Type A/B) | La alternativa gratis frente a plantillas pagas (ISOBudgets); público ISO 17025 global |
| 5 | diluciones-reactivo-comercial | /en/tools/concentrated-acid-dilution-calculator.html | Concentrated Acid Dilution Calculator (% w/w, Density) | La pregunta «1 M HCl from 37 %» tiene demanda y SERP llena de PDFs parásitos; va junto con el post HCl |
| 6 | recuperacion-error | /en/tools/spike-recovery-calculator.html | Spike Recovery Calculator: % Recovery, Bias, CV% | Poca oferta seria; completa el grupo de validación. Conviene apuntar a «spike recovery» y no a «percent recovery» (intención de recristalización) |

Si hay que recortar a 4: lod-loq, curva-calibracion, estadistica-laboratorio, incertidumbre.

## Posts a traducir para el piloto (2–3) y descartados

**Para el piloto:**

1. `que-es-el-limite-de-deteccion` → keyword **«how to calculate LOD and LOQ»** (secundarias: «limit of detection vs limit of quantitation»). Los resultados son tutoriales de Excel y PDFs; es ganable.
2. `dixon-o-grubbs-test-valores-anomalos` → **«Grubbs vs Dixon test»** / «which outlier test to use». metricgate tiene un artículo comparativo, pero hay poca oferta más.
3. `como-preparar-hcl-1m-desde-hcl-37` → **«how to prepare 1 M HCl from 37% HCl»**. Hay demanda y la SERP está llena de PDFs parásitos y respuestas con errores (una de ellas calcula 1,01 M en lugar de ~12 M).

Alternativa al 3 si se prefiere quedarse en un solo grupo temático: `incertidumbre-para-no-estadisticos` → «measurement uncertainty explained» / «type A and type B uncertainty».

**Más adelante (B):** `como-construir-curva-de-calibracion` («how to make a calibration curve»), `incertidumbre-para-no-estadisticos`, `como-armar-presupuesto-incertidumbre-volumetria` («uncertainty budget titration example»), `como-documentar-validacion-metodo-interno` («analytical method validation report template»), `espectrofotometria-curva-calibracion` («Beer-Lambert calibration curve»), `calculo-karl-fischer-humedad-factor` («Karl Fischer water equivalence factor calculation»: SERP de farmacopeas y PDFs, nicho interesante), `como-calibrar-material-de-vidrio-volumetrico` («volumetric glassware calibration ISO 4787»), `como-preparar-soluciones-estandar-correctamente`, `errores-comunes-titulacion` («titration errors»).

**Descartados o de baja prioridad:** `dureza-agua-gran-rosario` (local de Argentina, Código Alimentario), `normalidad-vs-molaridad` (Omni, Unacademy, Vedantu y Careers360 tienen la SERP saturada), `que-es-la-molaridad`, `como-calcular-el-ph`, `formula-dilucion-c1v1-c2v2`, `que-son-las-ppm-y-como-convertirlas` y `que-es-el-pka-y-como-usar-buffers` (todos escolares, con competencia de mucha autoridad). Revisar también cualquier mención a normativa argentina dentro de los posts traducidos.

## Terminología y estilo EN

| ES | EN recomendado | Nota |
|---|---|---|
| aforar / enrasar | make up to the mark / dilute to the mark | No usar «gauge» |
| matraz aforado | volumetric flask | «Erlenmeyer» = Erlenmeyer/conical flask |
| valoración / titulación | titration | Titulante = titrant; punto final ≠ punto de equivalencia (end point vs equivalence point) |
| curva de calibrado | calibration curve (US) / calibration graph (UK) | Usar «calibration curve» |
| blanco | blank | |
| recuperación por adición | spike recovery / matrix spike | Evitar «percent recovery» a secas (en EN se asocia a la recristalización) |
| desviación estándar / CV% | standard deviation (SD) / coefficient of variation (CV) o %RSD | En farma se dice %RSD; mencionar ambos |
| valor anómalo / atípico | outlier | |
| incertidumbre expandida, factor de cobertura | expanded uncertainty, coverage factor (k) | Términos del GUM/JCGM 100; no inventar |
| normalidad | normality (N), equivalents | En EN se considera obsoleta (IUPAC); indicarlo |
| p/p, p/v, v/v | % w/w, % w/v, % v/v | |
| ppm vs mg/L | ppm (mass/mass) vs mg/L (mass/volume) | Mantener la aclaración de la densidad; ppm es ambiguo en EN igual que en ES |
| pesar / pipetear | weigh out / pipette (UK) – pipet (US) | Recomiendo «pipette» (es más común en ambos) |
| reactivo comercial | stock reagent / concentrated reagent / commercial-grade | «Concentrated acid» para ácidos |
| dureza en °F (franceses) | °fH (French degrees) | ¡En EN °F = Fahrenheit! Cambiar el símbolo |
| coma decimal, punto de miles | punto decimal, coma de miles | Revisar los parsers JS: si los inputs aceptan «,», aceptar ambos y formatear la salida con `toLocaleString('en-US')` |
| tú/vos | you | Eliminar el voseo («Calculá») |

**US vs UK:** recomiendo **inglés de EE. UU.** (mayor volumen de búsqueda, Google trata igual a ambos), con estas excepciones aceptadas en ciencia: *liter* (US) en el texto, el símbolo **L** igual en ambos; *analyze*, *color*, *calibration*; usar **«pipette»** y **«sulfur»** (IUPAC usa *sulfur*). Un solo `hreflang="en"` (sin en-US/en-GB separados) más `x-default` apuntando a la versión ES o a la home.

## Riesgos y métricas

**Riesgos**

- **Poca autoridad del dominio:** con ~100 impresiones por página en ES, el EN puede tardar meses en indexarse y rankear. Los backlinks desde foros de QC (ResearchGate, r/labrats, r/chemistry) son casi necesarios.
- **Implementación técnica:** hoy no hay hreflang; `<html lang="es">` está fijo; `build_layout.py` y `sync_indexes.py` generan el layout y los índices desde tools.json/posts.json, así que hace falta un campo de idioma o un tools.en.json; sitemap con alternates; canonical propio por idioma (nunca un canonical EN→ES); service worker (`sw.js`) y precache para /en/; OG images en EN.
- **Calidad de traducción:** una traducción pobre o automática sin revisión técnica choca con los criterios de contenido útil. Revisar fórmulas, unidades (°fH), separador decimal y referencias normativas (ICH, ISO, EPA en lugar de normativa argentina).
- **Mantenimiento doble:** cada fix en un JS o en un texto se duplica. Conviene que el JS sea compartido y que solo cambien las cadenas.
- **Intención mal elegida:** «percent recovery» (recristalización) y «mmol/L to mg/dL» (clínica) atraen tráfico que no convierte.

**Qué medir (Search Console, filtrando por página `/en/` y por país)**

- Semana 0–2: cobertura/indexación de las 6+3 URLs y errores de hreflang (revisar en la inspección de URL).
- **Semana 8:** impresiones totales /en/ (por ejemplo >300/mes sumando las 9 URLs como señal mínima de que Google las asocia a las keywords), las consultas que aparecen y la posición media (en este nicho se esperan posiciones 20–50).
- **Semana 12–16:** posición media <20 en al menos 2–3 keywords principales y primeros clics. CTR por página; reescribir titles y descriptions si el CTR es menor a 1 % en posiciones menores a 10.
- **Semana 24 (decisión):** comparar las impresiones /en/ con las de las mismas páginas en ES. Si el EN de las 6 páginas supera al ES equivalente o crece mes a mes, escalar al grupo B (pH, titulación, molaridad + sólido, dureza, ppm). Si no hay tracción, congelar y no ampliar.
- Complementos: clics entre calculadoras EN (enlazado interno), países (EE. UU., India, Reino Unido, Filipinas, Nigeria son típicos en química en EN) y consultas long tail nuevas para ideas de posts.

**Orden de trabajo sugerido**

1. Infraestructura: estructura /en/, campo de idioma en los JSON, hreflang + x-default, sitemap con alternates, `lang="en"`, selector de idioma, separador decimal en el JS.
2. Glosario y guía de estilo EN (la tabla de arriba).
3. Traducir y adaptar: lod-loq y curva-calibracion (más el post LOD) → estadistica-laboratorio (más el post Grubbs/Dixon) → incertidumbre → diluciones-reactivo-comercial (más el post HCl) → recuperacion-error.
4. Revisión técnica de cada página (fórmulas, ejemplos con punto decimal, normas ICH/ISO/EPA).
5. Enviar el sitemap y pedir la indexación; difusión puntual en comunidades de laboratorio/QC.
6. Medir a 8, 12 y 24 semanas y decidir si se escala.

## Fuentes (URLs consultadas)

- LOD/LOQ: https://lab-training.com/tools/lod-loq-calculator/ · https://www.redcrab-software.com/en/Calculator/Chemistry/LOD-LOQ · https://conductscience.com/tools/lod-loq-calculator (no se pudo abrir: el dominio no resolvió) · https://bitesizebio.com/48459/excel-lod-loq · https://www.thebricks.com/resources/guide-how-to-calculate-lod-and-loq-from-calibration-curve-in-excel · https://www.uprm.edu/ccs-cicsa/wp-content/uploads/sites/183/2023/03/Mini-SOP-Calculating-Limit-of-Detection-with-Spectrometer.pdf · https://metricgate.com/blogs/limit-of-detection-quantification-loq/ · https://calculator.academy/limit-of-detection-calculator/
- Calibración: https://www.calculate.co.nz/calibration-curve-calculator.php · https://www.omnicalculator.com/chemistry/calibration-curve · https://cran.nics.utk.edu/cran/web/packages/chemCal/readme/README.html
- Grubbs/Dixon: https://www.graphpad.com/quickcalcs/grubbs1/ · https://www.spcforexcel.com/knowledge/basic-statistics/grubbs-test-for-outlier/ · https://metricgate.com/docs/dixons-q-test-for-outliers/ · https://metricgate.com/blogs/grubbs-test-vs-dixons-q · https://c2055.cloudnet.se/en/dixon-test-calculator.html · https://pubs.rsc.org/en/content/articlehtml/2015/ay/c5ay90053k · https://www.xlstat.com/solutions/features/dixon-test-for-outliers
- Estadística/CV: https://www.medcalc.org/manual/cvfromduplicates.php
- Incertidumbre: https://metricgate.com/calculator/measurement-uncertainty · https://simpledecisionmaker.onrender.com/tools/uncertainty-calculator/ · https://www.isobudgets.com/?p=2531 · https://westgard.com/guest41.htm
- Diluciones: https://www.calculate.co.nz/dilution-calculator-c1v1-c2v2.php · https://www.bio-techne.com/resources/dilution-calculator · https://www.apexbt.com/dilution-calculator · https://docs.kanaries.net/tools/chemistry/dilution-calculator · https://www.omnicalculator.com/chemistry/serial-dilution · https://www.aatbio.com/tools/serial-dilution · https://www.calculate.co.nz/dilution-series-calculator.php
- Ácido comercial/HCl: https://www.merckmillipore.com/CR/en/support/calculators-and-apps/molarity-calculator · https://mason.gmu.edu/~sslayden/Lab/sws/acid-calc.htm · https://openwetware.org/wiki/HCl
- Molaridad/sólido: https://www.sigmaaldrich.com/NZ/en/support/calculators-and-apps/mass-molarity-calculator · https://www.bio-techne.com/resources/molarity-calculator · https://biotium.com/molarity-calculator/ · https://www.tocris.com/node/456 · https://planetcalc.com/8461 · https://www.seodata.dev/keyword/find-mole-ratio-calculator (único dato de volumen hallado, de otra keyword)
- pH/buffers: https://www.pearson.com/channels/calculators/ph-calculator · https://8gwifi.org/equilibrium-ph-calculator.jsp · https://chem.libretexts.org/Bookshelves/Physical_and_Theoretical_Chemistry_Textbook_Maps/Supplemental_Modules_(Physical_and_Theoretical_Chemistry)/Acids_and_Bases/Acid/Exact_pH_Calculations · https://aatbio.com/tools/weak-acid-conjugate-base-ph-pka-calculator · https://groups.chem.ubc.ca/courseware/pH/section5/content.html · https://www.omnicalculator.com/chemistry/henderson-hasselbalch · https://www.pearson.com/channels/general-chemistry/calculators/henderson-hasselbalch-calculator · https://www.calculate.co.nz/henderson-hasselbalch-calculator.php
- Titulación: https://www.calculate.co.nz/titration-calculator.php · https://www.firgelliauto.com/blogs/calculators/titration-calculator · https://www.aatbio.com/tools/quick-calculator/titration-calculator · https://8gwifi.org/titration-calculator.jsp
- ppm/concentración: https://www.omnicalculator.com/conversion/ppm-to-mgl-converter · https://www.inchcalculator.com/ppm-to-mgl-converter/ · https://www.pearson.com/channels/calculators/percent-solution-converter · https://molekula.com/calculators/percent · https://www.chemicals.co.uk/blog/what-do-vv-ww-wv-mean · https://Omnicalculator.com/health/mmol-l-to-mg-dl
- Recuperación: https://calculator.academy/percent-recovery-calculator/ · https://handymath.com/calcshtml/SpikeAddn.html · https://www.welch-us.com/blogs/knowleage-base/how-to-calculate-spiked-recovery-rate-in-chromatographic-analysis · https://openlab.help.agilent.com/2.8/en/mergedProjects/CustomCalculator/6995414283.htm · https://water.usgs.gov/usgs/owq/WaQI/WAQIspikecal10.06.pdf
- Dureza: https://www.pearson.com/channels/calculators/water-hardness-calculator · https://www.softprowatersystems.com/pages/grains-per-gallon-to-ppm-how-do-you-convert-it · https://www.itseurope.co.uk/pages/conversion-formulas
- Tablas: https://www.masterorganicchemistry.com/?p=906 · https://dornshuld.chemistry.msstate.edu/books/chemistry/acid-base-relationships.html · https://groups.chem.ubc.ca/courseware/pH/inddata.html · https://www.chemteam.info/Equations/Solubility-Table.html · https://chem.libretexts.org/Core/Physical_and_Theoretical_Chemistry/Equilibria/Solubilty/Solubility_Rules · https://edu.rsc.org/news/interactive-periodic-table-updated/2020607.article
- Masa molar / rendimiento / temperatura: https://planetcalc.com/329/ · https://8gwifi.org/molar-mass-calculator.jsp · https://www.omnicalculator.com/chemistry/percent-yield · https://www.inchcalculator.com/percent-yield-calculator/ · https://symbolab.com/calculator/10c-=-f
- Posts: https://www.omnicalculator.com/normality-vs-molarity · https://www.pharmaguideline.com/2011/09/water-content-determination-by-karl.html · https://www.vedantu.com/chemistry/how-to-calculate-the-ph-of-a-weak-acid

Archivos del repo consultados (solo lectura): `data/tools.json`, `data/posts.json`, `quimcalc/herramientas/*.html`, `CONTEXTO-PROYECTO-QUIMCALC-5.md` (datos de Search Console de mayo–junio 2026).
