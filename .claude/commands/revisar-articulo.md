---
description: Revisión editorial completa de un artículo del blog (técnica, estilo y SEO) con informe priorizado
argument-hint: <ruta del artículo, p. ej. quimcalc/blog/posts/que-es-la-molaridad.html>
---

Coordina la revisión editorial del artículo: **$ARGUMENTS**

## 1. Preparación
- Si `$ARGUMENTS` está vacío, pregunta qué artículo revisar (lista los de `quimcalc/blog/posts/`, sin `PLANTILLA-post.html`) y detente.
- Acepta tanto la ruta completa como el slug solo (`que-es-la-molaridad` → `quimcalc/blog/posts/que-es-la-molaridad.html`). Comprueba que el archivo existe.
- Obtén la fecha de hoy (`date +%F`) y el slug del archivo.

## 2. Revisión en paralelo
Lanza **en un solo mensaje, en paralelo**, tres subagentes con la herramienta Agent:
- `revisor-tecnico`
- `corrector-estilo`
- `revisor-seo`

A cada uno pásale la ruta del artículo y pídele su informe completo en el formato de su definición. Recuérdales que no deben editar archivos.

## 3. Informe unificado
Cuando estén los tres informes, únelos en **un solo documento priorizado**:

```
# Revisión editorial — <slug> — <fecha>

Artículo: `<ruta>` · URL: https://quimcalc.com/blog/posts/<slug>.html

## Resumen
| Área | Críticos | Altos / imprecisos | Menores / sugerencias |
|---|---|---|---|
| Técnica | | | |
| Estilo | | | |
| SEO | | | |
Veredicto en 2–3 oraciones.

## 1. Críticos (corregir antes de cualquier otra cosa)
Errores técnicos críticos + problemas SEO de prioridad alta que rompen algo (enlace roto, schema inválido, title > 60…).

## 2. Importantes
Imprecisiones técnicas, voseo/regionalismos, title/meta mejorables (con las 3 alternativas), enlaces internos faltantes.

## 3. Menores y sugerencias
Resto de correcciones de estilo y sugerencias.

## 4. Ejemplos recalculados
(tal cual del revisor técnico, con el código Python)

## 5. Tabla de correcciones de estilo
(fragmento → corrección → motivo)

## 6. FAQ propuesta

## 7. Checklist de aplicación
- [ ] …  (una línea por cambio concreto, marcando con 🔢 los que tocan un número o cálculo)

## Anexos: informes originales
<details><summary>Revisor técnico</summary> … </details>
<details><summary>Corrector de estilo</summary> … </details>
<details><summary>Revisor SEO</summary> … </details>
```

Reglas al unir:
- Elimina duplicados (si dos revisores señalan lo mismo, una sola entrada con ambas fuentes).
- Si dos revisores se contradicen, muestra ambas posturas y marca «decisión del editor».
- No inventes hallazgos que no estén en los informes.

Guarda el documento en `revisiones/<slug>-<fecha>.md` (crea la carpeta si no existe). Si el archivo ya existe, agrega un sufijo `-2`, `-3`…

## 4. Mostrar y preguntar
Muestra al usuario el **Resumen** y la sección **Críticos**, con la ruta del informe completo. Después pregunta con AskUserQuestion si aplica las correcciones, con estas opciones:
- Aplicar todo
- Solo críticos e importantes
- Elegir una por una
- No aplicar nada

## 5. Aplicar (solo si el usuario dijo que sí)
- **Nunca edites el HTML sin la confirmación explícita del usuario.**
- **Nunca cambies un número, fórmula o resultado** que no figure como verificado (✅) o con corrección recalculada en el informe del revisor técnico. Si una corrección de estilo o SEO toca un cálculo no verificado, sáltala y avísalo.
- Para title y meta, si el usuario no eligió una alternativa, pregúntale cuál antes de aplicarla.
- Mantén sincronizadas las copias: `<title>` = `og:title` = `twitter:title`; meta description = `og:description` = `twitter:description`; FAQ visible = JSON-LD `FAQPage`; H1 = `headline` del `Article`. Actualiza `dateModified` si cambia el contenido.
- Si cambias title, description o image_alt, actualiza también `data/posts.json` y corre `python3 scripts/sync_indexes.py` desde la raíz del repo.
- Verifica al final: JSON-LD válido (parsearlo con Python), largos de title ≤ 60 y meta ≤ 155, enlaces internos que existen.
- Marca en el checklist del informe lo aplicado y lo omitido (con el motivo) y resume los cambios al usuario.
