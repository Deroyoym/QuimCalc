// ============================================================
// COMPARTIR — sistema unificado de difusión
// ============================================================
// • En los posts (que ya traen un bloque .compartir) lo POTENCIA:
//   microcopy, WhatsApp primero, botón nativo (Web Share API) y
//   copiar-enlace.
// • En las herramientas (que NO traen bloque) lo CREA y lo inserta
//   al final del contenido, con el mismo comportamiento.
// Cero dependencias. Progressive enhancement: si el navegador no
// soporta algo, el resto sigue funcionando.
// ============================================================

(function () {
  'use strict';

  var URL_ACTUAL = window.location.href;
  var URL_ENC    = encodeURIComponent(URL_ACTUAL);
  var TIT_ENC    = encodeURIComponent(document.title);

  // ── Toast reutilizable ──────────────────────────────────
  var toastEl = null;
  var toastTimer = null;
  function toast(msg) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'toast';
      toastEl.setAttribute('role', 'status');
      toastEl.setAttribute('aria-live', 'polite');
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    // fuerza reflow para reiniciar la transición
    void toastEl.offsetWidth;
    toastEl.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.classList.remove('visible');
    }, 2200);
  }
  window.quimToast = toast; // lo reutiliza copiar-resultado.js

  var ICONO_WA = '<svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>';
  var ICONO_X  = '<svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>';
  var ICONO_FB = '<svg viewBox="0 0 24 24"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>';
  var ICONO_LI = '<svg viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>';
  var ICONO_NATIVO = '<svg viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.6" y1="13.5" x2="15.4" y2="17.5"/><line x1="15.4" y1="6.5" x2="8.6" y2="10.5"/></svg>';
  var ICONO_LINK = '<svg viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>';

  function anchor(clase, href, label, icono) {
    var a = document.createElement('a');
    a.className = 'compartir__btn ' + clase;
    a.href = href;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.setAttribute('aria-label', label);
    a.innerHTML = icono;
    return a;
  }

  // Construye el bloque completo (usado en herramientas)
  function crearBloque() {
    var wrap = document.createElement('div');
    wrap.className = 'compartir';
    wrap.innerHTML = '<p class="compartir__etiqueta"></p><div class="compartir__botones"></div>';
    var cont = wrap.querySelector('.compartir__botones');
    cont.appendChild(anchor('compartir__btn--wa', '#', 'Compartir por WhatsApp', ICONO_WA));
    cont.appendChild(anchor('compartir__btn--x',  '#', 'Compartir en X', ICONO_X));
    cont.appendChild(anchor('compartir__btn--fb', '#', 'Compartir en Facebook', ICONO_FB));
    cont.appendChild(anchor('compartir__btn--li', '#', 'Compartir en LinkedIn', ICONO_LI));
    return wrap;
  }

  function potenciar(bloque) {
    var cont = bloque.querySelector('.compartir__botones');
    if (!cont) return;

    // Microcopy con intención
    var et = bloque.querySelector('.compartir__etiqueta');
    if (et) et.textContent = '¿Te sirvió? Compartilo con tu equipo';

    // (Re)armar los enlaces de cada red
    var mapa = {
      'compartir__btn--wa': 'https://wa.me/?text=' + TIT_ENC + '%20' + URL_ENC,
      'compartir__btn--x' : 'https://twitter.com/intent/tweet?url=' + URL_ENC + '&text=' + TIT_ENC,
      'compartir__btn--fb': 'https://www.facebook.com/sharer/sharer.php?u=' + URL_ENC,
      'compartir__btn--li': 'https://www.linkedin.com/sharing/share-offsite/?url=' + URL_ENC
    };
    Object.keys(mapa).forEach(function (c) {
      var b = bloque.querySelector('.' + c);
      if (b) b.setAttribute('href', mapa[c]);
    });

    // WhatsApp primero (canal principal de la audiencia)
    var wa = bloque.querySelector('.compartir__btn--wa');
    if (wa) cont.insertBefore(wa, cont.firstChild);

    // Botón nativo (Web Share API) — solo si el navegador lo soporta
    if (navigator.share) {
      var nativo = document.createElement('button');
      nativo.type = 'button';
      nativo.className = 'compartir__btn compartir__btn--nativo';
      nativo.setAttribute('aria-label', 'Compartir');
      nativo.innerHTML = ICONO_NATIVO + '<span>Compartir</span>';
      nativo.addEventListener('click', function () {
        navigator.share({ title: document.title, url: URL_ACTUAL }).catch(function () {});
      });
      cont.insertBefore(nativo, cont.firstChild);
    }

    // Copiar enlace
    if (navigator.clipboard) {
      var link = document.createElement('button');
      link.type = 'button';
      link.className = 'compartir__btn compartir__btn--link';
      link.setAttribute('aria-label', 'Copiar enlace');
      link.innerHTML = ICONO_LINK;
      link.addEventListener('click', function () {
        navigator.clipboard.writeText(URL_ACTUAL).then(function () {
          toast('Enlace copiado ✓');
        }).catch(function () {});
      });
      cont.appendChild(link);
    }
  }

  var existentes = document.querySelectorAll('.compartir');
  if (existentes.length) {
    existentes.forEach(potenciar);
  } else {
    // Página de herramienta: creamos el bloque al final del contenido
    var host = document.querySelector('main .contenedor') || document.querySelector('main');
    var esHerramienta = document.querySelector('.calculadora, .pagina-herramienta');
    if (host && esHerramienta) {
      var bloque = crearBloque();
      host.appendChild(bloque);
      potenciar(bloque);
    }
  }
})();
