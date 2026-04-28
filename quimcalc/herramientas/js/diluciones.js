/* ============================================================
   CALCULADORA DE DILUCIONES — C₁V₁ = C₂V₂
   Archivo: herramientas/js/diluciones.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ── Referencias a los elementos del HTML ──────────────── */
  const inputC1 = document.getElementById('c1');
  const inputV1 = document.getElementById('v1');
  const inputC2 = document.getElementById('c2');
  const inputV2 = document.getElementById('v2');
  const botonCalcular    = document.getElementById('btn-calcular');
  const bloqueResultado  = document.getElementById('resultado');
  const valorResultado   = document.getElementById('resultado-valor');
  const formulaResultado = document.getElementById('resultado-formula');
  const etiquetaResultado = document.getElementById('resultado-etiqueta');

  /* ── Función principal ──────────────────────────────────── */
  botonCalcular.addEventListener('click', function () {

    /* Leemos los valores. Si el campo está vacío, parseFloat devuelve NaN */
    const C1 = parseFloat(inputC1.value);
    const V1 = parseFloat(inputV1.value);
    const C2 = parseFloat(inputC2.value);
    const V2 = parseFloat(inputV2.value);

    /* Contamos cuántos campos están vacíos */
    const vacios = [
      isNaN(C1) ? 'C1' : null,
      isNaN(V1) ? 'V1' : null,
      isNaN(C2) ? 'C2' : null,
      isNaN(V2) ? 'V2' : null,
    ].filter(Boolean); /* filter(Boolean) elimina los null del array */

    /* ── Validación ─────────────────────────────────────────
       La ecuación C₁V₁ = C₂V₂ tiene 4 variables.
       Necesitamos exactamente 3 conocidas para resolver la 1 incógnita.
       ──────────────────────────────────────────────────────── */
    if (vacios.length === 0) {
      mostrarError('Dejá exactamente un campo vacío para que la calculadora encuentre la incógnita.');
      return;
    }

    if (vacios.length > 1) {
      mostrarError(`Hay ${vacios.length} campos vacíos (${vacios.join(', ')}). Necesitás completar todos menos uno.`);
      return;
    }

    /* Verificamos que los valores conocidos sean positivos */
    const valoresConocidos = { C1, V1, C2, V2 };
    for (const [nombre, valor] of Object.entries(valoresConocidos)) {
      if (!isNaN(valor) && valor <= 0) {
        mostrarError(`El valor de ${nombre} debe ser mayor a cero.`);
        return;
      }
    }

    /* ── LÓGICA DE CÁLCULO ───────────────────────────────────
       Según cuál sea la incógnita (el campo vacío), aplicamos
       la forma despejada de C₁V₁ = C₂V₂.
       ──────────────────────────────────────────────────────── */
    let resultado, descripcion, formula, unidad;
    const incognita = vacios[0]; /* El único campo vacío */

    if (incognita === 'C1') {
      resultado   = (C2 * V2) / V1;
      descripcion = 'Concentración inicial (C₁)';
      formula     = `C₁ = (C₂ × V₂) / V₁ = (${C2} × ${V2}) / ${V1}`;
      unidad      = ''; /* El usuario define las unidades de concentración */
    }
    else if (incognita === 'V1') {
      resultado   = (C2 * V2) / C1;
      descripcion = 'Volumen a tomar (V₁)';
      formula     = `V₁ = (C₂ × V₂) / C₁ = (${C2} × ${V2}) / ${C1}`;
      unidad      = '';
    }
    else if (incognita === 'C2') {
      resultado   = (C1 * V1) / V2;
      descripcion = 'Concentración final (C₂)';
      formula     = `C₂ = (C₁ × V₁) / V₂ = (${C1} × ${V1}) / ${V2}`;
      unidad      = '';
    }
    else if (incognita === 'V2') {
      resultado   = (C1 * V1) / C2;
      descripcion = 'Volumen final (V₂)';
      formula     = `V₂ = (C₁ × V₁) / C₂ = (${C1} × ${V1}) / ${C2}`;
      unidad      = '';
    }

    mostrarResultado(resultado.toFixed(4), descripcion, formula);
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

  /* ── Limpiamos el resultado al editar cualquier campo ───── */
  [inputC1, inputV1, inputC2, inputV2].forEach(function (campo) {
    campo.addEventListener('input', function () {
      bloqueResultado.classList.remove('visible');
    });
  });

});
