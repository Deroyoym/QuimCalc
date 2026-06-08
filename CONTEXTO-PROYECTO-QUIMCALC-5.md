# QuimCalc — Documento de Contexto del Proyecto v5

> Generado con estado REAL verificado contra el repo el 08 de junio de 2026.
> No copiar como verdad absoluta en sesiones futuras: el repo es siempre la fuente de verdad.

---

## 1. Descripción general

**QuimCalc** es un sitio web estático de herramientas de cálculo y blog para el ámbito de la química analítica e industrial. Orientado a técnicos de laboratorio, estudiantes y profesionales, con foco inicial en el Gran Rosario / Santa Fe, Argentina.

**URL activa:** https://quimcalc.com (dominio propio conectado a Vercel)
**URL alternativa:** https://quim-calc.vercel.app
**Repo GitHub:** https://github.com/Deroyoym/QuimCalc
**Carpeta raíz del sitio dentro del repo:** `/quimcalc/` (Vercel sirve desde ahí)
**Monetización futura:** Google AdSense (a 3.000–5.000 visitas/mes) + informes PDF descargables

---

## 2. Stack tecnológico

- **HTML5 semántico** — sin frameworks
- **CSS3** con variables CSS (`:root`) — sin frameworks
- **JavaScript vanilla ES6** — sin librerías externas
- **BEM** — nomenclatura de clases CSS
- **SVG inline** — íconos Lucide embebidos en HTML
- **JSON-LD** — datos estructurados SEO en cada página
- **Google Fonts** — Source Serif 4 + DM Sans
- **Git + GitHub** — control de versiones
- **Vercel** — deploy automático. Cada `git push` a `main` redeploya el sitio en ~1-2 min
- **Vercel Speed Insights** — `init-speed-insights.js`, `speed-insights.mjs` en `/quimcalc/js/`
- **Google Analytics** — `G-JPQ3QTH9BN` (activo en todas las páginas incluyendo PLANTILLA)
- **package.json / node_modules** — solo para Speed Insights de Vercel; sin bundler

---

## 3. Identidad visual

### Paleta (`:root` en `styles.css`)

```css
--color-fondo:        #F7F5F0;   /* Crema cálida — fondo principal */
--color-fondo-card:   #EDEAE2;   /* Crema más oscura — cards */
--color-acento:       #1A5C38;   /* Verde oscuro — botones, links */
--color-acento-hover: #134529;   /* Verde más oscuro para hover */
--color-acento-claro: #E8F2EC;   /* Verde muy claro — fondo de resultados */
--color-texto:        #1C1A17;   /* Marrón muy oscuro — texto principal */
--color-texto-suave:  #5C5649;   /* Marrón medio — texto secundario */
--color-borde:        #D4CFC4;   /* Arena — bordes */
--color-exito:        #276C43;   /* Verde éxito */
--color-error:        #B83232;   /* Rojo error */
--color-header-bg:    #1C2E22;   /* Verde muy oscuro — header y footer */
--color-header-texto: #F0EDE6;   /* Crema clara — texto del header */
```

### Tipografías

- **Títulos h1, h2:** `Source Serif 4` (serif, weight 600/700)
- **Cuerpo, UI, labels:** `DM Sans` (sans-serif, weight 400/500/600/700)
- **Fórmulas y código:** `Courier New` monospace

---

## 4. Estructura de archivos (estado real al 08-jun-2026)

```
QuimCalc/                             ← raíz del repo GitHub
├── README.md
├── add_analytics.py
├── add_og_tags.py                    ← script usado en sesión jun-2026 (puede borrarse)
├── CONTEXTO-PROYECTO-QUIMCALC-5.md  ← este archivo
└── quimcalc/                         ← RAÍZ DEL SITIO SERVIDO POR VERCEL
    │
    ├── index.html
    ├── styles.css
    ├── contacto.html                 ← ✅ WhatsApp +549 3413482171, email s.yedro@outlook.com
    ├── sobre-el-proyecto.html
    ├── politicas-de-privacidad.html
    ├── terminos-de-uso.html
    ├── robots.txt
    ├── sitemap.xml                   ← ✅ 40 URLs completas (actualizado jun-2026)
    ├── google3c7b1d6ccb347f0a.html
    ├── package.json / package-lock.json
    ├── node_modules/
    ├── sw.js                         ← PWA: Service Worker
    ├── offline.html                  ← PWA: página offline
    │
    ├── assets/
    │   ├── favicon.ico / favicon-16x16.png / favicon-32x32.png
    │   ├── apple-touch-icon.png
    │   ├── android-chrome-192x192.png / android-chrome-512x512.png
    │   ├── icon-maskable-192.png / icon-maskable-512.png
    │   ├── shortcut-molaridad.png / shortcut-diluciones.png / shortcut-ph.png / shortcut-masa.png
    │   └── site.webmanifest
    │
    ├── js/
    │   ├── init-speed-insights.js
    │   ├── speed-insights.mjs
    │   └── pwa-register.js
    │
    ├── descargas/
    │   └── curva-calibracion-quimcalc.xlsx
    │
    ├── blog/
    │   ├── index.html
    │   └── posts/
    │       ├── PLANTILLA-post.html   ← ✅ gtag.js activo (arreglado jun-2026)
    │       └── [10 posts — ver sección 6]
    │
    ├── herramientas/
    │   ├── [21 herramientas + 3 tablas — ver sección 5]
    │   └── js/
    │       └── [archivos .js de herramientas 1-16]
    │
    └── admin/
        └── index.html               ← CMS generador de posts (contraseña: quimcalc2025)
```

---

## 5. Herramientas — 21 calculadoras + 3 tablas = 24 archivos

### Básicas
| # | Nombre | Archivo |
|---|--------|---------|
| 1 | Molaridad y masa | `calculadora-molaridad.html` |
| 2 | Diluciones C₁V₁=C₂V₂ | `calculadora-diluciones.html` |
| 3 | Conversor ppm/mg/L/Normalidad | `conversor-ppm-mgl.html` |
| 4 | Calculadora de pH | `calculadora-ph.html` |
| 5 | % Rendimiento | `calculadora-rendimiento.html` |
| 6 | Temperatura °C/°F/K | `conversor-temperatura.html` |
| 7 | Concentración % p/p | `concentracion-pp.html` |
| 8 | Masa Molar (parser de fórmulas) | `masa-molar.html` |

### Intermedias
| # | Nombre | Archivo |
|---|--------|---------|
| 9 | Buffers Henderson-Hasselbalch | `calculadora-buffers.html` |
| 10 | Diluciones seriadas | `diluciones-seriadas.html` |
| 11 | Dureza del agua (8 unidades) | `dureza-agua.html` |
| 12 | Titulación volumétrica | `calculadora-titulacion.html` |

### Elaboradas
| # | Nombre | Archivo |
|---|--------|---------|
| 13 | Curva de calibración (regresión + canvas) | `curva-calibracion.html` |
| 14 | LOD y LOQ (3 métodos) | `lod-loq.html` |
| 15 | Incertidumbre GUM (Tipo A + B) | `incertidumbre.html` |
| 16 | Tabla periódica | `tabla-periodica.html` |

### Nuevas (mayo 2026)
| # | Nombre | Archivo |
|---|--------|---------|
| 17 | Dilución desde reactivo comercial | `diluciones-reactivo-comercial.html` |
| 18 | Estadística básica para laboratorio | `estadistica-laboratorio.html` |
| 19 | Conversor de concentración ampliado (11 unidades) | `conversor-concentracion.html` |
| 20 | % Recuperación y error sistemático | `recuperacion-error.html` |
| 21 | Solución desde sólido con pureza | `solucion-desde-solido.html` |

### Tablas de referencia estáticas
| Tabla | Archivo | Fuentes |
|-------|---------|---------|
| pKa (39 compuestos, 5 categorías) | `tabla-pka.html` | NIST WebBook, CRC 103ª ed., NIST SRD-46 |
| Indicadores ácido-base (15 indicadores) | `tabla-indicadores.html` | CRC 103ª ed., Skoog et al. 9ª ed. |
| Solubilidad de sales | `tabla-solubilidad.html` | — |

> **Nota:** `tabla-solubilidad.html` no estaba en el doc v4 — fue creada entre mayo y junio 2026.

---

## 6. Blog — 10 posts (el doc v4 decía 9, estaba mal)

| # | Archivo | Categoría |
|---|---------|-----------|
| 1 | `que-es-la-molaridad.html` | Química básica |
| 2 | `normalidad-vs-molaridad.html` | Química básica |
| 3 | `que-es-el-pka-y-como-usar-buffers.html` | Química básica |
| 4 | `dureza-agua-gran-rosario.html` | Agua y medio ambiente |
| 5 | `espectrofotometria-curva-calibracion.html` | Instrumentación |
| 6 | `incertidumbre-para-no-estadisticos.html` | Normativa y calidad |
| 7 | `errores-comunes-titulacion.html` | Análisis volumétrico |
| 8 | `que-es-el-limite-de-deteccion.html` | Normativa y calidad |
| 9 | `como-construir-curva-de-calibracion.html` | Instrumentación |
| 10 | `como-preparar-soluciones-estandar-correctamente.html` | Química básica |

---

## 7. Convenciones técnicas

### Rutas relativas por nivel
```
quimcalc/*.html          → ./styles.css    ./index.html
quimcalc/herramientas/   → ../styles.css   ../index.html
quimcalc/blog/index.html → ../styles.css   ../index.html
quimcalc/blog/posts/     → ../../styles.css  ../../index.html
quimcalc/admin/          → ../styles.css   ../index.html
```

### Herramientas 17-21
JS embebido en el HTML (al final del `<body>`), no en archivos separados en `js/`.

### Flujo git
```bash
git add .
git commit -m "Descripción del cambio"
git push
# Si hay error non-fast-forward: git pull origin main → git push
```

### Comentarios de código
Siempre en español.

---

## 8. SEO — estado al 08-jun-2026

### Implementado ✅

- `<title>` único con keyword + " | QuimCalc"
- `<meta name="description">` 120-160 chars
- **Open Graph + Twitter Card** en todas las páginas de contenido (41 archivos)
  - `og:type`, `og:url`, `og:title`, `og:description`, `og:image`
  - `twitter:card=summary_large_image`
  - Imagen fallback: `/assets/android-chrome-512x512.png` (mejorable con imagen 1200×630 dedicada)
- JSON-LD: `SoftwareApplication` en herramientas, `Article` en posts, `Dataset` en tablas
- `Dataset` de `tabla-indicadores.html` tiene campo `license` (CC BY 4.0)
- Canonical en páginas que lo tenían
- Todas las referencias a `quimcalc.netlify.app` reemplazadas por `quimcalc.com`
- `sitemap.xml` con 40 URLs (5 principales + 24 herramientas + 1 blog index + 10 posts)
- Google Search Console verificado (`robots.txt` + archivo HTML de verificación)
- Internal linking: calculadoras → posts relacionados

### Pendiente

- Crear imagen OG dedicada 1200×630 px (hoy se usa el ícono 512×512 como fallback)
- Rich Snippets `aggregateRating` cuando haya reseñas reales
- Cambiar contraseña del CMS (`admin/index.html`, contraseña actual: `quimcalc2025`)

---

## 9. PWA

| Archivo | Descripción |
|---------|-------------|
| `site.webmanifest` | Web App Manifest con shortcuts |
| `sw.js` | Service Worker |
| `pwa-register.js` | Registro del SW + botón instalación |
| `offline.html` | Página offline fallback |

Shortcuts PWA: Molaridad, Diluciones, pH, Masa Molar.

---

## 10. Analytics y monitoreo

- **Google Analytics:** `G-JPQ3QTH9BN` — activo en todas las páginas
- **Vercel Speed Insights:** configurado
- **Search Console:** verificado. Datos mayo-junio 2026: `lod-loq.html` 121 imp / 0.83% CTR, `dureza-agua.html` 88 imp / 0% CTR (snippets reescritos en jun-2026)

---

## 11. Deuda técnica resuelta en sesión jun-2026

| Ítem | Estado |
|------|--------|
| `gtag.js` comentado en PLANTILLA-post.html | ✅ Arreglado — posts nuevos ahora trackean analytics |
| Title + description de `lod-loq.html` | ✅ Reescritos con copia orientada a CTR |
| Title + description de `dureza-agua.html` | ✅ Reescritos con copia orientada a CTR |
| Open Graph + Twitter Card ausentes en todo el sitio | ✅ Agregados a 41 archivos |
| 9 referencias a `quimcalc.netlify.app` en JSON-LD | ✅ Reemplazadas por `quimcalc.com` |
| Campo `license` faltante en JSON-LD de `tabla-indicadores.html` | ✅ Agregado (CC BY 4.0) |
| `sitemap.xml` (lastmod desactualizado) | ✅ Actualizado para páginas editadas |

---

## 12. Plan de contenidos — posts priorizados

| Prioridad | Título | Herramienta relacionada |
|-----------|--------|------------------------|
| 1 | DBO vs. DQO en efluentes industriales | — |
| 2 | Nitratos en agua subterránea: límites y normativa argentina | — |
| 3 | Cómo validar un método analítico: guía introductoria ISO 17025 | Incertidumbre + Recuperación |
| 4 | ¿Qué es la trazabilidad metrológica y por qué la piden? | — |
| 5 | Control de calidad en aceites vegetales | Estadística lab |
| 6 | Parámetros fisicoquímicos del agua potable | Dureza del agua |
| 7 | Seguridad en laboratorio: hojas de seguridad y compatibilidad | — |

**Meta:** 2 posts nuevos por mes.

---

## 13. Estado general del sitio al 08-jun-2026

| Página / Funcionalidad | Estado |
|------------------------|--------|
| index.html | ✅ Online |
| contacto.html | ✅ Online — datos reales (WA + email) |
| sobre-el-proyecto.html | ✅ Online |
| politicas-de-privacidad.html | ✅ Online |
| terminos-de-uso.html | ✅ Online |
| admin/index.html (CMS) | ✅ Online |
| Las 21 herramientas calculadoras | ✅ Todas online |
| Las 3 tablas de referencia | ✅ Online (pKa, indicadores, solubilidad) |
| Los 10 posts del blog | ✅ Todos online |
| Excel descargable (curva de calibración) | ✅ En `/descargas/` |
| Open Graph + Twitter Card | ✅ En 41 páginas (jun-2026) |
| Internal linking calculadoras → posts | ✅ Implementado |
| Rich Snippets JSON-LD | ✅ SoftwareApplication / Article / Dataset |
| sitemap.xml | ✅ 40 URLs — completo y actualizado |
| Google Search Console | ✅ Verificado |
| robots.txt | ✅ Existe |
| PWA (Service Worker + Manifest) | ✅ Activo |
| Vercel Speed Insights | ✅ Configurado |
| Analytics en PLANTILLA-post.html | ✅ Activo (corregido jun-2026) |

*Última actualización: 08 de junio de 2026.*
