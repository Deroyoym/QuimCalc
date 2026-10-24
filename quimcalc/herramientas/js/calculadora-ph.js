/* ============================================================
   CALCULADORA DE pH
   Archivo: herramientas/js/calculadora-ph.js

   Cálculos incluidos (25 °C, Kw = 1,0 × 10⁻¹⁴), sin aproximaciones:
     - Ácido / base fuerte: [H⁺] o [OH⁻] = (C + √(C² + 4·Kw)) / 2
       (incluye el aporte del agua, que importa por debajo de ~10⁻⁶ M)
     - Ácido / base débil: balance de carga exacto
         [H⁺] − Kw/[H⁺] − Ka·C/(Ka + [H⁺]) = 0
       resuelto numéricamente. Se informa además el % de disociación y
       si la aproximación √(Ka·C) habría sido válida (< 5 %).
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  function conComa(s) { return String(s).replace(/(\d)\.(\d)/g, '$1,$2'); }

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
      ayuda.innerHTML = 'Ej: Ka del ácido acético = 1,8 × 10⁻⁵ → escribí 0,000018 o 1,8e-5';
    } else {
      label.textContent = 'Kb (constante de basicidad)';
      ayuda.innerHTML = 'Ej: Kb del amoniaco = 1,8 × 10⁻⁵ → escribí 0,000018 o 1,8e-5';
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

    if (tipo === 'acido-fuerte' || tipo === 'base-fuerte') {
      /* Disociación completa: [X] = C, más el aporte del agua (Kw) */
      const x   = fuerte(C);
      const pX  = -Math.log10(x);
      const agua = C < 1e-6 ? ' (incluye el aporte del agua: a esta dilución no es despreciable)' : '';
      if (tipo === 'acido-fuerte') {
        pH          = pX;
        formula     = `[H⁺] = ${cientifico(x)} M → pH = −log[H⁺] = ${pH.toFixed(4)}${agua}`;
        descripcion = 'pH del ácido fuerte';
      } else {
        pH          = 14 - pX;
        formula     = `[OH⁻] = ${cientifico(x)} M → pOH = ${pX.toFixed(4)} → pH = 14 − pOH${agua}`;
        descripcion = 'pH de la base fuerte';
      }
    }

    else if (tipo === 'acido-debil' || tipo === 'base-debil') {
      const esAcido = tipo === 'acido-debil';
      const K = parseFloat(inputKa.value);
      if (isNaN(K) || K <= 0) {
        mostrarError(`Ingresá un valor de ${esAcido ? 'Ka' : 'Kb'} válido (mayor a cero).`);
        return;
      }
      /* Solución exacta del equilibrio (balance de carga con Kw) */
      const x      = debil(C, K);                    /* [H⁺] o [OH⁻] */
      const pX     = -Math.log10(x);
      const disoc  = 100 * (K / (K + x));            /* fracción disociada: [A⁻]/C */
      const aprox  = Math.sqrt(K * C);
      const pAprox = -Math.log10(aprox);
      const pHaprox = esAcido ? pAprox : 14 - pAprox;
      pH = esAcido ? pX : 14 - pX;

      const ion  = esAcido ? '[H⁺]' : '[OH⁻]';
      const kNom = esAcido ? 'Ka' : 'Kb';
      const nota = disoc < 5
        ? `la aproximación √(${kNom}·C) es válida y daría pH ${pHaprox.toFixed(2)}`
        : `la aproximación √(${kNom}·C) no es válida (> 5 %): habría dado pH ${pHaprox.toFixed(2)}`;
      formula = `${ion} = ${cientifico(x)} M (solución exacta)` +
                (esAcido ? '' : ` → pOH = ${pX.toFixed(4)} → pH = 14 − pOH`) +
                ` · disociación = ${disoc.toFixed(2)} % · ${nota}`;
      descripcion = esAcido ? 'pH del ácido débil' : 'pH de la base débil';
    }

    /* Verificación de rango (pH debe estar entre 0 y 14) */
    if (pH < 0 || pH > 14) {
      mostrarError(`El pH calculado es ${pH.toFixed(4)}, fuera del rango 0–14. Verificá los datos ingresados.`);
      return;
    }

    mostrarResultado(`pH = ${pH.toFixed(4)}`, descripcion, formula);
  });

  /* ── Funciones auxiliares ───────────────────────────────── */
  const KW = 1e-14;

  /* Ácido o base fuerte monoprótico: x² − C·x − Kw = 0 */
  function fuerte(C) {
    return (C + Math.sqrt(C * C + 4 * KW)) / 2;
  }

  /*
   * Ácido (o base) débil monoprótico: balance de carga exacto
   *   f(x) = x − Kw/x − K·C/(K + x) = 0,   x = [H⁺] (o [OH⁻])
   * f es creciente en x, así que se resuelve por bisección en escala
   * logarítmica entre √Kw y C + √Kw.
   */
  function debil(C, K) {
    const f = function (x) { return x - KW / x - K * C / (K + x); };
    let lo = Math.log10(Math.sqrt(KW)), hi = Math.log10(C + Math.sqrt(KW));
    for (let i = 0; i < 200; i++) {
      const mid = (lo + hi) / 2;
      if (f(Math.pow(10, mid)) > 0) hi = mid; else lo = mid;
    }
    return Math.pow(10, (lo + hi) / 2);
  }

  function cientifico(x) {
    const e = Math.floor(Math.log10(x));
    const m = x / Math.pow(10, e);
    const sup = String(e).replace('-', '⁻').replace(/\d/g, function (d) { return '⁰¹²³⁴⁵⁶⁷⁸⁹'[d]; });
    return `${m.toFixed(3)} × 10${sup}`;
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

  [inputConc, inputKa, selectTipo].forEach(function (el) {
    el.addEventListener('input', function () {
      bloqueResultado.classList.remove('visible');
    });
  });

});
