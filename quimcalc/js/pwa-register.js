// ============================================================
// PWA REGISTER — QuimCalc
// ============================================================
// Este script registra el Service Worker y maneja
// la lógica del banner "Instalar app".
// Incluilo en TODAS las páginas del sitio (al final del <body>).
// ============================================================

(function () {

  // ── 1. Registro del Service Worker ─────────────────────
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js', { scope: '/' })
        .then((registro) => {
          console.log('[QuimCalc PWA] Service Worker registrado. Scope:', registro.scope);

          // Avisamos si hay una actualización disponible
          registro.addEventListener('updatefound', () => {
            const swNuevo = registro.installing;
            swNuevo.addEventListener('statechange', () => {
              if (swNuevo.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('[QuimCalc PWA] Nueva versión disponible. Recargá la página.');
              }
            });
          });
        })
        .catch((error) => {
          console.warn('[QuimCalc PWA] Error al registrar Service Worker:', error);
        });
    });
  }

  // ── 2. Banner de instalación (Android/Chrome) ───────────
  // Chrome dispara este evento cuando la PWA cumple los criterios de instalación.
  // Lo capturamos para mostrar nuestro propio botón en lugar del banner genérico.
  let eventoInstalacion = null;

  window.addEventListener('beforeinstallprompt', (evento) => {
    evento.preventDefault();             // evitamos el banner automático
    eventoInstalacion = evento;          // guardamos el evento para usarlo después
    mostrarBotonInstalar();
  });

  // Si la persona cerró el botón con la "×", no lo volvemos a mostrar por 30 días.
  const CLAVE_DESCARTE = 'quimcalc-pwa-dismissed';
  const DIAS_DESCARTE  = 30;

  function fueDescartadoRecientemente() {
    try {
      const ts = parseInt(window.localStorage.getItem(CLAVE_DESCARTE), 10);
      if (!ts) return false;
      const dias = (Date.now() - ts) / (1000 * 60 * 60 * 24);
      return dias < DIAS_DESCARTE;
    } catch (e) {
      return false;
    }
  }

  function guardarDescarte() {
    try { window.localStorage.setItem(CLAVE_DESCARTE, String(Date.now())); } catch (e) {}
  }

  // Estilo base compartido por el botón de instalar y el de cerrar
  const ESTILO_BASE = {
    background:   '#1A5C38',
    color:        '#F7F5F0',
    border:       'none',
    borderRadius: '8px',
    fontSize:     '0.9rem',
    fontWeight:   '600',
    fontFamily:   'inherit',
    cursor:       'pointer',
    boxShadow:    '0 4px 16px rgba(0,0,0,0.25)',
    transition:   'background 0.15s',
  };

  function conHover(elemento) {
    elemento.addEventListener('mouseenter', () => { elemento.style.background = '#134529'; });
    elemento.addEventListener('mouseleave', () => { elemento.style.background = '#1A5C38'; });
  }

  function mostrarBotonInstalar() {
    // Si ya existe el contenedor, o se descartó hace poco, no hacemos nada
    if (document.getElementById('pwa-instalar-wrap')) return;
    if (fueDescartadoRecientemente()) return;

    const wrap = document.createElement('div');
    wrap.id = 'pwa-instalar-wrap';
    Object.assign(wrap.style, {
      position:   'fixed',
      bottom:     '20px',
      right:      '20px',
      display:    'flex',
      alignItems: 'stretch',
      gap:        '6px',
      zIndex:     '9999',
    });

    const boton = document.createElement('button');
    boton.id          = 'btn-instalar-pwa';
    boton.textContent = '📲 Instalar QuimCalc';
    boton.setAttribute('aria-label', 'Instalar la aplicación QuimCalc en tu dispositivo');
    Object.assign(boton.style, ESTILO_BASE, { padding: '12px 20px' });
    conHover(boton);
    boton.addEventListener('click', async () => {
      if (!eventoInstalacion) return;
      eventoInstalacion.prompt();
      const { outcome } = await eventoInstalacion.userChoice;
      console.log('[QuimCalc PWA] Usuario eligió:', outcome);
      eventoInstalacion = null;
      wrap.remove();
    });

    const cerrar = document.createElement('button');
    cerrar.id          = 'btn-cerrar-pwa';
    cerrar.textContent = '×';
    cerrar.setAttribute('aria-label', 'No mostrar más el botón de instalación');
    Object.assign(cerrar.style, ESTILO_BASE, { width: '40px', fontSize: '1.2rem', lineHeight: '1', padding: '0' });
    conHover(cerrar);
    cerrar.addEventListener('click', () => {
      guardarDescarte();
      wrap.remove();
    });

    wrap.appendChild(boton);
    wrap.appendChild(cerrar);
    document.body.appendChild(wrap);
  }

  // Cuando la app se instala, ocultamos el botón
  window.addEventListener('appinstalled', () => {
    console.log('[QuimCalc PWA] ¡App instalada correctamente!');
    const wrap = document.getElementById('pwa-instalar-wrap');
    if (wrap) wrap.remove();
  });

})();
