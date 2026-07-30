    /* ── % Recuperación y error sistemático ── */
    var filaId = 0;

    document.addEventListener('DOMContentLoaded', function () {
      /* Comenzar con 5 filas vacías */
      for (var i = 0; i < 5; i++) agregarFila();
    });

    function agregarFila() {
      filaId++;
      var id = filaId;
      var tbody = document.getElementById('tbody');
      var tr = document.createElement('tr');
      tr.id = 'fila-' + id;
      tr.innerHTML =
        '<td style="text-align:center;color:var(--color-texto-suave);font-size:0.8rem;">' + id + '</td>' +
        '<td><input type="text"   placeholder="ej: Muestra A"></td>' +
        '<td><input type="number" placeholder="ej: 5.00"       step="any"></td>' +
        '<td><input type="number" placeholder="ej: 4.83"       step="any"></td>' +
        '<td class="td-result" id="rec-'   + id + '">—</td>' +
        '<td class="td-result" id="eabs-'  + id + '">—</td>' +
        '<td class="td-result" id="erel-'  + id + '">—</td>' +
        '<td><button class="btn-quitar" aria-label="Quitar fila">✕</button></td>';
      tbody.appendChild(tr);
    }

    function quitarFila(id) {
      var fila = document.getElementById('fila-' + id);
      if (fila) fila.remove();
      recalcular();
    }

    function limpiarTabla() {
      document.getElementById('tbody').innerHTML = '';
      filaId = 0;
      for (var i = 0; i < 5; i++) agregarFila();
      ocultarResultados();
    }

    function recalcularFila(id) {
      var fila = document.getElementById('fila-' + id);
      if (!fila) return;
      var inputs  = fila.querySelectorAll('input[type="number"]');
      var nominal = parseFloat(inputs[0].value);
      var medido  = parseFloat(inputs[1].value);

      var limInf = parseFloat(document.getElementById('lim-inf').value) || 80;
      var limSup = parseFloat(document.getElementById('lim-sup').value) || 120;

      if (!isNaN(nominal) && !isNaN(medido) && nominal !== 0) {
        var rec  = (medido / nominal) * 100;
        var eabs = medido - nominal;
        var erel = (eabs / nominal) * 100;

        var clase = rec >= limInf && rec <= limSup ? 'ok' : (Math.abs(rec - 100) < 20 ? 'warn' : 'error');

        document.getElementById('rec-'  + id).textContent = rec.toFixed(2)  + ' %';
        document.getElementById('rec-'  + id).className   = 'td-result ' + clase;
        document.getElementById('eabs-' + id).textContent = (eabs >= 0 ? '+' : '') + eabs.toFixed(4);
        document.getElementById('erel-' + id).textContent = (erel >= 0 ? '+' : '') + erel.toFixed(2) + ' %';
        document.getElementById('erel-' + id).className   = 'td-result ' + (Math.abs(erel) < 5 ? 'ok' : Math.abs(erel) < 20 ? 'warn' : 'error');
      } else {
        ['rec-','eabs-','erel-'].forEach(function(p) {
          document.getElementById(p + id).textContent = '—';
          document.getElementById(p + id).className   = 'td-result';
        });
      }
    }

    function recalcular() {
      var filas = document.getElementById('tbody').querySelectorAll('tr');
      filas.forEach(function (fila) {
        var id = fila.id.replace('fila-', '');
        recalcularFila(parseInt(id));
      });
    }

    function calcular() {
      var filas  = document.getElementById('tbody').querySelectorAll('tr');
      var recs   = [];

      filas.forEach(function (fila) {
        var inputs  = fila.querySelectorAll('input[type="number"]');
        var nominal = parseFloat(inputs[0].value);
        var medido  = parseFloat(inputs[1].value);
        if (!isNaN(nominal) && !isNaN(medido) && nominal !== 0) {
          recs.push((medido / nominal) * 100);
        }
      });

      if (recs.length < 2) {
        alert('Ingresá al menos 2 pares de valores para calcular el resumen estadístico.');
        return;
      }

      var n    = recs.length;
      var mean = recs.reduce(function(a,b){return a+b;},0) / n;
      var sd   = Math.sqrt(recs.reduce(function(a,b){return a+Math.pow(b-mean,2);},0) / (n-1));
      var cv   = Math.abs(mean) > 0 ? (sd / mean) * 100 : 0;
      var bias = mean - 100;

      var limInf = parseFloat(document.getElementById('lim-inf').value) || 80;
      var limSup = parseFloat(document.getElementById('lim-sup').value) || 120;
      var limCV  = parseFloat(document.getElementById('lim-cv').value)  || 5;

      var recovOk = mean >= limInf && mean <= limSup;
      var cvOk    = cv <= limCV;

      /* Mostrar resumen */
      var grid = document.getElementById('resumen-grid');
      var claseRec = recovOk ? 'ok' : (mean >= (limInf - 10) && mean <= (limSup + 10) ? 'warn' : 'error');
      var claseCv  = cvOk    ? 'ok' : (cv <= limCV * 2 ? 'warn' : 'error');
      var claseBias= Math.abs(bias) <= 5 ? 'ok' : Math.abs(bias) <= 15 ? 'warn' : 'error';

      grid.innerHTML = [
        { label:'n (muestras)',    val: n,                fmt:'0',       clase:''},
        { label:'Media de rec. %', val: mean,             fmt:'2',       clase:claseRec},
        { label:'Desv. est. (s)',  val: sd,               fmt:'3',       clase:''},
        { label:'CV %',            val: cv,               fmt:'2',       clase:claseCv},
        { label:'Mín. rec. %',     val: Math.min.apply(null,recs), fmt:'2', clase:''},
        { label:'Máx. rec. %',     val: Math.max.apply(null,recs), fmt:'2', clase:''},
        { label:'Bias (%)',         val: bias,             fmt:'2',       clase:claseBias},
        { label:'Límites config.',  val: limInf+'–'+limSup+'%', fmt:'str', clase:''},
      ].map(function(c){
        var v = c.fmt === 'str' ? c.val : (c.fmt === '0' ? c.val.toString() : parseFloat(c.val).toFixed(parseInt(c.fmt)));
        return '<div class="resumen-card">' +
          '<p class="resumen-card__label">' + c.label + '</p>' +
          '<p class="resumen-card__valor ' + c.clase + '">' + v + '</p>' +
          '</div>';
      }).join('');

      /* Evaluación final */
      var ev = document.getElementById('evaluacion');
      if (recovOk && cvOk) {
        ev.className = 'evaluacion-bloque visible ok';
        ev.textContent = '✓ El método cumple los criterios de aceptación: media de recuperación dentro del rango ' + limInf + '–' + limSup + ' % y CV% ≤ ' + limCV + ' %.';
      } else if (!recovOk && cvOk) {
        ev.className = 'evaluacion-bloque visible warn';
        ev.textContent = '⚠ La precisión es aceptable (CV% = ' + cv.toFixed(2) + ' %) pero la recuperación media (' + mean.toFixed(2) + ' %) está fuera del rango ' + limInf + '–' + limSup + ' %. Revisar sesgo sistemático.';
      } else if (recovOk && !cvOk) {
        ev.className = 'evaluacion-bloque visible warn';
        ev.textContent = '⚠ La recuperación media es aceptable (' + mean.toFixed(2) + ' %) pero la dispersión es alta (CV% = ' + cv.toFixed(2) + ' % > ' + limCV + ' %). Revisar repetibilidad.';
      } else {
        ev.className = 'evaluacion-bloque visible error';
        ev.textContent = '✗ El método no cumple los criterios: recuperación ' + mean.toFixed(2) + ' % (rango: ' + limInf + '–' + limSup + ' %) y CV% = ' + cv.toFixed(2) + ' % (límite: ' + limCV + ' %). Revisión necesaria.';
      }

      document.getElementById('seccion-resultados').classList.add('visible');
    }

    function ocultarResultados() {
      document.getElementById('seccion-resultados').classList.remove('visible');
      document.getElementById('evaluacion').className = 'evaluacion-bloque';
    }

/* ── Wiring de eventos (reemplaza los on* inline del HTML) ── */
document.addEventListener('DOMContentLoaded', function () {
  ['lim-inf', 'lim-sup', 'lim-cv'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('input', recalcular);
  });
  var botones = { 'btn-agregar': agregarFila, 'btn-limpiar': limpiarTabla, 'btn-calcular': calcular };
  Object.keys(botones).forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('click', botones[id]);
  });
  var tbody = document.getElementById('tbody');
  if (tbody) {
    // Delegación para las filas generadas dinámicamente
    tbody.addEventListener('input', function (ev) {
      var tr = ev.target.closest('tr');
      if (tr && tr.id.indexOf('fila-') === 0) recalcularFila(parseInt(tr.id.slice(5), 10));
    });
    tbody.addEventListener('click', function (ev) {
      var btn = ev.target.closest('.btn-quitar');
      if (!btn) return;
      var tr = btn.closest('tr');
      if (tr && tr.id.indexOf('fila-') === 0) quitarFila(parseInt(tr.id.slice(5), 10));
    });
  }
});
