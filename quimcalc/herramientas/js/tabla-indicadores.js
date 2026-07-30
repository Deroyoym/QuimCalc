    function filtrar() {
      var texto = document.getElementById('buscador').value.toLowerCase().trim();
      var filas = document.querySelectorAll('#tabla-principal tbody tr');
      filas.forEach(function (fila) {
        var coincide = !texto || fila.textContent.toLowerCase().includes(texto);
        fila.classList.toggle('oculta', !coincide);
      });
    }

/* ── Wiring de eventos (reemplaza los on* inline del HTML) ── */
document.addEventListener('DOMContentLoaded', function () {
  var buscador = document.getElementById('buscador');
  if (buscador) buscador.addEventListener('input', filtrar);
});
