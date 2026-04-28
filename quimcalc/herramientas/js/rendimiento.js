/* ============================================================
   CALCULADORA DE % DE RENDIMIENTO
   Archivo: herramientas/js/rendimiento.js

   Fórmula: % Rendimiento = (masa obtenida / masa teórica) × 100

   También puede calcular:
     - masa teórica si se conocen % y masa obtenida
     - masa obtenida si se conocen % y masa teórica
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  const inputObtenida  = document.getElementById('masa-obtenida');
  const inputTeorica   = document.getElementById('masa-teorica');
  const inputRend      = document.getElementById('rendimiento');
  const botonCalcular  = document.getElementById('btn-calcular');
  const bloqueResultado  = document.getElementById('resultado');
  const valorResultado   = document.getElementById('resultado-valor');
  const formulaResultado = document.getElementById('resultado-formula');
  const etiquetaResultado = document.getElementById('resultado-etiqueta');

  botonCalcular.addEventListener('click', function () {

    const mObt = parseFloat(inputObtenida.value);
    const mTeo = parseFloat(inputTeorica.value);
    const rend = parseFloat(inputRend.value);

    /* Contamos cuántos campos están vacíos */
    const vacios = [
      isNaN(mObt) ? 'Masa obtenida' : null,
      isNaN(mTeo) ? 'Masa teórica'  : null,
      isNaN(rend) ? '% Rendimiento' : null,
    ].filter(Boolean);

    if (vacios.length === 0) {
      mostrarError('Dejá exactamente un campo vacío para calcular la incógnita.');
      return;
    }
    if (vacios.length > 1) {
      mostrarError(`Completá todos los campos menos uno. Faltan: ${vacios.join(', ')}.`);
      return;
    }

    /* Validamos que los valores conocidos sean positivos */
    if (!isNaN(mObt) && mObt <= 0) { mostrarError('La masa obtenida debe ser mayor a cero.'); return; }
    if (!isNaN(mTeo) && mTeo <= 0) { mostrarError('La masa teórica debe ser mayor a cero.'); return; }
    if (!isNaN(rend) && (rend <= 0 || rend > 100)) { mostrarError('El rendimiento debe estar entre 0 y 100%.'); return; }

    let resultado, descripcion, formula;
    const incognita = vacios[0];

    /* ── Calcular % de rendimiento ── */
    if (incognita === '% Rendimiento') {
      if (mObt > mTeo) {
        mostrarError('La masa obtenida no puede ser mayor a la masa teórica. Verificá los datos.');
        return;
      }
      resultado   = (mObt / mTeo) * 100;
      descripcion = '% de Rendimiento';
      formula     = `% Rend. = (${mObt} g / ${mTeo} g) × 100`;
    }

    /* ── Calcular masa teórica ── */
    else if (incognita === 'Masa teórica') {
      resultado   = (mObt * 100) / rend;
      descripcion = 'Masa teórica';
      formula     = `Masa teórica = (${mObt} g × 100) / ${rend}%`;
    }

    /* ── Calcular masa obtenida ── */
    else if (incognita === 'Masa obtenida') {
      resultado   = (mTeo * rend) / 100;
      descripcion = 'Masa obtenida esperada';
      formula     = `Masa obtenida = (${mTeo} g × ${rend}%) / 100`;
    }

    /* Unidad según incógnita */
    const unidad = incognita === '% Rendimiento' ? '%' : ' g';
    mostrarResultado(resultado.toFixed(4) + unidad, descripcion, formula);
  });

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

  [inputObtenida, inputTeorica, inputRend].forEach(function (el) {
    el.addEventListener('input', function () {
      bloqueResultado.classList.remove('visible');
    });
  });

});
