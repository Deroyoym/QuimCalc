#!/usr/bin/env node
// ============================================================
// build_og_images.mjs — Tarjetas para compartir (og:image) de los posts
// ============================================================
// Genera quimcalc/blog/posts/img/og/<slug>.jpg (1200×630) para cada post
// de data/posts.json: foto del post a la derecha, panel verde con logo,
// categoría, título y, si el post lo define, un dato destacado
// ("og_highlight": {"valor": "8,3 mL", "texto": "por cada 100 mL…"}).
// Después actualiza en cada HTML og:image, twitter:image y og:image:*.
//
// Uso (desde la raíz del repo):
//   node scripts/build_og_images.mjs              → todos los posts
//   node scripts/build_og_images.mjs <slug> ...   → solo esos posts
//
// Requiere Playwright (no es dependencia del sitio, solo de este script):
//   npm i --no-save playwright && npx playwright install chromium
// o, si ya hay un Chromium instalado: CHROMIUM_PATH=/ruta/al/chrome node scripts/…
// ============================================================

import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT  = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const POSTS = resolve(ROOT, 'quimcalc/blog/posts');
const OUT   = resolve(POSTS, 'img/og');
const W = 1200, H = 630;

function loadChromium() {
  const require = createRequire(resolve(ROOT, 'package.json'));
  for (const mod of ['playwright', 'playwright-core']) {
    try { return require(mod).chromium; } catch { /* probar el siguiente */ }
  }
  console.error('✗ Falta Playwright. Instalalo con: npm i --no-save playwright && npx playwright install chromium');
  process.exit(1);
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// Espacio duro entre número y unidad («1 M», «37 %») para que no se corten de línea
const nbsp = (s) => esc(s).replace(/(\d) (M|N|%|mL|L|g|mg)(?![\w])/g, '$1&nbsp;$2');

function cardHtml(p) {
  // La foto va incrustada: una página creada con setContent no puede leer file://
  const ext  = p.image.split('.').pop().toLowerCase().replace('jpg', 'jpeg');
  const foto = `data:image/${ext};base64,${readFileSync(resolve(POSTS, p.image)).toString('base64')}`;
  const hl = p.og_highlight
    ? `<div class="dato">${esc(p.og_highlight.valor)} <small>${esc(p.og_highlight.texto)}</small></div>`
    : '';
  return `<!doctype html><html lang="es"><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,wght@0,700;1,700&family=DM+Sans:wght@500;700&display=swap">
<style>
*{margin:0;box-sizing:border-box}
body{width:${W}px;height:${H}px;overflow:hidden;background:#1C2E22;font-family:'DM Sans',sans-serif}
.foto{position:absolute;right:0;top:0;width:640px;height:${H}px;background:url("${foto}") 62% center/cover}
.panel{position:relative;width:640px;height:${H}px;padding:56px 56px 48px 64px;display:flex;flex-direction:column;color:#F0EDE6;background:#1C2E22}
.logo{font-family:'Source Serif 4',serif;font-weight:700;font-size:34px}
.logo span{color:#6FCF97}
.cat{margin-top:44px;font-weight:700;font-size:18px;letter-spacing:.14em;text-transform:uppercase;color:#6FCF97}
h1{margin-top:14px;font-family:'Source Serif 4',serif;font-style:italic;font-weight:700;font-size:54px;line-height:1.08}
.dato{margin-top:auto;display:inline-flex;align-self:flex-start;align-items:baseline;gap:12px;background:#E8F2EC;color:#1A5C38;border-radius:12px;padding:14px 22px;font-weight:700;font-size:26px}
.dato,.dato small{white-space:nowrap}
.dato small{font-weight:500;font-size:19px;color:#276C43}
.url{margin-top:22px;font-size:19px;color:#B9C7BD;font-weight:500}
.dato + .url{margin-top:22px}
h1 + .url{margin-top:auto}
</style></head><body>
<div class="foto"></div>
<div class="panel">
  <div class="logo">Quim<span>Calc</span></div>
  <div class="cat">${esc(p.category)}</div>
  <h1>${nbsp(p.title)}</h1>
  ${hl}
  <div class="url">quimcalc.com · blog de química de laboratorio</div>
</div></body></html>`;
}

// Achica el título hasta que entre en el espacio libre del panel
async function fitTitle(page) {
  await page.evaluate(() => {
    const h1 = document.querySelector('h1');
    const limite = (document.querySelector('.dato') || document.querySelector('.url')).getBoundingClientRect().top - 24;
    let size = 54;
    while (h1.getBoundingClientRect().bottom > limite && size > 30) {
      size -= 2;
      h1.style.fontSize = size + 'px';
    }
  });
}

function updateMeta(slug, title) {
  const file = resolve(POSTS, `${slug}.html`);
  let html = readFileSync(file, 'utf-8');
  const url = `https://quimcalc.com/blog/posts/img/og/${slug}.jpg`;
  html = html.replace(/<meta property="og:image" content="[^"]*">/, `<meta property="og:image" content="${url}">`);
  html = html.replace(/<meta name="twitter:image" content="[^"]*">/, `<meta name="twitter:image" content="${url}">`);
  // og:image:width / height / alt: se agregan una sola vez (idempotente)
  html = html.replace(/\n\s*<meta property="og:image:(width|height|alt)" content="[^"]*">/g, '');
  html = html.replace(
    /(<meta property="og:image" content="[^"]*">)/,
    `$1\n  <meta property="og:image:width" content="${W}">\n  <meta property="og:image:height" content="${H}">\n  <meta property="og:image:alt" content="${esc(title)} — QuimCalc">`
  );
  writeFileSync(file, html);
}

const posts = JSON.parse(readFileSync(resolve(ROOT, 'data/posts.json'), 'utf-8'));
const pedidos = process.argv.slice(2);
const lista = pedidos.length ? posts.filter((p) => pedidos.includes(p.slug)) : posts;
if (pedidos.length && lista.length !== pedidos.length) {
  console.error('✗ Slugs no encontrados en data/posts.json:', pedidos.filter((s) => !posts.some((p) => p.slug === s)));
  process.exit(1);
}

mkdirSync(OUT, { recursive: true });
const chromium = loadChromium();
const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const page = await browser.newPage({ viewport: { width: W, height: H } });

for (const p of lista) {
  if (!existsSync(resolve(POSTS, p.image))) { console.warn(`⚠ ${p.slug}: falta ${p.image}, se omite`); continue; }
  await page.setContent(cardHtml(p), { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await fitTitle(page);
  await page.screenshot({ path: resolve(OUT, `${p.slug}.jpg`), type: 'jpeg', quality: 85 });
  updateMeta(p.slug, p.title);
  console.log(`✓ ${p.slug}`);
}
await browser.close();
console.log(`Listo: ${lista.length} tarjetas en quimcalc/blog/posts/img/og/`);
