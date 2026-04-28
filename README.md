# QuimCalc
 
**Suite de herramientas de cálculo y blog para química analítica e industrial.**
 
Sitio web estático orientado a técnicos de laboratorio, estudiantes y profesionales de la química. Construido sin frameworks, con HTML, CSS y JavaScript vanilla puro.
 
---
 
## 🔬 ¿Qué es QuimCalc?
 
QuimCalc ofrece calculadoras y conversores de uso diario en el laboratorio, más artículos educativos sobre química analítica, instrumentación y normativa de calidad. El proyecto está orientado inicialmente al mercado de habla hispana, con foco en Argentina.
 
**Herramientas disponibles:** 15  
**Posts del blog:** 7 (+ plantilla para nuevos)  
**Dependencias externas:** 0  
 
---
 
## ⚗️ Herramientas incluidas
 
### Básicas
| Herramienta | Descripción |
|---|---|
| Molaridad y masa | Calcula gramos de soluto con corrección por pureza |
| Diluciones C₁V₁=C₂V₂ | Resuelve cualquier incógnita de la ecuación de dilución |
| Conversor ppm / mg/L / Normalidad | Conversión entre unidades de concentración |
| Calculadora de pH | Ácidos/bases fuertes y débiles (con Ka/Kb) |
| % Rendimiento | Calcula rendimiento, masa teórica u obtenida |
| Temperatura °C / °F / K | Conversor entre las tres escalas |
| Concentración % p/p | Porcentaje peso/peso con tres incógnitas posibles |
| Masa Molar | Parser de fórmulas químicas (soporta paréntesis: Ca(OH)₂) |
 
### Intermedias
| Herramienta | Descripción |
|---|---|
| Buffers — Henderson-Hasselbalch | pH, relación [A⁻]/[HA] o pKa. Tabla de pKa incluida |
| Diluciones seriadas | Genera tabla completa de la serie con volúmenes por tubo |
| Dureza del agua | Conversor entre 8 unidades + clasificación OMS |
| Titulación volumétrica | Normalidad, masa y % del analito desde datos de titulación |
 
### Elaboradas (ISO 17025)
| Herramienta | Descripción |
|---|---|
| Curva de calibración | Regresión lineal, R², gráfico canvas, interpolación, exportación |
| LOD y LOQ | Tres métodos: blanco (ISO 11843), curva (ICH Q2), señal/ruido |
| Incertidumbre GUM | Tipo A + Tipo B, u_c, U expandida, desglose por componente |
 
---
 
## 📝 Blog
 
Posts publicados sobre química analítica, agua y medio ambiente, instrumentación y normativa de calidad. Cada post incluye tabla de contenidos, herramientas relacionadas en el sidebar y ejemplos resueltos.
 
**Categorías:** Química básica · Agua y medio ambiente · Análisis volumétrico · Instrumentación · Normativa y calidad
 
---
 
## 🛠️ Stack tecnológico
 
```
HTML5 semántico
CSS3 con variables (:root)     — sin frameworks
JavaScript ES6 vanilla         — sin librerías externas
BEM                            — nomenclatura de clases
SVG inline (Lucide)            — íconos embebidos
JSON-LD                        — datos estructurados SEO
Google Fonts                   — Source Serif 4 + DM Sans
```
 
Sin npm. Sin Node. Sin React. Sin bundler. Abrís el `index.html` y funciona.
 
---
 
## 🎨 Identidad visual
 
Paleta editorial verde oscuro + crema, tipografía serif para títulos. Diseño orientado a un público técnico-científico.
 
| Variable | Color | Uso |
|---|---|---|
| `--color-fondo` | `#F7F5F0` | Fondo principal (crema cálida) |
| `--color-acento` | `#1A5C38` | Botones, links, destacados (verde oscuro) |
| `--color-header-bg` | `#1C2E22` | Header y footer (verde muy oscuro) |
| `--color-texto` | `#1C1A17` | Texto principal (marrón muy oscuro) |
| `--color-borde` | `#D4CFC4` | Bordes y separadores (arena) |
 
**Tipografías:** Source Serif 4 (títulos, italic) + DM Sans (cuerpo)
 
---
 
## 📁 Estructura del proyecto
 
```
/
├── index.html
├── styles.css                  ← CSS global compartido por todo el sitio
├── sobre-el-proyecto.html
├── politicas-de-privacidad.html
├── terminos-de-uso.html
│
├── herramientas/
│   ├── calculadora-molaridad.html
│   ├── calculadora-diluciones.html
│   ├── conversor-ppm-mgl.html
│   ├── calculadora-ph.html
│   ├── calculadora-rendimiento.html
│   ├── conversor-temperatura.html
│   ├── concentracion-pp.html
│   ├── masa-molar.html
│   ├── calculadora-buffers.html
│   ├── diluciones-seriadas.html
│   ├── dureza-agua.html
│   ├── calculadora-titulacion.html
│   ├── curva-calibracion.html
│   ├── lod-loq.html
│   ├── incertidumbre.html
│   └── js/                     ← un archivo JS por herramienta
│       └── *.js
│
└── blog/
    ├── index.html
    └── posts/
        ├── PLANTILLA-post.html ← plantilla comentada para posts nuevos
        └── *.html
```
 
---
 
## 🚀 Uso
 
No requiere instalación ni servidor. Cloná el repositorio y abrí `index.html` en el navegador:
 
```bash
git clone https://github.com/tu-usuario/quimcalc.git
cd quimcalc
# Abrís index.html directamente en el navegador
```
 
Para subir a producción, copiá todos los archivos a `public_html/` en Hostinger via FTP o el administrador de archivos del panel.
 
---
 
## ✍️ Cómo agregar un post nuevo
 
1. Copiá `blog/posts/PLANTILLA-post.html` con el nombre del artículo (ej: `nombre-del-articulo.html`)
2. Reemplazá todo lo que está entre `[corchetes]` con el contenido real
3. Agregá una card en `blog/index.html` copiando una de las existentes
4. Actualizá el contador de la categoría en el sidebar del blog
5. Si querés que aparezca en el index principal, actualizá la sección "Del blog" en `index.html`
6. Subí los archivos modificados por FTP
---
 
## 🗺️ Roadmap
 
- [ ] Página de contacto (WhatsApp + email)
- [ ] Generador de posts (CMS simple en `/admin/`)
- [ ] Imágenes en cards y headers de posts
- [ ] Sitemap.xml + Google Search Console
- [ ] Más posts del blog (37 temas planificados)
- [ ] Google AdSense (cuando llegue a 3.000-5.000 visitas/mes)
- [ ] Sistema de registro para generar informes PDF (largo plazo)
---
 
## 📄 Licencia
 
Uso personal. El código es de autoría propia. Las fórmulas químicas implementadas son de dominio público.
 
---
 
*Desarrollado con asistencia de Claude (Anthropic).*
