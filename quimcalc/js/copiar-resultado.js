// ============================================================
// COPIAR RESULTADO — botón de un toque en las calculadoras
// ============================================================
// Inserta un botón "Copiar resultado" dentro del bloque de resultado.
// Al copiarse, el valor viaja al portapapeles listo para pegar en un
// informe o en el WhatsApp del equipo: cada pegado difunde la
// herramienta. Cero dependencias, progressive enhancement.
// ============================================================

(function () {
  'use strict';

  if (!navigator.clipboard) return;

  // Contenedor del resultado (cubre las variantes de las calculadoras)
  var cont = document.querySelector('#resultado')
          || document.querySelector('.seccion-resultados')
          || document.querySelector('.resultado-gum')
          || document.querySelector('.resultado-lodloq');
  if (!cont) return;

  var btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'btn-copiar-resultado';
  btn.innerHTML = '<svg viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg><span>Copiar resultado</span>';

  btn.addEventListener('click', function () {
    // Texto del resultado, sin el propio texto del botón
    var texto = (cont.innerText || '').replace('Copiar resultado', '').trim();
    // Evita copiar el placeholder vacío
    if (!texto || texto === '—' || texto.replace(/[—\s]/g, '') === '') return;

    navigator.clipboard.writeText(texto).then(function () {
      var toast = window.quimToast;
      if (toast) {
        toast('Resultado copiado ✓');
      } else {
        var span = btn.querySelector('span');
        var prev = span.textContent;
        span.textContent = '¡Copiado! ✓';
        setTimeout(function () { span.textContent = prev; }, 1800);
      }
    }).catch(function () {});
  });

  cont.appendChild(btn);
})();
