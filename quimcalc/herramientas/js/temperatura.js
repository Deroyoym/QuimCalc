/* ============================================================
   CONVERSOR DE TEMPERATURA
   Archivo: herramientas/js/temperatura.js

   Conversiones:
     °C → °F:  F = (C × 9/5) + 32
     °C → K:   K = C + 273.15
     °F → °C:  C = (F - 32) × 5/9
     °F → K:   K = (F - 32) × 5/9 + 273.15
     K  → °C:  C = K - 273.15
     K  → °F:  F = (K - 273.15) × 9/5 + 32
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  const inputValor      = document.getElementById('valor-temp');
  const selectDe        = document.getElementById('unidad-de');
  const selectA         = document.getElementById('unidad-a');
  const botonCalcular   = document.getElementById('btn-calcular');
  const bloqueResultado = document.getElementById('resultado');
  const valorResultado  = document.getElementById('resultado-valor');
  const formulaResultado = document.getElementById('resultado-formula');
  const etiquetaResultado = document.getElementById('resultado-etiqueta');

  /* Evitamos que el usuario convierta una unidad a sí misma */
  selectDe.addEventListener('change', function () {
    if (selectDe.value === selectA.value) {
      /* Cambiamos el destino al siguiente disponible */
      const opciones = ['C', 'F', 'K'];
      const siguiente = opciones.find(u => u !== selectDe.value);
      selectA.value = siguiente;
    }
    bloqueResultado.classList.remove('visible');
  });

  selectA.addEventListener('change', function () {
    bloqueResultado.classList.remove('visible');
  });

  botonCalcular.addEventListener('click', function () {

    const valor = parseFloat(inputValor.value);
    const de    = selectDe.value;
    const a     = selectA.value;

    if (isNaN(valor)) {
      mostrarError('Ingresá un valor numérico válido.');
      return;
    }

    /* Validamos que no sea la misma unidad */
    if (de === a) {
      mostrarError('Elegí unidades diferentes de origen y destino.');
      return;
    }

    /* Validamos que Kelvin no sea negativo (cero absoluto = 0 K) */
    if (de === 'K' && valor < 0) {
      mostrarError('El valor en Kelvin no puede ser negativo (0 K es el cero absoluto).');
      return;
    }

    /* Validamos que la temperatura en °C no baje de -273.15 */
    if (de === 'C' && valor < -273.15) {
      mostrarError('El valor en °C no puede ser menor a −273.15 (cero absoluto).');
      return;
    }

    let resultado, formula, unidadResultado;

    /* ── Conversiones desde °C ── */
    if (de === 'C' && a === 'F') {
      resultado      = (valor * 9 / 5) + 32;
      formula        = `°F = (${valor} × 9/5) + 32`;
      unidadResultado = '°F';
    }
    else if (de === 'C' && a === 'K') {
      resultado      = valor + 273.15;
      formula        = `K = ${valor} + 273.15`;
      unidadResultado = 'K';
    }

    /* ── Conversiones desde °F ── */
    else if (de === 'F' && a === 'C') {
      resultado      = (valor - 32) * 5 / 9;
      formula        = `°C = (${valor} − 32) × 5/9`;
      unidadResultado = '°C';
    }
    else if (de === 'F' && a === 'K') {
      resultado      = (valor - 32) * 5 / 9 + 273.15;
      formula        = `K = (${valor} − 32) × 5/9 + 273.15`;
      unidadResultado = 'K';
    }

    /* ── Conversiones desde K ── */
    else if (de === 'K' && a === 'C') {
      resultado      = valor - 273.15;
      formula        = `°C = ${valor} − 273.15`;
      unidadResultado = '°C';
    }
    else if (de === 'K' && a === 'F') {
      resultado      = (valor - 273.15) * 9 / 5 + 32;
      formula        = `°F = (${valor} − 273.15) × 9/5 + 32`;
      unidadResultado = '°F';
    }

    mostrarResultado(
      `${resultado.toFixed(4)} ${unidadResultado}`,
      `${valor} ${nombreUnidad(de)} → ${unidadResultado}`,
      formula
    );
  });

  /* Nombre largo de la unidad para el resultado */
  function nombreUnidad(codigo) {
    return { 'C': '°C', 'F': '°F', 'K': 'K' }[codigo];
  }

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

  [inputValor, selectDe, selectA].forEach(function (el) {
    el.addEventListener('input', function () {
      bloqueResultado.classList.remove('visible');
    });
  });

});
