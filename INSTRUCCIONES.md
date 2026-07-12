# Guía de contenido — QuimCalc

Paso a paso para agregar posts nuevos, herramientas nuevas y mantener el sitio actualizado.

---

## Índice

1. [Agregar un post nuevo](#1-agregar-un-post-nuevo)
2. [Agregar una herramienta nueva](#2-agregar-una-herramienta-nueva)
3. [Sincronizar los índices automáticamente](#3-sincronizar-los-índices-automáticamente)
4. [Publicar los cambios](#4-publicar-los-cambios)
5. [Referencia rápida de archivos](#5-referencia-rápida-de-archivos)

---

## 1. Agregar un post nuevo

### Paso 1 — Crear el archivo HTML del post

Copiá la plantilla base y renombrala con el slug del artículo:

```bash
cp quimcalc/blog/posts/PLANTILLA-post.html quimcalc/blog/posts/nombre-del-articulo.html
```

**Convención del nombre de archivo:**
- Todo en minúsculas, sin acentos
- Palabras separadas por guiones
- Descriptivo y orientado a búsqueda
- Ejemplos: `como-calcular-ph-acidos-debiles.html`, `que-es-la-normalidad.html`

### Paso 2 — Completar el contenido del post

Abrí el archivo y reemplazá todo lo que está entre `[CORCHETES]` con el contenido real. Los bloques más importantes:

**En el `<head>`:**
```html
<title>[TÍTULO DEL POST] | QuimCalc</title>
<meta name="description" content="[DESCRIPCIÓN DE 150-160 CARACTERES]">
<meta property="og:title" content="[TÍTULO DEL POST] | QuimCalc">
<meta property="og:description" content="[DESCRIPCIÓN]">
<link rel="canonical" href="https://quimcalc.com/blog/posts/nombre-del-articulo.html">
```

**JSON-LD del post (en el `<head>`):**
```json
{
  "@type": "BlogPosting",
  "headline": "[TÍTULO]",
  "datePublished": "2026-06-10",
  "dateModified": "2026-06-10",
  "description": "[DESCRIPCIÓN]",
  "inLanguage": "es"
}
```

**Cuerpo del artículo:** seguí la estructura de la plantilla con `<h2>`, `<h3>`, `.ejemplo-bloque` para fórmulas, y `.faq-item` para preguntas frecuentes.

### Paso 3 — Preparar la imagen del post

- Formato: **WebP**, 600×200 px (o mayor con misma proporción 3:1)
- Guardar en: `quimcalc/blog/posts/img/nombre-del-articulo.webp`
- La imagen se usa en la card del blog index y en el header del post

### Paso 4 — Registrar el post en `data/posts.json`

Abrí `data/posts.json` y agregá un objeto al principio del array (los posts se muestran en el orden del archivo, de más reciente a más antiguo):

```json
{
  "slug": "nombre-del-articulo",
  "title": "Título completo del artículo",
  "description": "Resumen del artículo para la card del blog (2-3 oraciones, ~200 caracteres).",
  "category": "Química básica",
  "category_color": "#1A5C38",
  "date": "Junio 2026",
  "date_sort": "2026-06-10",
  "minutes": 8,
  "image": "img/nombre-del-articulo.webp",
  "image_alt": "Descripción accesible de la imagen para lectores de pantalla"
}
```

**Categorías disponibles y sus colores:**

| Categoría | Color |
|---|---|
| Química básica | `#1A5C38` |
| Agua y medio ambiente | `#059669` |
| Análisis volumétrico | `#D97706` |
| Instrumentación | `#7C3AED` |
| Laboratorio industrial | `#0369A1` |
| Normativa y calidad | `#DC2626` |

> **⚠️ Categorías nuevas (paso manual):** si usás una categoría que **no** está en la tabla de arriba, el script `sync_indexes.py` **no** la agrega sola al sidebar del blog — solo sabe actualizar los contadores de categorías que ya existen ahí. Para dar de alta una categoría nueva tenés que hacer **dos cosas a mano** antes de correr el script:
>
> 1. **Elegir un color** CSS distinto a los ya usados y ponerlo en el campo `category_color` del post en `data/posts.json`.
> 2. **Agregar la entrada al sidebar** en `quimcalc/blog/index.html`, dentro de `<ul class="categorias-lista">`, con el contador en 0 (el script lo actualiza al número real después):
>
> ```html
> <li>
>   <a href="#">Nombre de la categoría <span class="count">0</span></a>
> </li>
> ```
>
> Después corré `python scripts/sync_indexes.py` y el contador se ajusta solo. (El color del `category_color` sí se aplica automáticamente a la card del post; lo único manual es el alta en el sidebar.)

### Paso 5 — Ejecutar el script de sincronización

```bash
python scripts/sync_indexes.py
```

Esto actualiza automáticamente:
- ✅ `quimcalc/blog/index.html` — agrega la card del post nuevo
- ✅ `quimcalc/sitemap.xml` — agrega la URL con fecha de hoy
- ✅ `quimcalc/sw.js` — incrementa la versión del caché

### Paso 6 — Verificar en el navegador

Antes de publicar, abrí `quimcalc/blog/index.html` en el navegador y verificá que:
- La card del post nuevo aparece en el lugar correcto (primera posición)
- La imagen carga correctamente
- El título y resumen se leen bien

---

## 2. Agregar una herramienta nueva

### Paso 1 — Crear el archivo HTML de la herramienta

Copiá una herramienta existente similar como base:

```bash
cp quimcalc/herramientas/calculadora-molaridad.html quimcalc/herramientas/nombre-herramienta.html
```

### Paso 2 — Desarrollar la herramienta

Editá el HTML y adaptá:
- Título, meta description y JSON-LD (`inLanguage: "es"`, sin `priceCurrency`)
- Formulario de cálculo (campos de entrada, botón, div de resultado)
- Sección educativa con explicación, fórmulas y FAQ
- Link al blog relacionado (si existe un post)
- JavaScript (puede ir embebido al final del HTML o en `herramientas/js/nombre.js`)

### Paso 3 — Registrar la herramienta en `data/tools.json`

Abrí `data/tools.json` y agregá un objeto al principio del array:

```json
{
  "slug": "nombre-herramienta",
  "title": "Nombre de la herramienta",
  "icon_svg": "<svg viewBox=\"0 0 24 24\">...</svg>",
  "precache": false,
  "js": null
}
```

**Campos:**

| Campo | Descripción |
|---|---|
| `slug` | Nombre del archivo sin `.html` |
| `title` | Texto que se muestra en el índice de herramientas |
| `icon_svg` | SVG inline del ícono (24×24, estilo Lucide). Escapar `"` como `\"` |
| `precache` | `true` si querés que esté disponible offline. Solo para herramientas críticas |
| `js` | Nombre del archivo JS externo (ej: `"molaridad.js"`). `null` si el JS es inline |

> **Dónde encontrar íconos:** El proyecto usa íconos de Lucide (lucide.dev). Copiá el SVG del ícono que más represente la herramienta y poné el atributo `viewBox="0 0 24 24"`.

### Paso 4 — Agregar la herramienta al índice de herramientas en `index.html`

A diferencia del blog, el índice de herramientas en la página principal **NO se regenera automáticamente** (porque el orden visual puede importar). Abrí `quimcalc/index.html` y agregá un bloque en la sección `#herramientas`:

```html
<a href="herramientas/nombre-herramienta.html" class="indice-item" role="listitem">
  <div class="indice-item__icono" aria-hidden="true">
    <svg viewBox="0 0 24 24"><!-- ícono --></svg>
  </div>
  <span class="indice-item__texto">Nombre de la herramienta</span>
  <span class="indice-item__flecha" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg></span>
</a>
```

### Paso 5 — Ejecutar el script de sincronización

```bash
python scripts/sync_indexes.py
```

Esto actualiza:
- ✅ `quimcalc/sitemap.xml` — agrega la URL de la herramienta
- ✅ `quimcalc/sw.js` — agrega al precache si `precache: true`, incrementa versión

---

## 3. Sincronizar los índices automáticamente

### ¿Qué hace el script?

```bash
python scripts/sync_indexes.py
```

| Qué actualiza | Qué lee |
|---|---|
| `quimcalc/blog/index.html` (lista de posts + contadores de categorías) | `data/posts.json` |
| `quimcalc/sitemap.xml` (todas las URLs con fecha de hoy) | `data/posts.json` + `data/tools.json` |
| `quimcalc/sw.js` (PRECACHE_URLS + versión de caché) | `data/tools.json` |

### ¿Cuándo ejecutarlo?

- Siempre que agregues un post nuevo
- Siempre que agregues una herramienta nueva
- Si querés refrescar las fechas del sitemap

### Requisitos

Solo Python 3 (sin librerías adicionales):

```bash
python --version   # necesitás Python 3.6 o superior
```

---

## 4. Publicar los cambios

El sitio se despliega automáticamente en Vercel al hacer push a la rama principal (`main`). El flujo es:

```bash
# 1. Verificar qué archivos cambiaron
git status

# 2. Agregar los archivos al commit
git add quimcalc/blog/posts/nombre-del-articulo.html
git add quimcalc/blog/posts/img/nombre-del-articulo.webp
git add data/posts.json
git add quimcalc/blog/index.html
git add quimcalc/sitemap.xml
git add quimcalc/sw.js

# 3. Commit descriptivo
git commit -m "Blog: agrega post 'Nombre del artículo'"

# 4. Push → Vercel despliega automáticamente
git push origin main
```

> **Tiempo de deploy:** Vercel tarda entre 30 y 90 segundos en publicar los cambios después del push.

> **IndexNow (aviso a Bing):** no tenés que hacer nada. Un GitHub Action (`.github/workflows/indexnow.yml`) se dispara solo en cada push a `main` que toque `quimcalc/**`: espera a que Vercel publique y le envía a Bing la lista de URLs del `sitemap.xml` para que reindexe al instante. La clave de verificación vive en `quimcalc/aa441e507c4b364ef44a8407ef96f2e3.txt` (pública por diseño — no borrar). Podés ver el resultado en la pestaña **Actions** del repo en GitHub.

---

## 5. Referencia rápida de archivos

### Archivos que editás manualmente

| Archivo | Para qué |
|---|---|
| `data/posts.json` | Registrar posts nuevos |
| `data/tools.json` | Registrar herramientas nuevas |
| `quimcalc/index.html` | Agregar herramienta al índice visual |
| `quimcalc/blog/posts/nombre.html` | El HTML del post |
| `quimcalc/blog/posts/img/nombre.webp` | La imagen del post |
| `quimcalc/herramientas/nombre.html` | El HTML de la herramienta |
| `quimcalc/herramientas/js/nombre.js` | JS externo de la herramienta (si aplica) |

### Archivos que genera el script automáticamente

| Archivo | Cuándo |
|---|---|
| `quimcalc/blog/index.html` | Cada vez que corrés `sync_indexes.py` |
| `quimcalc/sitemap.xml` | Cada vez que corrés `sync_indexes.py` |
| `quimcalc/sw.js` (PRECACHE + versión) | Cada vez que corrés `sync_indexes.py` |

### Estructura completa

```
QuimCalc/
├── data/
│   ├── posts.json          ← metadatos de posts (editá acá para agregar)
│   └── tools.json          ← metadatos de herramientas (editá acá para agregar)
├── scripts/
│   └── sync_indexes.py     ← script de sincronización de índices
└── quimcalc/               ← raíz del sitio servida por Vercel
    ├── index.html
    ├── styles.css
    ├── sw.js               ← Service Worker (auto-actualizado por el script)
    ├── sitemap.xml         ← auto-actualizado por el script
    ├── js/
    │   ├── animations.js
    │   ├── pwa-register.js
    │   └── init-speed-insights.js
    ├── blog/
    │   ├── index.html      ← auto-actualizado por el script
    │   └── posts/
    │       ├── PLANTILLA-post.html
    │       ├── img/        ← imágenes de posts (WebP, 600×200 px)
    │       └── *.html
    └── herramientas/
        ├── *.html
        └── js/
            └── *.js
```

---

## Checklist rápido — Post nuevo

```
[ ] cp PLANTILLA-post.html → nuevo-post.html
[ ] Completar <title>, <meta description>, canonical, JSON-LD
[ ] Escribir el contenido del artículo
[ ] Guardar imagen en blog/posts/img/nuevo-post.webp (600×200 px)
[ ] Agregar entrada en data/posts.json
[ ] python scripts/sync_indexes.py
[ ] Verificar en navegador que la card aparece en blog/index.html
[ ] git add + git commit + git push
```

## Checklist rápido — Herramienta nueva

```
[ ] cp herramienta-similar.html → nueva-herramienta.html
[ ] Adaptar título, meta description, JSON-LD (inLanguage: "es")
[ ] Desarrollar formulario y lógica de cálculo
[ ] Agregar sección educativa y FAQ
[ ] Agregar bloque en quimcalc/index.html (sección #herramientas)
[ ] Agregar entrada en data/tools.json
[ ] python scripts/sync_indexes.py
[ ] Verificar en navegador
[ ] git add + git commit + git push
```
