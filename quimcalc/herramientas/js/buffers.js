/* ============================================================
   CALCULADORA DE BUFFERS — Henderson-Hasselbalch
   Archivo: herramientas/js/buffers.js

   pH = pKa + log([A⁻] / [HA])

   Puede calcular:
     - pH del buffer
     - Relación [A⁻]/[HA] necesaria para un pH objetivo
     - pKa del ácido a partir de pH y concentraciones
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ── Referencias ────────────────────────────────────────── */
  const selectIncognita  = document.getElementById('incognita');
  const inputPH          = document.getElementById('ph');
  const inputPKa         = document.getElementById('pka');
  const inputBase        = document.getElementById('conc-base');   /* [A⁻] */
  const inputAcido       = document.getElementById('conc-acido');  /* [HA] */
  const botonCalcular    = document.getElementById('btn-calcular');
  const bloqueResultado  = document.getElementById('resultado');
  const valorResultado   = document.getElementById('resultado-valor');
  const formulaResultado = document.getElementById('resultado-formula');
  const etiquetaResultado = document.getElementById('resultado-etiqueta');

  /* Paneles de campos que cambian según la incógnita */
  const campoPH   = document.getElementById('campo-ph');
  const campoPKa  = document.getElementById('campo-pka');
  const campoBase = document.getElementById('campo-base');
  const campoAcido = document.getElementById('campo-acido');

  /* ── Mostramos/ocultamos el campo de la incógnita ────────── */
  selectIncognita.addEventListener('change', actualizarCampos);
  actualizarCampos(); /* Llamada inicial */

  function actualizarCampos() {
    const incognita = selectIncognita.value;

    /* Todos visibles por defecto */
    campoPH.hidden    = false;
    campoPKa.hidden   = false;
    campoBase.hidden  = false;
    campoAcido.hidden = false;

    /* Ocultamos el campo de la incógnita y lo vaciamos */
    if (incognita === 'ph') {
      campoPH.hidden = true;
      inputPH.value  = '';
    } else if (incognita === 'pka') {
      campoPKa.hidden = true;
      inputPKa.value  = '';
    } else if (incognita === 'relacion') {
      /* Para la relación necesitamos pH y pKa, pero no las concentraciones individuales */
      campoBase.hidden  = true;
      campoAcido.hidden = true;
      inputBase.value   = '';
      inputAcido.value  = '';
    }

    bloqueResultado.classList.remove('visible');
  }

  /* ── Cálculo principal ──────────────────────────────────── */
  botonCalcular.addEventListener('click', function () {

    const incognita = selectIncognita.value;
    const pH   = parseFloat(inputPH.value);
    const pKa  = parseFloat(inputPKa.value);
    const cBase  = parseFloat(inputBase.value);   /* [A⁻] */
    const cAcido = parseFloat(inputAcido.value);  /* [HA] */

    let resultado, descripcion, formula;

    /* ── Calcular pH del buffer ──────────────────────────────
       pH = pKa + log([A⁻] / [HA])
       ──────────────────────────────────────────────────────── */
    if (incognita === 'ph') {
      if (isNaN(pKa))           { mostrarError('Ingresá el pKa del ácido débil.'); return; }
      if (isNaN(cBase) || cBase <= 0)  { mostrarError('Ingresá la concentración de la base conjugada [A⁻] (mayor a cero).'); return; }
      if (isNaN(cAcido) || cAcido <= 0) { mostrarError('Ingresá la concentración del ácido débil [HA] (mayor a cero).'); return; }

      const relacion = cBase / cAcido;
      const logRel   = Math.log10(relacion);
      resultado      = pKa + logRel;

      if (resultado < 0 || resultado > 14) {
        mostrarError(`El pH calculado (${resultado.toFixed(4)}) está fuera del rango 0–14. Verificá los datos.`);
        return;
      }

      descripcion = 'pH del buffer';
      formula     = `pH = ${pKa} + log(${cBase} / ${cAcido}) = ${pKa} + log(${relacion.toFixed(4)}) = ${pKa} + (${logRel.toFixed(4)})`;
      mostrarResultado(`pH = ${resultado.toFixed(4)}`, descripcion, formula);
    }

    /* ── Calcular pKa ────────────────────────────────────────
       pKa = pH - log([A⁻] / [HA])
       ──────────────────────────────────────────────────────── */
    else if (incognita === 'pka') {
      if (isNaN(pH) || pH < 0 || pH > 14) { mostrarError('Ingresá un pH válido entre 0 y 14.'); return; }
      if (isNaN(cBase) || cBase <= 0)  { mostrarError('Ingresá la concentración de la base conjugada [A⁻].'); return; }
      if (isNaN(cAcido) || cAcido <= 0) { mostrarError('Ingresá la concentración del ácido débil [HA].'); return; }

      const relacion = cBase / cAcido;
      resultado      = pH - Math.log10(relacion);
      descripcion    = 'pKa del ácido';
      formula        = `pKa = pH − log([A⁻]/[HA]) = ${pH} − log(${relacion.toFixed(4)})`;
      mostrarResultado(`pKa = ${resultado.toFixed(4)}`, descripcion, formula);
    }

    /* ── Calcular relación [A⁻]/[HA] necesaria ───────────────
       log([A⁻]/[HA]) = pH - pKa
       [A⁻]/[HA] = 10^(pH - pKa)
       ──────────────────────────────────────────────────────── */
    else if (incognita === 'relacion') {
      if (isNaN(pH) || pH < 0 || pH > 14) { mostrarError('Ingresá un pH válido entre 0 y 14.'); return; }
      if (isNaN(pKa)) { mostrarError('Ingresá el pKa del ácido débil.'); return; }

      const exponente = pH - pKa;
      resultado       = Math.pow(10, exponente);
      descripcion     = 'Relación [base conjugada] / [ácido débil]';
      formula         = `[A⁻]/[HA] = 10^(pH − pKa) = 10^(${pH} − ${pKa}) = 10^${exponente.toFixed(4)}`;

      /* Expresamos la relación de forma legible */
      let relacionTexto;
      if (resultado >= 1) {
        relacionTexto = `${resultado.toFixed(4)} : 1  (más base que ácido)`;
      } else {
        relacionTexto = `1 : ${(1/resultado).toFixed(4)}  (más ácido que base)`;
      }

      mostrarResultado(`[A⁻]/[HA] = ${resultado.toFixed(4)}`, descripcion + ` — ${relacionTexto}`, formula);
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

  [inputPH, inputPKa, inputBase, inputAcido, selectIncognita].forEach(function (el) {
    el.addEventListener('input', function () {
      bloqueResultado.classList.remove('visible');
    });
  });

});
