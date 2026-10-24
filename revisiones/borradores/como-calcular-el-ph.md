# Borrador — Cómo calcular el pH de ácidos y bases fuertes y débiles

Borrador recibido el 2026-10-24 para `/revisar-articulo`. Todavía no existe como HTML: se guarda tal cual lo envió el autor, sin cambios. Los campos 7–10 corresponden a la plantilla `quimcalc/blog/posts/PLANTILLA-post.html`.

Slug propuesto: `como-calcular-el-ph`

---

CAMPO 1 — TÍTULO
Cómo calcular el pH de ácidos y bases fuertes y débiles

CAMPO 2 — META DESCRIPTION
Aprendé cómo calcular el pH de ácidos y bases con fórmulas, la tabla ICE y la aproximación del 5 %. Incluye ejemplos resueltos paso a paso.

CAMPO 3 — CATEGORÍA
Química básica

CAMPO 4 — FECHA
Octubre 2026

CAMPO 5 — TIEMPO DE LECTURA
6 min

CAMPO 6 — IMAGEN DESTACADA
PROMPT: photorealistic chemistry laboratory, soft lighting, neutral background, volumetric flasks and a pH meter on a bench, no text, high quality.
ALT: Matraces aforados y un pehachímetro sobre una mesada de laboratorio químico.

CAMPO 7 — CUERPO DEL ARTÍCULO

## Definición de pH y pOH

El concepto de pH es una medida de la acidez o alcalinidad de una solución acuosa. Matemáticamente, se define como el logaritmo negativo de la actividad de los iones hidrógeno (Skoog et al., 9.ª ed.). En soluciones diluidas, aproximamos la actividad a la concentración molar.

La fórmula principal es pH = -log[H+]. De manera análoga, el pOH mide la concentración de iones hidroxilo con la ecuación pOH = -log[OH-]. En agua a 25 °C, la suma de ambos valores siempre es igual a 14,00 (NIST WebBook).

Por eso, si conocés el pOH de una muestra, podés calcular fácilmente su pH restando ese valor a 14. Esta relación es útil cuando analizamos muestras industriales, como efluentes de la industria aceitera o petroquímica.

Dicho esto, el método de cálculo cambia radicalmente dependiendo de si el compuesto se disocia por completo o solo parcialmente en agua. Veamos primero el caso más directo.

## Ácidos y bases fuertes: cálculo directo

Los ácidos fuertes, como el ácido clorhídrico (HCl) o el ácido sulfúrico (H2SO4), se disocian completamente en solución acuosa. Esto significa que la concentración de iones H+ es igual a la concentración inicial del ácido monoprótico.

Por ejemplo, si preparamos una solución de HCl 0,01 M para acidificar una muestra de suelo, la concentración de [H+] será exactamente 0,01 M. Al aplicar la fórmula, obtenemos un pH de 2,00. El cálculo es directo y no requiere constantes de equilibrio.

Las bases fuertes, como el hidróxido de sodio (NaOH), funcionan igual pero aportando iones OH-. En una solución de NaOH 0,01 M, el pOH será 2,00. Restando este valor a 14, determinamos que el pH final es 12,00.

Sin embargo, la mayoría de los reactivos y analitos orgánicos en el laboratorio no se disocian al 100 %. Para ellos, necesitamos usar un enfoque distinto basado en el equilibrio químico.

## Ácidos y bases débiles: la tabla ICE y Ka

Los ácidos débiles, como el ácido acético presente en el vinagre, alcanzan un equilibrio donde coexisten moléculas intactas e iones disociados. Para calcular su pH, usamos la constante de acidez (Ka) y una herramienta llamada tabla ICE (Inicial, Cambio, Equilibrio).

La ecuación exacta requiere resolver una fórmula cuadrática. En cambio, si la concentración inicial (C) es mucho mayor que el valor de Ka, podemos usar una aproximación simplificada: [H+] = √(Ka·C).

Esta fórmula es válida si la cantidad disociada representa menos del 5 % de la concentración inicial (Harris, 9.ª ed.). Si la solución es extremadamente diluida, la aproximación falla y debés usar la ecuación cuadrática completa para evitar errores analíticos.

Para agilizar tu trabajo diario en la mesada y evitar despejes matemáticos complejos, podés apoyarte en herramientas digitales. A continuación, aplicaremos estos conceptos en un caso práctico de laboratorio.

## Ejemplos resueltos en el laboratorio

Imaginá que necesitás calcular el pH de una solución de ácido acético 0,1 M. La constante Ka del ácido acético a 25 °C es 1,75 × 10-5 (CRC Handbook, 103.ª ed.).

Aplicando nuestra aproximación: [H+] = √(1,75 × 10-5 × 0,1). El resultado de la concentración de protones es 1,32 × 10-3 M. Al calcular el logaritmo negativo, obtenemos un pH de 2,87. Como la disociación es del 1,32 %, la aproximación del 5 % se cumple perfectamente.

Para verificar este o cualquier otro cálculo, usá Calculadora de pH en QuimCalc ingresando a /herramientas/calculadora-ph.html. También podés consultar los valores de constantes en nuestra /herramientas/tabla-pka.html si trabajás con otros ácidos orgánicos.

Si agregás una sal conjugada a este ácido débil, el sistema cambiará por completo. En ese caso, estarás formando una solución amortiguadora y deberás consultar cómo resolverlo visitando /herramientas/calculadora-buffers.html y nuestra guía en /blog/posts/que-es-el-pka-y-como-usar-buffers.html.

## Preguntas frecuentes sobre el cálculo de pH

¿Por qué el pH de un ácido débil no es −log C?
Porque el ácido no se disocia por completo. Si calculás −log(0,1) para el ácido acético 0,1 M, obtendrás un pH de 1,00, lo cual es incorrecto. El valor real es 2,87 porque solo una pequeña fracción de las moléculas libera iones H+.

¿Cómo se calcula el pH de una base débil?
El procedimiento es idéntico, pero usás la constante de basicidad (Kb) para encontrar la concentración de [OH-]. Luego calculás el pOH y, finalmente, lo restás a 14 para obtener el pH. Podés usar la relación Ka·Kb = 10-14 para hallar Kb si solo conocés Ka.

¿Qué pH tiene el agua destilada en el laboratorio?
En teoría, el agua pura tiene un pH de 7,00 a 25 °C. En la práctica habitual en laboratorios de análisis ambiental, el agua destilada suele tener un pH entre 5,5 y 6,0. Esto ocurre porque absorbe dióxido de carbono del aire, formando ácido carbónico (ISO 3696:1987).

CAMPO 8 — TABLA DE CONTENIDOS
#definicion-ph-poh — Definición de pH y pOH
#acidos-bases-fuertes — Ácidos y bases fuertes: cálculo directo
#acidos-bases-debiles — Ácidos y bases débiles: la tabla ICE y Ka
#ejemplos-resueltos — Ejemplos resueltos en el laboratorio
#preguntas-frecuentes — Preguntas frecuentes sobre el cálculo de pH

CAMPO 9 — HERRAMIENTAS RELACIONADAS
/herramientas/calculadora-ph.html — Calculadora de pH
/herramientas/tabla-pka.html — Tabla de pKa
/herramientas/calculadora-buffers.html — Buffers Henderson-Hasselbalch

CAMPO 10 — FUENTES CONSULTADAS
Skoog, D. A., West, D. M., Holler, F. J., & Crouch, S. R. (2014). Fundamentos de química analítica (9.ª ed.). Cengage Learning.
Harris, D. C. (2016). Análisis químico cuantitativo (9.ª ed.). Reverté.
NIST Chemistry WebBook, SRD 69. National Institute of Standards and Technology.
ISO 3696:1987. Water for analytical laboratory use — Specification and test methods.
CRC Handbook of Chemistry and Physics (103.ª ed.). CRC Press.
