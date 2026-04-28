/* ============================================================
   CALCULADORA DE TITULACIÓN
   Archivo: herramientas/js/titulacion.js

   Fórmula base: N₁ × V₁ = N₂ × V₂
   (igual que C₁V₁=C₂V₂ pero con normalidad)

   También puede calcular:
     - Concentración molar del analito: M = N / valencia
     - Masa del analito en la muestra: masa = M × V_muestra × PM
     - % del analito en la muestra: % = (masa_analito / masa_muestra) × 100

   Modos:
     1. Calcular concentración del analito (modo más común)
     2. Calcular volumen de titulante gastado (para verificar)
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ── Referencias ────────────────────────────────────────── */
  const selectModo       = document.getElementById('modo');
  const inputNtit        = document.getElementById('n-titulante');
  const inputVtit        = document.getElementById('v-titulante');
  const inputVmuestra    = document.getElementById('v-muestra');
  const inputValenciaAn  = document.getElementById('valencia-analito');
  const inputPM          = document.getElementById('pm-analito');
  const inputMasaMuestra = document.getElementById('masa-muestra');
  const botonCalcular    = document.getElementById('btn-calcular');
  const bloqueResultado  = document.getElementById('resultado');
  const valorResultado   = document.getElementById('resultado-valor');
  const formulaResultado = document.getElementById('resultado-formula');
  const etiquetaResultado = document.getElementById('resultado-etiqueta');
  const contenedorExtra  = document.getElementById('resultado-extra');

  /* Campos opcionales que aparecen solo en modo 1 */
  const grupoOpcionales = document.getElementById('grupo-opcionales');
  const campoVtit       = document.getElementById('campo-vtit');

  /* ── Cambio de modo ─────────────────────────────────────── */
  selectModo.addEventListener('change', function () {
    const modo = selectModo.value;
    /* Modo 1: calcular concentración → V titulante es dato */
    /* Modo 2: calcular V titulante → es la incógnita */
    campoVtit.querySelector('label').textContent =
      modo === 'conc'
        ? 'Volumen de titulante gastado (mL)'
        : 'Volumen de titulante a calcular — dejá vacío';

    if (modo === 'vtit') {
      inputVtit.value = '';
      inputVtit.placeholder = 'Se calculará automáticamente';
      inputVtit.readOnly = true;
      grupoOpcionales.hidden = true;
    } else {
      inputVtit.placeholder = 'Ej: 12.5';
      inputVtit.readOnly = false;
      grupoOpcionales.hidden = false;
    }
    bloqueResultado.classList.remove('visible');
    contenedorExtra.innerHTML = '';
  });

  /* ── Cálculo principal ──────────────────────────────────── */
  botonCalcular.addEventListener('click', function () {

    const modo      = selectModo.value;
    const Ntit      = parseFloat(inputNtit.value);
    const Vtit      = parseFloat(inputVtit.value);
    const Vmuestra  = parseFloat(inputVmuestra.value);

    /* ── Modo 1: Calcular concentración del analito ─────────
       N_analito = (N_titulante × V_titulante) / V_muestra
       ──────────────────────────────────────────────────────── */
    if (modo === 'conc') {

      if (isNaN(Ntit) || Ntit <= 0)    { mostrarError('Ingresá la normalidad del titulante (mayor a cero).'); return; }
      if (isNaN(Vtit) || Vtit <= 0)    { mostrarError('Ingresá el volumen de titulante gastado.'); return; }
      if (isNaN(Vmuestra) || Vmuestra <= 0) { mostrarError('Ingresá el volumen de la muestra.'); return; }

      const Nanalito = (Ntit * Vtit) / Vmuestra;
      const formula  = `N(analito) = (${Ntit} N × ${Vtit} mL) / ${Vmuestra} mL`;

      mostrarResultado(
        `N(analito) = ${Nanalito.toFixed(5)} N`,
        'Normalidad del analito',
        formula
      );

      /* ── Cálculos opcionales si se ingresaron datos extra ── */
      const valencia    = parseFloat(inputValenciaAn.value);
      const PM          = parseFloat(inputPM.value);
      const masaMuestra = parseFloat(inputMasaMuestra.value);
      const extras      = [];

      /* Concentración molar */
      if (!isNaN(valencia) && valencia > 0) {
        const Manalito = Nanalito / valencia;
        extras.push({
          titulo: 'Concentración molar del analito',
          valor:  `M(analito) = ${Manalito.toFixed(5)} mol/L`,
          formula: `M = N / valencia = ${Nanalito.toFixed(5)} / ${valencia}`,
        });

        /* Masa del analito en la muestra */
        if (!isNaN(PM) && PM > 0) {
          /* V_muestra está en mL → lo convertimos a L */
          const masaAnalito = Manalito * (Vmuestra / 1000) * PM;
          extras.push({
            titulo: 'Masa del analito en la alícuota',
            valor:  `${masaAnalito.toFixed(5)} g`,
            formula: `masa = M × V(muestra en L) × PM = ${Manalito.toFixed(5)} × ${(Vmuestra/1000).toFixed(4)} × ${PM}`,
          });

          /* % del analito en muestra sólida */
          if (!isNaN(masaMuestra) && masaMuestra > 0) {
            const porcentaje = (masaAnalito / masaMuestra) * 100;
            extras.push({
              titulo: '% del analito en la muestra',
              valor:  `${porcentaje.toFixed(4)} %`,
              formula: `% = (${masaAnalito.toFixed(5)} g / ${masaMuestra} g) × 100`,
            });
          }
        }
      }

      mostrarExtras(extras);
    }

    /* ── Modo 2: Calcular volumen de titulante ───────────────
       V_titulante = (N_analito × V_muestra) / N_titulante
       ──────────────────────────────────────────────────────── */
    else if (modo === 'vtit') {

      const Nanalito = parseFloat(document.getElementById('n-analito-conocida').value);

      if (isNaN(Ntit) || Ntit <= 0)       { mostrarError('Ingresá la normalidad del titulante.'); return; }
      if (isNaN(Nanalito) || Nanalito <= 0) { mostrarError('Ingresá la normalidad del analito.'); return; }
      if (isNaN(Vmuestra) || Vmuestra <= 0) { mostrarError('Ingresá el volumen de la muestra.'); return; }

      const VtitCalc = (Nanalito * Vmuestra) / Ntit;
      const formula  = `V(tit) = (${Nanalito} N × ${Vmuestra} mL) / ${Ntit} N`;

      mostrarResultado(
        `V(titulante) = ${VtitCalc.toFixed(4)} mL`,
        'Volumen de titulante esperado',
        formula
      );
    }
  });

  /* ── Funciones auxiliares ───────────────────────────────── */
  function mostrarResultado(valor, descripcion, formula) {
    bloqueResultado.classList.remove('resultado--error');
    etiquetaResultado.textContent = descripcion;
    valorResultado.textContent    = valor;
    formulaResultado.textContent  = formula;
    bloqueResultado.classList.add('visible');
    bloqueResultado.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function mostrarExtras(extras) {
    contenedorExtra.innerHTML = '';
    if (extras.length === 0) return;

    extras.forEach(function (e) {
      const div = document.createElement('div');
      div.style.cssText = `
        margin-top: var(--espacio-md);
        padding-top: var(--espacio-md);
        border-top: 1px solid rgba(37,99,235,0.2);
      `;
      div.innerHTML = `
        <p style="font-size:0.8rem;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:var(--color-acento);margin-bottom:4px;">
          ${e.titulo}
        </p>
        <p style="font-size:1.2rem;font-weight:700;color:var(--color-texto);margin-bottom:4px;">${e.valor}</p>
        <p style="font-size:0.85rem;color:var(--color-texto-suave);font-family:monospace;">${e.formula}</p>
      `;
      contenedorExtra.appendChild(div);
    });
  }

  function mostrarError(mensaje) {
    bloqueResultado.classList.add('resultado--error');
    etiquetaResultado.textContent = 'Error';
    valorResultado.textContent    = mensaje;
    formulaResultado.textContent  = '';
    bloqueResultado.classList.add('visible');
    contenedorExtra.innerHTML     = '';
  }

  document.querySelectorAll('input, select').forEach(function (el) {
    el.addEventListener('input', function () {
      if (!el.readOnly) bloqueResultado.classList.remove('visible');
    });
  });

});
