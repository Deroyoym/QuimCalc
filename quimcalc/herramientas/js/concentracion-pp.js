/* ============================================================
   CALCULADORA DE PORCENTAJE p/p, p/v y v/v
   Archivo: herramientas/js/concentracion-pp.js

   % p/p = masa soluto (g) / (masa soluto + masa solvente) (g) × 100
   % p/v = masa soluto (g) / volumen de solución (mL) × 100
   % v/v = volumen soluto (mL) / volumen de solución (mL) × 100

   En cada modo hay tres campos (soluto, segundo dato y %): se
   completan dos y se calcula el que quedó vacío. Los ids de los
   inputs se mantienen (masa-soluto, masa-solvente, porc-pp) aunque
   en p/v y v/v el segundo dato sea un volumen.
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  function conComa(s) { return String(s).replace(/(\d)\.(\d)/g, '$1,$2'); }

  const selectTipo     = document.getElementById('tipo-porc');
  const inputSoluto    = document.getElementById('masa-soluto');
  const inputSegundo   = document.getElementById('masa-solvente');
  const inputPorc      = document.getElementById('porc-pp');
  const labelSoluto    = document.getElementById('label-soluto');
  const labelSegundo   = document.getElementById('label-segundo');
  const labelPorc      = document.getElementById('label-porc');
  const ayudaSoluto    = document.getElementById('ayuda-soluto');
  const ayudaSegundo   = document.getElementById('ayuda-solvente');
  const ayudaPorc      = document.getElementById('ayuda-porc');
  const botonCalcular  = document.getElementById('btn-calcular');
  const bloqueResultado  = document.getElementById('resultado');
  const valorResultado   = document.getElementById('resultado-valor');
  const formulaResultado = document.getElementById('resultado-formula');
  const etiquetaResultado = document.getElementById('resultado-etiqueta');

  /* Textos y unidades de cada modo */
  const MODOS = {
    pp: {
      soluto:  ['Masa del soluto (g)', 'Masa de la sustancia que disolvés (el reactivo, sal, etc.)', 'g'],
      segundo: ['Masa del solvente (g)', 'Masa del líquido en que disolvés (agua, etanol, etc.), sin el soluto', 'g'],
      porc:    ['% p/p (peso/peso)', 'Gramos de soluto cada 100 g de solución. Entre 0 y 100'],
      nombre:  '% p/p',
    },
    pv: {
      soluto:  ['Masa del soluto (g)', 'Masa de la sustancia que disolvés', 'g'],
      segundo: ['Volumen de la solución (mL)', 'Volumen final, una vez enrasado (soluto + solvente)', 'mL'],
      porc:    ['% p/v (peso/volumen)', 'Gramos de soluto cada 100 mL de solución'],
      nombre:  '% p/v',
    },
    vv: {
      soluto:  ['Volumen del soluto (mL)', 'Volumen del líquido que diluís (etanol, ácido acético, etc.)', 'mL'],
      segundo: ['Volumen de la solución (mL)', 'Volumen final, una vez enrasado', 'mL'],
      porc:    ['% v/v (volumen/volumen)', 'mL de soluto cada 100 mL de solución. Entre 0 y 100'],
      nombre:  '% v/v',
    },
  };

  function aplicarModo() {
    const m = MODOS[selectTipo.value];
    labelSoluto.textContent  = m.soluto[0];
    ayudaSoluto.textContent  = m.soluto[1];
    labelSegundo.textContent = m.segundo[0];
    ayudaSegundo.textContent = m.segundo[1];
    labelPorc.textContent    = m.porc[0];
    ayudaPorc.textContent    = m.porc[1];
    bloqueResultado.classList.remove('visible');
  }
  selectTipo.addEventListener('change', aplicarModo);
  aplicarModo();

  function fmt(n) { return String(parseFloat(n.toPrecision(6))); }

  botonCalcular.addEventListener('click', function () {

    const tipo = selectTipo.value;
    const m    = MODOS[tipo];
    const a    = parseFloat(inputSoluto.value);   // soluto (g o mL)
    const b    = parseFloat(inputSegundo.value);  // solvente (g) o solución (mL)
    const porc = parseFloat(inputPorc.value);

    const vacios = [
      isNaN(a)    ? 'soluto'  : null,
      isNaN(b)    ? 'segundo' : null,
      isNaN(porc) ? 'porc'    : null,
    ].filter(Boolean);

    if (vacios.length === 0) {
      mostrarError('Dejá exactamente un campo vacío para calcular la incógnita.');
      return;
    }
    if (vacios.length > 1) {
      mostrarError('Completá dos campos y dejá vacío solo el que querés calcular.');
      return;
    }

    if (!isNaN(a) && a <= 0) { mostrarError(m.soluto[0] + ': debe ser mayor a cero.'); return; }
    if (!isNaN(b) && b <= 0) { mostrarError(m.segundo[0] + ': debe ser mayor a cero.'); return; }
    if (!isNaN(porc)) {
      if (porc <= 0) { mostrarError('El porcentaje debe ser mayor a cero.'); return; }
      if (tipo !== 'pv' && porc >= 100) { mostrarError('El ' + m.nombre + ' debe ser menor a 100.'); return; }
    }
    /* En p/v y v/v el soluto no puede superar a la solución (v/v) */
    if (tipo === 'vv' && !isNaN(a) && !isNaN(b) && a >= b) {
      mostrarError('El volumen del soluto tiene que ser menor que el volumen final de la solución.');
      return;
    }

    const incognita = vacios[0];
    const uA = m.soluto[2], uB = m.segundo[2];

    /* ── % p/p (lógica original) ─────────────────────────── */
    if (tipo === 'pp') {
      if (incognita === 'porc') {
        const total = a + b;
        const r = a / total * 100;
        mostrarResultado(fmt(r) + ' % p/p', '% p/p (peso en peso)',
          `% p/p = ${a} g / (${a} + ${b}) g × 100 = ${fmt(r)} %`);
      } else if (incognita === 'soluto') {
        const r = porc * b / (100 - porc);
        mostrarResultado(fmt(r) + ' g', 'Masa del soluto',
          `m(soluto) = ${porc} × ${b} g / (100 − ${porc}) = ${fmt(r)} g`);
      } else {
        const r = a * (100 - porc) / porc;
        mostrarResultado(fmt(r) + ' g', 'Masa del solvente',
          `m(solvente) = ${a} g × (100 − ${porc}) / ${porc} = ${fmt(r)} g`);
      }
      return;
    }

    /* ── % p/v y % v/v: soluto / solución × 100 ──────────── */
    if (incognita === 'porc') {
      const r = a / b * 100;
      const extra = tipo === 'pv' ? ` → ${fmt(r * 10)} g/L` : '';
      mostrarResultado(fmt(r) + ' ' + m.nombre, m.nombre,
        `${m.nombre} = ${a} ${uA} / ${b} ${uB} × 100 = ${fmt(r)} %${extra}`);
    } else if (incognita === 'soluto') {
      const r = porc * b / 100;
      mostrarResultado(fmt(r) + ' ' + uA, m.soluto[0].replace(/ \(.*\)/, ''),
        `soluto = ${porc} % × ${b} ${uB} / 100 = ${fmt(r)} ${uA}`);
    } else {
      const r = a * 100 / porc;
      mostrarResultado(fmt(r) + ' ' + uB, 'Volumen de la solución',
        `V(solución) = ${a} ${uA} × 100 / ${porc} % = ${fmt(r)} ${uB}`);
    }
  });

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

  [inputSoluto, inputSegundo, inputPorc].forEach(function (el) {
    el.addEventListener('input', function () {
      bloqueResultado.classList.remove('visible');
    });
  });

});
