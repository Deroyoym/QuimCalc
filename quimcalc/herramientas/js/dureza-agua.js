/* ============================================================
   CONVERSOR DE DUREZA DEL AGUA
   Archivo: herramientas/js/dureza-agua.js

   Unidades soportadas y factores de conversión a mg/L CaCO₃:
     mg/L CaCO₃   → base (×1)
     ppm CaCO₃    → igual que mg/L en agua (×1)
     mmol/L        → ×100.09 (PM del CaCO₃)
     mEq/L         → ×50.045 (PM del CaCO₃ / 2)
     °F (franceses)→ ×10
     °d (alemanes) → ×17.85
     °e (ingleses) → ×14.25
     gpg (grains/gallon EE.UU.) → ×17.12

   La estrategia:
     1. Convertimos el valor de entrada a mg/L CaCO₃ (base)
     2. Desde la base convertimos a todas las demás unidades
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* Coma decimal para todo texto visible */
  function conComa(s) { return String(s).replace(/(\d)\.(\d)/g, '$1,$2'); }

  const inputValor     = document.getElementById('valor-dureza');
  const selectUnidadDe = document.getElementById('unidad-de');
  const botonCalcular  = document.getElementById('btn-calcular');
  const contenedorRes  = document.getElementById('contenedor-resultados');
  const bloqueResultado  = document.getElementById('resultado');
  const valorResultado   = document.getElementById('resultado-valor');
  const formulaResultado = document.getElementById('resultado-formula');
  const etiquetaResultado = document.getElementById('resultado-etiqueta');

  /* ── Factores de conversión a mg/L CaCO₃ ─────────────────
     factor = cuántos mg/L CaCO₃ equivale 1 unidad de la columna
     ──────────────────────────────────────────────────────────── */
  const UNIDADES = [
    { codigo: 'mgl',   nombre: 'mg/L CaCO₃',         factor: 1       },
    { codigo: 'ppm',   nombre: 'ppm CaCO₃',           factor: 1       },
    { codigo: 'mmol',  nombre: 'mmol/L CaCO₃',        factor: 100.09  },
    { codigo: 'meq',   nombre: 'mEq/L',               factor: 50.045  },
    { codigo: 'fr',    nombre: '°fH (grados franceses)', factor: 10    },
    { codigo: 'de',    nombre: '°dH (grados alemanes)', factor: 17.848 },  /* 10 mg/L CaO */
    { codigo: 'en',    nombre: '°e (grados ingleses, Clark)', factor: 14.254 },  /* 1 grano/galón imperial */
    { codigo: 'gpg',   nombre: 'gpg (grains/gallon EE. UU.)', factor: 17.118 },
  ];

  botonCalcular.addEventListener('click', function () {

    const valor      = parseFloat(inputValor.value);
    const unidadDe   = selectUnidadDe.value;

    if (isNaN(valor) || valor < 0) {
      mostrarError('Ingresa un valor numérico válido (mayor o igual a cero).');
      return;
    }

    /* Encontramos la unidad de origen */
    const unidadOrigen = UNIDADES.find(u => u.codigo === unidadDe);

    /* Paso 1: convertimos a la base (mg/L CaCO₃) */
    const valorBase = valor * unidadOrigen.factor;

    /* Paso 2: convertimos desde la base a todas las demás unidades */
    const resultados = UNIDADES.map(function (unidad) {
      return {
        nombre: unidad.nombre,
        valor:  valorBase / unidad.factor,
        esOrigen: unidad.codigo === unidadDe,
      };
    });

    mostrarResultados(valor, unidadOrigen.nombre, valorBase, resultados);
  });

  /* ── Renderiza la tabla de resultados ──────────────────── */
  function mostrarResultados(valorOrig, nombreOrig, valorBase, resultados) {

    bloqueResultado.classList.remove('resultado--error');
    etiquetaResultado.textContent = conComa(`${valorOrig} ${nombreOrig} en todas las unidades`);
    valorResultado.textContent    = QCFormato.num(valorBase, 5, true) + ' mg/L CaCO₃';
    formulaResultado.textContent  = `Valor base de referencia: mg/L CaCO₃`;
    bloqueResultado.classList.add('visible');

    /* Clasificación habitual (USGS; también citada por la OMS) */
    let clasificacion = '';
    if      (valorBase < 60)  clasificacion = '💧 Agua blanda (< 60 mg/L CaCO₃)';
    else if (valorBase < 120) clasificacion = '💧 Agua moderadamente dura (60–120 mg/L CaCO₃)';
    else if (valorBase < 180) clasificacion = '⚠️ Agua dura (120–180 mg/L CaCO₃)';
    else                      clasificacion = '⚠️ Agua muy dura (> 180 mg/L CaCO₃)';

    /* Construimos la tabla */
    let tablaHTML = `
      <div class="clasificacion-dureza" role="note">
        <strong>Clasificación:</strong> ${clasificacion}
      </div>
      <table class="tabla-dureza" role="table" aria-label="Conversión de dureza del agua">
        <thead>
          <tr>
            <th scope="col">Unidad</th>
            <th scope="col">Valor equivalente</th>
          </tr>
        </thead>
        <tbody>
    `;

    resultados.forEach(function (r) {
      const esOrigen = r.esOrigen ? ' class="fila-origen"' : '';
      tablaHTML += `
        <tr${esOrigen}>
          <td>${r.nombre} ${r.esOrigen ? '<span class="badge-origen">origen</span>' : ''}</td>
          <td>${formatearValor(r.valor)}</td>
        </tr>
      `;
    });

    tablaHTML += '</tbody></table>';

    contenedorRes.innerHTML = tablaHTML;
    contenedorRes.style.display = 'block';
    contenedorRes.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  /* Formatea con decimales apropiados según la magnitud */
  function formatearValor(valor) {
    /* 5 cifras significativas (antes 0,5 mmol/L salía «5,0000e-1») */
    return QCFormato.num(valor, 5, true);
  }

  function mostrarError(mensaje) {
    bloqueResultado.classList.add('resultado--error');
    etiquetaResultado.textContent = 'Error';
    valorResultado.textContent    = mensaje;
    formulaResultado.textContent  = '';
    bloqueResultado.classList.add('visible');
    contenedorRes.style.display = 'none';
  }

  [inputValor, selectUnidadDe].forEach(function (el) {
    el.addEventListener('input', function () {
      bloqueResultado.classList.remove('visible');
      contenedorRes.style.display = 'none';
    });
  });

});
