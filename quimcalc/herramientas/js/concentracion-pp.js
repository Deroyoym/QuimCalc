/* ============================================================
   CALCULADORA DE CONCENTRACIÓN % p/p
   Archivo: herramientas/js/concentracion-pp.js

   % p/p = (masa soluto / masa solución) × 100
   masa solución = masa soluto + masa solvente

   Puede calcular cualquiera de las tres incógnitas:
     - % p/p
     - masa del soluto
     - masa del solvente
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  const inputSoluto    = document.getElementById('masa-soluto');
  const inputSolvente  = document.getElementById('masa-solvente');
  const inputPorc      = document.getElementById('porc-pp');
  const botonCalcular  = document.getElementById('btn-calcular');
  const bloqueResultado  = document.getElementById('resultado');
  const valorResultado   = document.getElementById('resultado-valor');
  const formulaResultado = document.getElementById('resultado-formula');
  const etiquetaResultado = document.getElementById('resultado-etiqueta');

  botonCalcular.addEventListener('click', function () {

    const mSoluto   = parseFloat(inputSoluto.value);
    const mSolvente = parseFloat(inputSolvente.value);
    const porc      = parseFloat(inputPorc.value);

    const vacios = [
      isNaN(mSoluto)   ? 'Masa del soluto'   : null,
      isNaN(mSolvente) ? 'Masa del solvente' : null,
      isNaN(porc)      ? '% p/p'             : null,
    ].filter(Boolean);

    if (vacios.length === 0) {
      mostrarError('Dejá exactamente un campo vacío para calcular la incógnita.');
      return;
    }
    if (vacios.length > 1) {
      mostrarError(`Completá todos los campos menos uno. Faltan: ${vacios.join(', ')}.`);
      return;
    }

    /* Validaciones de valores conocidos */
    if (!isNaN(mSoluto)   && mSoluto   <= 0) { mostrarError('La masa del soluto debe ser mayor a cero.'); return; }
    if (!isNaN(mSolvente) && mSolvente <= 0) { mostrarError('La masa del solvente debe ser mayor a cero.'); return; }
    if (!isNaN(porc)      && (porc <= 0 || porc >= 100)) { mostrarError('El % p/p debe estar entre 0 y 100 (sin incluir extremos).'); return; }

    const incognita = vacios[0];
    let resultado, descripcion, formula;

    /* ── Calcular % p/p ─────────────────────────────────────
       % p/p = (mSoluto / (mSoluto + mSolvente)) × 100
       ──────────────────────────────────────────────────────── */
    if (incognita === '% p/p') {
      const mSolucion = mSoluto + mSolvente;
      resultado       = (mSoluto / mSolucion) * 100;
      descripcion     = '% p/p (peso en peso)';
      formula         = `% p/p = (${mSoluto} g / (${mSoluto} + ${mSolvente}) g) × 100 = (${mSoluto} / ${mSolucion}) × 100`;
      mostrarResultado(resultado.toFixed(4) + ' %', descripcion, formula);
    }

    /* ── Calcular masa del soluto ────────────────────────────
       De % p/p = mSoluto / (mSoluto + mSolvente) × 100
       Despejando: mSoluto = (% × mSolvente) / (100 - %)
       ──────────────────────────────────────────────────────── */
    else if (incognita === 'Masa del soluto') {
      resultado   = (porc * mSolvente) / (100 - porc);
      descripcion = 'Masa del soluto';
      formula     = `m(soluto) = (${porc}% × ${mSolvente} g) / (100 − ${porc})`;
      mostrarResultado(resultado.toFixed(4) + ' g', descripcion, formula);
    }

    /* ── Calcular masa del solvente ──────────────────────────
       De % p/p = mSoluto / (mSoluto + mSolvente) × 100
       Despejando: mSolvente = mSoluto × (100 - %) / %
       ──────────────────────────────────────────────────────── */
    else if (incognita === 'Masa del solvente') {
      resultado   = mSoluto * (100 - porc) / porc;
      descripcion = 'Masa del solvente';
      formula     = `m(solvente) = ${mSoluto} g × (100 − ${porc}) / ${porc}`;
      mostrarResultado(resultado.toFixed(4) + ' g', descripcion, formula);
    }
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

  [inputSoluto, inputSolvente, inputPorc].forEach(function (el) {
    el.addEventListener('input', function () {
      bloqueResultado.classList.remove('visible');
    });
  });

});
