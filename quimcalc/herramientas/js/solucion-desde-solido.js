    /* ── Calculadora: solución desde sólido con pureza ── */
    document.addEventListener('DOMContentLoaded', function () {
      var campos = ['c-deseada', 'v-final', 'masa-molar', 'pureza'];
      campos.forEach(function (id) {
        var el = document.getElementById(id);
        if (el) el.addEventListener('input', limpiar);
      });
      document.getElementById('unidad-c').addEventListener('change', limpiar);
      document.getElementById('unidad-v').addEventListener('change', limpiar);
    });

    function conComa(s) { return String(s).replace(/(\d)\.(\d)/g, '$1,$2'); }

    function actualizarBarra(val) {
      var pct = Math.min(100, Math.max(0, parseFloat(val) || 0));
      var bar  = document.getElementById('pureza-bar');
      var lbl  = document.getElementById('pureza-label');
      if (parseFloat(val) > 100) {
        bar.style.setProperty('--pureza-pct', '100%');
        lbl.textContent = 'La pureza no puede superar el 100 %';
        return;
      }
      bar.style.setProperty('--pureza-pct', pct + '%');
      var impurezas = (100 - pct).toFixed(1);
      lbl.textContent = 'Pureza: ' + conComa(pct.toFixed(1)) + ' %  —  Impurezas: ' + conComa(impurezas) + ' %';
    }

    function limpiar() {
      document.getElementById('resultado').classList.remove('visible', 'resultado--error');
      document.getElementById('pasos').classList.remove('visible');
    }

    function mostrarError(msg) {
      var r = document.getElementById('resultado');
      r.className = 'resultado resultado--error visible';
      r.querySelector('.resultado__etiqueta').textContent = 'Error';
      r.querySelector('.resultado__valor').textContent    = msg;
      r.querySelector('.resultado__formula').textContent  = '';
      /* No dejar a la vista valores de un cálculo anterior */
      ['res-masa-pura', 'res-extra'].forEach(function (id) {
        var el = document.getElementById(id);
        if (el) el.textContent = '—';
      });
      document.getElementById('pasos').classList.remove('visible');
    }

    function calcular() {
      var cDeseada  = parseFloat(document.getElementById('c-deseada').value);
      var vFinal    = parseFloat(document.getElementById('v-final').value);
      var masaMolar = parseFloat(document.getElementById('masa-molar').value);
      var pureza    = parseFloat(document.getElementById('pureza').value);
      var unidadC   = document.getElementById('unidad-c').value;
      var unidadV   = document.getElementById('unidad-v').value;

      /* Validaciones */
      if (isNaN(cDeseada)  || cDeseada  <= 0)               return mostrarError('Ingresá una concentración válida (> 0).');
      if (isNaN(vFinal)    || vFinal    <= 0)               return mostrarError('Ingresá un volumen válido (> 0).');
      if (unidadC === 'mol/L' && (isNaN(masaMolar) || masaMolar <= 0)) return mostrarError('Ingresá una masa molar válida (> 0).');
      if (unidadC === 'g/L' && !isNaN(masaMolar) && masaMolar <= 0) return mostrarError('La masa molar debe ser mayor que 0 (o dejala vacía: en g/L no hace falta).');
      if (isNaN(pureza)    || pureza <= 0 || pureza > 100)  return mostrarError('La pureza debe estar entre 0 y 100 %.');

      /* Conversiones */
      var vL    = unidadV === 'mL'    ? vFinal / 1000 : vFinal;

      /* Cálculo (en g/L la masa molar no interviene: m = C × V) */
      var masaPura    = unidadC === 'mol/L' ? cDeseada * vL * masaMolar : cDeseada * vL;   // g de sustancia pura
      var masaReact   = masaPura / (pureza / 100);         // g de reactivo a pesar
      var masaExtra   = masaReact - masaPura;              // g de impurezas

      /* Mostrar resultado */
      var r = document.getElementById('resultado');
      r.className = 'resultado visible';
      r.querySelector('.resultado__etiqueta').textContent = 'Masa a pesar del reactivo';
      r.querySelector('.resultado__valor').textContent    = QCFormato.masa(masaReact);
      r.querySelector('.resultado__formula').textContent  = conComa(unidadC === 'mol/L'
        ? 'm = (C × V × M) / (P/100) = (' + cDeseada + ' mol/L × ' + vL + ' L × ' +
          masaMolar + ' g/mol) / ' + (pureza / 100)
        : 'm = (C × V) / (P/100) = (' + cDeseada + ' g/L × ' + vL + ' L) / ' + (pureza / 100));

      document.getElementById('res-masa-pura').textContent = QCFormato.masa(masaPura);
      document.getElementById('res-extra').textContent     = QCFormato.masa(masaExtra);

      /* Pasos de preparación */
      var vLabel = conComa(unidadV === 'mL' ? vFinal + ' mL' : vFinal + ' L');
      var pasos  = document.getElementById('lista-pasos');

      pasos.innerHTML = [
        'Pesá <strong>' + QCFormato.masa(masaReact) + '</strong> del reactivo en una balanza analítica usando un recipiente seco y tarado.',
        'Disolvé el reactivo en un vaso de precipitados con aproximadamente el 70–80 % del volumen final de agua destilada. Agitá hasta disolución completa.',
        'Trasvasá cuantitativamente al matraz aforado de <strong>' + vLabel + '</strong>.',
        'Enjuagá el vaso de precipitados 2 o 3 veces con porciones pequeñas de agua destilada y agregá los enjuagues al matraz.',
        'Si la disolución generó calor, esperá que vuelva a temperatura ambiente.',
        'Completá con agua destilada hasta la marca del matraz. Tapá e invertí varias veces para homogeneizar.',
        'Etiquetá: nombre del reactivo, concentración, fecha, pureza usada y operador.'
      ].map(function (p) { return '<li>' + p + '</li>'; }).join('');

      document.getElementById('pasos').classList.add('visible');
    }


/* ── Wiring de eventos (reemplaza los on* inline del HTML) ── */
document.addEventListener('DOMContentLoaded', function () {
  var pureza = document.getElementById('pureza');
  if (pureza) pureza.addEventListener('input', function () { actualizarBarra(this.value); });
  var btn = document.getElementById('btn-calcular');
  if (btn) btn.addEventListener('click', calcular);
});
