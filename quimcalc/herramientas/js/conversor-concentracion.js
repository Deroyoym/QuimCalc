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

    /* Unidades másicas entre sí, sin masa molar (referencia: g/L) */
    var A_GL = { 'g/L':1, 'mg/L':1e-3, 'ug/L':1e-6, 'mg/dL':1e-2, 'ugmL':1e-3,
                 'pct_mv':10, 'ppm':1e-3, 'ppb':1e-6 };

    function formatearValor(n) {
      if (isNaN(n) || !isFinite(n)) return '—';
      if (n === 0) return '0';
      var abs = Math.abs(n);
      /* Sin separador de miles: mezclado con el punto decimal era ambiguo
         ("58.440" podía leerse 58,44). Hasta 6 cifras, sin ceros de relleno. */
      if (abs >= 1e9 || abs < 1e-4) return n.toExponential(4);
      return String(parseFloat(n.toPrecision(6)));
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

      /* Unidad másica sin masa molar: se convierte solo entre unidades
         másicas; las molares quedan como "requiere M". */
      if (necesitaMInput && (isNaN(M) || M <= 0)) {
        renderGrid(null, null, false, unidadIn, val * A_GL[unidadIn]);
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

    function renderGrid(molL, M, tieneMolar, unidadActiva, gL) {
      var soloMasa = molL === null && typeof gL === 'number';
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
        var puedeCalcular = soloMasa ? necesita
                          : molL !== null && (!necesita || tieneMolar);
        var esActiva = u.id === unidadActiva;
        /* En modo "solo masa" las que faltan son las molares */
        var faltaM = soloMasa ? !necesita : (necesita && !tieneMolar);

        var valorStr;
        if (!puedeCalcular) {
          var sinDato = molL === null && !soloMasa;
          valorStr = !sinDato && faltaM ? '— (requiere M)' : '—';
        } else if (soloMasa) {
          valorStr = formatearValor(gL / A_GL[u.id]);
        } else {
          var res = desdeMolL(molL, u.id, M);
          valorStr = formatearValor(res);
        }

        var claseCard = 'conv-card' +
          (esActiva ? ' activa' : '') +
          (faltaM ? ' necesita-m' : '');
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
      if (soloMasa) {
        html += '<p class="conv-nota">Sin masa molar se convierte solo entre unidades de masa. Ingresá la masa molar para ver también mol/L, mmol/L y µmol/L.</p>';
      } else if (tieneMolar) {
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
