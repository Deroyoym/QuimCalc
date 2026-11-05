    /* ── Filtro de búsqueda y categoría ── */

    /* Normaliza para comparar: sin tildes ni mayúsculas, subíndices como
       dígitos («H3PO4» = «H₃PO₄») y «ácido» = «ác.» de la tabla. */
    var SUBS = { '₀':'0','₁':'1','₂':'2','₃':'3','₄':'4','₅':'5','₆':'6','₇':'7','₈':'8','₉':'9',
                 '⁰':'0','¹':'1','²':'2','³':'3','⁴':'4','⁵':'5','⁶':'6','⁷':'7','⁸':'8','⁹':'9' };
    function normalizar(s) {
      return s.toLowerCase()
        .replace(/[₀-₉⁰-⁹¹²³]/g, function (c) { return SUBS[c] || c; })
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/\bacido\b/g, 'ac.')
        .replace(/\s+/g, ' ');
    }

    function filtrar() {
      var texto = normalizar(document.getElementById('buscador').value.trim())
        /* La tabla usa coma decimal: aceptamos búsqueda con punto o con coma */
        .replace(/(^|\d)\.(?=\d|$)/g, '$1,');
      var cat   = document.getElementById('filtro-cat').value;
      var filas = document.querySelectorAll('#tabla-principal tbody tr:not(.fila-categoria)');
      var visibles = 0;

      filas.forEach(function (fila) {
        var contenido = normalizar(fila.textContent + ' ' + (fila.dataset.sinonimos || ''));
        var coincideTexto = !texto || contenido.includes(texto);
        var coincideCat   = !cat   || fila.dataset.cat === cat;

        if (coincideTexto && coincideCat) {
          fila.classList.remove('oculta');
          visibles++;
        } else {
          fila.classList.add('oculta');
        }
      });

      /* Ocultar filas de categoría si no tienen filas visibles */
      document.querySelectorAll('.fila-categoria').forEach(function (fc) {
        var catKey = fc.dataset.cat;
        var hayVisibles = Array.from(
          document.querySelectorAll('#tabla-principal tbody tr[data-cat="' + catKey + '"]:not(.fila-categoria)')
        ).some(function (r) { return !r.classList.contains('oculta'); });
        fc.style.display = hayVisibles ? '' : 'none';
      });

      document.getElementById('n-visibles').textContent = visibles;
    }

/* ── Wiring de eventos (reemplaza los on* inline del HTML) ── */
document.addEventListener('DOMContentLoaded', function () {
  var buscador = document.getElementById('buscador');
  if (buscador) buscador.addEventListener('input', filtrar);
  var cat = document.getElementById('filtro-cat');
  if (cat) cat.addEventListener('change', filtrar);
});
