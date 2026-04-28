/* ============================================================
   CALCULADORA DE pH
   Archivo: herramientas/js/calculadora-ph.js

   Cálculos incluidos:
     - Ácido fuerte:  pH = -log₁₀([H⁺])
     - Base fuerte:   pOH = -log₁₀([OH⁻]) → pH = 14 - pOH
     - Ácido débil:   pH = ½(pKa - log[HA])
     - Base débil:    pOH = ½(pKb - log[B]) → pH = 14 - pOH
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ── Referencias ────────────────────────────────────────── */
  const selectTipo      = document.getElementById('tipo-sustancia');
  const inputConc       = document.getElementById('concentracion');
  const campoKa         = document.getElementById('campo-ka');   /* div que envuelve el input Ka */
  const inputKa         = document.getElementById('ka');
  const botonCalcular   = document.getElementById('btn-calcular');
  const bloqueResultado = document.getElementById('resultado');
  const valorResultado  = document.getElementById('resultado-valor');
  const formulaResultado = document.getElementById('resultado-formula');
  const etiquetaResultado = document.getElementById('resultado-etiqueta');

  /* ── Mostrar/ocultar el campo Ka/Kb según el tipo ──────── */
  selectTipo.addEventListener('change', function () {
    const tipo = selectTipo.value;
    /* Solo los ácidos y bases débiles necesitan Ka o Kb */
    campoKa.hidden = (tipo === 'acido-fuerte' || tipo === 'base-fuerte');

    /* Actualizamos el label dinámicamente */
    const label = campoKa.querySelector('label');
    const ayuda = campoKa.querySelector('.ayuda');
    if (tipo === 'acido-debil') {
      label.textContent = 'Ka (constante de acidez)';
      ayuda.textContent = 'Ej: Ka del ácido acético = 1.8 × 10⁻⁵ → ingresá 0.000018';
    } else {
      label.textContent = 'Kb (constante de basicidad)';
      ayuda.textContent = 'Ej: Kb del amoniaco = 1.8 × 10⁻⁵ → ingresá 0.000018';
    }

    bloqueResultado.classList.remove('visible');
  });

  /* ── Cálculo principal ──────────────────────────────────── */
  botonCalcular.addEventListener('click', function () {

    const tipo = selectTipo.value;
    const C    = parseFloat(inputConc.value);

    /* Validación de concentración */
    if (isNaN(C) || C <= 0) {
      mostrarError('Ingresá una concentración mayor a cero.');
      return;
    }

    let pH, formula, descripcion;

    /* ── Ácido fuerte ────────────────────────────────────────
       Se disocia completamente: [H⁺] = C
       pH = -log₁₀(C)
       ──────────────────────────────────────────────────────── */
    if (tipo === 'acido-fuerte') {
      pH          = -Math.log10(C);
      formula     = `pH = -log(${C}) = ${pH.toFixed(4)}`;
      descripcion = 'pH del ácido fuerte';
    }

    /* ── Base fuerte ─────────────────────────────────────────
       Se disocia completamente: [OH⁻] = C
       pOH = -log₁₀(C) → pH = 14 - pOH
       ──────────────────────────────────────────────────────── */
    else if (tipo === 'base-fuerte') {
      const pOH   = -Math.log10(C);
      pH          = 14 - pOH;
      formula     = `pOH = -log(${C}) = ${pOH.toFixed(4)} → pH = 14 - ${pOH.toFixed(4)}`;
      descripcion = 'pH de la base fuerte';
    }

    /* ── Ácido débil ─────────────────────────────────────────
       Aproximación: pH = ½ × (pKa - log[HA])
       Válida cuando C/Ka > 100 (disociación < 5%)
       ──────────────────────────────────────────────────────── */
    else if (tipo === 'acido-debil') {
      const Ka = parseFloat(inputKa.value);
      if (isNaN(Ka) || Ka <= 0) {
        mostrarError('Ingresá un valor de Ka válido (mayor a cero).');
        return;
      }
      const pKa   = -Math.log10(Ka);
      pH          = 0.5 * (pKa - Math.log10(C));
      formula     = `pH = ½ × (pKa - log[C]) = ½ × (${pKa.toFixed(4)} - log(${C}))`;
      descripcion = 'pH del ácido débil (aproximación)';
    }

    /* ── Base débil ──────────────────────────────────────────
       Aproximación: pOH = ½ × (pKb - log[B]) → pH = 14 - pOH
       ──────────────────────────────────────────────────────── */
    else if (tipo === 'base-debil') {
      const Kb = parseFloat(inputKa.value);
      if (isNaN(Kb) || Kb <= 0) {
        mostrarError('Ingresá un valor de Kb válido (mayor a cero).');
        return;
      }
      const pKb   = -Math.log10(Kb);
      const pOH   = 0.5 * (pKb - Math.log10(C));
      pH          = 14 - pOH;
      formula     = `pOH = ½ × (pKb - log[C]) = ½ × (${pKb.toFixed(4)} - log(${C})) → pH = 14 - pOH`;
      descripcion = 'pH de la base débil (aproximación)';
    }

    /* Verificación de rango (pH debe estar entre 0 y 14) */
    if (pH < 0 || pH > 14) {
      mostrarError(`El pH calculado es ${pH.toFixed(4)}, fuera del rango 0–14. Verificá los datos ingresados.`);
      return;
    }

    mostrarResultado(`pH = ${pH.toFixed(4)}`, descripcion, formula);
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

  [inputConc, inputKa, selectTipo].forEach(function (el) {
    el.addEventListener('input', function () {
      bloqueResultado.classList.remove('visible');
    });
  });

});
