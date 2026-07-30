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

    function actualizarBarra(val) {
      var pct = Math.min(100, Math.max(0, parseFloat(val) || 0));
      var bar  = document.getElementById('pureza-bar');
      var lbl  = document.getElementById('pureza-label');
      bar.style.setProperty('--pureza-pct', pct + '%');
      var impurezas = (100 - pct).toFixed(1);
      lbl.textContent = 'Pureza: ' + pct.toFixed(1).replace('.', ',') + ' %  —  Impurezas: ' + impurezas.replace('.', ',') + ' %';
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
      if (isNaN(masaMolar) || masaMolar <= 0)               return mostrarError('Ingresá una masa molar válida (> 0).');
      if (isNaN(pureza)    || pureza <= 0 || pureza > 100)  return mostrarError('La pureza debe estar entre 0 y 100 %.');

      /* Conversiones */
      var cMolL = unidadC === 'mol/L' ? cDeseada : cDeseada / masaMolar;
      var vL    = unidadV === 'mL'    ? vFinal / 1000 : vFinal;

      /* Cálculo */
      var masaPura    = cMolL * vL * masaMolar;           // g de sustancia pura
      var masaReact   = masaPura / (pureza / 100);         // g de reactivo a pesar
      var masaExtra   = masaReact - masaPura;              // g de impurezas

      /* Mostrar resultado */
      var r = document.getElementById('resultado');
      r.className = 'resultado visible';
      r.querySelector('.resultado__etiqueta').textContent = 'Masa a pesar del reactivo';
      r.querySelector('.resultado__valor').textContent    = formatNum(masaReact) + ' g';
      r.querySelector('.resultado__formula').textContent  =
        'm = (C × V × M) / (P/100) = (' + cMolL.toFixed(4) + ' mol/L × ' +
        (vL * 1000).toFixed(1) + ' mL × ' + masaMolar.toFixed(2) + ' g/mol) / ' +
        (pureza / 100).toFixed(4);

      document.getElementById('res-masa-pura').textContent = formatNum(masaPura) + ' g';
      document.getElementById('res-extra').textContent     = formatNum(masaExtra) + ' g';

      /* Pasos de preparación */
      var vLabel = unidadV === 'mL' ? vFinal + ' mL' : vFinal + ' L';
      var pasos  = document.getElementById('lista-pasos');

      pasos.innerHTML = [
        'Pesá <strong>' + formatNum(masaReact) + ' g</strong> del reactivo en una balanza analítica usando un recipiente seco y tarado.',
        'Disolvé el reactivo en un vaso de precipitados con aproximadamente el 70–80 % del volumen final de agua destilada. Agitá hasta disolución completa.',
        'Trasvasá cuantitativamente al matraz aforado de <strong>' + vLabel + '</strong>.',
        'Enjuagá el vaso de precipitados 2 o 3 veces con porciones pequeñas de agua destilada y agregá los enjuagues al matraz.',
        'Si la disolución generó calor, esperá que vuelva a temperatura ambiente.',
        'Completá con agua destilada hasta la marca del matraz. Tapá e invertí varias veces para homogeneizar.',
        'Etiquetá: nombre del reactivo, concentración, fecha, pureza usada y operador.'
      ].map(function (p) { return '<li>' + p + '</li>'; }).join('');

      document.getElementById('pasos').classList.add('visible');
    }

    function formatNum(n) {
      if (n >= 100)  return n.toFixed(2);
      if (n >= 10)   return n.toFixed(3);
      if (n >= 1)    return n.toFixed(4);
      return n.toFixed(4);
    }

/* ── Wiring de eventos (reemplaza los on* inline del HTML) ── */
document.addEventListener('DOMContentLoaded', function () {
  var pureza = document.getElementById('pureza');
  if (pureza) pureza.addEventListener('input', function () { actualizarBarra(this.value); });
  var btn = document.getElementById('btn-calcular');
  if (btn) btn.addEventListener('click', calcular);
});
