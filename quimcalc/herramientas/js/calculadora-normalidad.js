/* ============================================================
   CALCULADORA DE NORMALIDAD Y PESO EQUIVALENTE
   Archivo: herramientas/js/calculadora-normalidad.js

     N = M × f          (f = factor de equivalencia: H⁺, OH⁻ o e⁻ por mol)
     PE = M_m / f       (peso equivalente, g/eq)
     masa a pesar = N × V(L) × PE / (pureza / 100)

   Las masas molares de los reactivos precargados se calculan con
   herramientas/js/masas-atomicas.js (CIAAW/IUPAC), así coinciden
   con la calculadora de masa molar.
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  const A = window.QCMasasAtomicas.MASAS;
  const masa = function (comp) {
    return Object.keys(comp).reduce(function (s, el) { return s + A[el] * comp[el]; }, 0);
  };

  /* [nombre, composición, f por defecto, nota] */
  const REACTIVOS = {
    hcl:     ['HCl', { H: 1, Cl: 1 }, 1, 'Ácido monoprótico: 1 M = 1 N.'],
    hno3:    ['HNO₃', { H: 1, N: 1, O: 3 }, 1, 'Ácido monoprótico: 1 M = 1 N.'],
    h2so4:   ['H₂SO₄', { H: 2, S: 1, O: 4 }, 2, 'Cede 2 H⁺ en una titulación ácido-base: 1 M = 2 N.'],
    h3po4:   ['H₃PO₄', { H: 3, P: 1, O: 4 }, 2, 'f depende del punto final: 1 hasta pH ≈ 4,7 y 2 hasta pH ≈ 9,7. El tercer H⁺ (pKa₃ ≈ 12,35) no se titula directamente en agua; f = 3 solo si reaccionan los tres, por ejemplo al precipitar Ag₃PO₄.'],
    acetico: ['CH₃COOH', { C: 2, H: 4, O: 2 }, 1, 'Ácido monoprótico: 1 M = 1 N.'],
    oxalico: ['H₂C₂O₄·2H₂O', { H: 6, C: 2, O: 6 }, 2, 'Dihidratado (sólido habitual). f = 2 como ácido y también como reductor (2 e⁻ por mol).'],
    naoh:    ['NaOH', { Na: 1, O: 1, H: 1 }, 1, 'Libera 1 OH⁻: 1 M = 1 N.'],
    koh:     ['KOH', { K: 1, O: 1, H: 1 }, 1, 'Libera 1 OH⁻: 1 M = 1 N.'],
    caoh2:   ['Ca(OH)₂', { Ca: 1, O: 2, H: 2 }, 2, 'Libera 2 OH⁻: 1 M = 2 N. Es poco soluble: en agua no supera ≈ 0,047 N a 20 °C.'],
    na2co3:  ['Na₂CO₃', { Na: 2, C: 1, O: 3 }, 2, 'f = 2 si se titula hasta CO₂ (anaranjado de metilo); f = 1 si solo hasta HCO₃⁻ (fenolftaleína).'],
    kmno4:   ['KMnO₄', { K: 1, Mn: 1, O: 4 }, 5, 'En medio ácido gana 5 e⁻ (MnO₄⁻ → Mn²⁺); en medio neutro o débilmente básico, 3 e⁻ (→ MnO₂).'],
    k2cr2o7: ['K₂Cr₂O₇', { K: 2, Cr: 2, O: 7 }, 6, 'Gana 6 e⁻ por mol (Cr₂O₇²⁻ → 2 Cr³⁺). Es patrón primario.'],
    tiosulf: ['Na₂S₂O₃·5H₂O', { Na: 2, S: 2, O: 8, H: 10 }, 1, 'Pentahidratado (sólido habitual). Cede 1 e⁻ por mol frente al yodo.'],
    iodo:    ['I₂', { I: 2 }, 2, 'Gana 2 e⁻ por mol (I₂ → 2 I⁻). Se disuelve en solución de KI, no en agua sola.'],
    agno3:   ['AgNO₃', { Ag: 1, N: 1, O: 3 }, 1, 'Precipitación: 1 Ag⁺ por mol.'],
    otro:    ['Otro reactivo', null, null, 'Ingresa la masa molar y el factor de equivalencia de tu reactivo.'],
  };
  const LIQUIDOS = ['hcl', 'hno3', 'h2so4', 'h3po4', 'acetico'];
  const A_ESTANDARIZAR = ['naoh', 'koh', 'kmno4', 'tiosulf', 'iodo', 'caoh2'];
  const ENLACE_FACTOR = '<a href="factor-correccion-estandarizacion.html">calculadora de factor de corrección</a>';

  const $ = function (id) { return document.getElementById(id); };
  const selReactivo = $('reactivo'), inMasa = $('masa-molar'), inF = $('feq'), nota = $('nota-reactivo');
  const selModo = $('modo');
  const res = $('resultado'), resEtiq = $('resultado-etiqueta'), resValor = $('resultado-valor'),
        resForm = $('resultado-formula'), resExtra = $('resultado-extra');
  const F = QCFormato.num;
  const E = function (x) { return QCFormato.num(x, 6, true); };

  function leer(id) {
    const t = String($(id).value).trim();
    return t === '' ? null : parseFloat(t);
  }
  const ok = function (x) { return x !== null && isFinite(x); };

  function elegirReactivo() {
    const r = REACTIVOS[selReactivo.value];
    if (r[1]) { inMasa.value = Number(masa(r[1]).toFixed(3)); inF.value = r[2]; }
    else { inMasa.value = ''; inF.value = ''; }
    nota.textContent = r[3];
    limpiar();
  }
  function mostrarModo() {
    document.querySelectorAll('.bloque-modo').forEach(function (b) { b.hidden = b.dataset.modo !== selModo.value; });
    limpiar();
  }
  function limpiar() { res.classList.remove('visible', 'resultado--error'); resExtra.innerHTML = ''; }

  function mostrarError(msg) {
    res.classList.add('visible', 'resultado--error');
    resEtiq.textContent = 'Error'; resValor.textContent = msg; resForm.textContent = ''; resExtra.innerHTML = '';
  }
  function mostrar(etiqueta, valor, formula, minis, avisos, nombre) {
    res.classList.remove('resultado--error');
    resEtiq.innerHTML = etiqueta;   /* texto interno, con la fórmula en .sin-mayus */
    resValor.textContent = valor; resForm.textContent = formula;
    let html = '<div class="resultados-grilla">' + minis.map(function (m) {
      return '<div class="resultado-mini"><p class="resultado-mini__etiqueta">' + m[0] + '</p><p class="resultado-mini__valor">' + m[1] + '</p></div>';
    }).join('') + '</div>';
    (avisos || []).forEach(function (a) { html += '<p class="aviso-calculo">⚠️ ' + a + '</p>'; });
    resExtra.innerHTML = html;
    res.classList.add('visible');
    if (window.QuimCalcHistorial) window.QuimCalcHistorial.registrar(nombre + ': ' + valor, formula);
    res.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  /* Masa en g; por encima de 1 kg se muestra en kg */
  function masaTexto(g) {
    return g >= 1000 ? F(g / 1000, 5) + ' kg' : QCFormato.masa(g, 5);
  }

  function calcular() {
    const Mm = leer('masa-molar'), f = leer('feq');
    if (!ok(Mm) || Mm <= 0) return mostrarError('Ingresa la masa molar (g/mol): un número mayor que 0.');
    if (!ok(f) || f <= 0) return mostrarError('Ingresa el factor de equivalencia f (H⁺, OH⁻ o e⁻ por mol): un número mayor que 0.');
    const PE = Mm / f;
    const clave = selReactivo.value;
    const nombre = REACTIVOS[clave][0];
    const etq = '<span class="sin-mayus">' + nombre + '</span>';
    const avisos = [];
    if (!Number.isInteger(f)) avisos.push('El factor de equivalencia suele ser un entero (1, 2, 3, 5, 6…). Revisa el valor.');

    if (selModo.value === 'convertir') {
      const c = leer('conc'), u = $('unidad-conc').value;
      if (!ok(c) || c <= 0) return mostrarError('Ingresa la concentración: un número mayor que 0.');
      const N = u === 'N' ? c : c * f;
      const M = u === 'M' ? c : c / f;
      mostrar(etq + ': ' + (u === 'N' ? 'molaridad' : 'normalidad'),
        u === 'N' ? F(M, 5) + ' mol/L (M)' : F(N, 5) + ' eq/L (N)',
        u === 'N' ? 'M = N / f = ' + E(c) + ' / ' + E(f) : 'N = M × f = ' + E(c) + ' × ' + E(f),
        [['Normalidad', F(N, 5) + ' N'], ['Molaridad', F(M, 5) + ' M'], ['Peso equivalente', F(PE, 5) + ' g/eq']], avisos, nombre);
    } else {
      const N = leer('n-deseada'), V = leer('v-prep'), Pl = leer('pureza');
      const P = Pl === null ? 100 : Pl;
      const uV = $('unidad-v').value;
      if (!ok(N) || N <= 0) return mostrarError('Ingresa la normalidad deseada: un número mayor que 0.');
      if (!ok(V) || V <= 0) return mostrarError('Ingresa el volumen a preparar: un número mayor que 0.');
      if (!isFinite(P) || P <= 0 || P > 100) return mostrarError('La pureza debe ser un número mayor que 0 y hasta 100 % (o déjala vacía para usar 100 %).');
      const VL = uV === 'mL' ? V / 1000 : V;
      const m = N * VL * PE / (P / 100);

      if (LIQUIDOS.indexOf(clave) >= 0) {
        avisos.push('Este reactivo se compra como líquido concentrado: en lugar de pesarlo, calcula el volumen con la <a href="diluciones-reactivo-comercial.html">calculadora de dilución desde reactivo comercial</a> usando M = N / f = ' + F(N / f, 4) + ' mol/L.');
      }
      if (clave === 'caoh2' && N > 0.04) {
        avisos.push('Supera la solubilidad del Ca(OH)₂ (≈ 0,047 N a 20 °C): no se disuelve todo. Para concentraciones mayores usa NaOH o KOH.');
      }
      if (clave === 'iodo') {
        avisos.push('El I₂ casi no se disuelve en agua (≈ 0,0026 N): disuélvelo en solución concentrada de KI (unos 40 g/L para 0,1 N), que forma I₃⁻.');
      }
      if (A_ESTANDARIZAR.indexOf(clave) >= 0) {
        avisos.push('El ' + nombre + ' no es patrón primario: pesándolo no se obtiene la normalidad exacta. Prepara una concentración aproximada y estandarízala con la ' + ENLACE_FACTOR + '.');
      }
      mostrar('Masa de ' + etq + ' a pesar', masaTexto(m),
        'm = N × V × PE / (P/100) = ' + E(N) + ' eq/L × ' + E(VL) + ' L × ' + F(PE, 5) + ' g/eq' + (P < 100 ? ' / ' + E(P / 100) : ''),
        [['Peso equivalente', F(PE, 5) + ' g/eq'], ['Equivalentes', F(N * VL, 5) + ' eq'], ['Molaridad', F(N / f, 5) + ' M']], avisos, nombre);
    }
  }

  selReactivo.addEventListener('change', elegirReactivo);
  selModo.addEventListener('change', mostrarModo);
  document.querySelectorAll('.calculadora input, .calculadora select').forEach(function (el) {
    if (el !== selReactivo && el !== selModo) el.addEventListener(el.tagName === 'SELECT' ? 'change' : 'input', limpiar);
  });
  $('btn-calcular').addEventListener('click', calcular);
  elegirReactivo();
  mostrarModo();
});
