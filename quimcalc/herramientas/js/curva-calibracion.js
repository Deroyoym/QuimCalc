/* ============================================================
   GENERADOR DE CURVA DE CALIBRACIÓN
   Archivo: herramientas/js/curva-calibracion.js

   Funcionalidades:
     - El usuario ingresa pares concentración / señal (absorbancia, etc.)
     - Calcula regresión lineal: y = mx + b
     - Calcula coeficiente de correlación R y R²
     - Dibuja la curva en un <canvas>
     - Calcula concentración para una señal desconocida: x = (y - b) / m
     - Exporta los resultados como texto para informes
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* Idioma de la página: la misma lógica sirve para /herramientas/ (es) y /en/tools/ (en) */
  const EN = (document.documentElement.lang || '').slice(0, 2) === 'en';
  const T = EN ? {
    errValores: 'Enter valid numbers in both fields.',
    sinPuntos: 'No points entered yet',
    eliminar: n => `Delete point ${n}`,
    errMinPuntos: 'You need at least 3 points to calculate the curve.',
    errInterpPuntos: 'Enter at least 3 points and calculate the curve first.',
    errSenal: 'Enter a numeric signal value.',
    errPendiente: 'The slope is practically zero. The curve cannot be used to interpolate.',
    extrapolacion: ' ⚠️ Value outside the calibration range (extrapolation)',
    errExportar: 'Calculate the curve first.',
    ejeX: 'Concentration',
    ejeY: 'Signal',
    locale: 'en-US',
    expTitulo: 'CALIBRATION CURVE — QuimCalc',
    expFecha: 'Date',
    expEjeX: 'X axis',
    expEjeY: 'Y axis',
    expDatos: 'EXPERIMENTAL DATA',
    expCabecera: 'No.\tConcentration\tSignal',
    expRegresion: 'LINEAR REGRESSION RESULTS',
    expEcuacion: 'Equation',
    expPendiente: 'Slope (m)',
    expOrdenada: 'Intercept (b)',
    expR: 'Correlation coefficient (R)',
    expR2: 'Coefficient of determination (R²)',
    expSe: 'Standard error of the regression (Se = s_y/x)',
    expLod: 'Estimated LOD (3.3·Se/m)',
    expLoq: 'Estimated LOQ (10·Se/m)',
    expN: 'Number of points (n)',
    expResiduales: 'RESIDUALS (y − ŷ)',
    copiado: '✓ Copied to clipboard',
    exportar: 'Export for report',
    copiaManual: 'Copy the text (Ctrl+A, Ctrl+C):'
  } : {
    errValores: 'Ingresá valores numéricos válidos en ambos campos.',
    sinPuntos: 'Todavía no hay puntos ingresados',
    eliminar: n => `Eliminar punto ${n}`,
    errMinPuntos: 'Necesitás al menos 3 puntos para calcular la curva.',
    errInterpPuntos: 'Primero ingresá al menos 3 puntos y calculá la curva.',
    errSenal: 'Ingresá un valor numérico de señal.',
    errPendiente: 'La pendiente es prácticamente cero. La curva no permite interpolar.',
    extrapolacion: ' ⚠️ Valor fuera del rango de la curva (extrapolación)',
    errExportar: 'Primero calculá la curva.',
    ejeX: 'Concentración',
    ejeY: 'Señal',
    locale: 'es',
    expTitulo: 'CURVA DE CALIBRACIÓN — QuimCalc',
    expFecha: 'Fecha',
    expEjeX: 'Eje X',
    expEjeY: 'Eje Y',
    expDatos: 'DATOS EXPERIMENTALES',
    expCabecera: 'N°\tConcentración\tSeñal',
    expRegresion: 'RESULTADOS DE REGRESIÓN LINEAL',
    expEcuacion: 'Ecuación',
    expPendiente: 'Pendiente (m)',
    expOrdenada: 'Ordenada al origen (b)',
    expR: 'Coeficiente de correlación (R)',
    expR2: 'Coeficiente de determinación (R²)',
    expSe: 'Error estándar de la regresión (Se)',
    expLod: 'LOD estimado (3,3·Se/m)',
    expLoq: 'LOQ estimado (10·Se/m)',
    expN: 'Número de puntos (n)',
    expResiduales: 'RESIDUALES (y − ŷ)',
    copiado: '✓ Copiado al portapapeles',
    exportar: 'Exportar para informe',
    copiaManual: 'Copiá el texto (Ctrl+A, Ctrl+C):'
  };

  /* Coma decimal para todo texto visible (solo en español) */
  function conComa(s) { return EN ? String(s) : String(s).replace(/(\d)\.(\d)/g, '$1,$2'); }

  /* Ecuación de la recta con el signo de b bien escrito: «y = 0.1008x − 0.0006» */
  function ecuacion(reg, dec) {
    const signo = reg.b < 0 ? '−' : '+';
    return `y = ${reg.m.toFixed(dec)}x ${signo} ${Math.abs(reg.b).toFixed(dec)}`;
  }

  /* ── Estado global: lista de puntos ingresados ──────────── */
  let puntos = []; /* Array de objetos { x: concentracion, y: senal } */

  /* ── Referencias ────────────────────────────────────────── */
  const inputX        = document.getElementById('input-x');
  const inputY        = document.getElementById('input-y');
  const btnAgregar    = document.getElementById('btn-agregar');
  const btnLimpiar    = document.getElementById('btn-limpiar');
  const tablaCuerpo   = document.getElementById('tabla-puntos');
  const btnCalcular   = document.getElementById('btn-calcular');
  const canvas        = document.getElementById('grafico');
  const ctx           = canvas.getContext('2d');
  const bloqueRes     = document.getElementById('resultado');
  const resEcuacion   = document.getElementById('res-ecuacion');
  const resR2         = document.getElementById('res-r2');
  const resR          = document.getElementById('res-r');
  const resSe         = document.getElementById('res-se');
  const resLod        = document.getElementById('res-lod');
  const resLoq        = document.getElementById('res-loq');
  const tablaResid    = document.getElementById('tabla-residuales');
  const inputSenal    = document.getElementById('senal-desconocida');
  const btnInterp     = document.getElementById('btn-interpolar');
  const resInterp     = document.getElementById('resultado-interpolacion');
  const btnExportar   = document.getElementById('btn-exportar');
  const labelEjeX     = document.getElementById('label-eje-x');
  const labelEjeY     = document.getElementById('label-eje-y');

  /* ── Agregar punto con Enter o botón ────────────────────── */
  [inputX, inputY].forEach(function (el) {
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') agregarPunto();
    });
  });

  btnAgregar.addEventListener('click', agregarPunto);

  function agregarPunto() {
    const x = parseFloat(inputX.value);
    const y = parseFloat(inputY.value);

    if (isNaN(x) || isNaN(y)) {
      alert(T.errValores);
      return;
    }

    puntos.push({ x, y });
    actualizarTabla();

    /* Limpiamos inputs y ponemos el foco en X para el siguiente par */
    inputX.value = '';
    inputY.value = '';
    inputX.focus();

    /* Si hay al menos 3 puntos, calculamos automáticamente */
    if (puntos.length >= 3) calcular();
  }

  /* ── Actualizar tabla de puntos ingresados ──────────────── */
  function actualizarTabla() {
    tablaCuerpo.innerHTML = '';

    if (puntos.length === 0) {
      tablaCuerpo.innerHTML = `
        <tr>
          <td colspan="3" style="text-align:center; color:var(--color-texto-suave); font-style:italic;">
            ${T.sinPuntos}
          </td>
        </tr>`;
      return;
    }

    puntos.forEach(function (p, i) {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${i + 1}</td>
        <td>${conComa(p.x)}</td>
        <td>${conComa(p.y)}</td>
        <td>
          <button
            class="btn-eliminar-punto"
            data-index="${i}"
            aria-label="${T.eliminar(i + 1)}"
            style="background:none;border:none;cursor:pointer;color:var(--color-error);font-size:1rem;padding:4px;"
          >✕</button>
        </td>`;
      tablaCuerpo.appendChild(tr);
    });

    /* Botones de eliminar punto individual */
    document.querySelectorAll('.btn-eliminar-punto').forEach(function (btn) {
      btn.addEventListener('click', function () {
        puntos.splice(parseInt(btn.dataset.index), 1);
        actualizarTabla();
        if (puntos.length >= 3) calcular();
        else limpiarGrafico();
      });
    });
  }

  /* ── Limpiar todo ───────────────────────────────────────── */
  btnLimpiar.addEventListener('click', function () {
    puntos = [];
    actualizarTabla();
    limpiarGrafico();
    bloqueRes.classList.remove('visible');
    resInterp.classList.remove('visible');
  });

  /* ── REGRESIÓN LINEAL ────────────────────────────────────
     Dado un array de puntos {x, y}, calcula:
       - pendiente m
       - ordenada al origen b
       - coeficiente de correlación R
       - error estándar de la regresión Se
     ──────────────────────────────────────────────────────── */
  function regresionLineal(pts) {
    const n  = pts.length;
    const sx = pts.reduce((acc, p) => acc + p.x, 0);
    const sy = pts.reduce((acc, p) => acc + p.y, 0);
    const sx2 = pts.reduce((acc, p) => acc + p.x * p.x, 0);
    const sy2 = pts.reduce((acc, p) => acc + p.y * p.y, 0);
    const sxy = pts.reduce((acc, p) => acc + p.x * p.y, 0);

    const m = (n * sxy - sx * sy) / (n * sx2 - sx * sx);
    const b = (sy - m * sx) / n;

    /* Coeficiente de Pearson R */
    const numeradorR   = n * sxy - sx * sy;
    const denominadorR = Math.sqrt((n * sx2 - sx * sx) * (n * sy2 - sy * sy));
    const R = denominadorR === 0 ? 0 : numeradorR / denominadorR;

    /* Error estándar de la regresión (desviación residual) */
    const ssRes = pts.reduce((acc, p) => {
      const yPred = m * p.x + b;
      return acc + Math.pow(p.y - yPred, 2);
    }, 0);
    const Se = n > 2 ? Math.sqrt(ssRes / (n - 2)) : 0;

    /* LOD y LOQ estimados desde la curva (criterio ICH Q2):
       LOD = 3,3·Se/m   LOQ = 10·Se/m */
    const pend = Math.abs(m);
    const LOD = pend > 0 ? 3.3 * Se / pend : NaN;
    const LOQ = pend > 0 ? 10  * Se / pend : NaN;

    return { m, b, R, R2: R * R, Se, LOD, LOQ };
  }

  /* Cifras significativas legibles para valores chicos (solo para mostrar/exportar: devuelve coma decimal) */
  function sig(n, cifras) {
    if (!isFinite(n)) return '—';
    if (n === 0) return '0';
    return conComa(parseFloat(n.toPrecision(cifras || 4)));
  }

  /* Tabla de residuales: y − ŷ por punto. Se marca el punto si el
     residual supera 2·Se (posible anómalo o falta de linealidad). */
  function mostrarResiduales(reg) {
    tablaResid.innerHTML = puntos.map(function (p, i) {
      const yCalc = reg.m * p.x + reg.b;
      const res   = p.y - yCalc;
      const alto  = reg.Se > 0 && Math.abs(res) > 2 * reg.Se;
      return '<tr' + (alto ? ' class="residual-alto"' : '') + '>' +
        '<td>' + (i + 1) + '</td>' +
        '<td>' + conComa(p.x) + '</td>' +
        '<td>' + conComa(p.y) + '</td>' +
        '<td>' + sig(yCalc, 5) + '</td>' +
        '<td>' + (res >= 0 ? '+' : '') + sig(res, 3) + (alto ? ' ⚠' : '') + '</td>' +
        '</tr>';
    }).join('');
  }

  /* ── Calcular y mostrar resultados ──────────────────────── */
  btnCalcular.addEventListener('click', calcular);

  function calcular() {
    if (puntos.length < 3) {
      alert(T.errMinPuntos);
      return;
    }

    const reg = regresionLineal(puntos);

    /* Mostramos los resultados numéricos */
    resEcuacion.textContent = conComa(ecuacion(reg, 6));
    resR2.textContent       = conComa(reg.R2.toFixed(6));
    resR.textContent        = conComa(reg.R.toFixed(6));
    resSe.textContent       = conComa(reg.Se.toFixed(6));
    resLod.textContent      = sig(reg.LOD);
    resLoq.textContent      = sig(reg.LOQ);
    mostrarResiduales(reg);

    /* Color del R² según calidad del ajuste */
    const r2El = document.getElementById('bloque-r2');
    if (reg.R2 >= 0.999)      r2El.style.borderLeftColor = '#059669'; /* verde — excelente */
    else if (reg.R2 >= 0.995) r2El.style.borderLeftColor = '#D97706'; /* naranja — aceptable */
    else                       r2El.style.borderLeftColor = '#DC2626'; /* rojo — revisar */

    bloqueRes.classList.add('visible');

    /* Dibujamos el gráfico */
    dibujarGrafico(reg);
  }

  /* ── DIBUJAR GRÁFICO EN CANVAS ───────────────────────────
     Dibujamos:
       1. Ejes y grilla
       2. Puntos experimentales (círculos)
       3. Recta de regresión
       4. Ecuación sobre el gráfico
     ──────────────────────────────────────────────────────── */
  function dibujarGrafico(reg) {
    const W = canvas.width;
    const H = canvas.height;

    /* Márgenes para los ejes */
    const ML = 70, MR = 30, MT = 40, MB = 60;
    const gW = W - ML - MR; /* ancho útil del gráfico */
    const gH = H - MT - MB; /* alto útil del gráfico */

    ctx.clearRect(0, 0, W, H);

    /* Rango de datos con padding del 10% */
    const xs = puntos.map(p => p.x);
    const ys = puntos.map(p => p.y);
    const xMin = Math.min(...xs);
    const xMax = Math.max(...xs);
    const yMin = Math.min(...ys);
    const yMax = Math.max(...ys);
    const xPad = (xMax - xMin) * 0.12 || xMax * 0.12 || 1;
    const yPad = (yMax - yMin) * 0.12 || yMax * 0.12 || 1;
    const xLo = xMin - xPad, xHi = xMax + xPad;
    const yLo = Math.max(0, yMin - yPad), yHi = yMax + yPad;

    /* Funciones de transformación coordenadas → pixels */
    const px = x => ML + ((x - xLo) / (xHi - xLo)) * gW;
    const py = y => MT + gH - ((y - yLo) / (yHi - yLo)) * gH;

    /* ── Fondo ── */
    ctx.fillStyle = '#FAFAFA';
    ctx.fillRect(ML, MT, gW, gH);

    /* ── Grilla ── */
    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 1;
    const numLineas = 5;

    for (let i = 0; i <= numLineas; i++) {
      /* Líneas horizontales */
      const yVal = yLo + (i / numLineas) * (yHi - yLo);
      const yPix = py(yVal);
      ctx.beginPath();
      ctx.moveTo(ML, yPix);
      ctx.lineTo(ML + gW, yPix);
      ctx.stroke();

      /* Etiqueta eje Y */
      ctx.fillStyle = '#6B7280';
      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(conComa(yVal.toPrecision(3)), ML - 8, yPix + 4);

      /* Líneas verticales */
      const xVal = xLo + (i / numLineas) * (xHi - xLo);
      const xPix = px(xVal);
      ctx.beginPath();
      ctx.moveTo(xPix, MT);
      ctx.lineTo(xPix, MT + gH);
      ctx.stroke();

      /* Etiqueta eje X */
      ctx.textAlign = 'center';
      ctx.fillText(conComa(xVal.toPrecision(3)), xPix, MT + gH + 18);
    }

    /* ── Ejes principales ── */
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(ML, MT);
    ctx.lineTo(ML, MT + gH);
    ctx.lineTo(ML + gW, MT + gH);
    ctx.stroke();

    /* ── Etiquetas de ejes ── */
    const etX = labelEjeX.value || T.ejeX;
    const etY = labelEjeY.value || T.ejeY;

    ctx.fillStyle = '#374151';
    ctx.font = 'bold 12px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(etX, ML + gW / 2, H - 10);

    /* Eje Y rotado */
    ctx.save();
    ctx.translate(16, MT + gH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(etY, 0, 0);
    ctx.restore();

    /* ── Recta de regresión ── */
    ctx.strokeStyle = '#2563EB';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(px(xLo), py(reg.m * xLo + reg.b));
    ctx.lineTo(px(xHi), py(reg.m * xHi + reg.b));
    ctx.stroke();

    /* ── Puntos experimentales ── */
    puntos.forEach(function (p) {
      ctx.beginPath();
      ctx.arc(px(p.x), py(p.y), 5, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.strokeStyle = '#1D4ED8';
      ctx.lineWidth = 2.5;
      ctx.stroke();
    });

    /* ── Ecuación sobre el gráfico ── */
    const ecuacionTxt = `${ecuacion(reg, 4)}   R² = ${reg.R2.toFixed(5)}`;
    ctx.fillStyle = '#1E40AF';
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(conComa(ecuacionTxt), ML + 10, MT + 18);
  }

  function limpiarGrafico() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  /* ── INTERPOLACIÓN: señal desconocida → concentración ───── */
  btnInterp.addEventListener('click', function () {
    if (puntos.length < 3) {
      alert(T.errInterpPuntos);
      return;
    }

    const senal = parseFloat(inputSenal.value);
    if (isNaN(senal)) {
      alert(T.errSenal);
      return;
    }

    const reg = regresionLineal(puntos);

    if (Math.abs(reg.m) < 1e-10) {
      alert(T.errPendiente);
      return;
    }

    /* x = (y - b) / m */
    const concentracion = (senal - reg.b) / reg.m;

    /* Advertencia si la concentración está fuera del rango de la curva */
    const xMin = Math.min(...puntos.map(p => p.x));
    const xMax = Math.max(...puntos.map(p => p.x));
    let advertencia = '';
    if (concentracion < xMin || concentracion > xMax) {
      advertencia = T.extrapolacion;
    }

    document.getElementById('interp-senal').textContent        = conComa(senal);
    document.getElementById('interp-concentracion').textContent = conComa(concentracion.toFixed(6));
    document.getElementById('interp-formula').textContent = conComa(
      `x = (${senal} - (${reg.b.toFixed(6)})) / ${reg.m.toFixed(6)}${advertencia}`);

    resInterp.classList.add('visible');
  });

  /* ── EXPORTAR RESULTADOS ─────────────────────────────────
     Genera un texto listo para copiar en un informe o planilla.
     ──────────────────────────────────────────────────────── */
  btnExportar.addEventListener('click', function () {
    if (puntos.length < 3) {
      alert(T.errExportar);
      return;
    }

    const reg = regresionLineal(puntos);
    const fecha = new Date().toLocaleDateString(T.locale);

    let texto = `${T.expTitulo}\n`;
    texto += `${T.expFecha}: ${fecha}\n`;
    texto += `${T.expEjeX}: ${labelEjeX.value || T.ejeX}\n`;
    texto += `${T.expEjeY}: ${labelEjeY.value || T.ejeY}\n\n`;

    texto += `${T.expDatos}\n`;
    texto += `${T.expCabecera}\n`;
    puntos.forEach((p, i) => {
      texto += `${i + 1}\t${p.x}\t${p.y}\n`;
    });

    texto += `\n${T.expRegresion}\n`;
    texto += `${T.expEcuacion}: ${ecuacion(reg, 6)}\n`;
    texto += `${T.expPendiente}: ${reg.m.toFixed(6)}\n`;
    texto += `${T.expOrdenada}: ${reg.b.toFixed(6)}\n`;
    texto += `${T.expR}: ${reg.R.toFixed(6)}\n`;
    texto += `${T.expR2}: ${reg.R2.toFixed(6)}\n`;
    texto += `${T.expSe}: ${reg.Se.toFixed(6)}\n`;
    texto += `${T.expLod}: ${sig(reg.LOD)}\n`;
    texto += `${T.expLoq}: ${sig(reg.LOQ)}\n`;
    texto += `${T.expN}: ${puntos.length}\n`;

    texto += `\n${T.expResiduales}\n`;
    puntos.forEach((p, i) => {
      texto += `${i + 1}\t${p.x}\t${sig(p.y - (reg.m * p.x + reg.b), 3)}\n`;
    });

    /* Coma decimal en todo el texto en español (se pega en Excel en español; columnas separadas por tabulador).
       En inglés conComa no cambia nada: punto decimal. */
    texto = conComa(texto);

    /* Copiamos al portapapeles */
    navigator.clipboard.writeText(texto).then(function () {
      btnExportar.textContent = T.copiado;
      setTimeout(() => { btnExportar.textContent = T.exportar; }, 2500);
    }).catch(function () {
      /* Fallback: mostramos en un prompt para copiar manualmente */
      prompt(T.copiaManual, texto);
    });
  });

  /* Inicializamos la tabla vacía */
  actualizarTabla();

});
