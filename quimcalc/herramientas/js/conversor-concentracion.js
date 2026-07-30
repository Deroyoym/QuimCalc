    /* ── Conversor de concentración ampliado ── */

    /* Todas las unidades y su info */
    var UNIDADES = [
      /* Molares */
      { id:'mol/L',   label:'mol/L',            grupo:'Molares',   necesitaM:false  },
      { id:'mmol/L',  label:'mmol/L (mM)',       grupo:'Molares',   necesitaM:false  },
      { id:'umol/L',  label:'µmol/L (µM)',       grupo:'Molares',   necesitaM:false  },
      /* Másicas por litro */
      { id:'g/L',     label:'g/L',               grupo:'Másicas',   necesitaM:true   },
      { id:'mg/L',    label:'mg/L',              grupo:'Másicas',   necesitaM:true   },
      { id:'ug/L',    label:'µg/L',              grupo:'Másicas',   necesitaM:true   },
      /* Clínicas / especiales */
      { id:'mg/dL',   label:'mg/dL',             grupo:'Clínicas',  necesitaM:true   },
      { id:'ugmL',    label:'µg/mL (= mg/L)',    grupo:'Clínicas',  necesitaM:true   },
      { id:'pct_mv',  label:'% m/v',             grupo:'Clínicas',  necesitaM:true   },
      /* Ambiental */
      { id:'ppm',     label:'ppm ≈ mg/L (aq.)',  grupo:'Ambiental', necesitaM:true   },
      { id:'ppb',     label:'ppb ≈ µg/L (aq.)', grupo:'Ambiental', necesitaM:true   },
    ];

    /* Convertir a mol/L (referencia interna) */
    function aMolL(val, unidad, M) {
      switch(unidad) {
        case 'mol/L':   return val;
        case 'mmol/L':  return val * 1e-3;
        case 'umol/L':  return val * 1e-6;
        case 'g/L':     return val / M;
        case 'mg/L':    return val / M / 1e3;
        case 'ug/L':    return val / M / 1e6;
        case 'mg/dL':   return (val * 10) / M / 1e3;   /* mg/dL × 10 = mg/L */
        case 'ugmL':    return val / M / 1e3;           /* = mg/L */
        case 'pct_mv':  return (val * 10) / M;          /* % m/v = 10 g/L */
        case 'ppm':     return val / M / 1e3;           /* ppm ≈ mg/L */
        case 'ppb':     return val / M / 1e6;           /* ppb ≈ µg/L */
        default:        return NaN;
      }
    }

    /* Convertir desde mol/L */
    function desdeMolL(molL, unidad, M) {
      switch(unidad) {
        case 'mol/L':   return molL;
        case 'mmol/L':  return molL * 1e3;
        case 'umol/L':  return molL * 1e6;
        case 'g/L':     return molL * M;
        case 'mg/L':    return molL * M * 1e3;
        case 'ug/L':    return molL * M * 1e6;
        case 'mg/dL':   return molL * M * 1e3 / 10;
        case 'ugmL':    return molL * M * 1e3;
        case 'pct_mv':  return molL * M / 10;
        case 'ppm':     return molL * M * 1e3;
        case 'ppb':     return molL * M * 1e6;
        default:        return NaN;
      }
    }

    function formatearValor(n) {
      if (isNaN(n) || !isFinite(n)) return '—';
      if (n === 0) return '0';
      var abs = Math.abs(n);
      if (abs >= 1e9)   return n.toExponential(4);
      if (abs >= 1e6)   return n.toLocaleString('es', {maximumFractionDigits:2});
      if (abs >= 1000)  return n.toLocaleString('es', {maximumFractionDigits:4});
      if (abs >= 1)     return n.toPrecision(6);
      if (abs >= 1e-3)  return n.toPrecision(5);
      return n.toExponential(4);
    }

    var grupoActual = '';

    function convertir() {
      var valStr   = document.getElementById('valor').value.trim();
      var unidadIn = document.getElementById('unidad-entrada').value;
      var masaStr  = document.getElementById('masa-molar').value.trim();
      var M        = parseFloat(masaStr);
      var val      = parseFloat(valStr);
      var errorDiv = document.getElementById('error-msg');

      errorDiv.style.display = 'none';

      var unidadInfo = UNIDADES.find(function(u){ return u.id === unidadIn; });
      var necesitaMInput = unidadInfo && unidadInfo.necesitaM;

      if (!valStr || isNaN(val) || val < 0) {
        renderGrid(null, null, false);
        return;
      }

      if (necesitaMInput && (isNaN(M) || M <= 0)) {
        errorDiv.style.display = 'block';
        document.getElementById('error-texto').textContent =
          'La unidad "' + unidadIn + '" requiere masa molar para convertir.';
        renderGrid(null, null, false);
        return;
      }

      var molL = aMolL(val, unidadIn, M);
      if (isNaN(molL)) {
        errorDiv.style.display = 'block';
        document.getElementById('error-texto').textContent = 'No se pudo convertir el valor ingresado.';
        return;
      }

      var tieneMolar = !isNaN(M) && M > 0;
      renderGrid(molL, M, tieneMolar, unidadIn);
    }

    function renderGrid(molL, M, tieneMolar, unidadActiva) {
      var grid = document.getElementById('conv-grid');
      var html = '';
      var grupoAnterior = '';

      UNIDADES.forEach(function(u) {
        /* Separador de grupo */
        if (u.grupo !== grupoAnterior) {
          html += '<div class="conv-grupo-titulo">' + u.grupo + '</div>';
          grupoAnterior = u.grupo;
        }

        var necesita = u.necesitaM;
        var puedeCalcular = molL !== null && (!necesita || tieneMolar);
        var esActiva = u.id === unidadActiva;

        var valorStr;
        if (!puedeCalcular) {
          valorStr = necesita && !tieneMolar ? '— (requiere M)' : '—';
        } else {
          var res = desdeMolL(molL, u.id, M);
          valorStr = formatearValor(res);
        }

        var claseCard = 'conv-card' +
          (esActiva ? ' activa' : '') +
          (necesita && !tieneMolar ? ' necesita-m' : '');
        var claseValor = 'conv-card__valor' + (valorStr === '—' || valorStr.includes('requiere') ? ' placeholder' : '');

        html +=
          '<div class="' + claseCard + '" role="listitem"' +
          (puedeCalcular ? ' data-valor="' + valorStr + '" title="Clic para copiar"' : '') +
          '>' +
          '<span class="conv-card__unidad">' + u.label + '</span>' +
          '<span class="' + claseValor + '">' + valorStr + '</span>' +
          '</div>';
      });

      /* Nota equivalencias */
      if (tieneMolar) {
        html += '<p class="conv-nota">Las unidades ppm, ppb, µg/mL y mg/L son equivalentes para soluciones acuosas diluidas (ρ ≈ 1 g/mL). Hacé clic en cualquier resultado para copiarlo.</p>';
      }

      grid.innerHTML = html;
    }

    function copiar(el, texto) {
      if (!texto || texto.includes('requiere') || texto === '—') return;
      navigator.clipboard.writeText(texto).then(function() {
        var toast = document.getElementById('copy-toast');
        toast.classList.add('visible');
        setTimeout(function(){ toast.classList.remove('visible'); }, 1800);
      });
    }

    /* Inicializar grid vacío */
    document.addEventListener('DOMContentLoaded', function() {
      renderGrid(null, null, false);
    });

/* ── Wiring de eventos (reemplaza los on* inline del HTML) ── */
document.addEventListener('DOMContentLoaded', function () {
  ['valor', 'masa-molar'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('input', convertir);
  });
  var sel = document.getElementById('unidad-entrada');
  if (sel) sel.addEventListener('change', convertir);
  var grid = document.getElementById('conv-grid');
  if (grid) grid.addEventListener('click', function (ev) {
    var card = ev.target.closest('.conv-card[data-valor]');
    if (card) copiar(card, card.getAttribute('data-valor'));
  });
});
