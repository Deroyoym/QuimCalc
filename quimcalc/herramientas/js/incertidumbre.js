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
    const nombre  = document.getElementById('nombre-componente').value.trim() || `Componente ${componenteIdCounter + 1}`;
    const ci      = parseFloat(document.getElementById('coef-sensibilidad').value) || 1;

    let u, descripcion;

    if (tipo === 'A') {
      /* Tipo A: estadístico — necesitamos s y n */
      const lecturas = document.getElementById('lecturas-tipo-a').value.trim();
      const vals = lecturas.split(/[\n,;]+/).map(v => parseFloat(v.trim())).filter(v => !isNaN(v));

      if (vals.length < 2) {
        alert('Para una componente Tipo A necesitás al menos 2 lecturas.');
        return;
      }

      const n    = vals.length;
      const media = vals.reduce((a, b) => a + b, 0) / n;
      const s    = Math.sqrt(vals.reduce((acc, v) => acc + Math.pow(v - media, 2), 0) / (n - 1));
      u = s / Math.sqrt(n); /* Desviación estándar de la media */

      descripcion = `Tipo A · n=${n} · x̄=${media.toFixed(6)} · s=${s.toFixed(6)} · u=s/√n=${u.toFixed(6)}`;
    }
    else {
      /* Tipo B: por especificación — necesitamos semirango y distribución */
      const a            = parseFloat(document.getElementById('semirango').value);
      const distribucion = document.getElementById('distribucion').value;

      if (isNaN(a) || a <= 0) {
        alert('Ingresá un semirango (a) mayor a cero.');
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

      const nombresDistrib = {
        normal: 'Normal (k=1)',
        rectangular: 'Rectangular (k=√3)',
        triangular: 'Triangular (k=√6)',
        u: 'En U (k=√2)',
      };

      descripcion = `Tipo B · a=${a} · ${nombresDistrib[distribucion]} · u=a/k=${u.toFixed(6)}`;
    }

    if (isNaN(u) || u <= 0) {
      alert('No se pudo calcular la incertidumbre del componente. Verificá los datos.');
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
          Todavía no hay componentes agregados
        </div>`;
      return;
    }

    componentes.forEach(function (comp) {
      const div = document.createElement('div');
      div.className = 'componente-item';
      div.innerHTML = `
        <div class="componente-item__header">
          <span class="badge-tipo ${comp.tipo === 'A' ? 'badge-tipo--a' : 'badge-tipo--b'}">
            Tipo ${comp.tipo}
          </span>
          <strong class="componente-item__nombre">${comp.nombre}</strong>
          <button
            class="btn-eliminar-comp"
            data-id="${comp.id}"
            aria-label="Eliminar ${comp.nombre}"
          >✕</button>
        </div>
        <p class="componente-item__desc">${comp.descripcion}</p>
        <p class="componente-item__u">
          u(x) = <strong>${comp.u.toFixed(6)}</strong> · ci = <strong>${comp.ci}</strong> · ci×u = <strong>${(comp.ci * comp.u).toFixed(6)}</strong>
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
      alert('Agregá al menos una componente de incertidumbre.');
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
    resUc.textContent    = uc.toFixed(6);
    resU.textContent     = U.toFixed(6);
    resKp.textContent    = kp;
    resNivel.textContent = nivelConfianza;

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
        <td>Tipo ${comp.tipo}</td>
        <td>${comp.u.toFixed(6)}</td>
        <td>${comp.ci.toFixed(4)}</td>
        <td>${contribucion.toFixed(6)}</td>
        <td>${porcentaje.toFixed(1)}%</td>
      `;
      tablaDesglose.appendChild(tr);
    });
  }

  /* ── Exportar ───────────────────────────────────────────── */
  btnExportar.addEventListener('click', function () {
    if (componentes.length === 0) { alert('Calculá primero.'); return; }

    const kp = parseFloat(inputKp.value) || 2;
    const uc = Math.sqrt(componentes.reduce((acc, comp) => acc + Math.pow(comp.ci * comp.u, 2), 0));
    const U  = kp * uc;
    const fecha = new Date().toLocaleDateString('es-AR');

    let texto = `PRESUPUESTO DE INCERTIDUMBRE — QuimCalc (Método GUM)\n`;
    texto += `Fecha: ${fecha}\n\n`;
    texto += `COMPONENTES DE INCERTIDUMBRE\n`;
    texto += `Nº\tNombre\tTipo\tu(xi)\tci\tci×u(xi)\t% contribución\n`;

    componentes.forEach((comp, i) => {
      const contrib = comp.ci * comp.u;
      const pct = uc > 0 ? (Math.pow(contrib, 2) / Math.pow(uc, 2) * 100).toFixed(1) : '0.0';
      texto += `${i+1}\t${comp.nombre}\tTipo ${comp.tipo}\t${comp.u.toFixed(6)}\t${comp.ci.toFixed(4)}\t${contrib.toFixed(6)}\t${pct}%\n`;
    });

    texto += `\nRESULTADO FINAL\n`;
    texto += `Incertidumbre combinada (uc): ${uc.toFixed(6)}\n`;
    texto += `Factor de cobertura (k): ${kp}\n`;
    texto += `Incertidumbre expandida (U = k×uc): ${U.toFixed(6)}\n`;
    texto += `\nDetalle de componentes:\n`;
    componentes.forEach(c => { texto += `  • ${c.nombre}: ${c.descripcion}\n`; });

    navigator.clipboard.writeText(texto).then(function () {
      btnExportar.textContent = '✓ Copiado al portapapeles';
      setTimeout(() => { btnExportar.textContent = 'Exportar presupuesto de incertidumbre'; }, 2500);
    }).catch(() => { prompt('Copiá el texto (Ctrl+A, Ctrl+C):', texto); });
  });

  /* Inicializar */
  renderizarComponentes();
});
