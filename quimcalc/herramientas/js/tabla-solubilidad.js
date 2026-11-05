    /* ── BUSCADOR DE CATIONES Y RESALTADO POR SOLUBILIDAD ────
       La búsqueda oculta filas; el filtro «Resaltar» atenúa las celdas
       que no coinciden (antes ocultaba filas enteras y «Solubles»
       mostraba las 17 porque todas tienen alguna sal soluble).
       Los dos se combinan. */
    const buscador = document.getElementById('buscador');
    const filas    = document.querySelectorAll('#cuerpo-tabla tr');
    const botones  = document.querySelectorAll('.filtro-btn');
    let filtro = 'todos';

    function normalizar(s) {
      return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[₀-₉]/g, function (c) { return String(c.charCodeAt(0) - 0x2080); })
        .replace(/[⁺⁻²³+\-]/g, '').replace(/[()]/g, '').replace(/\s+/g, ' ').trim();
    }

    function aplicar() {
      const termino = normalizar(buscador.value);
      filas.forEach(function (fila) {
        const cab = fila.querySelector('th');
        const texto = normalizar((fila.getAttribute('data-cation') || '') + ' ' + (cab ? cab.textContent : ''));
        fila.classList.toggle('fila-oculta', termino !== '' && !texto.includes(termino));
        fila.querySelectorAll('.pastilla').forEach(function (p) {
          p.classList.toggle('atenuada', filtro !== 'todos' && !p.classList.contains('pastilla--' + filtro));
        });
      });
    }

    buscador.addEventListener('input', aplicar);
    botones.forEach(function (btn) {
      btn.addEventListener('click', function () {
        botones.forEach(function (b) { b.classList.remove('activo'); b.setAttribute('aria-pressed', 'false'); });
        this.classList.add('activo');
        this.setAttribute('aria-pressed', 'true');
        filtro = this.getAttribute('data-filtro');
        aplicar();
      });
    });
