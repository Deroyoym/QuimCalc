/* ============================================================
   CALCULADORA DE INCERTIDUMBRE DE MEDICIÓN
   Archivo: herramientas/js/incertidumbre.js

   Implementa el método GUM (Guide to the Expression of
   Uncertainty in Measurement — ISO/IEC Guide 98-3)

   Componentes de incertidumbre:
     Tipo A — evaluación estadística (repetibilidad)
     Tipo B — evaluación por otros medios (especificaciones,
               certificados de calibración, literatura)

   Cálculo:
     1. u_A = s / √n  (desviación estándar de la media)
     2. u_B = a / k   (donde a = semirango, k = factor divisor)
     3. u_c = √(Σ(ci × u_i)²)   (incertidumbre combinada)
     4. U   = k_p × u_c          (incertidumbre expandida, k=2 → 95%)
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* Idioma de la página: la misma lógica sirve para /herramientas/ (es) y /en/tools/ (en) */
  const EN = (document.documentElement.lang || '').slice(0, 2) === 'en';
  const T = EN ? {
    compDefecto: n => `Component ${n}`,
    errPocasLecturas: 'A Type A component needs at least 2 readings.',
    errSemirango: 'Enter a half-width (a) greater than zero.',
    errU: 'The standard uncertainty of this component could not be calculated. Check the data.',
    errSinComp: 'Add at least one uncertainty component.',
    errCalcula: 'Calculate first.',
    tipo: 'Type',
    distrib: {
      normal: 'Normal (divisor 1)',
      rectangular: 'Rectangular (divisor √3)',
      triangular: 'Triangular (divisor √6)',
      u: 'U-shaped (divisor √2)'
    },
    vacio: 'No components added yet',
    eliminar: 'Remove',
    locale: 'en-US',
    expTitulo: 'UNCERTAINTY BUDGET — QuimCalc (GUM method)',
    expFecha: 'Date',
    expComps: 'UNCERTAINTY COMPONENTS',
    expCab: '#\tName\tType\tu(xi)\tci\tci×u(xi)\t% contribution',
    expResultado: 'FINAL RESULT',
    expUc: 'Combined standard uncertainty (uc)',
    expK: 'Coverage factor (k)',
    expU: 'Expanded uncertainty (U = k×uc)',
    expDetalle: 'Component details:',
    copiado: '✓ Copied to clipboard',
    btnExportar: 'Export uncertainty budget',
    copiaManual: 'Copy the text (Ctrl+A, Ctrl+C):'
  } : {
    compDefecto: n => `Componente ${n}`,
    errPocasLecturas: 'Para una componente Tipo A necesitás al menos 2 lecturas.',
    errSemirango: 'Ingresá un semirango (a) mayor a cero.',
    errU: 'No se pudo calcular la incertidumbre del componente. Verificá los datos.',
    errSinComp: 'Agregá al menos una componente de incertidumbre.',
    errCalcula: 'Calculá primero.',
    tipo: 'Tipo',
    distrib: {
      normal: 'Normal (k=1)',
      rectangular: 'Rectangular (k=√3)',
      triangular: 'Triangular (k=√6)',
      u: 'En U (k=√2)'
    },
    vacio: 'Todavía no hay componentes agregados',
    eliminar: 'Eliminar',
    locale: 'es',
    expTitulo: 'PRESUPUESTO DE INCERTIDUMBRE — QuimCalc (Método GUM)',
    expFecha: 'Fecha',
    expComps: 'COMPONENTES DE INCERTIDUMBRE',
    expCab: 'Nº\tNombre\tTipo\tu(xi)\tci\tci×u(xi)\t% contribución',
    expResultado: 'RESULTADO FINAL',
    expUc: 'Incertidumbre combinada (uc)',
    expK: 'Factor de cobertura (k)',
    expU: 'Incertidumbre expandida (U = k×uc)',
    expDetalle: 'Detalle de componentes:',
    copiado: '✓ Copiado al portapapeles',
    btnExportar: 'Exportar presupuesto de incertidumbre',
    copiaManual: 'Copiá el texto (Ctrl+A, Ctrl+C):'
  };

  /* Coma decimal para todo texto visible (solo en español) */
  function conComa(s) { return EN ? String(s) : String(s).replace(/(\d)\.(\d)/g, '$1,$2'); }

  /*
   * Lee una lista de números escrita por el usuario. Separadores: espacio, «;» o
   * salto de línea. Decimales: coma o punto. Si el texto ya usa punto decimal, la
   * coma se toma como separador (formato «5.42, 5.38»); si no, «5,42» es un decimal.
   * Un fragmento con dos o más comas («1,2,3») se separa por comas.
   */
  function leerNumeros(texto) {
    var hayPunto = EN || /\d\.\d/.test(texto);   /* en inglés la coma siempre separa */
    var out = [];
    texto.split(/[\s;]+/).forEach(function (tok) {
      if (!tok) return;
      var comas = (tok.match(/,/g) || []).length;
      var partes = (hayPunto || comas >= 2) ? tok.split(',') : [tok.replace(',', '.')];
      partes.forEach(function (p) { var n = parseFloat(p); if (!isNaN(n)) out.push(n); });
    });
    return out;
  }

  /* ── Estado: lista de componentes de incertidumbre ──────── */
  let componentes = [];
  let componenteIdCounter = 0;

  /* ── Referencias ────────────────────────────────────────── */
  const selectTipoComp    = document.getElementById('tipo-componente');
  const panelTipoA        = document.getElementById('panel-tipo-a');
  const panelTipoB        = document.getElementById('panel-tipo-b');
  const btnAgregarComp    = document.getElementById('btn-agregar-componente');
  const listaComponentes  = document.getElementById('lista-componentes');
  const btnCalcular       = document.getElementById('btn-calcular');
  const inputKp           = document.getElementById('factor-cobertura');
  const bloqueResultado   = document.getElementById('resultado');
  const resUc             = document.getElementById('res-uc');
  const resU              = document.getElementById('res-u');
  const resKp             = document.getElementById('res-kp');
  const resNivel          = document.getElementById('res-nivel');
  const tablaDesglose     = document.getElementById('tabla-desglose');
  const btnExportar       = document.getElementById('btn-exportar');

  /* ── Cambio de tipo de componente ───────────────────────── */
  selectTipoComp.addEventListener('change', function () {
    panelTipoA.hidden = selectTipoComp.value !== 'A';
    panelTipoB.hidden = selectTipoComp.value !== 'B';
  });

  /* ── Agregar componente de incertidumbre ────────────────── */
  btnAgregarComp.addEventListener('click', function () {

    const tipo    = selectTipoComp.value;
    const nombre  = document.getElementById('nombre-componente').value.trim() || T.compDefecto(componenteIdCounter + 1);
    const ci      = parseFloat(document.getElementById('coef-sensibilidad').value) || 1;

    let u, descripcion;

    if (tipo === 'A') {
      /* Tipo A: estadístico — necesitamos s y n */
      const lecturas = document.getElementById('lecturas-tipo-a').value.trim();
      const vals = leerNumeros(lecturas);

      if (vals.length < 2) {
        alert(T.errPocasLecturas);
        return;
      }

      const n    = vals.length;
      const media = vals.reduce((a, b) => a + b, 0) / n;
      const s    = Math.sqrt(vals.reduce((acc, v) => acc + Math.pow(v - media, 2), 0) / (n - 1));
      u = s / Math.sqrt(n); /* Desviación estándar de la media */

      descripcion = conComa(`${T.tipo} A · n=${n} · x̄=${media.toFixed(6)} · s=${s.toFixed(6)} · u=s/√n=${u.toFixed(6)}`);
    }
    else {
      /* Tipo B: por especificación — necesitamos semirango y distribución */
      const a            = parseFloat(document.getElementById('semirango').value);
      const distribucion = document.getElementById('distribucion').value;

      if (isNaN(a) || a <= 0) {
        alert(T.errSemirango);
        return;
      }

      /* Factor divisor según distribución:
         Normal:      k = 1 (si ya es desv. estándar)
         Rectangular: k = √3
         Triangular:  k = √6
         U (forma de U): k = √2           */
      const factores = { normal: 1, rectangular: Math.sqrt(3), triangular: Math.sqrt(6), u: Math.sqrt(2) };
      const k = factores[distribucion] || Math.sqrt(3);
      u = a / k;

      const nombresDistrib = T.distrib;

      descripcion = conComa(`${T.tipo} B · a=${a} · ${nombresDistrib[distribucion]} · u=a/k=${u.toFixed(6)}`);
    }

    if (isNaN(u) || u <= 0) {
      alert(T.errU);
      return;
    }

    componenteIdCounter++;
    const comp = { id: componenteIdCounter, nombre, tipo, ci: Math.abs(ci), u, descripcion };
    componentes.push(comp);
    renderizarComponentes();

    /* Limpiamos campos */
    document.getElementById('nombre-componente').value = '';
    document.getElementById('coef-sensibilidad').value = '1';
    document.getElementById('lecturas-tipo-a').value = '';
    document.getElementById('semirango').value = '';
  });

  /* ── Renderizar lista de componentes ────────────────────── */
  function renderizarComponentes() {
    listaComponentes.innerHTML = '';

    if (componentes.length === 0) {
      listaComponentes.innerHTML = `
        <div style="text-align:center;color:var(--color-texto-suave);font-size:0.875rem;padding:var(--espacio-lg);font-style:italic;">
          ${T.vacio}
        </div>`;
      return;
    }

    componentes.forEach(function (comp) {
      const div = document.createElement('div');
      div.className = 'componente-item';
      div.innerHTML = `
        <div class="componente-item__header">
          <span class="badge-tipo ${comp.tipo === 'A' ? 'badge-tipo--a' : 'badge-tipo--b'}">
            ${T.tipo} ${comp.tipo}
          </span>
          <strong class="componente-item__nombre">${comp.nombre}</strong>
          <button
            class="btn-eliminar-comp"
            data-id="${comp.id}"
            aria-label="${T.eliminar} ${comp.nombre}"
          >✕</button>
        </div>
        <p class="componente-item__desc">${comp.descripcion}</p>
        <p class="componente-item__u">
          u(x) = <strong>${conComa(comp.u.toFixed(6))}</strong> · ci = <strong>${conComa(comp.ci)}</strong> · ci×u = <strong>${conComa((comp.ci * comp.u).toFixed(6))}</strong>
        </p>
      `;
      listaComponentes.appendChild(div);
    });

    /* Botones eliminar */
    document.querySelectorAll('.btn-eliminar-comp').forEach(function (btn) {
      btn.addEventListener('click', function () {
        componentes = componentes.filter(c => c.id !== parseInt(btn.dataset.id));
        renderizarComponentes();
        bloqueResultado.classList.remove('visible');
      });
    });
  }

  /* ── CÁLCULO PRINCIPAL ──────────────────────────────────── */
  btnCalcular.addEventListener('click', function () {

    if (componentes.length === 0) {
      alert(T.errSinComp);
      return;
    }

    const kp = parseFloat(inputKp.value) || 2;

    /* Incertidumbre combinada: u_c = √(Σ(ci × u_i)²) */
    const uc = Math.sqrt(
      componentes.reduce((acc, comp) => acc + Math.pow(comp.ci * comp.u, 2), 0)
    );

    /* Incertidumbre expandida */
    const U = kp * uc;

    /* Nivel de confianza aproximado según kp */
    const nivelConfianza = {
      1: '~68%', 2: '~95%', 2.576: '~99%', 3: '~99.7%'
    }[kp] || `k = ${kp}`;

    /* Mostramos resultados */
    resUc.textContent    = conComa(uc.toFixed(6));
    resU.textContent     = conComa(U.toFixed(6));
    resKp.textContent    = conComa(kp);
    resNivel.textContent = conComa(nivelConfianza);

    /* Tabla de desglose */
    renderizarTablaDesglose(componentes, uc);

    bloqueResultado.classList.add('visible');
    bloqueResultado.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  /* ── Tabla de desglose de incertidumbre ─────────────────── */
  function renderizarTablaDesglose(comps, uc) {
    tablaDesglose.innerHTML = '';

    comps.forEach(function (comp) {
      const contribucion = comp.ci * comp.u;
      const porcentaje   = uc > 0 ? (Math.pow(contribucion, 2) / Math.pow(uc, 2) * 100) : 0;
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${comp.nombre}</td>
        <td>${T.tipo} ${comp.tipo}</td>
        <td>${conComa(comp.u.toFixed(6))}</td>
        <td>${conComa(comp.ci.toFixed(4))}</td>
        <td>${conComa(contribucion.toFixed(6))}</td>
        <td>${conComa(porcentaje.toFixed(1))}%</td>
      `;
      tablaDesglose.appendChild(tr);
    });
  }

  /* ── Exportar ───────────────────────────────────────────── */
  btnExportar.addEventListener('click', function () {
    if (componentes.length === 0) { alert(T.errCalcula); return; }

    const kp = parseFloat(inputKp.value) || 2;
    const uc = Math.sqrt(componentes.reduce((acc, comp) => acc + Math.pow(comp.ci * comp.u, 2), 0));
    const U  = kp * uc;
    const fecha = new Date().toLocaleDateString(T.locale);

    let texto = `${T.expTitulo}\n`;
    texto += `${T.expFecha}: ${fecha}\n\n`;
    texto += `${T.expComps}\n`;
    texto += `${T.expCab}\n`;

    componentes.forEach((comp, i) => {
      const contrib = comp.ci * comp.u;
      const pct = uc > 0 ? conComa((Math.pow(contrib, 2) / Math.pow(uc, 2) * 100).toFixed(1)) : conComa('0.0');
      texto += `${i+1}\t${comp.nombre}\t${T.tipo} ${comp.tipo}\t${conComa(comp.u.toFixed(6))}\t${conComa(comp.ci.toFixed(4))}\t${conComa(contrib.toFixed(6))}\t${pct}%\n`;
    });

    texto += `\n${T.expResultado}\n`;
    texto += `${T.expUc}: ${conComa(uc.toFixed(6))}\n`;
    texto += `${T.expK}: ${conComa(kp)}\n`;
    texto += `${T.expU}: ${conComa(U.toFixed(6))}\n`;
    texto += `\n${T.expDetalle}\n`;
    componentes.forEach(c => { texto += `  • ${c.nombre}: ${c.descripcion}\n`; });

    navigator.clipboard.writeText(texto).then(function () {
      btnExportar.textContent = T.copiado;
      setTimeout(() => { btnExportar.textContent = T.btnExportar; }, 2500);
    }).catch(() => { prompt(T.copiaManual, texto); });
  });

  /* Inicializar */
  renderizarComponentes();
});
