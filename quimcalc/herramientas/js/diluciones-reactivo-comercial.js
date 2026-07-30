    /* ── Calculadora: dilución desde reactivo comercial ── */
    document.addEventListener('DOMContentLoaded', function () {

      var campos = ['densidad', 'pureza', 'masa-molar', 'c-final', 'v-final'];
      campos.forEach(function (id) {
        var el = document.getElementById(id);
        if (el) el.addEventListener('input', limpiar);
      });
      document.getElementById('unidad-c').addEventListener('change', limpiar);
      document.getElementById('unidad-v').addEventListener('change', limpiar);
    });

    function limpiar() {
      document.getElementById('resultado').classList.remove('visible', 'resultado--error');
      document.getElementById('pasos').classList.remove('visible');
      document.getElementById('alerta-seguridad').classList.remove('visible');
    }

    function mostrarError(msg) {
      var r = document.getElementById('resultado');
      r.className = 'resultado resultado--error visible';
      r.querySelector('.resultado__etiqueta').textContent = 'Error';
      r.querySelector('.resultado__valor').textContent = msg;
      r.querySelector('.resultado__formula').textContent = '';
    }

    function calcular() {
      var densidad  = parseFloat(document.getElementById('densidad').value);
      var pureza    = parseFloat(document.getElementById('pureza').value);
      var masaMolar = parseFloat(document.getElementById('masa-molar').value);
      var cFinal    = parseFloat(document.getElementById('c-final').value);
      var vFinal    = parseFloat(document.getElementById('v-final').value);
      var unidadC   = document.getElementById('unidad-c').value;
      var unidadV   = document.getElementById('unidad-v').value;

      /* Validaciones */
      if (isNaN(densidad) || densidad <= 0)    return mostrarError('Ingresá una densidad válida (> 0).');
      if (isNaN(pureza) || pureza <= 0 || pureza > 100) return mostrarError('La pureza debe estar entre 0 y 100 %.');
      if (isNaN(masaMolar) || masaMolar <= 0)  return mostrarError('Ingresá una masa molar válida (> 0).');
      if (isNaN(cFinal) || cFinal <= 0)        return mostrarError('Ingresá una concentración deseada válida (> 0).');
      if (isNaN(vFinal) || vFinal <= 0)        return mostrarError('Ingresá un volumen final válido (> 0).');

      /* Conversión de unidades ─ todo a mol/L y L */
      var cStockMolL = (densidad * 1000 * (pureza / 100)) / masaMolar;
      var cStockGl   = densidad * 1000 * (pureza / 100);

      var cFinalMolL;
      if (unidadC === 'mol/L') {
        cFinalMolL = cFinal;
      } else if (unidadC === 'g/L') {
        cFinalMolL = cFinal / masaMolar;
      } else if (unidadC === '%m/v') {
        cFinalMolL = (cFinal * 10) / masaMolar; // %m/v → g/100mL × 10 = g/L ÷ M
      }

      var vFinalL = unidadV === 'mL' ? vFinal / 1000 : vFinal;

      /* Validar que C_final ≤ C_stock */
      if (cFinalMolL > cStockMolL) {
        return mostrarError(
          'La concentración deseada (' + cFinalMolL.toFixed(4) + ' mol/L) supera la concentración del reactivo puro (' + cStockMolL.toFixed(4) + ' mol/L). No es posible esta dilución.'
        );
      }

      /* Cálculo del volumen a tomar */
      var vTomarL  = (cFinalMolL * vFinalL) / cStockMolL;
      var vTomarMl = vTomarL * 1000;

      /* Mostrar resultado */
      var r = document.getElementById('resultado');
      r.className = 'resultado visible';
      r.querySelector('.resultado__etiqueta').textContent = 'Volumen a tomar del reactivo comercial';
      r.querySelector('.resultado__valor').textContent = formatNum(vTomarMl) + ' mL';
      r.querySelector('.resultado__formula').textContent =
        'V = (C_final × V_final) / C_stock = (' + cFinalMolL.toFixed(4) + ' mol/L × ' +
        (vFinalL * 1000).toFixed(1) + ' mL) / ' + cStockMolL.toFixed(4) + ' mol/L';

      document.getElementById('res-stock-mol').textContent = cStockMolL.toFixed(4) + ' mol/L';
      document.getElementById('res-stock-g').textContent   = cStockGl.toFixed(2)   + ' g/L';

      /* Pasos de preparación */
      var pasos = document.getElementById('lista-pasos');
      var vFinalLabel = unidadV === 'mL'
        ? vFinal + ' mL'
        : (vFinal < 1 ? (vFinal * 1000).toFixed(0) + ' mL' : vFinal + ' L');

      pasos.innerHTML = [
        'Tomá ' + formatNum(vTomarMl) + ' mL del reactivo con una pipeta graduada o bureta apropiada. Si el volumen es mayor a 10 mL, podés usar una probeta.',
        'Vertí aproximadamente la mitad del agua destilada en el matraz aforado de ' + vFinalLabel + '.',
        'Agregá el reactivo <strong>lentamente</strong> al agua, con agitación constante.',
        'Si la mezcla se calienta, esperá que vuelva a temperatura ambiente antes de continuar.',
        'Completá con agua destilada hasta la marca del matraz aforado.',
        'Tapá el matraz y homogeneizá invirtiendo varias veces. Etiquetá con el nombre del reactivo, la concentración, la fecha y tu nombre.'
      ].map(function (p) {
        return '<li>' + p + '</li>';
      }).join('');

      document.getElementById('pasos').classList.add('visible');

      /* Alerta de seguridad para reactivos con densidad > 1.1 */
      if (densidad > 1.1) {
        document.getElementById('alerta-seguridad').classList.add('visible');
      }
    }

    function formatNum(n) {
      if (n >= 100)  return n.toFixed(1);
      if (n >= 10)   return n.toFixed(2);
      if (n >= 1)    return n.toFixed(3);
      return n.toFixed(4);
    }

/* ── Wiring de eventos (reemplaza los on* inline del HTML) ── */
document.addEventListener('DOMContentLoaded', function () {
  var btn = document.getElementById('btn-calcular');
  if (btn) btn.addEventListener('click', calcular);
});
