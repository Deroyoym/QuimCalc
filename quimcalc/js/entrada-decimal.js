/* ============================================================
   ENTRADA DECIMAL CON COMA — QuimCalc
   Archivo: js/entrada-decimal.js

   Los <input type="number"> descartan la coma en muchos navegadores:
   «0,5» llegaba al cálculo como 5. Este script convierte cada campo
   numérico en un campo de texto con teclado decimal y redefine su
   propiedad `value` (solo en ese elemento):
     • lectura  → devuelve el número con punto («0,5» → «0.5»), así que
                  el parseFloat(input.value) de cada herramienta sigue igual;
     • escritura → muestra el número con coma («12.5» → «12,5»).
   El usuario puede escribir con coma o con punto. También se adaptan
   los campos que las herramientas crean después (MutationObserver).
   Los campos adaptados quedan marcados con data-decimal.
   ============================================================ */
(function () {
  'use strict';

  // En inglés la coma es separador de miles («1,000»): no se toca nada.
  if ((document.documentElement.lang || '').slice(0, 2) === 'en') return;

  var nativo = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
  if (!nativo || !nativo.get || !nativo.set) return;

  function aPunto(s) { return String(s).replace(/\s/g, '').replace(/,/g, '.'); }
  function aComa(s)  { return String(s).replace(/\./g, ','); }
  // Solo dígitos, separador decimal, signo y exponente (1,8e-5)
  var PERMITIDOS = /[^0-9.,eE+\-]/g;

  function adaptar(input) {
    if (input.dataset.decimal || input.type !== 'number') return;

    var previo = nativo.get.call(input);
    input.type = 'text';
    input.setAttribute('inputmode', 'decimal');
    input.setAttribute('autocomplete', 'off');
    input.dataset.decimal = '1';
    if (input.placeholder) input.placeholder = input.placeholder.replace(/(\d)\.(\d)/g, '$1,$2');

    Object.defineProperty(input, 'value', {
      configurable: true,
      get: function () { return aPunto(nativo.get.call(this)); },
      set: function (v) { nativo.set.call(this, v == null ? '' : aComa(v)); }
    });
    if (previo) input.value = previo;

    // Descarta letras y símbolos sin mover el cursor más de lo necesario
    input.addEventListener('input', function () {
      var v = nativo.get.call(input);
      var limpio = v.replace(PERMITIDOS, '');
      if (limpio === v) return;
      var pos = (input.selectionStart || limpio.length) - (v.length - limpio.length);
      nativo.set.call(input, limpio);
      try { input.setSelectionRange(pos, pos); } catch (e) { /* algunos navegadores no lo permiten */ }
    });
  }

  function adaptarEn(raiz) {
    if (raiz.matches && raiz.matches('input[type="number"]')) adaptar(raiz);
    if (raiz.querySelectorAll) raiz.querySelectorAll('input[type="number"]').forEach(adaptar);
  }

  function iniciar() {
    adaptarEn(document);
    new MutationObserver(function (cambios) {
      cambios.forEach(function (c) { c.addedNodes.forEach(adaptarEn); });
    }).observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();
