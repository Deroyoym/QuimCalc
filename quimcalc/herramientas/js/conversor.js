/* ============================================================
   CONVERSOR DE UNIDADES DE CONCENTRACIÓN
   Archivo: herramientas/js/conversor.js

   Conversiones incluidas:
     1. ppm ↔ mg/L
     2. % p/v ↔ g/L
     3. Molaridad ↔ Normalidad
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ── Referencias a elementos del HTML ──────────────────── */
  const selectTipo      = document.getElementById('tipo-conversion');
  const botonCalcular   = document.getElementById('btn-calcular');
  const bloqueResultado = document.getElementById('resultado');
  const valorResultado  = document.getElementById('resultado-valor');
  const formulaResultado = document.getElementById('resultado-formula');
  const etiquetaResultado = document.getElementById('resultado-etiqueta');

  /* Paneles de inputs: uno por tipo de conversión */
  const panelPpm        = document.getElementById('panel-ppm');
  const panelPorcentaje = document.getElementById('panel-porcentaje');
  const panelNorm       = document.getElementById('panel-normalidad');

  /* Inputs de ppm ↔ mg/L */
  const inputPpm        = document.getElementById('valor-ppm');
  const selectDirPpm    = document.getElementById('dir-ppm');
  const inputDensidad   = document.getElementById('densidad-ppm');

  /* Inputs de % p/v ↔ g/L */
  const inputPorc       = document.getElementById('valor-porc');
  const selectDirPorc   = document.getElementById('dir-porc');

  /* Inputs de Molaridad ↔ Normalidad */
  const inputMol        = document.getElementById('valor-mol');
  const inputValencia   = document.getElementById('valencia');
  const selectDirNorm   = document.getElementById('dir-norm');

  /* ── Mostrar/ocultar el panel correcto al cambiar el selector ── */
  selectTipo.addEventListener('change', function () {
    /* Ocultamos todos los paneles */
    panelPpm.hidden        = true;
    panelPorcentaje.hidden = true;
    panelNorm.hidden       = true;

    /* Mostramos solo el que corresponde al valor seleccionado */
    if (selectTipo.value === 'ppm')     panelPpm.hidden        = false;
    if (selectTipo.value === 'porc')    panelPorcentaje.hidden = false;
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

      if (dir === 'ppm-a-mgl') {
        const resultado = valor * densidad;
        mostrarResultado(
          resultado.toFixed(4) + ' mg/L',
          'mg/L = ppm × densidad (g/mL)',
          `${valor} ppm × ${densidad} g/mL = ${resultado} mg/L`
        );
      } else {
        const resultado = valor / densidad;
        mostrarResultado(
          resultado.toFixed(4) + ' ppm',
          'ppm = mg/L ÷ densidad (g/mL)',
          `${valor} mg/L ÷ ${densidad} g/mL = ${resultado} ppm`
        );
      }
    }

    /* ── Conversión 2: % p/v ↔ g/L ──────────────────────────
       1% p/v significa 1 g de soluto en 100 mL de solución.
       1% p/v = 10 g/L (multiplicamos por 10)
       ──────────────────────────────────────────────────────── */
    else if (tipo === 'porc') {
      const valor = parseFloat(inputPorc.value);
      const dir   = selectDirPorc.value;

      if (isNaN(valor) || valor < 0) {
        mostrarError('Ingresá un valor numérico válido (mayor o igual a cero).');
        return;
      }

      if (dir === 'porc-a-gl') {
        const resultado = valor * 10;
        mostrarResultado(
          resultado.toFixed(4) + ' g/L',
          '% p/v × 10 = g/L   (porque 1% p/v = 1 g/100 mL = 10 g/L)',
          `${valor}% p/v × 10 = ${resultado} g/L`
        );
      } else {
        const resultado = valor / 10;
        mostrarResultado(
          resultado.toFixed(4) + ' % p/v',
          'g/L ÷ 10 = % p/v',
          `${valor} g/L ÷ 10 = ${resultado}% p/v`
        );
      }
    }

    /* ── Conversión 3: Molaridad ↔ Normalidad ────────────────
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
  function mostrarResultado(valor, descripcion, formula) {
    bloqueResultado.classList.remove('resultado--error');
    etiquetaResultado.textContent = descripcion;
    valorResultado.textContent    = valor;
    formulaResultado.textContent  = formula;
    bloqueResultado.classList.add('visible');
    bloqueResultado.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function mostrarError(mensaje) {
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
