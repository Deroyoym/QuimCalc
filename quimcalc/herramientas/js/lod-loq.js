/* ============================================================
   CALCULADORA DE LOD Y LOQ
   Archivo: herramientas/js/lod-loq.js

   Métodos implementados:
     Método 1 — Basado en el blanco (ISO 11843 / IUPAC):
       LOD = x̄_blanco + 3 × s_blanco
       LOQ = x̄_blanco + 10 × s_blanco

     Método 2 — Basado en la curva de calibración (ICH Q2):
       LOD = 3.3 × Se / m
       LOQ = 10 × Se / m
       (donde Se = error estándar de la regresión, m = pendiente)

     Método 3 — Relación señal/ruido (S/N):
       LOD: S/N = 3  → LOD = 3 × ruido / m
       LOQ: S/N = 10 → LOQ = 10 × ruido / m
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* Idioma de la página: la misma lógica sirve para /herramientas/ (es) y /en/tools/ (en) */
  const EN = (document.documentElement.lang || '').slice(0, 2) === 'en';
  const T = EN ? {
    resultado: 'Result',
    errBlancoVacio: 'Enter the blank readings, one per line or separated by spaces or semicolons.',
    errBlancoPocas: n => `You need at least 5 blank readings (you entered ${n}). 10 or more are recommended for reliability.`,
    nLecturas: n => `n = ${n} blank readings`,
    media: 'Blank mean (x̄)',
    desv: 'Standard deviation (s)',
    metBlanco: 'Method: blank-based (ISO 11843 / IUPAC)',
    errSe: 'Enter the standard error of the regression (Se > 0).',
    errM: 'Enter the slope of the calibration curve (m > 0).',
    se: 'Se (standard error of the regression)',
    m: 'm (slope)',
    metCurva: 'Method: calibration curve (ICH Q2)',
    errRuido: 'Enter the baseline noise amplitude (> 0).',
    errMsn: 'Enter the slope of the calibration curve (> 0).',
    ruido: 'Baseline noise (h)',
    pend: 'Calibration slope (m)',
    ruidoF: 'noise',
    metSN: 'Method: signal-to-noise ratio (S/N)'
  } : {
    resultado: 'Resultado',
    errBlancoVacio: 'Ingresá las lecturas del blanco, una por línea o separadas por punto y coma.',
    errBlancoPocas: n => `Necesitás al menos 5 lecturas del blanco (ingresaste ${n}). Para mayor confiabilidad se recomiendan 10 o más.`,
    nLecturas: n => `n = ${n} lecturas del blanco`,
    media: 'Media del blanco (x̄)',
    desv: 'Desviación estándar (s)',
    metBlanco: 'Método: Basado en el blanco (ISO 11843 / IUPAC)',
    errSe: 'Ingresá el error estándar de la regresión (Se > 0).',
    errM: 'Ingresá la pendiente de la curva (m > 0).',
    se: 'Se (error estándar de la regresión)',
    m: 'm (pendiente)',
    metCurva: 'Método: Curva de calibración (ICH Q2 / ICH Q2R1)',
    errRuido: 'Ingresá la amplitud del ruido de la línea base (> 0).',
    errMsn: 'Ingresá la pendiente de la curva de calibración (> 0).',
    ruido: 'Ruido de la línea base (h)',
    pend: 'Pendiente de la curva (m)',
    ruidoF: 'ruido',
    metSN: 'Método: Relación señal/ruido (S/N)'
  };

  /* Coma decimal para todo texto visible (solo en español) */
  function conComa(s) { return EN ? String(s) : String(s).replace(/(\d)\.(\d)/g, '$1,$2'); }

  /*
   * Lee una lista de números escrita por el usuario. Separadores: espacio, «;» o
   * salto de línea. Decimales: coma o punto. Si el texto ya usa punto decimal, la
   * coma se toma como separador (formato «5.42, 5.38»); si no, «5,42» es un decimal.
   * Un fragmento con dos o más comas («1,2,3») se separa por comas.
   */
  function leerNumeros(texto) {
    var hayPunto = EN || /\d\.\d/.test(texto);   /* en inglés la coma siempre separa */
    var out = [];
    texto.split(/[\s;]+/).forEach(function (tok) {
      if (!tok) return;
      var comas = (tok.match(/,/g) || []).length;
      var partes = (hayPunto || comas >= 2) ? tok.split(',') : [tok.replace(',', '.')];
      partes.forEach(function (p) { var n = parseFloat(p); if (!isNaN(n)) out.push(n); });
    });
    return out;
  }

  /* ── Referencias ────────────────────────────────────────── */
  const selectMetodo    = document.getElementById('metodo');
  const panelBlanco     = document.getElementById('panel-blanco');
  const panelCurva      = document.getElementById('panel-curva');
  const panelSN         = document.getElementById('panel-sn');
  const botonCalcular   = document.getElementById('btn-calcular');
  const bloqueResultado = document.getElementById('resultado');
  const valorLOD        = document.getElementById('valor-lod');
  const valorLOQ        = document.getElementById('valor-loq');
  const detalleCalculo  = document.getElementById('detalle-calculo');
  const contenedorOps   = document.getElementById('contenedor-opciones');

  /* ── Cambio de método ───────────────────────────────────── */
  selectMetodo.addEventListener('change', function () {
    panelBlanco.hidden = true;
    panelCurva.hidden  = true;
    panelSN.hidden     = true;

    if (selectMetodo.value === 'blanco')  panelBlanco.hidden = false;
    if (selectMetodo.value === 'curva')   panelCurva.hidden  = false;
    if (selectMetodo.value === 'sn')      panelSN.hidden     = false;

    bloqueResultado.classList.remove('visible');
  });

  /* ── CÁLCULO PRINCIPAL ──────────────────────────────────── */
  botonCalcular.addEventListener('click', function () {

    const metodo = selectMetodo.value;
    const unidad = document.getElementById('unidad-resultado').value;

    /* ── MÉTODO 1: Basado en el blanco ───────────────────────
       El usuario ingresa las lecturas del blanco (sin analito).
       Calculamos media y desviación estándar del blanco.
       ──────────────────────────────────────────────────────── */
    if (metodo === 'blanco') {

      const textoLecturas = document.getElementById('lecturas-blanco').value.trim();
      if (!textoLecturas) {
        mostrarError(T.errBlancoVacio);
        return;
      }

      /* Parseamos los valores: aceptamos comas, punto y coma, o nueva línea como separadores */
      const lecturas = leerNumeros(textoLecturas);

      if (lecturas.length < 5) {
        mostrarError(T.errBlancoPocas(lecturas.length));
        return;
      }

      const n    = lecturas.length;
      const media = lecturas.reduce((a, b) => a + b, 0) / n;
      const varianza = lecturas.reduce((acc, v) => acc + Math.pow(v - media, 2), 0) / (n - 1);
      const s    = Math.sqrt(varianza);

      const LOD  = media + 3 * s;
      const LOQ  = media + 10 * s;

      const detalle = [
        T.nLecturas(n),
        `${T.media}: ${media.toFixed(6)}`,
        `${T.desv}: ${s.toFixed(6)}`,
        ``,
        `LOD = x̄ + 3×s = ${media.toFixed(6)} + 3×${s.toFixed(6)} = ${LOD.toFixed(6)} ${unidad}`,
        `LOQ = x̄ + 10×s = ${media.toFixed(6)} + 10×${s.toFixed(6)} = ${LOQ.toFixed(6)} ${unidad}`,
      ].join('\n');

      mostrarResultado(LOD, LOQ, unidad, detalle, T.metBlanco);
    }

    /* ── MÉTODO 2: Basado en la curva de calibración (ICH Q2) ─
       El usuario ingresa la pendiente y el error estándar
       de la regresión (obtenibles desde la calculadora de curva).
       ──────────────────────────────────────────────────────── */
    else if (metodo === 'curva') {

      const Se = parseFloat(document.getElementById('se-regresion').value);
      const m  = parseFloat(document.getElementById('pendiente').value);

      if (isNaN(Se) || Se <= 0) { mostrarError(T.errSe); return; }
      if (isNaN(m)  || m  <= 0) { mostrarError(T.errM); return; }

      const LOD = (3.3 * Se) / m;
      const LOQ = (10  * Se) / m;

      const detalle = [
        `${T.se}: ${Se}`,
        `${T.m}: ${m}`,
        ``,
        `LOD = 3.3 × Se / m = 3.3 × ${Se} / ${m} = ${LOD.toFixed(6)} ${unidad}`,
        `LOQ = 10 × Se / m = 10 × ${Se} / ${m} = ${LOQ.toFixed(6)} ${unidad}`,
      ].join('\n');

      mostrarResultado(LOD, LOQ, unidad, detalle, T.metCurva);
    }

    /* ── MÉTODO 3: Relación señal/ruido (S/N) ────────────────
       El usuario ingresa la amplitud del ruido de la línea base
       y la pendiente de la curva.
       LOD: concentración que da S/N = 3
       LOQ: concentración que da S/N = 10
       ──────────────────────────────────────────────────────── */
    else if (metodo === 'sn') {

      const ruido = parseFloat(document.getElementById('ruido').value);
      const m     = parseFloat(document.getElementById('pendiente-sn').value);

      if (isNaN(ruido) || ruido <= 0) { mostrarError(T.errRuido); return; }
      if (isNaN(m)     || m     <= 0) { mostrarError(T.errMsn); return; }

      const LOD = (3  * ruido) / m;
      const LOQ = (10 * ruido) / m;

      const detalle = [
        `${T.ruido}: ${ruido}`,
        `${T.pend}: ${m}`,
        ``,
        `LOD (S/N = 3): C = 3 × ${T.ruidoF} / m = 3 × ${ruido} / ${m} = ${LOD.toFixed(6)} ${unidad}`,
        `LOQ (S/N = 10): C = 10 × ${T.ruidoF} / m = 10 × ${ruido} / ${m} = ${LOQ.toFixed(6)} ${unidad}`,
      ].join('\n');

      mostrarResultado(LOD, LOQ, unidad, detalle, T.metSN);
    }
  });

  /* ── Funciones de UI ────────────────────────────────────── */
  function mostrarResultado(LOD, LOQ, unidad, detalle, metodoTexto) {
    bloqueResultado.classList.remove('resultado--error');
    document.getElementById('resultado-etiqueta').textContent = T.resultado;

    valorLOD.textContent = conComa(`${LOD.toFixed(6)} ${unidad}`);
    valorLOQ.textContent = conComa(`${LOQ.toFixed(6)} ${unidad}`);

    detalleCalculo.textContent = conComa(`${metodoTexto}\n\n${detalle}`);

    bloqueResultado.classList.add('visible');
    bloqueResultado.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function mostrarError(mensaje) {
    bloqueResultado.classList.add('resultado--error');
    document.getElementById('resultado-etiqueta').textContent = 'Error';
    valorLOD.textContent = mensaje;
    valorLOQ.textContent = '';
    detalleCalculo.textContent = '';
    bloqueResultado.classList.add('visible');
  }

  document.querySelectorAll('input, select, textarea').forEach(function (el) {
    el.addEventListener('input', function () {
      bloqueResultado.classList.remove('visible');
    });
  });

});
