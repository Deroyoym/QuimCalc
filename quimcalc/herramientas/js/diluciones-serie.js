/* ============================================================
   CALCULADORA DE DILUCIONES SERIADAS
   Archivo: herramientas/js/diluciones-serie.js

   Genera la tabla completa de una serie de diluciones:
     - Factor de dilución constante (1:10, 1:5, etc.)
     - Concentración inicial y número de pasos
     - Volumen de transferencia y volumen final de cada tubo

   Para cada paso:
     C_n = C_(n-1) / factor
     V_transferencia = V_final / factor
     V_solvente = V_final - V_transferencia
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  const inputConcInicial  = document.getElementById('conc-inicial');
  const inputFactor       = document.getElementById('factor');
  const inputPasos        = document.getElementById('pasos');
  const inputVolFinal     = document.getElementById('vol-final');
  const selectUnidadConc  = document.getElementById('unidad-conc');
  const botonCalcular     = document.getElementById('btn-calcular');
  const contenedorTabla   = document.getElementById('contenedor-tabla');
  const bloqueResultado   = document.getElementById('resultado');
  const valorResultado    = document.getElementById('resultado-valor');
  const formulaResultado  = document.getElementById('resultado-formula');
  const etiquetaResultado = document.getElementById('resultado-etiqueta');

  botonCalcular.addEventListener('click', function () {

    const C0     = parseFloat(inputConcInicial.value);
    const factor = parseFloat(inputFactor.value);
    const pasos  = parseInt(inputPasos.value);
    const vFinal = parseFloat(inputVolFinal.value);
    const unidad = selectUnidadConc.value;

    /* ── Validaciones ─────────────────────────────────────── */
    if (isNaN(C0) || C0 <= 0)              { mostrarError('La concentración inicial debe ser mayor a cero.'); return; }
    if (isNaN(factor) || factor <= 1)      { mostrarError('El factor de dilución debe ser mayor a 1 (ej: 10 para 1:10).'); return; }
    if (isNaN(pasos) || pasos < 1 || pasos > 20) { mostrarError('El número de pasos debe estar entre 1 y 20.'); return; }
    if (isNaN(vFinal) || vFinal <= 0)      { mostrarError('El volumen final de cada tubo debe ser mayor a cero.'); return; }

    /* ── Cálculo de la serie ──────────────────────────────── */
    const vTransferencia = vFinal / factor;  /* Volumen que se pasa de un tubo al siguiente */
    const vSolvente      = vFinal - vTransferencia;

    /* Construimos la tabla de resultados */
    const filas = [];

    /* Fila 0: solución madre (punto de partida) */
    filas.push({
      tubo:           'Madre',
      concFinal:      C0,
      factorAcum:     1,
      vTransferencia: vTransferencia,
      vSolvente:      '—',
      nota:           'Solución de partida'
    });

    /* Filas 1 a N: cada paso de dilución */
    let concActual = C0;
    for (let i = 1; i <= pasos; i++) {
      concActual = concActual / factor;
      filas.push({
        tubo:           `Tubo ${i}`,
        concFinal:      concActual,
        factorAcum:     Math.pow(factor, i),
        vTransferencia: i < pasos ? vTransferencia : '—', /* El último tubo no transfiere */
        vSolvente:      vSolvente,
        nota:           `1:${Math.pow(factor, i).toLocaleString('es-AR')}`
      });
    }

    /* ── Renderizamos la tabla ────────────────────────────── */
    mostrarTabla(filas, unidad, vFinal, factor, vTransferencia, vSolvente);
  });

  /* ── Función que construye la tabla HTML ──────────────────  */
  function mostrarTabla(filas, unidad, vFinal, factor, vTransf, vSolv) {

    /* Mostramos el resumen en el bloque de resultado */
    bloqueResultado.classList.remove('resultado--error');
    etiquetaResultado.textContent = `Serie generada — Factor 1:${factor} · ${filas.length - 1} pasos`;
    valorResultado.textContent    = `${filas.length - 1} diluciones`;
    formulaResultado.textContent  =
      `Volumen de transferencia: ${vTransf.toFixed(2)} mL · Volumen de solvente: ${vSolv.toFixed(2)} mL`;
    bloqueResultado.classList.add('visible');

    /* Construimos la tabla */
    const tabla = document.createElement('table');
    tabla.className  = 'tabla-serie';
    tabla.setAttribute('role', 'table');
    tabla.setAttribute('aria-label', 'Tabla de diluciones seriadas');

    /* Encabezados */
    tabla.innerHTML = `
      <thead>
        <tr>
          <th scope="col">Tubo</th>
          <th scope="col">Concentración (${unidad})</th>
          <th scope="col">Factor acumulado</th>
          <th scope="col">Tomar (mL)</th>
          <th scope="col">Agregar solvente (mL)</th>
        </tr>
      </thead>
      <tbody></tbody>
    `;

    const tbody = tabla.querySelector('tbody');

    filas.forEach(function (fila, index) {
      const tr = document.createElement('tr');
      if (index === 0) tr.style.fontWeight = '600'; /* Fila madre en negrita */

      /* Formateamos la concentración con notación científica si es muy pequeña */
      const concFormateada = formatearConc(fila.concFinal);

      /* Formateamos el volumen de transferencia */
      const vTransfFormateado = fila.vTransferencia === '—'
        ? '—'
        : parseFloat(fila.vTransferencia).toFixed(2);

      tr.innerHTML = `
        <td>${fila.tubo}</td>
        <td>${concFormateada}</td>
        <td>1:${fila.factorAcum.toLocaleString('es-AR')}</td>
        <td>${vTransfFormateado}</td>
        <td>${fila.vSolvente === '—' ? '—' : parseFloat(fila.vSolvente).toFixed(2)}</td>
      `;
      tbody.appendChild(tr);
    });

    /* Limpiamos y mostramos */
    contenedorTabla.innerHTML = '';
    contenedorTabla.appendChild(tabla);
    contenedorTabla.style.display = 'block';
    contenedorTabla.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  /* Formatea números muy pequeños en notación científica legible */
  function formatearConc(valor) {
    if (valor === 0) return '0';
    if (valor >= 0.001) return valor.toPrecision(4);
    /* Notación científica manual para mayor legibilidad */
    const exp = Math.floor(Math.log10(valor));
    const base = valor / Math.pow(10, exp);
    return `${base.toFixed(3)} × 10^${exp}`;
  }

  function mostrarError(mensaje) {
    bloqueResultado.classList.add('resultado--error');
    etiquetaResultado.textContent = 'Error';
    valorResultado.textContent    = mensaje;
    formulaResultado.textContent  = '';
    bloqueResultado.classList.add('visible');
    contenedorTabla.style.display = 'none';
  }

  /* Limpiamos al cambiar cualquier campo */
  [inputConcInicial, inputFactor, inputPasos, inputVolFinal].forEach(function (el) {
    el.addEventListener('input', function () {
      bloqueResultado.classList.remove('visible');
      contenedorTabla.style.display = 'none';
    });
  });

});
