/* ============================================================
   BANNER DE CONSENTIMIENTO DE COOKIES (Google Consent Mode v2)
   Archivo: js/consent-banner.js

   Google Analytics 4 arranca con analytics_storage: 'denied'
   (ver el bloque gtag en el <head> de cada página). Este script
   muestra un banner para que la persona acepte o rechace las
   cookies de medición; solo al aceptar se actualiza el estado a
   'granted' y GA4 escribe la cookie _ga. La decisión se guarda en
   localStorage para no volver a mostrar el banner.
   ============================================================ */
(function () {
  'use strict';

  var CLAVE = 'quimcalc-consent';   /* valores: 'granted' | 'denied' */
  var POLITICA = '/politicas-de-privacidad.html';

  var almacen;
  try { almacen = window.localStorage; } catch (e) { almacen = null; }

  function leer() {
    try { return almacen ? almacen.getItem(CLAVE) : null; }
    catch (e) { return null; }
  }
  function guardar(valor) {
    try { if (almacen) almacen.setItem(CLAVE, valor); } catch (e) {}
  }

  function actualizarConsentimiento(estado) {
    if (typeof window.gtag !== 'function') return;
    window.gtag('consent', 'update', {
      analytics_storage: estado,
      ad_storage: estado,
      ad_user_data: estado,
      ad_personalization: estado
    });
  }

  /* Si ya hay una decisión previa, la aplicamos sin mostrar el banner. */
  var previa = leer();
  if (previa === 'granted') { actualizarConsentimiento('granted'); return; }
  if (previa === 'denied')  { return; }  /* sigue denegado por defecto */

  function construirBanner() {
    var banner = document.createElement('div');
    banner.className = 'consent-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-live', 'polite');
    banner.setAttribute('aria-label', 'Aviso de cookies');
    banner.innerHTML =
      '<p class="consent-banner__texto">' +
        'Usamos Google Analytics con cookies para medir el uso del sitio de forma anónima. ' +
        'Podés aceptarlas o rechazarlas. Más información en nuestra ' +
        '<a href="' + POLITICA + '" class="consent-banner__link">política de privacidad</a>.' +
      '</p>' +
      '<div class="consent-banner__acciones">' +
        '<button type="button" class="consent-banner__btn consent-banner__btn--rechazar" data-consent="denied">Rechazar</button>' +
        '<button type="button" class="consent-banner__btn consent-banner__btn--aceptar" data-consent="granted">Aceptar</button>' +
      '</div>';
    return banner;
  }

  function ocultar(banner) {
    banner.classList.add('consent-banner--oculto');
    setTimeout(function () {
      if (banner.parentNode) banner.parentNode.removeChild(banner);
    }, 300);
  }

  function mostrarBanner() {
    var banner = construirBanner();
    banner.addEventListener('click', function (ev) {
      var btn = ev.target.closest ? ev.target.closest('[data-consent]') : null;
      if (!btn) return;
      var decision = btn.getAttribute('data-consent');
      guardar(decision);
      actualizarConsentimiento(decision);
      ocultar(banner);
    });
    document.body.appendChild(banner);
  }

  if (document.body) mostrarBanner();
  else document.addEventListener('DOMContentLoaded', mostrarBanner);

})();
