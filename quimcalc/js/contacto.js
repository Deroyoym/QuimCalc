// ============================================================
// CONTACTO — ofuscación anti-scraping
// ============================================================
// El número de WhatsApp y el email NO están en el HTML: se guardan
// codificados en base64 y se decodifican para armar los enlaces recién
// cuando la página se ejecuta en el navegador. Esto evita que los bots
// que rastrean el código fuente (harvesters de spam) los cosechen,
// manteniendo los botones 100% funcionales para las personas.
// ============================================================

(function () {
  'use strict';

  // Valores codificados (no legibles a simple vista en el fuente).
  var WA_B64    = 'NTQ5MzQxMzQ4MjE3MQ==';        // número de WhatsApp
  var MAIL_B64  = 'cy55ZWRyb0BvdXRsb29rLmNvbQ=='; // dirección de email

  function decode(b64) {
    try { return atob(b64); } catch (e) { return ''; }
  }

  var whatsapp = decode(WA_B64);
  var email    = decode(MAIL_B64);

  // Botón de WhatsApp
  var btnWa = document.getElementById('btn-whatsapp');
  if (btnWa && whatsapp) {
    var texto = encodeURIComponent('Hola, te contacto desde QuimCalc.');
    btnWa.setAttribute('href', 'https://wa.me/' + whatsapp + '?text=' + texto);
  }

  // Botón de Email
  var btnMail = document.getElementById('btn-email');
  if (btnMail && email) {
    btnMail.setAttribute('href', 'mailto:' + email);
  }
})();
