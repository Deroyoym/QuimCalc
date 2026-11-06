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

  function conComa(s) { return String(s).replace(/(\d)\.(\d)/g, '$1,$2'); }

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
      if (isNaN(pKa))           { mostrarError('Ingresa el pKa del ácido débil.'); return; }
      if (isNaN(cBase) || cBase <= 0)  { mostrarError('Ingresa la concentración de la base conjugada [A⁻] (mayor a cero).'); return; }
      if (isNaN(cAcido) || cAcido <= 0) { mostrarError('Ingresa la concentración del ácido débil [HA] (mayor a cero).'); return; }

      const relacion = cBase / cAcido;
      const logRel   = Math.log10(relacion);
      resultado      = pKa + logRel;

      if (resultado < 0 || resultado > 14) {
        mostrarError(`El pH calculado (${resultado.toFixed(4)}) está fuera del rango 0–14. Verifica los datos.`);
        return;
      }

      descripcion = 'pH del buffer (Henderson-Hasselbalch)';
      formula     = `pH = ${pKa} + log(${cBase} / ${cAcido}) = ${pKa} + log(${relacion.toFixed(4)}) = ${pKa} + (${logRel.toFixed(4)})`;

      /* Control de validez: pH exacto por balance de carga (25 °C).
         H-H supone que [HA] y [A⁻] no cambian al disolverse; falla con
         soluciones muy diluidas, relaciones extremas o pKa muy bajos/altos. */
      const exacto = pHExacto(pKa, cAcido, cBase);
      const avisos = [];
      if (exacto !== null && Math.abs(exacto - resultado) > 0.05) {
        avisos.push(`⚠️ Henderson-Hasselbalch no es válida con estos datos: el pH exacto (balance de carga, 25 °C) es ${exacto.toFixed(2)}`);
      }
      if (relacion < 0.1 || relacion > 10) {
        avisos.push('⚠️ La relación [A⁻]/[HA] está fuera de 0,1–10: la capacidad amortiguadora es baja');
      }
      if (avisos.length) descripcion += ' — ' + avisos.join(' · ');
      mostrarResultado(`pH = ${resultado.toFixed(2)}`, descripcion, formula);
    }

    /* ── Calcular pKa ────────────────────────────────────────
       pKa = pH - log([A⁻] / [HA])
       ──────────────────────────────────────────────────────── */
    else if (incognita === 'pka') {
      if (isNaN(pH) || pH < 0 || pH > 14) { mostrarError('Ingresa un pH válido entre 0 y 14.'); return; }
      if (isNaN(cBase) || cBase <= 0)  { mostrarError('Ingresa la concentración de la base conjugada [A⁻].'); return; }
      if (isNaN(cAcido) || cAcido <= 0) { mostrarError('Ingresa la concentración del ácido débil [HA].'); return; }

      const relacion = cBase / cAcido;
      resultado      = pH - Math.log10(relacion);
      descripcion    = 'pKa del ácido';
      formula        = `pKa = pH − log([A⁻]/[HA]) = ${pH} − log(${relacion.toFixed(4)})`;
      mostrarResultado(`pKa = ${resultado.toFixed(2)}`, descripcion, formula);
    }

    /* ── Calcular relación [A⁻]/[HA] necesaria ───────────────
       log([A⁻]/[HA]) = pH - pKa
       [A⁻]/[HA] = 10^(pH - pKa)
       ──────────────────────────────────────────────────────── */
    else if (incognita === 'relacion') {
      if (isNaN(pH) || pH < 0 || pH > 14) { mostrarError('Ingresa un pH válido entre 0 y 14.'); return; }
      if (isNaN(pKa)) { mostrarError('Ingresa el pKa del ácido débil.'); return; }

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

      if (Math.abs(exponente) > 1) {
        relacionTexto += ' — ⚠️ el pH está a más de 1 unidad del pKa: elige un ácido con pKa más cercano al pH buscado';
      }
      mostrarResultado(`[A⁻]/[HA] = ${QCFormato.num(resultado, 4)}`, descripcion + ` — ${relacionTexto}`, formula);
    }
  });

  /* ── Funciones auxiliares ───────────────────────────────── */

  /* pH exacto de una mezcla HA (Ca) + NaA (Cb), Kw = 1,0e-14 (25 °C).
     Balance de carga: [H⁺] + [Na⁺] = [A⁻] + [OH⁻], con [Na⁺] = Cb y
     [A⁻] = (Ca + Cb)·Ka / (Ka + [H⁺]). Se resuelve por bisección en log[H⁺]. */
  function pHExacto(pKa, Ca, Cb) {
    const Ka = Math.pow(10, -pKa), Kw = 1e-14, Ct = Ca + Cb;
    const f = function (h) { return h + Cb - Ct * Ka / (Ka + h) - Kw / h; };
    let lo = -16, hi = 1;   /* log10[H⁺] */
    if (f(Math.pow(10, lo)) > 0 || f(Math.pow(10, hi)) < 0) return null;
    for (let i = 0; i < 200; i++) {
      const mid = (lo + hi) / 2;
      if (f(Math.pow(10, mid)) > 0) hi = mid; else lo = mid;
    }
    return -(lo + hi) / 2;
  }

  function mostrarResultado(valor, descripcion, formula) {
    valor = conComa(valor); descripcion = conComa(descripcion); formula = conComa(formula);
    if (window.QuimCalcHistorial) window.QuimCalcHistorial.registrar(valor, formula);
    bloqueResultado.classList.remove('resultado--error');
    etiquetaResultado.textContent = descripcion;
    valorResultado.textContent    = valor;
    formulaResultado.textContent  = formula;
    bloqueResultado.classList.add('visible');
    bloqueResultado.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function mostrarError(mensaje) {
    mensaje = conComa(mensaje);
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
