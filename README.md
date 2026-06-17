# QuimCalc

**Suite de herramientas de cálculo y blog para química analítica e industrial.**

Sitio web estático para técnicos de laboratorio, estudiantes y profesionales de la química del mundo hispanohablante. Construido sin frameworks, con HTML, CSS y JavaScript vanilla puro.

**Sitio en vivo:** [quimcalc.com](https://quimcalc.com)

---

## ¿Qué es QuimCalc?

QuimCalc ofrece 24 calculadoras y conversores de uso diario en el laboratorio, más artículos educativos sobre química analítica, instrumentación y normativa de calidad.

**Herramientas disponibles:** 24 (20 calculadoras + 4 tablas de referencia)
**Posts del blog:** 10
**Dependencias externas:** 0

---

## Herramientas incluidas

### Calculadoras básicas
| Herramienta | Archivo |
|---|---|
| Molaridad y masa | `calculadora-molaridad.html` |
| Diluciones C₁V₁=C₂V₂ | `calculadora-diluciones.html` |
| Conversor ppm / mg/L | `conversor-ppm-mgl.html` |
| Calculadora de pH | `calculadora-ph.html` |
| % Rendimiento | `calculadora-rendimiento.html` |
| Conversor de temperatura | `conversor-temperatura.html` |
| Concentración % p/p, p/v, v/v | `concentracion-pp.html` |
| Masa Molar | `masa-molar.html` |

### Calculadoras intermedias
| Herramienta | Archivo |
|---|---|
| Buffers — Henderson-Hasselbalch | `calculadora-buffers.html` |
| Diluciones seriadas | `diluciones-seriadas.html` |
| Dureza del agua (8 unidades) | `dureza-agua.html` |
| Titulación volumétrica | `calculadora-titulacion.html` |

### Calculadoras avanzadas
| Herramienta | Archivo |
|---|---|
| Curva de calibración | `curva-calibracion.html` |
| LOD / LOQ (3 métodos) | `lod-loq.html` |
| Incertidumbre GUM | `incertidumbre.html` |
| % Recuperación y error sistemático | `recuperacion-error.html` |
| Solución desde sólido con pureza | `solucion-desde-solido.html` |
| Dilución desde reactivo comercial | `diluciones-reactivo-comercial.html` |
| Estadística básica para laboratorio | `estadistica-laboratorio.html` |
| Conversor de concentración ampliado | `conversor-concentracion.html` |

### Tablas de referencia
| Tabla | Archivo |
|---|---|
| Tabla periódica interactiva | `tabla-periodica.html` |
| Tabla de pKa | `tabla-pka.html` |
| Tabla de indicadores ácido-base | `tabla-indicadores.html` |
| Tabla de solubilidad | `tabla-solubilidad.html` |

---

## Blog

10 posts sobre química analítica, instrumentación y normativa de calidad.

**Categorías:** Química básica · Agua y medio ambiente · Análisis volumétrico · Instrumentación · Normativa y calidad

---

## Stack tecnológico

```
HTML5 semántico
CSS3 con variables (:root)     — sin frameworks
JavaScript ES6 vanilla         — sin librerías externas
BEM                            — nomenclatura de clases
SVG inline (Lucide)            — íconos embebidos
JSON-LD                        — datos estructurados SEO
PWA + Service Worker           — disponible offline
Vercel                         — hosting y deploy automático
```

Sin npm. Sin Node. Sin React. Sin bundler. Abrís el `index.html` y funciona.

---

## Estructura del proyecto

```
QuimCalc/
├── data/
│   ├── posts.json              ← metadatos de posts (editá acá para agregar)
│   └── tools.json              ← metadatos de herramientas
├── scripts/
│   └── sync_indexes.py         ← regenera blog/index.html, sitemap y sw.js
├── INSTRUCCIONES.md            ← guía detallada para agregar contenido
└── quimcalc/                   ← raíz del sitio (servida por Vercel)
    ├── index.html
    ├── styles.css
    ├── sw.js                   ← Service Worker PWA
    ├── sitemap.xml
    ├── js/
    │   ├── animations.js       ← fade-in on scroll (IntersectionObserver)
    │   ├── pwa-register.js
    │   └── init-speed-insights.js
    ├── herramientas/
    │   ├── *.html
    │   └── js/
    └── blog/
        ├── index.html
        └── posts/
            ├── PLANTILLA-post.html
            ├── img/
            └── *.html
```

---

## Cómo agregar contenido nuevo

> Ver guía completa en **[INSTRUCCIONES.md](./INSTRUCCIONES.md)**

### Resumen — Post nuevo

```bash
# 1. Crear el HTML del post desde la plantilla
cp quimcalc/blog/posts/PLANTILLA-post.html quimcalc/blog/posts/nombre-del-articulo.html
# Editar el archivo y completar el contenido

# 2. Agregar la imagen (WebP, 600×200 px)
# quimcalc/blog/posts/img/nombre-del-articulo.webp

# 3. Registrar el post en data/posts.json (agregar objeto al array)

# 4. Sincronizar índices
python scripts/sync_indexes.py

# 5. Publicar
git add . && git commit -m "Blog: agrega post 'Título'" && git push
```

### Resumen — Herramienta nueva

```bash
# 1. Crear el HTML de la herramienta
cp quimcalc/herramientas/calculadora-molaridad.html quimcalc/herramientas/nueva-herramienta.html
# Editar el archivo

# 2. Agregar el bloque en quimcalc/index.html (sección #herramientas)

# 3. Registrar en data/tools.json

# 4. Sincronizar índices
python scripts/sync_indexes.py

# 5. Publicar
git add . && git commit -m "Herramienta: agrega 'Nombre'" && git push
```

---

## Deploy

El sitio se despliega automáticamente en Vercel al hacer push a `main`. No se requiere ninguna acción manual.

---

## Identidad visual

| Variable CSS | Color | Uso |
|---|---|---|
| `--color-fondo` | `#F7F5F0` | Fondo principal (crema cálida) |
| `--color-acento` | `#1A5C38` | Botones, links, destacados (verde) |
| `--color-header-bg` | `#1C2E22` | Header y footer (verde oscuro) |
| `--color-texto` | `#1C1A17` | Texto principal |
| `--color-borde` | `#D4CFC4` | Bordes y separadores |

**Tipografías:** Source Serif 4 (títulos) · DM Sans (cuerpo)

---

*Desarrollado con asistencia de Claude (Anthropic).*
