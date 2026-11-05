# Revisión editorial — concentracion-porcentual-pp-pv-vv — 2026-11-05

Artículo: `revisiones/borradores/concentracion-porcentual-pp-pv-vv.md` (borrador en Markdown, sin maquetar) · URL prevista: https://quimcalc.com/blog/posts/concentracion-porcentual-pp-pv-vv.html

## Resumen
| Área | Críticos | Altos / imprecisos | Menores / sugerencias |
|---|---|---|---|
| Técnica | 0 | 4 | 6 |
| Estilo | 0 | 7 (regionalismos y terminología) | 13 (+9 del post de LinkedIn) |
| SEO | 3 (alta) | 8 (media) | 3 (baja) |

El borrador es técnicamente sólido: los 9 cálculos recalculados son correctos y no hay errores en definiciones ni fórmulas. Lo urgente es de SEO y maquetación: el title supera el límite, falta una respuesta directa al principio y la calculadora principal solo se enlaza al final. En lo técnico conviene precisar cómo funciona la calculadora (pide solución final, no solvente, en p/v y v/v) y el papel del factor 10.

## 1. Críticos (corregir antes de cualquier otra cosa)
1. **Title demasiado largo** (SEO, alta). Tiene 69 caracteres y con el sufijo « | QuimCalc», que usan todos los posts, llega a 80. Alternativas (largo con sufijo):
   - A: «Concentración porcentual: % p/p, p/v y v/v | QuimCalc» (53) ✔ recomendada
   - B: «Cómo calcular % p/p, % p/v y % v/v: 4 ejemplos | QuimCalc» (57)
   - C: «Concentración porcentual % p/p, p/v y v/v: 4 ejemplos | QuimCalc» (64). Se pasa del límite y solo sirve sin sufijo.
2. **Falta una respuesta directa** en las primeras 50 palabras (SEO, alta). Abrir con un párrafo que defina el concepto, dé las tres fórmulas y enlace a la calculadora; el gancho del 37 % / 0,9 % / 70 % pasa a segundo párrafo.
3. **La calculadora principal `concentracion-pp.html` solo aparece en el CTA** (SEO, alta). Agregar un enlace en el primer párrafo y otro al final de «Tipos…».

## 2. Importantes
**Técnica (imprecisos)**
- T1. **La descripción de la calculadora no coincide con lo que hace** (l. 165). Pide la masa del solvente solo en el modo p/p; en p/v y v/v pide el volumen de la solución final. Corrección: «la cantidad de soluto (masa o volumen), la de solvente (en % p/p) o la de solución final (en % p/v y % v/v), o el porcentaje».
- T2. **El papel del factor 10 está mal explicado** (l. 106). Corrección: «% p/p × ρ da gramos de soluto por 100 mL de solución; el factor 10 los convierte en gramos por litro». El corrector de estilo detectó lo mismo.
- T3. **Suero fisiológico** (Ejemplo 2). El título debería decir «solución salina 0,9 % p/v» y llevar el aviso «es para uso de laboratorio, no apta para uso clínico ni para los ojos». Coincide con la corrección de estilo E12, que propone nombrarla igual en la tabla y en el ejemplo.
- T4. **Etanol** (Ejemplo 3). Falta indicar que hay que dejar enfriar la mezcla a 20 °C antes de aforar. Nota opcional: con etanol al 96 % se miden unos 182 mL.

**Estilo: regionalismos y terminología**
- E1 y E2. En la primera mención, escribir «solución (o disolución)» y «solvente (disolvente)». El SEO lo pide por la misma razón: España es el primer mercado.
- E3, E4, E5 y E6. Unificar en «aforar» («enrasar» se menciona una sola vez). El SEO también lo señala.
- E11. Escribir «titulaciones (valoraciones)».
- E10. Escribir «menor que el 100 %», no «menor al».

**SEO (media)**
- S4. Eliminar el encabezado «Introducción».
- S5. **Reordenar la estructura:**
  1. Qué es
  2. Tipos (un H3 por tipo, con su fórmula)
  3. Conversión a % p/v y molaridad
  4. Ejemplos
  5. Errores comunes, con estos H3:
     - Dividir por el solvente
     - Sumar volúmenes
     - Temperatura
     - No indicar el tipo
     - Pureza
  6. FAQ
  7. CTA (bloque `div.cta-herramienta`)
- S6. **FAQ:** cada pregunta como H3; dejar 5.
- S7. Agregar «riqueza», «% m/m» y «tanto por ciento en masa» al menos una vez en el texto (fuera de la tabla).
- S9. Pasar las fórmulas de LaTeX a `div.post-formula` con subíndices HTML.
- S10. Usar rutas relativas en los enlaces internos.
- **Meta.** Alternativas:
  - A ✔ recomendada (133): «10 g de sal en 100 g de agua no es 10 %, sino 9,1 % p/p. Aprende a calcular % p/p, % p/v y % v/v con 4 ejemplos y calculadora gratis.»
  - B (146): «Concentración porcentual (% m/m o p/p, % m/v y % v/v): fórmulas, el error más común y 4 ejemplos resueltos. Compruébalo con la calculadora gratis.»
  - C (139): «¿Suero al 0,9 % o alcohol al 70 %? Calcula % p/p, % p/v y % v/v paso a paso, pasa de % a mol/L con la densidad y usa la calculadora gratis.»
- **Enlaces internos que faltan:**
  - `diluciones-reactivo-comercial` (tras el HCl o el H₂SO₄)
  - `conversor-concentracion` (junto a «1 % p/v = 10 g/L»)
  - `masa-molar` (Ejemplo 4)
  - `calculadora-molaridad`
  - `conversor-ppm-mgl`
  - post `formula-dilucion-c1v1-c2v2`
  - opcional: `normalidad-vs-molaridad`
- **Enlaces entrantes** (hoy nadie enlaza al post):
  - calculadora `concentracion-pp.html` (prioridad máxima)
  - `que-es-la-molaridad`
  - `formula-dilucion-c1v1-c2v2`
  - `como-preparar-hcl-1m-desde-hcl-37` (en el texto y en «También te puede interesar»)
  - `que-son-las-ppm-y-como-convertirlas`

## 3. Menores y sugerencias
- T5. Masa molar del H₂SO₄: usar 98,07 g/mol (IUPAC; otro post del sitio ya la usa). El 18,4 M no cambia.
- T6. HCl ρ = 1,19 g/mL: agregar «según la etiqueta del lote».
- T7. Aclarar que el % p/v puede superar 100.
- T8. NaOH: añadir una nota de seguridad (agregar de a poco, con gafas).
- T9 y T10. Opcionales: el % p/p solo cambia si hay evaporación; la IUPAC recomienda el término «fracción másica».
- **Estilo:** E7–E9 (puntuación), E13–E18 (claridad), E19 y E20. Ver la tabla de la sección 5.
- **S11. Imagen destacada:**
  - Archivo: `img/concentracion-porcentual-pp-pv-vv.webp`, 1536×1024, `loading="eager"`.
  - Tarjeta OG: `img/og/…jpg`.
- **S12.** Ya se resuelve con los nuevos H2 de S5.
- **Schema:** Article + FAQPage. BreadcrumbList es opcional: ningún post la tiene todavía. **Decisión del editor:** agregarla solo acá o en todos los posts más adelante.
- **Post de LinkedIn:** cambios L1–L9 (sección 5).
  - **Contradicción:** el corrector y el SEO piden pasarlo a tuteo neutro, pero es una publicación personal y el sitio usa voseo en otras partes. **Decisión del editor.**

## 4. Ejemplos recalculados
```python
H,S,O,Cl=1.008,32.06,15.999,35.45
25/(25+225)*100                     # Ej1 → 10,0 %
0.9*500/100; 4.5/0.5                # Ej2 → 4,5 g; 9,0 g/L
70*250/100; 250-175                 # Ej3 → 175 mL; 75 mL
98*1.84; 98*1.84*10/98.08; 98*1.84*10/(2*H+S+4*O)   # Ej4 → 180,32; 18,385; 18,386 mol/L
37*1.19; 37*1.19*10/36.46           # HCl → 44,03 % p/v; 12,076 mol/L
10/110*100                          # sal → 9,0909 %
1e-6*100                            # 1 ppm → 0,0001 %
```

| Ejemplo | Artículo | Recalculado | Veredicto |
|---|---|---|---|
| NaOH 25 g + 225 g | 10 % p/p | 10,0 % | ✅ |
| NaCl 0,9 % p/v, 500 mL | 4,5 g; 9 g/L | 4,5 g; 9,0 g/L | ✅ |
| Etanol 70 % v/v, 250 mL | 175 mL | 175,0 mL | ✅ |
| H₂SO₄ 98 %, 1,84 g/mL | 180,3 % p/v; 18,4 M | 180,32; 18,385 M | ✅ |
| HCl 37 %, 1,19 g/mL | 44 % p/v; 12,1 M | 44,03; 12,076 M | ✅ (coincide con el post del HCl) |
| 10 g sal en 100 g agua | 9,09 % | 9,0909 % | ✅ |
| Etanol + agua, 50 + 50 mL | ≈ 96 mL | ≈ 96,5 mL (densidades a 20 °C) | ✅ |
| 1 ppm | ≈ 0,0001 % | 1 × 10⁻⁴ % | ✅ |
| LinkedIn | 9,1 %; 18,4 M; 96 mL | — | ✅ |

Además, comprobé un valor de la FAQ propuesta por el revisor SEO: 0,01 % p/v = 0,1 g/L = 100 mg/L ✅.

## 5. Tabla de correcciones de estilo
| # | Fragmento original | Corrección | Motivo |
|---|---|---|---|
| E1 | «en 100 unidades de **solución**» | «…de **solución** (o *disolución*, como se dice en España)» | Término de España, primera mención |
| E2 | «**Solvente:** el medio…» | «**Solvente (disolvente):** el medio…» | Ídem |
| E3 | «ya llevada a aforo» | «una vez aforada (llevada a volumen)» | Unificar con «aforar» |
| E4 | «enrasa el material volumétrico a 20 °C, que es la temperatura de calibración habitual» | «afora (enrasa) a unos 20 °C, la temperatura a la que suele estar calibrado el material volumétrico» | Término preferido; lo que se afora es la solución |
| E5 | «trasvasa a un matraz aforado de 500 mL y completa hasta el enrase» | «trasvasa la solución a un matraz aforado de 500 mL y afora con agua destilada» | Unificar; falta complemento |
| E6 | «Mide 175 mL de etanol absoluto y completa con agua hasta 250 mL en un matraz aforado» | «Mide 175 mL de etanol absoluto, pásalos a un matraz aforado de 250 mL y afora con agua» (+ T4: dejar enfriar) | Orden de las operaciones |
| E7 | «lo que se mide es masa, por eso en España…» | «lo que se mide es masa; por eso, en España y en muchos libros de texto,» | Puntuación |
| E8 | «suele ser % p/p, en soluciones biológicas y clínicas suele ser % p/v y en alcoholes, % v/v» | «suele ser % p/p; en soluciones biológicas y clínicas, % p/v, y en alcoholes, % v/v» | Enumeración con elisión |
| E9 | «1803 g/L / 98,08 g/mol» | «1803 g/L ÷ 98,08 g/mol» | Doble barra ambigua |
| E10 | «con pureza menor al 100 %» | «con una pureza menor que el 100 %» | Norma general |
| E11 | «titulaciones» | «titulaciones (valoraciones)» | Variante de España |
| E12 | «suero fisiológico» / «soluciones fisiológicas» | «solución salina fisiológica (suero fisiológico)» | Coherencia (ver T3) |
| E13 | «En masa, masa de solución = …» | «Su masa es la suma de la masa de soluto y la de solvente (los volúmenes, en cambio, no siempre se suman)» | Claridad |
| E14 | «100 unidades de solución» | «100 partes de solución (100 g o 100 mL, según el tipo)» | Vago |
| E15 | «Ojo:» | «Atención:» | Coloquial (opcional) |
| E16 | «las tres formas de concentración porcentual» | «los tres tipos de concentración porcentual» | Coherencia con el H2 |
| E17 | «masa molar (M, en g/mol)» | usar *M*<sub>m</sub> o advertir que no es la M de molaridad | Ambigüedad de notación |
| E18 | «completa dos datos y obtendrás el tercero» | «introduce dos datos y la calculadora te dará el tercero» (+ T1) | Evitar repetir «completa» |
| E19 | Comillas “…” | «…» | El sitio no usa comillas inglesas en los posts |
| E20 | Intro (5 oraciones) y CTA (5 oraciones) | Dividir: unir las dos últimas de la intro; «Es gratuita…» en línea aparte | Largo de párrafo |
| L1 | «Necesitás la densidad» | «Necesitas…» / «Hace falta…» | Voseo (decisión del editor) |
| L2 | «Armamos una guía» | «Preparamos una guía» | Regionalismo |
| L3 | «Te dejo el link» | «Dejamos el enlace en el primer comentario» | Persona y anglicismo |
| L4 | «Acá está» | «Aquí está» | Regionalismo |
| L5 | «gramos de soluto cada 100 g» / «mL cada 100 mL» | «por cada 100 g de solución» / «mL de soluto por cada 100 mL de solución» | Rioplatense; incompleto |
| L6 | «¿Cuál… viste más?» | «¿Cuál… ves más?» | Neutro |
| L7 | Tres viñetas «→» en una línea | Una por línea | Formato |
| L8 | «9,1 %» | «≈ 9,1 %» | Coherencia con 9,09 |
| L9 | «carrusel de 3 placas», «sin link» | «3 imágenes», «sin enlace» | Nota interna |

## 6. FAQ propuesta
(Del revisor SEO. Reemplaza las 6 actuales; las de suma de volúmenes y trazas pasan al cuerpo.)

**¿Cuál es la diferencia entre % p/p, % p/v y % v/v?**
El % p/p compara masas: gramos de soluto en 100 g de solución. El % p/v indica gramos de soluto en 100 mL de solución. El % v/v indica mililitros de soluto en 100 mL de solución y se usa con líquidos, como el alcohol. Solo el % p/p no cambia con la temperatura, porque no depende de ningún volumen.

**¿Es lo mismo % p/p que % m/m?**
Sí. «Peso» y «masa» se usan como sinónimos en este contexto: ambas expresiones indican gramos de soluto por cada 100 g de solución (o disolución). En España y en muchos libros de texto se prefiere % m/m o «tanto por ciento en masa»; en las etiquetas de reactivos es habitual % p/p o «riqueza».

**¿Cómo se pasa de % p/p a molaridad?**
Se multiplica el porcentaje por la densidad de la solución (g/mL) y por 10 para obtener gramos por litro, y el resultado se divide por la masa molar. Para H₂SO₄ al 98 % p/p (d = 1,84 g/mL; M = 98,07 g/mol): 98 × 1,84 × 10 / 98,07 = 18,4 mol/L. Sin la densidad no se puede convertir.

**¿Cómo se pasa de % p/v a g/L?**
Se multiplica por 10, porque 1 % p/v son 1 g en 100 mL, es decir, 10 g en un litro. La solución salina al 0,9 % p/v contiene 9 g/L de NaCl. Para concentraciones muy bajas conviene trabajar en mg/L o ppm: una solución al 0,01 % p/v equivale a 100 mg/L.

**¿Qué significa una solución «al 5 %» si no se indica el tipo?**
Depende del contexto. En reactivos líquidos concentrados suele ser % p/p; en soluciones clínicas y biológicas, % p/v; y en alcoholes y bebidas, % v/v. Si la etiqueta no lo aclara, hay que consultar la ficha técnica o el certificado de análisis antes de hacer cualquier cálculo con ese valor.

## 7. Checklist de aplicación
Aplicado el 2026-11-05 («Aplicar todo y maquetar»):
- [x] Title A (53 con sufijo) en `<title>`, `og:title`, `twitter:title`; `posts.json` usa el H1, como el resto de los posts
- [x] Meta A (133) en description, OG, Twitter, Article y `posts.json`
- [x] Respuesta directa al principio, con las 3 fórmulas y un enlace a `concentracion-pp`
- [x] Se quitó el encabezado «Introducción»; H2 reestructurados según S5
- [x] 🔢 T1: descripción de la calculadora corregida (CTA)
- [x] 🔢 T2: explicación del factor 10 corregida
- [x] T3: cambiado a «solución salina fisiológica» + aviso de uso de laboratorio
- [x] 🔢 T4: dejar enfriar a 20 °C + nota de 182 mL con etanol al 96 % (verificado: 70 × 250 / 96 = 182,3)
- [x] 🔢 T5: masa molar 98,07 g/mol en el Ejemplo 4 y en la FAQ (18,4 M sin cambios)
- [x] T6–T10: etiqueta del lote, % p/v > 100, seguridad del NaOH, evaporación, fracción másica
- [x] E1–E20 aplicadas (E17 con M<sub>m</sub>; E19 con comillas «»)
- [x] Fórmulas en `div.post-formula`
- [x] Enlaces internos relativos + los faltantes (reactivo comercial, conversor de concentración, masa molar, molaridad, ppm, C₁V₁). `normalidad-vs-molaridad` (opcional) no se agregó
- [x] FAQ de 5 preguntas en H3, generada igual en el JSON-LD `FAQPage`
- [x] Schema Article (headline = H1) + BreadcrumbList (primera del sitio; ítem Blog = `/blog/index.html`, como en el sitemap)
- [x] Imagen destacada (1536×864, 16:9; alt ajustado a «frasco ámbar de reactivo») + tarjeta OG
- [x] Entrada en `data/posts.json` y `sync_indexes.py`
- [x] Enlaces entrantes: calculadora `concentracion-pp` (Para profundizar), `que-es-la-molaridad`, `formula-dilucion-c1v1-c2v2`, `como-preparar-hcl-1m-desde-hcl-37` (texto + sidebar), `que-son-las-ppm-y-como-convertirlas` (solo la FAQ visible; la del JSON-LD es texto plano)
- [x] Post de LinkedIn: L1–L9 aplicadas, en tuteo neutro (decisión por «Aplicar todo»)

**Fuera del artículo (notas del redactor):**
- [x] Portada: «21 herramientas» → 24 (FAQ visible y JSON-LD de `index.html`). Confirmado.
- [ ] Índice del blog con enlaces `/posts/...`: en el código los enlaces son relativos (`posts/…`) e iguales para los 19 posts. Solo fallarían si se entra por `/blog` sin barra final. Verificar en producción.

## Anexos: informes originales
<details><summary>Revisor técnico</summary>

0 críticos · 4 imprecisos · 6 sugerencias. Los 9 ejemplos son correctos.
- (1) La calculadora pide la masa del solvente solo en el modo p/p; en p/v y v/v pide el volumen de la solución final.
- (2) Factor 10: lo que pasa de 100 g a 100 mL es ρ; el factor 10 pasa de 100 mL a 1 L.
- (3) El suero fisiológico clínico es estéril; agregar un aviso.
- (4) Enfriar a 20 °C antes de aforar; nota con etanol al 96 %.
- (5) Masa molar 98,07 g/mol.
- (6) HCl ρ «según etiqueta».
- (7) % p/v > 100.
- (8) Seguridad del NaOH.
- (9) Evaporación.
- (10) Fracción másica.

Sin errores en las definiciones, las fórmulas ni la FAQ. Cálculos verificados: ver sección 4.
</details>
<details><summary>Corrector de estilo</summary>

20 correcciones en el artículo (0 de ortografía, 2 de gramática, 3 de puntuación, 0 de voseo, 4 de regionalismos, 7 de claridad y 4 de terminología) y 9 en el post de LinkedIn. El artículo usa tuteo de forma uniforme y escribe bien los números y las unidades. Tabla completa en la sección 5. Coherencia terminológica: «solución» (≈ 33), «disolución» (0); «solvente» (9), «disolvente» (0); para llevar a volumen hay 5 variantes → unificar en «aforar».
</details>
<details><summary>Revisor SEO</summary>

Críticos:
- Title de 69/80 caracteres.
- No hay respuesta directa al principio.
- La calculadora solo se enlaza en el CTA.
- Faltan 5 calculadoras y el post de C₁V₁.
- Ningún enlace entrante.
- La meta es genérica.
- «Disolución» no aparece nunca.

Además:
- Estructura de H2 propuesta (S5).
- FAQ en H3 (5 preguntas).
- Fórmulas en `post-formula`.
- Rutas relativas.
- Imagen y tarjeta OG.
- Article + FAQPage; BreadcrumbList sería la primera del sitio.
- `posts.json`: categoría «Química básica», 8 min, `og_highlight` «9,1 % p/p — 10 g de sal en 100 g de agua».
- Alt sugerido para la imagen (ajustarlo a la imagen real): «Balanza analítica con cloruro de sodio pesado junto a un matraz aforado de 500 mL, una probeta con etanol y un frasco de ácido con etiqueta de 37 % sobre una mesa de laboratorio».
</details>
