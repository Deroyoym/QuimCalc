// ============================================================
// CONTACTO — ofuscación anti-scraping
// ============================================================
// El email NO está en el HTML: se guarda codificado en base64 y se
// decodifica para armar el enlace recién cuando la página se ejecuta en
// el navegador. Así los bots que rastrean el código fuente (harvesters
// de spam) no lo cosechan, y el botón sigue funcionando para las personas.
// ============================================================

(function () {
  'use strict';

  // Valor codificado (no legible a simple vista en el fuente).
  var MAIL_B64  = 'cy55ZWRyb0BvdXRsb29rLmNvbQ=='; // dirección de email

  function decode(b64) {
    try { return atob(b64); } catch (e) { return ''; }
  }

  var email = decode(MAIL_B64);

  // Botón de Email
  var btnMail = document.getElementById('btn-email');
  if (btnMail && email) {
    btnMail.setAttribute('href', 'mailto:' + email);
  }
})();
