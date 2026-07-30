    /* ═══════════════════════════════════════════════════════════
       ESTADÍSTICA BÁSICA PARA LABORATORIO — QuimCalc
       Fuentes de valores críticos:
         Grubbs: ISO 5725-2:1994 / Grubbs (1969) Technometrics 11(1)
         Dixon Q: Dixon (1953) Biometrics 9(1)
         t-Student: tablas estándar, df = n-1, α = 0.05 bilateral
    ═══════════════════════════════════════════════════════════ */

    /* ── Tablas de valores críticos ── */
    var GRUBBS_CRIT = {
      3:1.155, 4:1.481, 5:1.715, 6:1.887, 7:2.020,
      8:2.126, 9:2.215, 10:2.290, 11:2.355, 12:2.412,
      13:2.462, 14:2.507, 15:2.549, 16:2.585, 17:2.620,
      18:2.651, 19:2.681, 20:2.709, 25:2.822, 30:2.908,
      40:3.036, 50:3.128
    };

    var DIXON_CRIT = {
      3:0.941, 4:0.765, 5:0.642, 6:0.560,
      7:0.507, 8:0.468, 9:0.437, 10:0.412
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

    /* ── Parseo de datos ── */
    function parsear(texto) {
      return texto
        .replace(/,/g, ' ')
        .replace(/;/g, ' ')
        .split(/\s+/)
        .map(function(s){ return parseFloat(s.replace(',', '.')); })
        .filter(function(n){ return !isNaN(n); });
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
      if (!txt) { alert('Ingresá al menos 3 valores para calcular.'); return; }

      var arr = parsear(txt);
      if (arr.length < 3) { alert('Se necesitan al menos 3 valores válidos.'); return; }

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
        { label:'n',                 val: n.toString(),                          sub:'valores válidos',    dest:false },
        { label:'Media (x̄)',         val: fmt(xb),                               sub:'promedio aritmético',dest:true  },
        { label:'Mediana',           val: fmt(med),                              sub:'valor central',      dest:false },
        { label:'CV %',              val: fmt(cv,4) + ' %',                      sub:'coef. de variación', dest:false, color:cvClase },
        { label:'Desv. estándar (s)',val: fmt(s),                                sub:'muestral (n−1)',     dest:false },
        { label:'Varianza (s²)',     val: fmt(s2),                               sub:'muestral (n−1)',     dest:false },
        { label:'SEM',               val: fmt(sem),                              sub:'error estándar media',dest:false},
        { label:'IC 95 %',           val: '[' + fmt(ciLo) + ' — ' + fmt(ciHi) + ']', sub:'t=' + t95.toFixed(3) + ', df=' + df, dest:true },
        { label:'Mínimo',            val: fmt(mn),                               sub:'',                   dest:false },
        { label:'Máximo',            val: fmt(mx),                               sub:'',                   dest:false },
        { label:'Rango',             val: fmt(rng),                              sub:'max − min',          dest:false },
        { label:'t crítico (95 %)',  val: t95.toFixed(3),                        sub:'df=' + df,           dest:false },
      ];

      document.getElementById('stats-grid').innerHTML = cards.map(function(c) {
        var claseCard = 'stat-card' + (c.dest ? ' destacada' : '');
        var styleVal  = c.color ? 'style="color:' + c.color + '"' : '';
        return '<div class="' + claseCard + '">' +
          '<p class="stat-card__label">' + c.label + '</p>' +
          '<p class="stat-card__valor" ' + styleVal + '>' + c.val + '</p>' +
          (c.sub ? '<p class="stat-card__sub">' + c.sub + '</p>' : '') +
          '</div>';
      }).join('');

      /* ── Outlier bloque ── */
      var ob = document.getElementById('outlier-bloque');
      if (!outlierRes) {
        ob.className = 'outlier-bloque ok';
        ob.innerHTML = 'Los datos son todos iguales o insuficientes para el test de outliers.';
      } else if (outlierRes.isOutlier) {
        ob.className = 'outlier-bloque warn';
        ob.innerHTML =
          '⚠ <strong>Test de ' + outlierRes.test + ' (α = 0,05):</strong> ' +
          'el valor <strong>' + outlierRes.val + '</strong> es un posible outlier. ' +
          outlierRes.test.charAt(0) + '-stat = ' + outlierRes.stat.toFixed(4) +
          ' &gt; ' + outlierRes.test.charAt(0) + '-crit = ' + outlierRes.crit.toFixed(3) +
          '. Verificá si hay una causa asignable antes de descartarlo.';
      } else {
        ob.className = 'outlier-bloque ok';
        ob.innerHTML =
          '✓ <strong>Test de ' + outlierRes.test + ' (α = 0,05):</strong> ' +
          'no se detectaron outliers significativos. ' +
          outlierRes.test.charAt(0) + '-stat = ' + outlierRes.stat.toFixed(4) +
          ' ≤ ' + outlierRes.test.charAt(0) + '-crit = ' + outlierRes.crit.toFixed(3) + '.';
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
        ctx.fillText(parseFloat(val.toPrecision(4)).toString(), xc, 96);
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
      ctx.fillText('x̄=' + parseFloat(xb.toPrecision(5)), xMedia, 10);
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
