# CTR del conversor ppm ↔ mg/L — 2026-11-07

## Problema
Es la página con más impresiones del sitio, pero casi nadie hace clic. Datos de Search Console, últimos 3 meses (5/8 al 4/11/2026):

| Métrica | Valor |
|---|---|
| Impresiones | 20.164 |
| Clics | 92 |
| CTR | 0,46 % |
| Posición media | 9,4 |

Consultas principales (impresiones / clics / posición):

| Consulta | Impr. | Clics | Pos. |
|---|---|---|---|
| ppm a mg/l | 2.255 | 19 | 4,7 |
| mg/l a ppm | 1.049 | 4 | 6,0 |
| ppm a % | 362 | 1 | 9,7 |
| 1 ppm a mg/l | 250 | 2 | 6,0 |
| ppm a mg | 235 | 2 | 6,0 |
| mg a ppm | 191 | 2 | 6,2 |
| ppm a mg/ml | 182 | 1 | 7,7 |
| ppm es igual a mg/l | 167 | 0 | 7,3 |
| ppm a g/l | 112 | 1 | 8,0 |

En posición 5–6 lo esperable es un CTR de varios puntos, no 0,5–0,8 %. La explicación más probable es que Google ya responde «1 ppm = 1 mg/L» en la propia página de resultados (respuesta destacada o resumen con IA), así que quien solo quiere esa equivalencia no entra.

## Cambio (7/11/2026)
El título anterior se había cambiado el 16/10. El export de 3 meses mezcla los dos títulos, así que no se pudo medir aquel cambio por separado.

| | Antes | Después |
|---|---|---|
| title | ppm a mg/L y mg/L a ppm: conversor con densidad | ppm a mg/L y mg/L a ppm: calculadora y tabla \| QuimCalc |
| description | ppm no siempre es mg/L: en soluciones concentradas o solventes cambia. Calcúlalo con la densidad y pasa a %, mg/mL y ppb, gratis y al instante. | En agua, 1 ppm = 1 mg/L. Convierte ppm a mg/L, %, g/L, mg/mL y ppb al instante, con tabla de equivalencias y corrección por densidad. Gratis. |

Por qué:
- **Description:** la anterior arrancaba contradiciendo lo que busca la mayoría («ppm no siempre es mg/L»). La nueva confirma primero la respuesta y después ofrece lo que el resultado de Google no da: las otras unidades (%, g/L, mg/mL, que también se buscan), la tabla y la corrección por densidad.
- **Title:** mantiene las dos direcciones exactas («ppm a mg/L», «mg/L a ppm»), que Google resalta en negrita, y promete calculadora y tabla.
- **Primer párrafo:** ahora dice «1 ppm = 1 mg/L» en la primera oración, para competir por la respuesta destacada.

## Cómo medir (a partir del 5/12/2026)
En Search Console → Rendimiento → filtro de página `conversor-ppm-mgl.html` → Fecha → **Comparar** «últimas 4 semanas» contra las 4 semanas anteriores al 7/11. Mirar CTR y clics de «ppm a mg/l» y «mg/l a ppm», no solo el total, y comparar con la posición: si la posición se mantiene y el CTR sube, el cambio funcionó.
