# Borrador blog QuimCalc — noviembre 2026

Nov 5, 2026 · @Sebastian

## Notas para el editor

**Tema elegido: concentración porcentual (% p/p, % p/v y % v/v).** Es una de las búsquedas escolares y de laboratorio más frecuentes en español, el sitio ya tiene su calculadora ([Porcentaje p/p, p/v y v/v](https://quimcalc.com/herramientas/concentracion-pp.html)) y ninguno de los 19 artículos del blog la trata.

- **Keyword principal:** concentración porcentual / porcentaje en masa.
- **Variantes regionales a cubrir:** % m/m y % m/v (México, Perú, Chile), % p/p y % p/v (Argentina, laboratorio), “tanto por ciento en masa” y “porcentaje en volumen” (España, ESO y Bachillerato).
- **Enlaces internos sugeridos:** [¿Qué es la molaridad?](https://quimcalc.com/blog/posts/que-es-la-molaridad.html), [Cómo preparar soluciones estándar](https://quimcalc.com/blog/posts/como-preparar-soluciones-estandar-correctamente.html), [Qué son las ppm](https://quimcalc.com/blog/posts/que-son-las-ppm-y-como-convertirlas.html), [Cómo preparar HCl 1 M desde HCl 37 %](https://quimcalc.com/blog/posts/como-preparar-hcl-1m-desde-hcl-37.html) y la calculadora [Solución desde sólido con pureza](https://quimcalc.com/herramientas/solucion-desde-solido.html).
- **Temas ya cubiertos (descartados):** pH, C₁V₁ = C₂V₂, HCl 1 M, ppm, molaridad, normalidad, pKa y buffers, soluciones estándar, curva de calibración, espectrofotometría, LOD, titulación, incertidumbre, Karl Fischer, Dixon/Grubbs, calibración de material de vidrio, validación y dureza del agua.
- **Próximos temas posibles (calculadora sin artículo):** % de rendimiento, diluciones seriadas, masa molar.

**Problemas que encontré en el sitio (no toqué nada):**

- En el índice del blog, los tres posts más nuevos (pH, C₁V₁ y HCl 1 M) enlazan a `/posts/...` en vez de `/blog/posts/...`, y esa ruta no carga.
- En las preguntas frecuentes de la portada dice “21 herramientas”, pero la portada y el sitemap listan 24.
- El sitio mezcla voseo y tuteo. Este borrador usa español neutro con tuteo, como se pidió.

## Ficha SEO

| Campo | Propuesta |
| --- | --- |
| Título SEO (69 caracteres) | Concentración porcentual: % p/p, % p/v y % v/v con ejemplos resueltos |
| H1 | Concentración porcentual: cómo calcular % p/p, % p/v y % v/v |
| Meta descripción (136 caracteres) | Aprende a calcular % p/p (m/m), % p/v y % v/v con fórmulas, ejemplos resueltos paso a paso y una calculadora gratis para tus soluciones. |
| Slug | /blog/posts/concentracion-porcentual-pp-pv-vv.html |
| Keyword principal | concentración porcentual |
| Secundarias | porcentaje en masa, % m/m, % p/v, porcentaje en volumen, % v/v, tanto por ciento en masa, cómo calcular el porcentaje de una solución |
| Categoría | Química básica |
| Lectura estimada | 8 min |

## Artículo

### Introducción

La etiqueta de un frasco de ácido dice “37 %”. Un protocolo pide “NaCl al 0,9 %”. Una botella de alcohol indica “70 % vol”. Las tres cifras son concentraciones porcentuales, pero no significan lo mismo. Confundirlas es uno de los errores más comunes al preparar soluciones, tanto en clase como en el laboratorio.

En esta guía aprenderás a calcular las tres formas de concentración porcentual: % p/p (o % m/m), % p/v (o % m/v) y % v/v. Verás cuándo se usa cada una, cómo convertir entre ellas y varios ejemplos resueltos paso a paso.

### ¿Qué es la concentración porcentual?

La concentración porcentual indica cuánto soluto hay en 100 unidades de **solución**. Es la forma más intuitiva de expresar una concentración porque no requiere conocer la masa molar del soluto.

Antes de calcular, conviene tener claros tres términos:

- **Soluto:** la sustancia que se disuelve (sal, azúcar, ácido, etanol).
- **Solvente:** el medio en el que se disuelve, casi siempre agua.
- **Solución:** la mezcla final. En masa, masa de solución = masa de soluto + masa de solvente.

### Los tres tipos de porcentaje

| Tipo | Otros nombres | Qué expresa | Uso típico |
| --- | --- | --- | --- |
| % p/p | % m/m, porcentaje en masa, tanto por ciento en masa | gramos de soluto en 100 g de solución | ácidos y bases comerciales, aleaciones, alimentos |
| % p/v | % m/v, porcentaje masa/volumen | gramos de soluto en 100 mL de solución | soluciones fisiológicas, reactivos de laboratorio |
| % v/v | porcentaje en volumen, % vol | mililitros de soluto en 100 mL de solución | alcoholes, bebidas, mezclas de solventes |

“p” (peso) y “m” (masa) se usan como sinónimos. En rigor, lo que se mide es masa, por eso en España y en muchos libros de texto se prefiere % m/m.

#### Porcentaje masa/masa (% p/p o % m/m)

```latex
\%\,p/p = \frac{m_{\text{soluto}}\ (\text{g})}{m_{\text{solución}}\ (\text{g})} \times 100
```

Como compara dos masas, no depende de la temperatura. Por eso es la forma estándar para reactivos concentrados como el HCl al 37 % o el H₂SO₄ al 98 %.

#### Porcentaje masa/volumen (% p/v o % m/v)

```latex
\%\,p/v = \frac{m_{\text{soluto}}\ (\text{g})}{V_{\text{solución}}\ (\text{mL})} \times 100
```

El volumen es el de la solución final, ya llevada a aforo, no el del agua agregada. Un dato útil: 1 % p/v equivale a 10 g/L.

#### Porcentaje volumen/volumen (% v/v)

```latex
\%\,v/v = \frac{V_{\text{soluto}}\ (\text{mL})}{V_{\text{solución}}\ (\text{mL})} \times 100
```

Se usa cuando soluto y solvente son líquidos. Ojo: los volúmenes no siempre se suman. Al mezclar 50 mL de etanol con 50 mL de agua se obtienen unos 96 mL, no 100 mL. Por eso siempre se mide el soluto y se completa con solvente hasta el volumen final.

### El error más común: dividir por el solvente

El denominador es siempre la **solución**, no el solvente. Si disuelves 10 g de sal en 100 g de agua, la solución pesa 110 g y la concentración es 9,09 % p/p, no 10 %. Para obtener una solución al 10 % p/p necesitas 10 g de sal y 90 g de agua.

### Cómo convertir % p/p a % p/v y a molaridad

Para pasar de masa a volumen necesitas la densidad (ρ) de la solución, en g/mL:

```latex
\%\,p/v = \%\,p/p \times \rho
```

En soluciones acuosas diluidas la densidad es cercana a 1 g/mL y ambos valores casi coinciden. En reactivos concentrados la diferencia es grande: el HCl al 37 % p/p (ρ = 1,19 g/mL) equivale a unos 44 % p/v.

Si además conoces la masa molar (M, en g/mol), puedes obtener la [molaridad](https://quimcalc.com/blog/posts/que-es-la-molaridad.html):

```latex
C\ (\text{mol/L}) = \frac{\%\,p/p \times \rho\ (\text{g/mL}) \times 10}{M\ (\text{g/mol})}
```

El factor 10 convierte “gramos por 100 g” en “gramos por litro”. Para concentraciones muy bajas resulta más práctico trabajar en [ppm](https://quimcalc.com/blog/posts/que-son-las-ppm-y-como-convertirlas.html).

### Temperatura y buenas prácticas

- El % p/p no cambia con la temperatura. El % p/v y el % v/v sí, porque el volumen se dilata o se contrae.
- En el laboratorio, enrasa el material volumétrico a 20 °C, que es la temperatura de calibración habitual.
- Si el reactivo sólido no es 100 % puro, corrige la masa por pureza. La calculadora [Solución desde sólido con pureza](https://quimcalc.com/herramientas/solucion-desde-solido.html) lo hace automáticamente.
- Indica siempre el tipo de porcentaje. “Al 5 %” sin aclarar puede ser p/p, p/v o v/v.

### Ejemplos resueltos paso a paso

#### Ejemplo 1: % p/p de una solución de NaOH

Se disuelven 25 g de NaOH en 225 g de agua. ¿Cuál es la concentración en % p/p?

1. Calcula la masa de la solución: 25 g + 225 g = 250 g.
2. Aplica la fórmula: (25 g / 250 g) × 100.
3. **Resultado: 10 % p/p.**

#### Ejemplo 2: preparar 500 mL de suero fisiológico (NaCl 0,9 % p/v)

1. Despeja la masa: m = (% p/v × V) / 100 = (0,9 × 500 mL) / 100.
2. **Resultado: 4,5 g de NaCl.**
3. Pesa 4,5 g, disuélvelos en unos 400 mL de agua destilada, trasvasa a un matraz aforado de 500 mL y completa hasta el enrase.

Comprobación: 4,5 g en 0,5 L son 9 g/L, que coincide con la regla 1 % p/v = 10 g/L.

#### Ejemplo 3: 250 mL de etanol al 70 % v/v

1. Volumen de etanol: (70 × 250 mL) / 100 = 175 mL.
2. Mide 175 mL de etanol absoluto y completa con agua hasta 250 mL en un matraz aforado.
3. **No** agregues simplemente 75 mL de agua: por la contracción de volumen, el total quedaría por debajo de 250 mL y la concentración sería algo mayor que 70 % v/v.

#### Ejemplo 4: molaridad del ácido sulfúrico al 98 % p/p

Datos de la etiqueta: 98 % p/p, densidad 1,84 g/mL. Masa molar del H₂SO₄: 98,08 g/mol.

1. Pasa a % p/v: 98 × 1,84 = 180,3 % p/v, es decir, 180,3 g por 100 mL o 1803 g/L.
2. Divide por la masa molar: 1803 g/L / 98,08 g/mol.
3. **Resultado: 18,4 mol/L.**

Con el mismo procedimiento, el HCl al 37 % p/p (ρ = 1,19 g/mL; M = 36,46 g/mol) da 12,1 mol/L. Si necesitas diluirlo, sigue la guía [Cómo preparar HCl 1 M a partir de HCl al 37 %](https://quimcalc.com/blog/posts/como-preparar-hcl-1m-desde-hcl-37.html).

### Preguntas frecuentes

**¿Es lo mismo % p/p que % m/m?** Sí. “Peso” y “masa” se usan como sinónimos en este contexto. Ambas expresiones indican gramos de soluto por cada 100 g de solución.

**¿Qué significa una solución al 5 % si no se indica el tipo?** Depende del contexto. En reactivos líquidos concentrados suele ser % p/p, en soluciones biológicas y clínicas suele ser % p/v y en alcoholes, % v/v. Si no está indicado, consulta la ficha técnica o el certificado de análisis.

**¿Cómo paso de % p/v a g/L?** Multiplica por 10. Una solución al 2 % p/v contiene 20 g/L.

**¿Por qué el % v/v no se calcula sumando volúmenes?** Porque al mezclar algunos líquidos, como el etanol y el agua, el volumen final es menor que la suma de los volúmenes. Por eso se mide el soluto y se completa con solvente hasta el volumen final.

**¿Cuándo conviene usar molaridad en lugar de porcentaje?** Cuando la reacción depende del número de partículas, como en titulaciones o cálculos estequiométricos. El porcentaje es más práctico para preparar y etiquetar soluciones de uso general.

**¿Se puede usar el porcentaje para concentraciones muy bajas?** Se puede, pero los números quedan incómodos (0,0005 %). Para trazas es mejor usar ppm o mg/L: 1 ppm equivale aproximadamente a 0,0001 % en soluciones acuosas diluidas.

### Calcula tu concentración porcentual en segundos

¿No quieres despejar fórmulas a mano? La [calculadora de porcentaje p/p, p/v y v/v](https://quimcalc.com/herramientas/concentracion-pp.html) de QuimCalc resuelve cualquiera de los tres casos. Elige el tipo de porcentaje, completa dos datos y obtendrás el tercero: la masa de soluto, la cantidad de solvente o el porcentaje. Es gratuita, no requiere registro y funciona en el teléfono.

**[Usar la calculadora de porcentaje →](https://quimcalc.com/herramientas/concentracion-pp.html)**

Si partes de un sólido con pureza menor al 100 %, usa también la calculadora [Solución desde sólido con pureza](https://quimcalc.com/herramientas/solucion-desde-solido.html). Para preparar soluciones de trabajo, repasa [Cómo preparar soluciones estándar correctamente](https://quimcalc.com/blog/posts/como-preparar-soluciones-estandar-correctamente.html).

## Idea de post para LinkedIn (corregido tras la revisión del 2026-11-05)

Formato sugerido: texto corto con una pregunta de enganche. Sumar un carrusel de 3 imágenes con las fórmulas es opcional. Publicar sin enlace y pegarlo en el primer comentario.

> ¿10 g de sal en 100 g de agua es una solución al 10 %?
>
> No. Es al 9,1 % p/p. 👀
>
> Es uno de los errores más comunes cuando preparamos soluciones: dividir por el solvente en vez de por la solución. La solución pesa 110 g, no 100.
>
> Y no es el único. «Al 37 %», «al 0,9 %» y «70 % vol» parecen lo mismo, pero no lo son:
>
> → % p/p: gramos de soluto por cada 100 g de solución. No cambia con la temperatura. Es el de los ácidos comerciales.
>
> → % p/v: gramos de soluto por cada 100 mL de solución. Truco: 1 % p/v = 10 g/L.
>
> → % v/v: mL de soluto por cada 100 mL de solución. Ojo, los volúmenes no se suman: 50 mL de etanol + 50 mL de agua dan unos 96 mL.
>
> ¿Y para pasar de p/p a molaridad? Hace falta la densidad. El H₂SO₄ al 98 % p/p (1,84 g/mL) es unos 18,4 mol/L.
>
> Preparamos una guía con fórmulas, ejemplos resueltos paso a paso y una calculadora gratis para que no tengas que despejar a mano. Dejamos el enlace en el primer comentario. 👇
>
> ¿Cuál de estos errores ves más en el laboratorio o en clase?
>
> \#Química #Laboratorio #QuímicaAnalítica #Estudiantes #ControlDeCalidad

**Primer comentario:** «Aquí está la guía completa con la calculadora 👉 https://quimcalc.com/blog/posts/concentracion-porcentual-pp-pv-vv.html»
