    /* ── Filtro de búsqueda y categoría ── */
    var TOTAL = 39;

    function filtrar() {
      var texto = document.getElementById('buscador').value.toLowerCase().trim();
      var cat   = document.getElementById('filtro-cat').value;
      var filas = document.querySelectorAll('#tabla-principal tbody tr:not(.fila-categoria)');
      var visibles = 0;

      filas.forEach(function (fila) {
        var coincideTexto = !texto || fila.textContent.toLowerCase().includes(texto);
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
