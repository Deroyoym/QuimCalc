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
        mostrarError('Ingresá las lecturas del blanco separadas por comas o saltos de línea.');
        return;
      }

      /* Parseamos los valores: aceptamos comas, punto y coma, o nueva línea como separadores */
      const lecturas = textoLecturas
        .split(/[\n,;]+/)
        .map(v => parseFloat(v.trim()))
        .filter(v => !isNaN(v));

      if (lecturas.length < 5) {
        mostrarError(`Necesitás al menos 5 lecturas del blanco (ingresaste ${lecturas.length}). Para mayor confiabilidad se recomiendan 10 o más.`);
        return;
      }

      const n    = lecturas.length;
      const media = lecturas.reduce((a, b) => a + b, 0) / n;
      const varianza = lecturas.reduce((acc, v) => acc + Math.pow(v - media, 2), 0) / (n - 1);
      const s    = Math.sqrt(varianza);

      const LOD  = media + 3 * s;
      const LOQ  = media + 10 * s;

      const detalle = [
        `n = ${n} lecturas del blanco`,
        `Media del blanco (x̄): ${media.toFixed(6)}`,
        `Desviación estándar (s): ${s.toFixed(6)}`,
        ``,
        `LOD = x̄ + 3×s = ${media.toFixed(6)} + 3×${s.toFixed(6)} = ${LOD.toFixed(6)} ${unidad}`,
        `LOQ = x̄ + 10×s = ${media.toFixed(6)} + 10×${s.toFixed(6)} = ${LOQ.toFixed(6)} ${unidad}`,
      ].join('\n');

      mostrarResultado(LOD, LOQ, unidad, detalle, `Método: Basado en el blanco (ISO 11843 / IUPAC)`);
    }

    /* ── MÉTODO 2: Basado en la curva de calibración (ICH Q2) ─
       El usuario ingresa la pendiente y el error estándar
       de la regresión (obtenibles desde la calculadora de curva).
       ──────────────────────────────────────────────────────── */
    else if (metodo === 'curva') {

      const Se = parseFloat(document.getElementById('se-regresion').value);
      const m  = parseFloat(document.getElementById('pendiente').value);

      if (isNaN(Se) || Se <= 0) { mostrarError('Ingresá el error estándar de la regresión (Se > 0).'); return; }
      if (isNaN(m)  || m  <= 0) { mostrarError('Ingresá la pendiente de la curva (m > 0).'); return; }

      const LOD = (3.3 * Se) / m;
      const LOQ = (10  * Se) / m;

      const detalle = [
        `Se (error estándar de la regresión): ${Se}`,
        `m (pendiente): ${m}`,
        ``,
        `LOD = 3.3 × Se / m = 3.3 × ${Se} / ${m} = ${LOD.toFixed(6)} ${unidad}`,
        `LOQ = 10 × Se / m = 10 × ${Se} / ${m} = ${LOQ.toFixed(6)} ${unidad}`,
      ].join('\n');

      mostrarResultado(LOD, LOQ, unidad, detalle, `Método: Curva de calibración (ICH Q2 / ICH Q2R1)`);
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

      if (isNaN(ruido) || ruido <= 0) { mostrarError('Ingresá la amplitud del ruido de la línea base (> 0).'); return; }
      if (isNaN(m)     || m     <= 0) { mostrarError('Ingresá la pendiente de la curva de calibración (> 0).'); return; }

      const LOD = (3  * ruido) / m;
      const LOQ = (10 * ruido) / m;

      const detalle = [
        `Ruido de la línea base (h): ${ruido}`,
        `Pendiente de la curva (m): ${m}`,
        ``,
        `LOD (S/N = 3): C = 3 × ruido / m = 3 × ${ruido} / ${m} = ${LOD.toFixed(6)} ${unidad}`,
        `LOQ (S/N = 10): C = 10 × ruido / m = 10 × ${ruido} / ${m} = ${LOQ.toFixed(6)} ${unidad}`,
      ].join('\n');

      mostrarResultado(LOD, LOQ, unidad, detalle, `Método: Relación señal/ruido (S/N)`);
    }
  });

  /* ── Funciones de UI ────────────────────────────────────── */
  function mostrarResultado(LOD, LOQ, unidad, detalle, metodoTexto) {
    bloqueResultado.classList.remove('resultado--error');

    valorLOD.textContent = `${LOD.toFixed(6)} ${unidad}`;
    valorLOQ.textContent = `${LOQ.toFixed(6)} ${unidad}`;

    detalleCalculo.textContent = `${metodoTexto}\n\n${detalle}`;

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
