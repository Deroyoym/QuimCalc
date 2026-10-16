/* ============================================================
   CONVERSOR DE UNIDADES DE CONCENTRACIÓN
   Archivo: herramientas/js/conversor.js

   Conversiones incluidas:
     1. ppm ↔ mg/L
     2. Molaridad ↔ Normalidad
   (% p/v ↔ g/L se movió a concentracion-pp.html y conversor-concentracion.html)
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ── Referencias a elementos del HTML ──────────────────── */
  const selectTipo      = document.getElementById('tipo-conversion');
  const botonCalcular   = document.getElementById('btn-calcular');
  const bloqueResultado = document.getElementById('resultado');
  const valorResultado  = document.getElementById('resultado-valor');
  const formulaResultado = document.getElementById('resultado-formula');
  const etiquetaResultado = document.getElementById('resultado-etiqueta');
  const listaEquiv      = document.getElementById('resultado-equivalencias');

  /* Paneles de inputs: uno por tipo de conversión */
  const panelPpm        = document.getElementById('panel-ppm');
  const panelNorm       = document.getElementById('panel-normalidad');

  /* Inputs de ppm ↔ mg/L */
  const inputPpm        = document.getElementById('valor-ppm');
  const selectDirPpm    = document.getElementById('dir-ppm');
  const inputDensidad   = document.getElementById('densidad-ppm');

  /* Inputs de Molaridad ↔ Normalidad */
  const inputMol        = document.getElementById('valor-mol');
  const inputValencia   = document.getElementById('valencia');
  const selectDirNorm   = document.getElementById('dir-norm');

  /* ── Mostrar/ocultar el panel correcto al cambiar el selector ── */
  selectTipo.addEventListener('change', function () {
    /* Ocultamos todos los paneles */
    panelPpm.hidden        = true;
    panelNorm.hidden       = true;

    /* Mostramos solo el que corresponde al valor seleccionado */
    if (selectTipo.value === 'ppm')     panelPpm.hidden        = false;
    if (selectTipo.value === 'norm')    panelNorm.hidden       = false;

    /* Limpiamos el resultado anterior */
    bloqueResultado.classList.remove('visible');
  });

  /* ── Función principal de cálculo ───────────────────────── */
  botonCalcular.addEventListener('click', function () {

    const tipo = selectTipo.value;

    /* ── Conversión 1: ppm ↔ mg/L ───────────────────────────
       Fórmulas corregidas por densidad de la solución:
         mg/L = ppm × densidad(g/mL)
         ppm  = mg/L ÷ densidad(g/mL)
       (la densidad en g/mL es numéricamente igual a kg/L).
       Con densidad = 1 g/mL (soluciones acuosas diluidas) la
       conversión vuelve a ser directa: 1 ppm = 1 mg/L.
       ──────────────────────────────────────────────────────── */
    if (tipo === 'ppm') {
      const valor = parseFloat(inputPpm.value);
      const dir   = selectDirPpm.value; /* "ppm-a-mgl" o "mgl-a-ppm" */

      if (isNaN(valor) || valor < 0) {
        mostrarError('Ingresá un valor numérico válido (mayor o igual a cero).');
        return;
      }

      /* Densidad de la solución; si queda vacía o es inválida, usamos 1 */
      let densidad = parseFloat(inputDensidad.value);
      if (isNaN(densidad) || densidad <= 0) densidad = 1;

      let ppm, mgl;
      if (dir === 'ppm-a-mgl') {
        ppm = valor;
        mgl = valor * densidad;
        mostrarResultado(
          formatear(mgl) + ' mg/L',
          'mg/L = ppm × densidad (g/mL)',
          `${valor} ppm × ${densidad} g/mL = ${formatear(mgl)} mg/L`
        );
      } else {
        mgl = valor;
        ppm = valor / densidad;
        mostrarResultado(
          formatear(ppm) + ' ppm',
          'ppm = mg/L ÷ densidad (g/mL)',
          `${valor} mg/L ÷ ${densidad} g/mL = ${formatear(ppm)} ppm`
        );
      }
      mostrarEquivalencias(ppm, mgl);
    }

    /* ── Conversión 2: Molaridad ↔ Normalidad ────────────────
       N = M × valencia (número de equivalentes)
       M = N / valencia
       ──────────────────────────────────────────────────────── */
    else if (tipo === 'norm') {
      const valor    = parseFloat(inputMol.value);
      const valencia = parseFloat(inputValencia.value);
      const dir      = selectDirNorm.value;

      if (isNaN(valor) || valor < 0) {
        mostrarError('Ingresá un valor numérico válido para la concentración.');
        return;
      }

      if (isNaN(valencia) || valencia <= 0 || !Number.isInteger(valencia)) {
        mostrarError('La valencia debe ser un número entero positivo (1, 2, 3...).');
        return;
      }

      if (dir === 'mol-a-norm') {
        const resultado = valor * valencia;
        mostrarResultado(
          resultado.toFixed(4) + ' N',
          'N = M × valencia',
          `${valor} M × ${valencia} = ${resultado} N`
        );
      } else {
        const resultado = valor / valencia;
        mostrarResultado(
          resultado.toFixed(4) + ' M',
          'M = N / valencia',
          `${valor} N ÷ ${valencia} = ${resultado} M`
        );
      }
    }
  });

  /* ── Funciones auxiliares ───────────────────────────────── */

  /* Hasta 6 cifras significativas, sin ceros de relleno;
     notación científica para valores muy chicos o muy grandes. */
  function formatear(n) {
    if (n === 0) return '0';
    const abs = Math.abs(n);
    if (abs < 1e-4 || abs >= 1e9) return n.toExponential(3);
    return String(parseFloat(n.toPrecision(6)));
  }

  /* Equivalencias del resultado ppm ↔ mg/L.
     ppm es masa/masa (mg/kg); mg/L es masa/volumen. */
  function mostrarEquivalencias(ppm, mgl) {
    const filas = [
      ['mg/L',             mgl],
      ['µg/mL',            mgl],          // 1 mg/L = 1 µg/mL
      ['mg/mL',            mgl / 1000],
      ['g/L',              mgl / 1000],
      ['% m/v (g/100 mL)', mgl / 10000],
      ['ppm (mg/kg)',      ppm],
      ['% m/m',            ppm / 10000],  // 1 % = 10 000 ppm
      ['ppb (µg/kg)',      ppm * 1000],
    ];
    listaEquiv.innerHTML = filas.map(function (f) {
      return '<li><span>' + f[0] + '</span><strong>' + formatear(f[1]) + '</strong></li>';
    }).join('');
    listaEquiv.hidden = false;
  }

  function ocultarEquivalencias() {
    listaEquiv.innerHTML = '';
    listaEquiv.hidden = true;
  }

  function mostrarResultado(valor, descripcion, formula) {
    ocultarEquivalencias();
    if (window.QuimCalcHistorial) window.QuimCalcHistorial.registrar(valor, formula);
    bloqueResultado.classList.remove('resultado--error');
    etiquetaResultado.textContent = descripcion;
    valorResultado.textContent    = valor;
    formulaResultado.textContent  = formula;
    bloqueResultado.classList.add('visible');
    bloqueResultado.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function mostrarError(mensaje) {
    ocultarEquivalencias();
    bloqueResultado.classList.add('resultado--error');
    etiquetaResultado.textContent = 'Error';
    valorResultado.textContent    = mensaje;
    formulaResultado.textContent  = '';
    bloqueResultado.classList.add('visible');
  }

  /* ── Limpiamos al editar cualquier input ────────────────── */
  document.querySelectorAll('input, select').forEach(function (el) {
    el.addEventListener('input', function () {
      bloqueResultado.classList.remove('visible');
    });
  });

});
