// ============================================================
// SERVICE WORKER — QuimCalc PWA
// ============================================================
// Estrategia de caché:
//   • CSS, JS, íconos → Cache-First (cambian poco, velocidad máxima)
//   • Páginas HTML    → Stale-While-Revalidate (muestra rápido y actualiza en segundo plano)
//   • Todo lo demás   → Network-First con fallback al caché
// ============================================================

const CACHE_VERSION   = 'v3.019';                           // ← incrementar cuando hagas cambios grandes
const CACHE_ESTATICO  = `quimcalc-estatico-${CACHE_VERSION}`;
const CACHE_PAGINAS   = `quimcalc-paginas-${CACHE_VERSION}`;

// ── Recursos que se pre-cachean al instalar el SW ──────────
// Son los archivos que queremos que estén SIEMPRE disponibles offline.
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/styles.css',
  '/assets/site.webmanifest',
  '/herramientas/lod-loq.html',
  '/herramientas/calculadora-titulacion.html',
  '/herramientas/calculadora-buffers.html',
  '/herramientas/dureza-agua.html',
  '/herramientas/calculadora-ph.html',
  '/herramientas/masa-molar.html',
  '/herramientas/calculadora-diluciones.html',
  '/herramientas/calculadora-molaridad.html',
  '/herramientas/js/titulacion.js',
  '/herramientas/js/buffers.js',
  '/herramientas/js/dureza-agua.js',
  '/herramientas/js/calculadora-ph.js',
  '/herramientas/js/masa-molar.js',
  '/herramientas/js/diluciones.js',
  '/herramientas/js/molaridad.js',
  '/assets/android-chrome-192x192.png',
  '/assets/android-chrome-512x512.png',
  '/offline.html',
];

// ── INSTALL: pre-cacheamos los recursos críticos ────────────
self.addEventListener('install', (evento) => {
  evento.waitUntil(
    caches.open(CACHE_ESTATICO)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())   // activa el SW nuevo de inmediato
      .catch((err) => console.error('[QuimCalc SW] Error en pre-cache:', err))
  );
});

// ── ACTIVATE: eliminamos caches de versiones anteriores ─────
self.addEventListener('activate', (evento) => {
  evento.waitUntil(
    caches.keys()
      .then((claves) => Promise.all(
        claves
          .filter((clave) => clave !== CACHE_ESTATICO && clave !== CACHE_PAGINAS)
          .map((clave) => {
            console.log('[QuimCalc SW] Eliminando caché viejo:', clave);
            return caches.delete(clave);
          })
      ))
      .then(() => self.clients.claim())  // toma control de todas las pestañas abiertas
  );
});

// ── FETCH: interceptamos todas las peticiones ───────────────
self.addEventListener('fetch', (evento) => {
  const { request } = evento;
  const url = new URL(request.url);

  // Solo interceptamos peticiones de nuestro propio dominio
  if (url.origin !== location.origin) return;

  // Ignoramos peticiones que no son GET (POST, etc.)
  if (request.method !== 'GET') return;

  const ruta = url.pathname;

  // ── CSS, JS, íconos y fuentes → Cache-First ────────────
  if (
    ruta.endsWith('.css') ||
    ruta.endsWith('.js')  ||
    ruta.endsWith('.png') ||
    ruta.endsWith('.jpg') ||
    ruta.endsWith('.svg') ||
    ruta.endsWith('.ico') ||
    ruta.endsWith('.woff2')
  ) {
    evento.respondWith(cacheFirst(request, CACHE_ESTATICO));
    return;
  }

  // ── Páginas HTML → Stale-While-Revalidate ──────────────
  if (
    ruta.endsWith('.html') ||
    ruta === '/' ||
    request.headers.get('Accept')?.includes('text/html')
  ) {
    evento.respondWith(staleWhileRevalidate(request, CACHE_PAGINAS));
    return;
  }
});

// ── ESTRATEGIA: Cache-First ─────────────────────────────────
// Sirve desde caché si existe. Si no, va a la red y guarda el resultado.
async function cacheFirst(request, nombreCache) {
  const respuestaCacheada = await caches.match(request);
  if (respuestaCacheada) return respuestaCacheada;

  try {
    const respuestaRed = await fetch(request);
    if (respuestaRed.ok) {
      const cache = await caches.open(nombreCache);
      cache.put(request, respuestaRed.clone());
    }
    return respuestaRed;
  } catch {
    // Sin red y sin caché: devolvemos respuesta de error genérica
    return new Response('Recurso no disponible sin conexión.', {
      status: 503,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
}

// ── ESTRATEGIA: Stale-While-Revalidate ─────────────────────
// Muestra inmediatamente desde caché (rápido) y actualiza en segundo plano.
// Si no hay caché, espera la red. Si tampoco hay red, muestra offline.html.
async function staleWhileRevalidate(request, nombreCache) {
  const cache              = await caches.open(nombreCache);
  const respuestaCacheada  = await cache.match(request);

  // Actualizamos en segundo plano (no esperamos el resultado)
  const promesaRed = fetch(request)
    .then((respuestaRed) => {
      if (respuestaRed.ok) cache.put(request, respuestaRed.clone());
      return respuestaRed;
    })
    .catch(() => null);

  // Si tenemos caché: lo mostramos ya y dejamos la red que actualice
  if (respuestaCacheada) return respuestaCacheada;

  // Sin caché: esperamos la red
  const respuestaRed = await promesaRed;
  if (respuestaRed) return respuestaRed;

  // Sin red ni caché: página offline de respaldo
  const fallback = await caches.match('/offline.html');
  return fallback || new Response(
    '<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Sin conexión — QuimCalc</title>' +
    '<meta name="viewport" content="width=device-width,initial-scale=1"></head>' +
    '<body style="font-family:sans-serif;text-align:center;padding:40px;background:#F7F5F0;">' +
    '<h1 style="color:#1C2E22;">Sin conexión</h1>' +
    '<p style="color:#5C5649;">Esta página no está disponible offline.</p>' +
    '<a href="/" style="color:#1A5C38;">← Ir al inicio</a></body></html>',
    { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
  );
}
