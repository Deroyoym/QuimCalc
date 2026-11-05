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

  /* [clave, nombre, composición, f por defecto, nota] */
  const REACTIVOS = {
    hcl:     ['HCl', { H: 1, Cl: 1 }, 1, 'Ácido monoprótico: 1 M = 1 N.'],
    hno3:    ['HNO₃', { H: 1, N: 1, O: 3 }, 1, 'Ácido monoprótico: 1 M = 1 N.'],
    h2so4:   ['H₂SO₄', { H: 2, S: 1, O: 4 }, 2, 'Cede 2 H⁺ en una titulación ácido-base: 1 M = 2 N.'],
    h3po4:   ['H₃PO₄', { H: 3, P: 1, O: 4 }, 2, 'f depende del punto final: 1 (hasta pH ≈ 4,5), 2 (hasta pH ≈ 9,7) o 3 (los tres H⁺). Ajustá f según tu método.'],
    acetico: ['CH₃COOH', { C: 2, H: 4, O: 2 }, 1, 'Ácido monoprótico: 1 M = 1 N.'],
    oxalico: ['H₂C₂O₄·2H₂O', { H: 6, C: 2, O: 6 }, 2, 'Dihidratado (sólido habitual). f = 2 como ácido y también como reductor (2 e⁻ por mol).'],
    naoh:    ['NaOH', { Na: 1, O: 1, H: 1 }, 1, 'Libera 1 OH⁻: 1 M = 1 N.'],
    koh:     ['KOH', { K: 1, O: 1, H: 1 }, 1, 'Libera 1 OH⁻: 1 M = 1 N.'],
    caoh2:   ['Ca(OH)₂', { Ca: 1, O: 2, H: 2 }, 2, 'Libera 2 OH⁻: 1 M = 2 N.'],
    na2co3:  ['Na₂CO₃', { Na: 2, C: 1, O: 3 }, 2, 'f = 2 si se titula hasta CO₂ (anaranjado de metilo); f = 1 si solo hasta HCO₃⁻ (fenolftaleína).'],
    kmno4:   ['KMnO₄', { K: 1, Mn: 1, O: 4 }, 5, 'En medio ácido gana 5 e⁻ (MnO₄⁻ → Mn²⁺); en medio neutro o básico, 3 e⁻ (→ MnO₂).'],
    k2cr2o7: ['K₂Cr₂O₇', { K: 2, Cr: 2, O: 7 }, 6, 'Gana 6 e⁻ por mol (Cr₂O₇²⁻ → 2 Cr³⁺).'],
    tiosulf: ['Na₂S₂O₃·5H₂O', { Na: 2, S: 2, O: 8, H: 10 }, 1, 'Pentahidratado (sólido habitual). Cede 1 e⁻ por mol frente al yodo.'],
    iodo:    ['I₂', { I: 2 }, 2, 'Gana 2 e⁻ por mol (I₂ → 2 I⁻).'],
    agno3:   ['AgNO₃', { Ag: 1, N: 1, O: 3 }, 1, 'Precipitación: 1 Ag⁺ por mol.'],
    otro:    ['Otro reactivo', null, null, 'Ingresá la masa molar y el factor de equivalencia de tu reactivo.'],
  };

  const $ = function (id) { return document.getElementById(id); };
  const selReactivo = $('reactivo'), inMasa = $('masa-molar'), inF = $('feq'), nota = $('nota-reactivo');
  const selModo = $('modo');
  const res = $('resultado'), resEtiq = $('resultado-etiqueta'), resValor = $('resultado-valor'),
        resForm = $('resultado-formula'), resExtra = $('resultado-extra');
  const F = QCFormato.num;

  function leer(id) {
    const t = String($(id).value).trim();
    return t === '' ? null : parseFloat(t);
  }

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
  function mostrar(etiqueta, valor, formula, minis, avisos) {
    res.classList.remove('resultado--error');
    resEtiq.innerHTML = etiqueta; resValor.textContent = valor; resForm.textContent = formula;   /* etiqueta: texto interno, con la fórmula en .sin-mayus */
    let html = '<div class="resultados-grilla">' + minis.map(function (m) {
      return '<div class="resultado-mini"><p class="resultado-mini__etiqueta">' + m[0] + '</p><p class="resultado-mini__valor">' + m[1] + '</p></div>';
    }).join('') + '</div>';
    (avisos || []).forEach(function (a) { html += '<p class="aviso-calculo">⚠️ ' + a + '</p>'; });
    resExtra.innerHTML = html;
    res.classList.add('visible');
    if (window.QuimCalcHistorial) window.QuimCalcHistorial.registrar(valor, formula);
    res.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function calcular() {
    const Mm = leer('masa-molar'), f = leer('feq');
    if (Mm === null || isNaN(Mm) || Mm <= 0) return mostrarError('Ingresá la masa molar (g/mol), mayor que 0.');
    if (f === null || isNaN(f) || f <= 0) return mostrarError('Ingresá el factor de equivalencia f (H⁺, OH⁻ o e⁻ por mol), mayor que 0.');
    const PE = Mm / f;
    const nombre = REACTIVOS[selReactivo.value][0];
    const avisos = [];
    if (!Number.isInteger(f)) avisos.push('El factor de equivalencia suele ser un entero (1, 2, 3, 5, 6…). Revisá el valor.');

    if (selModo.value === 'convertir') {
      const c = leer('conc'), u = $('unidad-conc').value;
      if (c === null || isNaN(c) || c <= 0) return mostrarError('Ingresá la concentración, mayor que 0.');
      const N = u === 'N' ? c : c * f;
      const M = u === 'M' ? c : c / f;
      mostrar('<span class="sin-mayus">' + nombre + '</span>: ' + (u === 'N' ? 'molaridad' : 'normalidad'),
        u === 'N' ? F(M, 5) + ' mol/L (M)' : F(N, 5) + ' eq/L (N)',
        u === 'N' ? 'M = N / f = ' + F(c, 5) + ' / ' + f : 'N = M × f = ' + F(c, 5) + ' × ' + f,
        [['Normalidad', F(N, 5) + ' N'], ['Molaridad', F(M, 5) + ' M'], ['Peso equivalente', F(PE, 5) + ' g/eq']], avisos);
    } else {
      const N = leer('n-deseada'), V = leer('v-prep'), P = leer('pureza') === null ? 100 : leer('pureza');
      const uV = $('unidad-v').value;
      if (N === null || isNaN(N) || N <= 0) return mostrarError('Ingresá la normalidad deseada, mayor que 0.');
      if (V === null || isNaN(V) || V <= 0) return mostrarError('Ingresá el volumen a preparar, mayor que 0.');
      if (isNaN(P) || P <= 0 || P > 100) return mostrarError('La pureza debe ser mayor que 0 y hasta 100 %.');
      const VL = uV === 'mL' ? V / 1000 : V;
      const m = N * VL * PE / (P / 100);
      if (selReactivo.value === 'hcl' || selReactivo.value === 'hno3' || selReactivo.value === 'h2so4' ||
          selReactivo.value === 'h3po4' || selReactivo.value === 'acetico') {
        avisos.push('Este reactivo se compra como líquido concentrado: en lugar de pesarlo, calculá el volumen con la calculadora de dilución desde reactivo comercial usando M = N / f = ' + F(N / f, 4) + ' mol/L.');
      }
      if (selReactivo.value === 'naoh' || selReactivo.value === 'koh') {
        avisos.push('El ' + nombre + ' absorbe agua y CO₂: la solución no queda exacta pesando. Prepará una concentración aproximada y estandarizala (por ejemplo con biftalato de potasio).');
      }
      mostrar('Masa de <span class="sin-mayus">' + nombre + '</span> a pesar', QCFormato.masa(m, 5),
        'm = N × V × PE / (P/100) = ' + F(N, 4) + ' eq/L × ' + F(VL, 4) + ' L × ' + F(PE, 5) + ' g/eq' + (P < 100 ? ' / ' + F(P / 100, 4) : ''),
        [['Peso equivalente', F(PE, 5) + ' g/eq'], ['Equivalentes', F(N * VL, 4) + ' eq'], ['Molaridad', F(N / f, 5) + ' M']], avisos);
    }
  }

  selReactivo.addEventListener('change', elegirReactivo);
  selModo.addEventListener('change', mostrarModo);
  document.querySelectorAll('.calculadora input').forEach(function (el) { el.addEventListener('input', limpiar); });
  $('btn-calcular').addEventListener('click', calcular);
  elegirReactivo();
  mostrarModo();
});
