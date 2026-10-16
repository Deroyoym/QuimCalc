---
description: Propone temas nuevos para el blog que lleven tráfico a las calculadoras
argument-hint: "[foco opcional: categoría, calculadora o país]"
---

Busca ideas de artículos nuevos para el blog de QuimCalc.

1. Obtén la fecha de hoy (`date +%F`).
2. Lanza el subagente `investigador-temas` con la herramienta Agent. Si hay foco, pásaselo: **$ARGUMENTS** (si está vacío, que haga una revisión general de todas las calculadoras).
3. Guarda su informe tal cual en `revisiones/ideas-<fecha>.md` (crea la carpeta si no existe; si el archivo ya existe, agrega un sufijo `-2`, `-3`…).
4. Muestra al usuario una tabla resumen (n.º, título tentativo, keyword, calculadora, prioridad) y la ruta del informe completo.

No crees artículos ni edites archivos del sitio: esto es solo investigación.
