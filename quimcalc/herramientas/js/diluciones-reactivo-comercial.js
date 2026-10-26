    /* ── Calculadora: dilución desde reactivo comercial ── */

    /* Idioma de la página: la misma lógica sirve para /herramientas/ (es) y /en/tools/ (en) */
    var EN = (document.documentElement.lang || '').slice(0, 2) === 'en';
    var T = EN ? {
      errDensidad: 'Enter a valid density (> 0).',
      errPureza: 'The purity must be between 0 and 100 %.',
      errMasaMolar: 'Enter a valid molar mass (> 0).',
      errCFinal: 'Enter a valid target concentration (> 0).',
      errVFinal: 'Enter a valid final volume (> 0).',
      errSupera: function (cf, cs) {
        return 'The target concentration (' + cf + ' mol/L) is higher than the concentration of the stock reagent (' + cs + ' mol/L). This dilution is not possible.';
      },
      etiqueta: 'Volume of concentrated reagent to measure',
      pasos: function (v, material, vFinalLabel) {
        return [
          'Working in a fume hood, measure ' + v + ' mL of the reagent with ' + material,
          'Pour about half of the distilled water into the ' + vFinalLabel + ' volumetric flask.',
          'Add the reagent <strong>slowly</strong> to the water while swirling or stirring constantly.',
          'If the mixture warms up, let it cool to room temperature (≈\u00a020 °C, the calibration temperature of the flask) before continuing.',
          'Make up to the mark with distilled water.',
          'Stopper the flask and mix by inverting it several times. Label it with the reagent name, concentration, date and your initials.',
          'The concentration you get is <strong>nominal</strong>: the actual assay of the bottle may differ from the label. If the solution will be used as a titrant, standardize it against a primary standard before use.'
        ];
      },
      propipeta: ', always with a pipette filler (never pipette by mouth).',
      aforada: function (v) { return 'a ' + v + ' mL volumetric pipette'; },
      micro: 'a calibrated micropipette. Such a small volume has a large relative error: ' +
             'it is better to prepare an intermediate dilution first and dilute from it.',
      graduada: 'a graduated pipette of suitable capacity',
      probeta: 'a graduated cylinder of suitable capacity (or a burette, if you need better accuracy).'
    } : {
      errDensidad: 'Ingresá una densidad válida (> 0).',
      errPureza: 'La pureza debe estar entre 0 y 100 %.',
      errMasaMolar: 'Ingresá una masa molar válida (> 0).',
      errCFinal: 'Ingresá una concentración deseada válida (> 0).',
      errVFinal: 'Ingresá un volumen final válido (> 0).',
      errSupera: function (cf, cs) {
        return 'La concentración deseada (' + cf + ' mol/L) supera la concentración del reactivo puro (' + cs + ' mol/L). No es posible esta dilución.';
      },
      etiqueta: 'Volumen a tomar del reactivo comercial',
      pasos: function (v, material, vFinalLabel) {
        return [
          'Dentro de la campana, medí ' + v + ' mL del reactivo con ' + material,
          'Vertí aproximadamente la mitad del agua destilada en el matraz aforado de ' + vFinalLabel + '.',
          'Agregá el reactivo <strong>lentamente</strong> al agua, con agitación constante.',
          'Si la mezcla se calienta, esperá que vuelva a temperatura ambiente (≈ 20 °C, la de calibración del matraz) antes de continuar.',
          'Completá con agua destilada hasta la marca del matraz aforado.',
          'Tapá el matraz y homogeneizá invirtiendo varias veces. Etiquetá con el nombre del reactivo, la concentración, la fecha y tu nombre.',
          'La concentración obtenida es <strong>nominal</strong>: la riqueza real del frasco puede diferir de la etiqueta. Si la solución se va a usar como titulante, valorala frente a un patrón primario antes de usarla.'
        ];
      },
      propipeta: ', siempre con propipeta (nunca pipetees con la boca).',
      aforada: function (v) { return 'una pipeta aforada de ' + v + ' mL'; },
      micro: 'una micropipeta calibrada. Un volumen tan pequeño tiene mucho error relativo: ' +
             'conviene preparar primero una dilución intermedia y diluir a partir de ella.',
      graduada: 'una pipeta graduada de capacidad adecuada',
      probeta: 'una probeta de capacidad adecuada (o una bureta, si necesitás más exactitud).'
    };

    /* Coma decimal para todo número que se muestra (en inglés, punto: sin cambios) */
    function conComa(s) { return EN ? String(s) : String(s).replace(/(\d)\.(\d)/g, '$1,$2'); }

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
      r.querySelector('.resultado__valor').textContent = conComa(msg);
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
      if (isNaN(densidad) || densidad <= 0)    return mostrarError(T.errDensidad);
      if (isNaN(pureza) || pureza <= 0 || pureza > 100) return mostrarError(T.errPureza);
      if (isNaN(masaMolar) || masaMolar <= 0)  return mostrarError(T.errMasaMolar);
      if (isNaN(cFinal) || cFinal <= 0)        return mostrarError(T.errCFinal);
      if (isNaN(vFinal) || vFinal <= 0)        return mostrarError(T.errVFinal);

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
        return mostrarError(T.errSupera(cFinalMolL.toFixed(4), cStockMolL.toFixed(4)));
      }

      /* Cálculo del volumen a tomar */
      var vTomarL  = (cFinalMolL * vFinalL) / cStockMolL;
      var vTomarMl = vTomarL * 1000;

      /* Mostrar resultado */
      var r = document.getElementById('resultado');
      r.className = 'resultado visible';
      r.querySelector('.resultado__etiqueta').textContent = T.etiqueta;
      r.querySelector('.resultado__valor').textContent = conComa(formatNum(vTomarMl)) + ' mL';
      r.querySelector('.resultado__formula').textContent = conComa(
        'V = (C_final × V_final) / C_stock = (' + cFinalMolL.toFixed(4) + ' mol/L × ' +
        (vFinalL * 1000).toFixed(1) + ' mL) / ' + cStockMolL.toFixed(4) + ' mol/L');

      document.getElementById('res-stock-mol').textContent = conComa(cStockMolL.toFixed(4)) + ' mol/L';
      document.getElementById('res-stock-g').textContent   = conComa(cStockGl.toFixed(2))   + ' g/L';

      /* Pasos de preparación */
      var pasos = document.getElementById('lista-pasos');
      var vFinalLabel = unidadV === 'mL'
        ? vFinal + ' mL'
        : (vFinal < 1 ? (vFinal * 1000).toFixed(0) + ' mL' : vFinal + ' L');

      /* Los pasos solo llevan texto y <strong>: conComa no toca atributos.
         Cada paso va en un <span> porque el <li> es flex: sin él, el <strong>
         partiría el texto en columnas. */
      pasos.innerHTML = conComa(T.pasos(formatNum(vTomarMl), materialMedicion(vTomarMl), vFinalLabel).map(function (p) {
        return '<li><span>' + p + '</span></li>';
      }).join(''));

      document.getElementById('pasos').classList.add('visible');

      /* Alerta de seguridad para reactivos con densidad > 1.1 */
      if (densidad > 1.1) {
        document.getElementById('alerta-seguridad').classList.add('visible');
      }
    }

    /*
     * Material para medir el reactivo concentrado. Su riqueza es nominal (±1 % según
     * la etiqueta) y la solución se valora después, así que no hace falta material
     * de máxima exactitud: si el volumen coincide con una pipeta aforada estándar se
     * sugiere esa; si no, pipeta graduada hasta 25 mL y probeta por encima.
     */
    function materialMedicion(v) {
      var PROPIPETA = T.propipeta;
      var aforadas = [1, 2, 5, 10, 20, 25, 50, 100];
      for (var i = 0; i < aforadas.length; i++) {
        if (Math.abs(v - aforadas[i]) / aforadas[i] <= 0.005) {
          return T.aforada(aforadas[i]) + PROPIPETA;
        }
      }
      if (v < 1) {
        return T.micro;
      }
      if (v <= 25) return T.graduada + PROPIPETA;
      return T.probeta;
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
