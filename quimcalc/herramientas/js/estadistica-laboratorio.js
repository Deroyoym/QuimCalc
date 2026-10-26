    /* ═══════════════════════════════════════════════════════════
       ESTADÍSTICA BÁSICA PARA LABORATORIO — QuimCalc
       Fuentes de valores críticos:
         Grubbs: ISO 5725-2:1994 / Grubbs (1969) Technometrics 11(1)
         Dixon Q: Dixon (1953) Biometrics 9(1)
         t-Student: tablas estándar, df = n-1, α = 0.05 bilateral
    ═══════════════════════════════════════════════════════════ */

    /* Idioma de la página: la misma lógica sirve para /herramientas/ (es) y /en/tools/ (en) */
    var EN = (document.documentElement.lang || '').slice(0, 2) === 'en';
    var T = EN ? {
      errVacio: 'Enter at least 3 values to calculate.',
      errPocos: 'At least 3 valid values are needed.',
      nSub: 'valid values',
      media: 'Mean (x̄)', mediaSub: 'arithmetic mean',
      mediana: 'Median', medianaSub: 'middle value',
      cv: 'CV % (%RSD)', cvSub: 'coefficient of variation',
      desv: 'Standard deviation (s)', desvSub: 'sample (n−1)',
      varianza: 'Variance (s²)', varianzaSub: 'sample (n−1)',
      sem: 'SEM', semSub: 'standard error of the mean',
      ic: '95 % CI',
      minimo: 'Minimum', maximo: 'Maximum',
      rango: 'Range', rangoSub: 'max − min',
      tcrit: 'Critical t (95 %)',
      sinTest: 'All values are equal, or there are not enough data for the outlier test.',
      nombreTest: function (t) { return t === 'Grubbs' ? "Grubbs' test" : "Dixon's Q test"; },
      simbolo: function (t) { return t === 'Grubbs' ? 'G' : 'Q'; },
      outlierSi: function (v) { return 'the value <strong>' + v + '</strong> is a possible outlier. '; },
      outlierSiFin: '. Check for an assignable cause before discarding it.',
      outlierNo: 'no significant outliers were detected. '
    } : {
      errVacio: 'Ingresá al menos 3 valores para calcular.',
      errPocos: 'Se necesitan al menos 3 valores válidos.',
      nSub: 'valores válidos',
      media: 'Media (x̄)', mediaSub: 'promedio aritmético',
      mediana: 'Mediana', medianaSub: 'valor central',
      cv: 'CV %', cvSub: 'coef. de variación',
      desv: 'Desv. estándar (s)', desvSub: 'muestral (n−1)',
      varianza: 'Varianza (s²)', varianzaSub: 'muestral (n−1)',
      sem: 'SEM', semSub: 'error estándar media',
      ic: 'IC 95 %',
      minimo: 'Mínimo', maximo: 'Máximo',
      rango: 'Rango', rangoSub: 'max − min',
      tcrit: 't crítico (95 %)',
      sinTest: 'Los datos son todos iguales o insuficientes para el test de outliers.',
      nombreTest: function (t) { return 'Test de ' + t; },
      simbolo: function (t) { return t.charAt(0); },
      outlierSi: function (v) { return 'el valor <strong>' + v + '</strong> es un posible outlier. '; },
      outlierSiFin: '. Verificá si hay una causa asignable antes de descartarlo.',
      outlierNo: 'no se detectaron outliers significativos. '
    };

    /* ── Tablas de valores críticos ── */
    var GRUBBS_CRIT = {
      3:1.155, 4:1.481, 5:1.715, 6:1.887, 7:2.020,
      8:2.126, 9:2.215, 10:2.290, 11:2.355, 12:2.412,
      13:2.462, 14:2.507, 15:2.549, 16:2.585, 17:2.620,
      18:2.651, 19:2.681, 20:2.709, 25:2.822, 30:2.908,
      40:3.036, 50:3.128
    };

    /* Valores críticos de Dixon Q para α = 0,05 (Q95; Rorabacher, Anal. Chem. 1991) */
    var DIXON_CRIT = {
      3:0.970, 4:0.829, 5:0.710, 6:0.625,
      7:0.568, 8:0.526, 9:0.493, 10:0.466
    };

    /* t crítico bilateral 95% (α=0.025 por cola), df = n-1 */
    var T_CRIT = {
      1:12.706, 2:4.303, 3:3.182, 4:2.776, 5:2.571,
      6:2.447,  7:2.365, 8:2.306, 9:2.262, 10:2.228,
      11:2.201, 12:2.179, 13:2.160, 14:2.145, 15:2.131,
      16:2.120, 17:2.110, 18:2.101, 19:2.093, 20:2.086,
      25:2.060, 30:2.042, 40:2.021, 60:2.000, 120:1.980
    };

    function getCrit(tabla, n) {
      var keys = Object.keys(tabla).map(Number).sort(function(a,b){return a-b;});
      for (var i = 0; i < keys.length; i++) {
        if (n <= keys[i]) return tabla[keys[i]];
      }
      return tabla[keys[keys.length - 1]];
    }


    /*
     * Lee una lista de números escrita por el usuario. Separadores: espacio, «;» o
     * salto de línea. Decimales: coma o punto. Si el texto ya usa punto decimal, la
     * coma se toma como separador (formato «5.42, 5.38»); si no, «5,42» es un decimal.
     * Un fragmento con dos o más comas («1,2,3») se separa por comas.
     * En inglés la coma siempre separa valores.
     */
    function leerNumeros(texto) {
      var hayPunto = EN || /\d\.\d/.test(texto);
      var out = [];
      texto.split(/[\s;]+/).forEach(function (tok) {
        if (!tok) return;
        var comas = (tok.match(/,/g) || []).length;
        var partes = (hayPunto || comas >= 2) ? tok.split(',') : [tok.replace(',', '.')];
        partes.forEach(function (p) { var n = parseFloat(p); if (!isNaN(n)) out.push(n); });
      });
      return out;
    }

    /* ── Parseo de datos ── */
    function parsear(texto) {
      return leerNumeros(texto);
    }

    /* ── Estadísticos ── */
    function media(arr) {
      return arr.reduce(function(a,b){return a+b;},0) / arr.length;
    }

    function mediana(arr) {
      var s = arr.slice().sort(function(a,b){return a-b;});
      var n = s.length;
      return n % 2 === 0 ? (s[n/2-1] + s[n/2]) / 2 : s[Math.floor(n/2)];
    }

    function desv(arr, xbar) {
      var n = arr.length;
      if (n < 2) return 0;
      return Math.sqrt(arr.reduce(function(a,b){return a+Math.pow(b-xbar,2);},0) / (n-1));
    }

    /* ── Test de Grubbs ── */
    function grubbs(arr) {
      var n   = arr.length;
      var xb  = media(arr);
      var s   = desv(arr, xb);
      if (s === 0) return null;

      var Gmax = 0, outlierVal = null;
      arr.forEach(function(v) {
        var g = Math.abs(v - xb) / s;
        if (g > Gmax) { Gmax = g; outlierVal = v; }
      });

      var Gcrit = getCrit(GRUBBS_CRIT, n);
      return { stat: Gmax, crit: Gcrit, isOutlier: Gmax > Gcrit, val: outlierVal, test: 'Grubbs' };
    }

    /* ── Test de Dixon Q ── */
    function dixonQ(arr) {
      var n = arr.length;
      var s = arr.slice().sort(function(a,b){return a-b;});
      var rango = s[n-1] - s[0];
      if (rango === 0) return null;

      var Qmin = (s[1]   - s[0])   / rango;
      var Qmax = (s[n-1] - s[n-2]) / rango;
      var Q    = Math.max(Qmin, Qmax);
      var Qcrit = getCrit(DIXON_CRIT, n);
      var outlierVal = Qmax >= Qmin ? s[n-1] : s[0];

      return { stat: Q, crit: Qcrit, isOutlier: Q > Qcrit, val: outlierVal, test: 'Dixon Q' };
    }

    /* ── Coma decimal para todo texto visible (solo en español) ── */
    function conComa(s) { return EN ? String(s) : String(s).replace(/(\d)\.(\d)/g, '$1,$2'); }

    /* ── Formato de números ── */
    function fmt(n, sig) {
      if (isNaN(n)) return '—';
      sig = sig || 5;
      var abs = Math.abs(n);
      if (abs === 0) return '0';
      if (abs >= 1e5 || abs < 1e-4) return n.toExponential(3);
      return parseFloat(n.toPrecision(sig)).toString();
    }

    /* ── Limpiar ── */
    function limpiarResultados() {
      document.getElementById('seccion-resultados').classList.remove('visible');
    }

    /* ── Ejemplos ── */
    function cargarEjemplo(tipo) {
      var ta = document.getElementById('datos');
      if (tipo === 'normal') {
        ta.value = '5.42\n5.38\n5.41\n5.45\n5.39\n5.43\n5.40\n5.44\n5.41\n5.42';
      } else {
        ta.value = '5.42\n5.38\n5.41\n5.45\n5.39\n5.43\n5.40\n5.44\n5.41\n5.87';
      }
      limpiarResultados();
    }

    /* ── Cálculo principal ── */
    function calcular() {
      var txt = document.getElementById('datos').value.trim();
      if (!txt) { alert(T.errVacio); return; }

      var arr = parsear(txt);
      if (arr.length < 3) { alert(T.errPocos); return; }

      var n    = arr.length;
      var xb   = media(arr);
      var med  = mediana(arr);
      var s    = desv(arr, xb);
      var s2   = s * s;
      var cv   = xb !== 0 ? Math.abs(s / xb) * 100 : NaN;
      var sem  = s / Math.sqrt(n);
      var mn   = Math.min.apply(null, arr);
      var mx   = Math.max.apply(null, arr);
      var rng  = mx - mn;

      /* Intervalo de confianza 95% */
      var df   = n - 1;
      var t95  = getCrit(T_CRIT, df);
      var eMar = t95 * sem;
      var ciLo = xb - eMar;
      var ciHi = xb + eMar;

      /* Test de outliers */
      var outlierRes = n <= 10 ? dixonQ(arr) : grubbs(arr);

      /* ── Renderizar stats grid ── */
      var cvClase = cv < 2 ? '#276C43' : cv < 5 ? '#D97706' : '#B83232';

      var cards = [
        { label:'n',                 val: n.toString(),                          sub:T.nSub,        dest:false },
        { label:T.media,             val: fmt(xb),                               sub:T.mediaSub,    dest:true  },
        { label:T.mediana,           val: fmt(med),                              sub:T.medianaSub,  dest:false },
        { label:T.cv,                val: fmt(cv,4) + ' %',                      sub:T.cvSub,       dest:false, color:cvClase },
        { label:T.desv,              val: fmt(s),                                sub:T.desvSub,     dest:false },
        { label:T.varianza,          val: fmt(s2),                               sub:T.varianzaSub, dest:false },
        { label:T.sem,               val: fmt(sem),                              sub:T.semSub,      dest:false },
        { label:T.ic,                val: '[' + fmt(ciLo) + ' — ' + fmt(ciHi) + ']', sub:'t=' + t95.toFixed(3) + ', df=' + df, dest:true },
        { label:T.minimo,            val: fmt(mn),                               sub:'',            dest:false },
        { label:T.maximo,            val: fmt(mx),                               sub:'',            dest:false },
        { label:T.rango,             val: fmt(rng),                              sub:T.rangoSub,    dest:false },
        { label:T.tcrit,             val: t95.toFixed(3),                        sub:'df=' + df,    dest:false },
      ];

      document.getElementById('stats-grid').innerHTML = cards.map(function(c) {
        var claseCard = 'stat-card' + (c.dest ? ' destacada' : '');
        var styleVal  = c.color ? 'style="color:' + c.color + '"' : '';
        return '<div class="' + claseCard + '">' +
          '<p class="stat-card__label">' + c.label + '</p>' +
          '<p class="stat-card__valor" ' + styleVal + '>' + conComa(c.val) + '</p>' +
          (c.sub ? '<p class="stat-card__sub">' + conComa(c.sub) + '</p>' : '') +
          '</div>';
      }).join('');

      /* ── Outlier bloque ── */
      var ob = document.getElementById('outlier-bloque');
      if (!outlierRes) {
        ob.className = 'outlier-bloque ok';
        ob.innerHTML = T.sinTest;
      } else if (outlierRes.isOutlier) {
        ob.className = 'outlier-bloque warn';
        ob.innerHTML = conComa(
          '⚠ <strong>' + T.nombreTest(outlierRes.test) + ' (α = 0.05):</strong> ' +
          T.outlierSi(outlierRes.val) +
          T.simbolo(outlierRes.test) + '-stat = ' + outlierRes.stat.toFixed(4) +
          ' &gt; ' + T.simbolo(outlierRes.test) + '-crit = ' + outlierRes.crit.toFixed(3) +
          T.outlierSiFin);
      } else {
        ob.className = 'outlier-bloque ok';
        ob.innerHTML = conComa(
          '✓ <strong>' + T.nombreTest(outlierRes.test) + ' (α = 0.05):</strong> ' +
          T.outlierNo +
          T.simbolo(outlierRes.test) + '-stat = ' + outlierRes.stat.toFixed(4) +
          ' ≤ ' + T.simbolo(outlierRes.test) + '-crit = ' + outlierRes.crit.toFixed(3) + '.');
      }

      /* ── Dot-plot en canvas ── */
      dibujarDotPlot(arr, xb, ciLo, ciHi, outlierRes);

      document.getElementById('seccion-resultados').classList.add('visible');
      document.getElementById('seccion-resultados').scrollIntoView({ behavior:'smooth', block:'nearest' });
    }

    /* ── Dot-plot ── */
    function dibujarDotPlot(arr, xb, ciLo, ciHi, outlierRes) {
      var canvas = document.getElementById('dotplot');
      var W = canvas.parentElement.clientWidth - 32;
      if (W < 200) W = 200;
      canvas.width  = W;
      canvas.height = 110;

      var ctx  = canvas.getContext('2d');
      var PAD  = 30;
      var mn   = Math.min.apply(null, arr);
      var mx   = Math.max.apply(null, arr);
      var rng  = mx - mn || 1;
      var PAD_DATA = rng * 0.2;
      var xMin = mn - PAD_DATA;
      var xMax = mx + PAD_DATA;

      function toCanvas(val) {
        return PAD + ((val - xMin) / (xMax - xMin)) * (W - PAD * 2);
      }

      ctx.clearRect(0, 0, W, canvas.height);

      /* IC 95% banda */
      ctx.fillStyle = 'rgba(147, 197, 160, 0.35)';
      ctx.fillRect(toCanvas(ciLo), 10, toCanvas(ciHi) - toCanvas(ciLo), 70);

      /* Eje */
      ctx.strokeStyle = '#D4CFC4';
      ctx.lineWidth   = 1;
      ctx.beginPath();
      ctx.moveTo(PAD, 80);
      ctx.lineTo(W - PAD, 80);
      ctx.stroke();

      /* Ticks y labels del eje */
      ctx.fillStyle   = '#5C5649';
      ctx.font        = '10px Arial';
      ctx.textAlign   = 'center';
      var tickCount   = Math.min(7, arr.length);
      for (var i = 0; i <= tickCount; i++) {
        var val = xMin + (xMax - xMin) * (i / tickCount);
        var xc  = toCanvas(val);
        ctx.strokeStyle = '#D4CFC4';
        ctx.beginPath();
        ctx.moveTo(xc, 78);
        ctx.lineTo(xc, 84);
        ctx.stroke();
        ctx.fillText(conComa(parseFloat(val.toPrecision(4)).toString()), xc, 96);
      }

      /* Puntos — stacking vertical para evitar solapamiento */
      var RADIO   = 5;
      var posMap  = {};

      arr.forEach(function(v) {
        var xc   = Math.round(toCanvas(v));
        var key  = Math.round(xc / (RADIO * 2));
        var level= posMap[key] || 0;
        posMap[key] = level + 1;

        var yc = 72 - level * (RADIO * 2 + 2);

        var esOutlier = outlierRes && outlierRes.isOutlier && v === outlierRes.val;

        ctx.beginPath();
        ctx.arc(xc, yc, RADIO, 0, Math.PI * 2);
        ctx.fillStyle   = esOutlier ? '#B83232' : '#1A5C38';
        ctx.globalAlpha = 0.75;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.strokeStyle = esOutlier ? '#7F1D1D' : '#134529';
        ctx.lineWidth   = 1;
        ctx.stroke();
      });

      /* Línea de media */
      ctx.strokeStyle = '#1A5C38';
      ctx.lineWidth   = 2.5;
      ctx.beginPath();
      var xMedia = toCanvas(xb);
      ctx.moveTo(xMedia, 12);
      ctx.lineTo(xMedia, 82);
      ctx.stroke();

      /* Etiqueta media */
      ctx.fillStyle  = '#1A5C38';
      ctx.font       = 'bold 10px Arial';
      ctx.textAlign  = 'center';
      ctx.fillText(conComa('x̄=' + parseFloat(xb.toPrecision(5))), xMedia, 10);
    }

/* ── Wiring de eventos (reemplaza los on* inline del HTML) ── */
document.addEventListener('DOMContentLoaded', function () {
  var datos = document.getElementById('datos');
  if (datos) {
    datos.addEventListener('input', limpiarResultados);
    datos.addEventListener('focus', function () { this.style.borderColor = 'var(--color-acento)'; });
    datos.addEventListener('blur',  function () { this.style.borderColor = 'var(--color-borde)'; });
  }
  var acciones = {
    'btn-ejemplo-normal':  function () { cargarEjemplo('normal'); },
    'btn-ejemplo-outlier': function () { cargarEjemplo('outlier'); },
    'btn-limpiar':         function () { if (datos) datos.value = ''; limpiarResultados(); },
    'btn-calcular':        calcular
  };
  Object.keys(acciones).forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('click', acciones[id]);
  });
});
