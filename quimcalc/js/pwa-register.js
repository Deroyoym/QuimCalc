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

  function mostrarBotonInstalar() {
    // Si ya existe el botón en el DOM, no hacemos nada
    if (document.getElementById('btn-instalar-pwa')) return;

    const boton = document.createElement('button');
    boton.id          = 'btn-instalar-pwa';
    boton.textContent = '📲 Instalar QuimCalc';
    boton.setAttribute('aria-label', 'Instalar la aplicación QuimCalc en tu dispositivo');

    // Estilo inline para no depender de una clase CSS adicional
    Object.assign(boton.style, {
      position:     'fixed',
      bottom:       '20px',
      right:        '20px',
      background:   '#1A5C38',
      color:        '#F7F5F0',
      border:       'none',
      borderRadius: '8px',
      padding:      '12px 20px',
      fontSize:     '0.9rem',
      fontWeight:   '600',
      fontFamily:   'inherit',
      cursor:       'pointer',
      boxShadow:    '0 4px 16px rgba(0,0,0,0.25)',
      zIndex:       '9999',
      transition:   'background 0.15s',
    });

    boton.addEventListener('mouseenter', () => { boton.style.background = '#134529'; });
    boton.addEventListener('mouseleave', () => { boton.style.background = '#1A5C38'; });

    boton.addEventListener('click', async () => {
      if (!eventoInstalacion) return;
      eventoInstalacion.prompt();
      const { outcome } = await eventoInstalacion.userChoice;
      console.log('[QuimCalc PWA] Usuario eligió:', outcome);
      eventoInstalacion = null;
      boton.remove();
    });

    document.body.appendChild(boton);
  }

  // Cuando la app se instala, ocultamos el botón
  window.addEventListener('appinstalled', () => {
    console.log('[QuimCalc PWA] ¡App instalada correctamente!');
    const boton = document.getElementById('btn-instalar-pwa');
    if (boton) boton.remove();
  });

})();
