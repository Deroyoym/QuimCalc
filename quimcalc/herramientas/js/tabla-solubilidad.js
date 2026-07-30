    /* ── BUSCADOR DE CATIONES ─────────────────────────────── */
    const buscador = document.getElementById('buscador');
    const filas    = document.querySelectorAll('#cuerpo-tabla tr');

    buscador.addEventListener('input', function () {
      const termino = this.value.toLowerCase().trim();

      filas.forEach(function (fila) {
        // data-cation contiene nombre e símbolo del catión
        const texto = fila.getAttribute('data-cation') || '';
        // También busca en el texto visible de la primera celda
        const celdaCation = fila.querySelector('td:first-child');
        const textoVisible = celdaCation ? celdaCation.textContent.toLowerCase() : '';

        const coincide = texto.includes(termino) || textoVisible.includes(termino);
        fila.classList.toggle('fila-oculta', !coincide && termino !== '');
      });
    });

    /* ── FILTRO POR SOLUBILIDAD ───────────────────────────── */
    const botonesFiltra = document.querySelectorAll('.filtro-btn');

    botonesFiltra.forEach(function (btn) {
      btn.addEventListener('click', function () {
        // Actualizar estado activo del botón
        botonesFiltra.forEach(function (b) { b.classList.remove('activo'); });
        this.classList.add('activo');

        const filtro = this.getAttribute('data-filtro');

        filas.forEach(function (fila) {
          if (filtro === 'todos') {
            // Mostrar todas (respetando el buscador)
            const terminoBuscador = buscador.value.toLowerCase().trim();
            if (terminoBuscador !== '') {
              const texto       = fila.getAttribute('data-cation') || '';
              const textoVisible = fila.querySelector('td:first-child')?.textContent.toLowerCase() || '';
              fila.classList.toggle('fila-oculta', !texto.includes(terminoBuscador) && !textoVisible.includes(terminoBuscador));
            } else {
              fila.classList.remove('fila-oculta');
            }
            return;
          }

          // Buscar si la fila tiene al menos una pastilla del tipo pedido
          const pastillas = fila.querySelectorAll('.pastilla');
          let tieneFiltro = false;

          pastillas.forEach(function (p) {
            if (p.classList.contains('pastilla--' + filtro)) {
              tieneFiltro = true;
            }
          });

          fila.classList.toggle('fila-oculta', !tieneFiltro);
        });
      });
    });
