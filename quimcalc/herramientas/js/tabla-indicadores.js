    /* Sin tildes ni mayúsculas: «fenolftaleina» encuentra «Fenolftaleína» */
    function normalizar(s) {
      return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }

    function filtrar() {
      var texto = normalizar(document.getElementById('buscador').value.trim())
        /* La tabla usa coma decimal: aceptamos búsqueda con punto o con coma */
        .replace(/(^|\d)\.(?=\d|$)/g, '$1,');
      var filas = document.querySelectorAll('#tabla-principal tbody tr');
      var visibles = 0;
      filas.forEach(function (fila) {
        var coincide = !texto || normalizar(fila.textContent).includes(texto);
        fila.classList.toggle('oculta', !coincide);
        if (coincide) visibles++;
      });
      var aviso = document.getElementById('sin-resultados');
      if (aviso) aviso.hidden = visibles > 0;
    }

/* ── Wiring de eventos (reemplaza los on* inline del HTML) ── */
document.addEventListener('DOMContentLoaded', function () {
  var buscador = document.getElementById('buscador');
  if (buscador) buscador.addEventListener('input', filtrar);
});
