/* ============================================================
   CALCULADORA DE KARL FISCHER
   Archivo: herramientas/js/calculadora-karl-fischer.js

   Modos:
     1. Factor (título) del reactivo, F en mg de agua por mL:
          F = m(agua) / V
        con agua pura, tartrato sódico dihidratado (15,66 % de agua)
        o un estándar líquido certificado (mg de agua por g).
        Hasta 3 réplicas: media, desvío estándar y CV %.
     2. % de agua por KF volumétrico:
          % H₂O = (V − V_blanco) × F / (10 × m_muestra[g])
     3. % de agua por KF coulométrico (el equipo da µg de agua):
          % H₂O = (µg − µg_blanco) / (m_muestra[g] × 10⁴)
   Usa QCFormato (js/formato-numero.js) para los números.
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* Agua en el tartrato sódico dihidratado, Na₂C₄H₄O₆·2H₂O:
     2 × 18,015 / 230,08 = 0,15660 (masas atómicas CIAAW) */
  const FRACCION_TARTRATO = 2 * 18.015 / 230.08;

  const $ = function (id) { return document.getElementById(id); };
  const selModo   = $('modo');
  const selPatron = $('patron');
  const bloques   = document.querySelectorAll('.bloque-modo');
  const res       = $('resultado');
  const resEtiq   = $('resultado-etiqueta');
  const resValor  = $('resultado-valor');
  const resForm   = $('resultado-formula');
  const resExtra  = $('resultado-extra');

  /* null = campo vacío; NaN = texto que no es un número */
  function leer(id) {
    const el = $(id);
    const t = el ? String(el.value).trim() : '';
    return t === '' ? null : parseFloat(t);
  }
  const ok = function (x) { return x !== null && isFinite(x); };
  const F = QCFormato.num;
  const E = function (x) { return QCFormato.num(x, 6, true); };   // repetir una entrada sin ceros de relleno

  function mostrarModo() {
    bloques.forEach(function (b) { b.hidden = b.dataset.modo !== selModo.value; });
    $('campo-contenido').hidden = selPatron.value !== 'estandar';
    limpiar();
  }
  function limpiar() { res.classList.remove('visible', 'resultado--error'); resExtra.innerHTML = ''; }

  function mostrarError(msg) {
    res.classList.add('visible', 'resultado--error');
    resEtiq.textContent = 'Error';
    resValor.textContent = msg;
    resForm.textContent = '';
    resExtra.innerHTML = '';
  }

  function mostrar(etiqueta, valor, formula, minis, avisos, detalle) {
    res.classList.remove('resultado--error');
    resEtiq.textContent = etiqueta;
    resValor.textContent = valor;
    resForm.textContent = formula;
    let html = '';
    if (minis && minis.length) {
      html += '<div class="resultados-grilla">' + minis.map(function (m) {
        return '<div class="resultado-mini"><p class="resultado-mini__etiqueta">' + m[0] +
               '</p><p class="resultado-mini__valor">' + m[1] + '</p></div>';
      }).join('') + '</div>';
    }
    if (detalle && detalle.length) html += '<ul class="detalle-replicas">' + detalle.map(function (d) { return '<li>' + d + '</li>'; }).join('') + '</ul>';
    (avisos || []).forEach(function (a) { html += '<p class="aviso-calculo">⚠️ ' + a + '</p>'; });
    resExtra.innerHTML = html;
    res.classList.add('visible');
    if (window.QuimCalcHistorial) window.QuimCalcHistorial.registrar(valor, formula);
    res.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  /* Campo opcional (blanco): vacío → 0; texto inválido → NaN (da error) */
  function opcional(id) {
    const v = leer(id);
    return v === null ? 0 : v;
  }

  function estadistica(valores) {
    const n = valores.length;
    const media = valores.reduce(function (a, b) { return a + b; }, 0) / n;
    if (n < 2) return { n: n, media: media, s: null, cv: null };
    const s = Math.sqrt(valores.reduce(function (a, v) { return a + (v - media) * (v - media); }, 0) / (n - 1));
    return { n: n, media: media, s: s, cv: 100 * s / media };
  }

  /* ── 1. Factor del reactivo ─────────────────────────────── */
  function calcularFactor() {
    const patron = selPatron.value;
    let fraccion, nombrePatron;
    if (patron === 'agua') { fraccion = 1; nombrePatron = 'agua'; }
    else if (patron === 'tartrato') { fraccion = FRACCION_TARTRATO; nombrePatron = 'tartrato sódico dihidratado'; }
    else {
      const cont = leer('contenido');
      if (!ok(cont) || cont <= 0) return mostrarError('Ingresa el contenido de agua del estándar (mg/g): un número mayor que 0.');
      if (cont > 1000) return mostrarError('El contenido de agua no puede superar 1000 mg/g.');
      fraccion = cont / 1000; nombrePatron = 'estándar líquido';
    }

    const factores = [], detalle = [];
    for (let i = 1; i <= 3; i++) {
      const m = leer('rep-m-' + i), v = leer('rep-v-' + i);
      if (m === null && v === null) continue;
      if (m === null || v === null) return mostrarError('Réplica ' + i + ': completa la masa y el volumen, o deja los dos vacíos.');
      if (!isFinite(m)) return mostrarError('Réplica ' + i + ': la masa no es un número válido.');
      if (!isFinite(v)) return mostrarError('Réplica ' + i + ': el volumen no es un número válido.');
      if (m <= 0 || v <= 0) return mostrarError('Réplica ' + i + ': la masa y el volumen deben ser mayores que 0.');
      const agua = m * fraccion;
      const f = agua / v;
      factores.push(f);
      detalle.push('Réplica ' + i + ': ' + F(agua, 4) + ' mg de agua / ' + E(v) + ' mL = ' + F(f, 5) + ' mg/mL');
    }
    if (!factores.length) return mostrarError('Completa al menos una réplica (masa del patrón y volumen gastado).');

    const st = estadistica(factores);
    const avisos = [];
    if (st.n === 1) avisos.push('Con una sola réplica no se puede evaluar la repetibilidad. Se recomienda determinar el factor por duplicado o triplicado.');
    if (st.cv !== null && st.cv > 1) avisos.push('El CV entre réplicas supera el 1 %. Revisa la inyección del patrón, la deriva y la estabilidad del punto final antes de usar el factor (el criterio de aceptación lo fija el procedimiento del laboratorio; muchos piden 0,5 % o menos).');
    if (st.media < 0.5 || st.media > 10) avisos.push('El factor queda lejos de los reactivos habituales (≈ 1, 2 o 5 mg/mL). Revisa las unidades: la masa del patrón va en mg.');

    const formula = patron === 'agua'
      ? 'F = m(agua) / V'
      : patron === 'tartrato'
        ? 'F = m(tartrato) × 0,1566 / V   (0,1566 = 2 × 18,015 / 230,08)'
        : 'F = m(estándar) × contenido / 1000 / V';
    const minis = [['Réplicas', String(st.n)]];
    if (st.s !== null) { minis.push(['Desvío estándar', F(st.s, 3) + ' mg/mL']); minis.push(['CV', F(st.cv, 3) + ' %']); }
    mostrar('Factor del reactivo (' + nombrePatron + ')' + (st.n > 1 ? ', media de ' + st.n + ' réplicas' : ''),
      'F = ' + F(st.media, 5) + ' mg/mL', formula, minis, avisos, st.n > 1 ? detalle : null);
  }

  /* ── 2. Volumétrico ─────────────────────────────────────── */
  function calcularVolumetrico() {
    const f = leer('vol-factor'), v = leer('vol-v'), vb = opcional('vol-blanco'), m = leer('vol-masa');
    if (!ok(f) || f <= 0) return mostrarError('Ingresa el factor del reactivo (mg/mL): un número mayor que 0.');
    if (!ok(v) || v <= 0) return mostrarError('Ingresa el volumen de reactivo gastado (mL): un número mayor que 0.');
    if (!isFinite(vb) || vb < 0) return mostrarError('El blanco no es un número válido: déjalo vacío o ingresa un volumen mayor o igual a 0.');
    if (vb >= v) return mostrarError('El volumen del blanco debe ser menor que el gastado con la muestra.');
    if (!ok(m) || m <= 0) return mostrarError('Ingresa la masa de muestra (g): un número mayor que 0.');

    const agua = (v - vb) * f;              // mg
    const pct  = agua / (10 * m);
    const ppm  = agua / m * 1000;           // mg/kg
    const avisos = [];
    if (pct > 100) avisos.push('El resultado supera el 100 %: revisa las unidades (masa en g, factor en mg/mL).');
    if (v - vb < 0.5) avisos.push('Se gastaron menos de 0,5 mL: el error de la bureta pesa mucho. Si es posible, aumenta la masa de muestra.');
    const vTxt = vb ? '(' + E(v) + ' − ' + E(vb) + ') mL' : E(v) + ' mL';
    mostrar('Agua en la muestra (KF volumétrico)', F(pct, 4) + ' %',
      '% H₂O = ' + vTxt + ' × ' + E(f) + ' mg/mL / (10 × ' + E(m) + ' g)',
      [['Agua titulada', F(agua, 4) + ' mg'], ['Contenido', F(ppm, 4) + ' mg/kg (ppm)']], avisos);
  }

  /* ── 3. Coulométrico ────────────────────────────────────── */
  function calcularCoulometrico() {
    const ug = leer('cou-ug'), b = opcional('cou-blanco'), m = leer('cou-masa');
    if (!ok(ug) || ug <= 0) return mostrarError('Ingresa los µg de agua que informa el equipo: un número mayor que 0.');
    if (!isFinite(b) || b < 0) return mostrarError('El blanco no es un número válido: déjalo vacío o ingresa un valor mayor o igual a 0.');
    if (b >= ug) return mostrarError('El blanco debe ser menor que el agua medida en la muestra.');
    if (!ok(m) || m <= 0) return mostrarError('Ingresa la masa de muestra (g): un número mayor que 0.');

    const neto = ug - b;
    const ppm = neto / m;                    // µg/g = mg/kg
    const pct = ppm / 1e4;
    const avisos = [];
    if (pct > 100) avisos.push('El resultado supera el 100 %: revisa las unidades (masa de muestra en g, agua en µg).');
    if (neto < 10) avisos.push('Menos de 10 µg de agua neta: el resultado es muy sensible a la deriva. Si es posible, aumenta la masa de muestra.');
    if (neto > 10000) avisos.push('Más de 10 mg de agua: el método coulométrico es para trazas; para contenidos altos conviene el volumétrico.');
    const ugTxt = b ? '(' + E(ug) + ' − ' + E(b) + ') µg' : E(ug) + ' µg';
    mostrar('Agua en la muestra (KF coulométrico)', F(pct, 4) + ' %',
      '% H₂O = ' + ugTxt + ' / (' + E(m) + ' g × 10⁴)',
      [['Agua neta', F(neto, 4) + ' µg'], ['Contenido', F(ppm, 4) + ' mg/kg (ppm)']], avisos);
  }

  selModo.addEventListener('change', mostrarModo);
  selPatron.addEventListener('change', mostrarModo);
  document.querySelectorAll('.calculadora input').forEach(function (el) { el.addEventListener('input', limpiar); });
  $('btn-calcular').addEventListener('click', function () {
    if (selModo.value === 'factor') calcularFactor();
    else if (selModo.value === 'volumetrico') calcularVolumetrico();
    else calcularCoulometrico();
  });
  mostrarModo();
});
