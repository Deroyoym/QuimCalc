# Revisión de herramientas nuevas — 2026-11-05

Herramientas:
- `calculadora-karl-fischer`
- `calculadora-normalidad`
- `factor-correccion-estandarizacion`

Ninguna está publicada todavía (rama `claude/repo-review-improvements-villyc`).

Revisores:
- 3 × `auditor-calculadoras`
- `revisor-seo`

Batería: 19/19 pruebas de estas páginas.

## Resumen
| Herramienta | Casos recalculados | Críticos | Altos | Medios | Bajos |
|---|---|---|---|---|---|
| Karl Fischer | 16/16 correctos | 1 | 2 | 4 | 6 |
| Normalidad | 15/15 correctos | 0 (1 en el post) | 2 | 6 | 7 |
| Factor de corrección | 9/9 correctos | 1 | 1 | 5 | 5 |
| SEO (las 3) | — | — | 3 por página | 3–4 por página | 1–2 por página |

Las fórmulas, las masas molares, los factores de equivalencia, las relaciones estequiométricas y los ejemplos de las páginas están todos verificados. Los problemas son de validación, de avisos que faltan, de notas químicas incompletas y de enlazado.

## 1. Críticos
- **Blanco inválido tomado como 0 sin avisar.** Afecta a Karl Fischer (`vol-blanco` y `cou-blanco`) y a factor de corrección (`v-blanco`). La lectura `leer(...) || 0` convierte NaN en 0, así que «1,2,3» calcula sin restar el blanco. Corrección: tratar vacío como 0 e inválido como error.
- **Post `normalidad-vs-molaridad`, l. 292:** la ecuación en molaridad está invertida. Debe decir M(NaOH)·V(NaOH) = 2·M(H₂SO₄)·V(H₂SO₄).

## 2. Altos
**Karl Fischer**
- El modo coulométrico no avisa si el resultado supera el 100 %.
- La ayuda del blanco coulométrico no advierte que muchos equipos ya descuentan la deriva, así que es fácil restarla dos veces.

**Normalidad**
- Falta un aviso de solubilidad para Ca(OH)₂: en agua no llega a más de ≈ 0,047 N a 20 °C.
- Falta un aviso para I₂: necesita KI para disolverse y hay que estandarizarlo.

**Factor de corrección**
- Las ecuaciones yodométricas de las notas no están balanceadas. Las correctas:
  - IO₃⁻ + 5 I⁻ + 6 H⁺ → 3 I₂ + 3 H₂O
  - Cr₂O₇²⁻ + 6 I⁻ + 14 H⁺ → 2 Cr³⁺ + 3 I₂ + 7 H₂O

**SEO**
- Ningún post enlaza a las tres herramientas. Los posts de Karl Fischer y de normalidad mandan su CTA a otras calculadoras (molaridad y conversor de ppm).
- Karl Fischer no usa «humedad» en el title, la meta ni el H1.

## 3. Medios y bajos
**Validación y formato (todas las herramientas)**
- Validar `isFinite` (hoy «1e400» pasa).
- Mensaje distinto para «vacío» y para «no es un número».
- Repetir las entradas sin ceros de relleno.
- Normalidad: f con punto decimal en la fórmula.
- Limpiar el resultado al cambiar las unidades.
- Masas grandes en kg.

**Notas químicas**
- H₃PO₄: el tercer H⁺ no se titula en agua. Ajustar también el post.
- KMnO₄: «neutro o débilmente básico».
- KMnO₄, tiosulfato e I₂ no son patrones primarios: avisar que hay que estandarizarlos.
- EDTA/CaCO₃: indicar el indicador (NET con Mg-EDTA o calcón).
- Tartrato: permitir el contenido de agua que indica el certificado.
- Rango del método coulométrico: de 1 mg/kg a 1–5 %.
- Estándares líquidos de 0,1, 1 y 10 mg/g.
- Usar estados de agregación en las ecuaciones.
- Factor 0,95–1,05: aclarar que es orientativo (la JP pide 0,970–1,030).
- Avisar si la masa es menor de 0,1 g o si la pureza parece escrita como fracción.

**Coherencia del sitio**
- Umbral de CV: el post de errores dice 0,3 % y 0,5 %, y la herramienta 0,2 %. Propuesta: 0,2 % para estandarizar el titulante y 0,5 % para las réplicas de muestra.
- El post de errores usa una fórmula de concentración real sin la estequiometría ni la pureza.
- El post de Karl Fischer atribuye la estandarización a la ISO 17025. Debería citar USP ‹921› o Ph. Eur. 2.5.12.

**SEO**
- Agregar `offers` al JSON-LD.
- Poner `id` en los H2 y un H2 para el ejemplo resuelto.
- Agregar enlaces dentro del cuerpo.
- Agregar variantes: título y equivalente de agua; equivalente-gramo y disolución; valoración y normalización.
- Agregar una FAQ de respuesta directa en cada página.
- Crear un bloque «Herramientas relacionadas» en titulación.
- No enlazar «factor de corrección» desde el post de calibración del material de vidrio, donde el término es otro concepto (el factor Z).

**Decisión del editor**
Las páginas de herramientas usan voseo («Calculá», «¿Qué querés calcular?»), igual que las 24 existentes. La guía editorial pide español neutro.

## 4. Casos nuevos para la batería
Están en los informes de los auditores: 8 de Karl Fischer, 9 de normalidad y 10 de factor de corrección. Se suman al aplicar.
