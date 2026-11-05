/* ============================================================
   FACTOR DE CORRECCIÓN / ESTANDARIZACIÓN DE SOLUCIONES
   Archivo: herramientas/js/factor-correccion-estandarizacion.js

   Para cada réplica:
     n(patrón)   = m × (P/100) / M(patrón)
     n(titulante) = n(patrón) × r            (r = mol titulante / mol patrón)
     C(real)     = n(titulante) / ((V − V_blanco) / 1000)
     f           = C(real) / C(nominal)
   Resultado: media, desvío estándar y CV % de f.

   Las masas molares de los patrones salen de masas-atomicas.js.
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  const A = window.QCMasasAtomicas.MASAS;
  const masa = function (comp) {
    return Object.keys(comp).reduce(function (s, el) { return s + A[el] * comp[el]; }, 0);
  };

  /* [titulante, patrón, composición del patrón, r = mol titulante / mol patrón, reacción] */
  const PARES = {
    'naoh-khp':     ['NaOH', 'biftalato de potasio (KHP)', { C: 8, H: 5, K: 1, O: 4 }, 1, 'HP⁻ + OH⁻ → P²⁻ + H₂O (fenolftaleína)'],
    'hcl-na2co3':   ['HCl', 'carbonato de sodio', { Na: 2, C: 1, O: 3 }, 2, 'CO₃²⁻ + 2 H⁺ → CO₂ + H₂O (anaranjado de metilo o verde de bromocresol, con ebullición)'],
    'hcl-borax':    ['HCl', 'bórax (Na₂B₄O₇·10H₂O)', { Na: 2, B: 4, O: 17, H: 20 }, 2, 'B₄O₇²⁻ + 2 H⁺ + 5 H₂O → 4 H₃BO₃ (rojo de metilo)'],
    'hcl-tris':     ['HCl', 'TRIS (tris(hidroximetil)aminometano)', { C: 4, H: 11, N: 1, O: 3 }, 1, 'RNH₂ + H⁺ → RNH₃⁺ (verde de bromocresol)'],
    'edta-caco3':   ['EDTA', 'carbonato de calcio', { Ca: 1, C: 1, O: 3 }, 1, 'Ca²⁺ + Y⁴⁻ → CaY²⁻ (CaCO₃ disuelto en HCl; pH 10 o 12)'],
    'edta-zn':      ['EDTA', 'zinc metálico', { Zn: 1 }, 1, 'Zn²⁺ + Y⁴⁻ → ZnY²⁻ (negro de eriocromo T, pH 10)'],
    'tio-kio3':     ['Na₂S₂O₃', 'yodato de potasio', { K: 1, I: 1, O: 3 }, 6, 'IO₃⁻ + 5 I⁻ + 6 H⁺ → 3 I₂; 3 I₂ + 6 S₂O₃²⁻ → 6 I⁻ + 3 S₄O₆²⁻'],
    'tio-k2cr2o7':  ['Na₂S₂O₃', 'dicromato de potasio', { K: 2, Cr: 2, O: 7 }, 6, 'Cr₂O₇²⁻ + 6 I⁻ + 14 H⁺ → 3 I₂; 3 I₂ + 6 S₂O₃²⁻ → 6 I⁻ + 3 S₄O₆²⁻'],
    'kmno4-oxalato':['KMnO₄', 'oxalato de sodio', { Na: 2, C: 2, O: 4 }, 0.4, '2 MnO₄⁻ + 5 C₂O₄²⁻ + 16 H⁺ → 2 Mn²⁺ + 10 CO₂ + 8 H₂O (en caliente)'],
    'agno3-nacl':   ['AgNO₃', 'cloruro de sodio', { Na: 1, Cl: 1 }, 1, 'Ag⁺ + Cl⁻ → AgCl (Mohr o Fajans)'],
    'otro':         ['Titulante', 'patrón', null, null, 'Ingresá la masa molar del patrón y la relación estequiométrica.'],
  };

  const $ = function (id) { return document.getElementById(id); };
  const selPar = $('par'), inM = $('m-patron'), inR = $('relacion'), nota = $('nota-par');
  const res = $('resultado'), resEtiq = $('resultado-etiqueta'), resValor = $('resultado-valor'),
        resForm = $('resultado-formula'), resExtra = $('resultado-extra');
  const F = QCFormato.num;
  const NREP = 5;

  function leer(id) {
    const t = String($(id).value).trim();
    return t === '' ? null : parseFloat(t);
  }

  function elegirPar() {
    const p = PARES[selPar.value];
    if (p[2]) { inM.value = Number(masa(p[2]).toFixed(3)); inR.value = p[3]; }
    else { inM.value = ''; inR.value = ''; }
    nota.textContent = p[4];
    limpiar();
  }
  function limpiar() { res.classList.remove('visible', 'resultado--error'); resExtra.innerHTML = ''; }
  function mostrarError(msg) {
    res.classList.add('visible', 'resultado--error');
    resEtiq.textContent = 'Error'; resValor.textContent = msg; resForm.textContent = ''; resExtra.innerHTML = '';
  }

  function calcular() {
    const par = PARES[selPar.value];
    const Cn = leer('c-nominal'), Mp = leer('m-patron'), r = leer('relacion');
    const P = leer('pureza-patron') === null ? 100 : leer('pureza-patron');
    const Vb = leer('v-blanco') || 0;
    if (Cn === null || isNaN(Cn) || Cn <= 0) return mostrarError('Ingresá la concentración nominal del titulante (mol/L), mayor que 0.');
    if (Mp === null || isNaN(Mp) || Mp <= 0) return mostrarError('Ingresá la masa molar del patrón (g/mol), mayor que 0.');
    if (r === null || isNaN(r) || r <= 0) return mostrarError('Ingresá la relación estequiométrica (mol de titulante por mol de patrón), mayor que 0.');
    if (isNaN(P) || P <= 0 || P > 100) return mostrarError('La pureza del patrón debe ser mayor que 0 y hasta 100 %.');
    if (isNaN(Vb) || Vb < 0) return mostrarError('El blanco no puede ser negativo.');

    const filas = [];
    for (let i = 1; i <= NREP; i++) {
      const m = leer('rep-m-' + i), V = leer('rep-v-' + i);
      if (m === null && V === null) continue;
      if (m === null || V === null || isNaN(m) || isNaN(V)) return mostrarError('Réplica ' + i + ': completá la masa y el volumen, o dejá los dos vacíos.');
      if (m <= 0 || V <= 0) return mostrarError('Réplica ' + i + ': la masa y el volumen deben ser mayores que 0.');
      if (V <= Vb) return mostrarError('Réplica ' + i + ': el volumen gastado debe ser mayor que el blanco.');
      const nPat = m * (P / 100) / Mp;
      const C = nPat * r / ((V - Vb) / 1000);
      filas.push({ i: i, m: m, V: V, C: C, f: C / Cn });
    }
    if (!filas.length) return mostrarError('Completá al menos una réplica (masa del patrón y volumen gastado).');

    const n = filas.length;
    const fs = filas.map(function (x) { return x.f; });
    const media = fs.reduce(function (a, b) { return a + b; }, 0) / n;
    const s = n > 1 ? Math.sqrt(fs.reduce(function (a, v) { return a + (v - media) * (v - media); }, 0) / (n - 1)) : null;
    const cv = s !== null ? 100 * s / media : null;

    const avisos = [];
    if (n < 3) avisos.push('Con menos de 3 réplicas no se puede evaluar bien la repetibilidad. Lo habitual es estandarizar por triplicado.');
    if (cv !== null && cv > 0.2) avisos.push('El CV entre réplicas supera 0,2 %, un criterio frecuente para estandarizaciones (orientativo; seguí el de tu procedimiento). Revisá las réplicas que se alejan de la media.');
    if (media < 0.95 || media > 1.05) avisos.push('El factor está fuera de 0,95–1,05: la solución se aparta más de un 5 % de lo nominal. Revisá los datos o considerá prepararla de nuevo.');
    const volBajo = filas.some(function (x) { return x.V - Vb < 10; });
    if (volBajo) avisos.push('Algún volumen gastado es menor de 10 mL: con una bureta de 25 o 50 mL el error relativo de lectura crece. Conviene pesar más patrón.');

    res.classList.remove('resultado--error');
    resEtiq.innerHTML = 'Factor de corrección del <span class="sin-mayus">' + par[0] + '</span>' + (n > 1 ? ' (media de ' + n + ' réplicas)' : '');
    resValor.textContent = 'f = ' + F(media, 5);
    resForm.textContent = 'C(real) = m × (P/100) / M × r / (V − V_blanco);  f = C(real) / ' + F(Cn, 4) + ' mol/L';
    const minis = [['Concentración real', F(media * Cn, 5) + ' mol/L'], ['Réplicas', String(n)]];
    if (s !== null) { minis.push(['Desvío estándar de f', F(s, 3)]); minis.push(['CV', F(cv, 3) + ' %']); }
    let html = '<div class="resultados-grilla">' + minis.map(function (x) {
      return '<div class="resultado-mini"><p class="resultado-mini__etiqueta">' + x[0] + '</p><p class="resultado-mini__valor">' + x[1] + '</p></div>';
    }).join('') + '</div>';
    html += '<ul class="detalle-replicas">' + filas.map(function (x) {
      return '<li>Réplica ' + x.i + ': ' + F(x.m, 4) + ' g, ' + F(x.V, 4) + ' mL → ' + F(x.C, 5) + ' mol/L (f = ' + F(x.f, 5) + ')</li>';
    }).join('') + '</ul>';
    avisos.forEach(function (a) { html += '<p class="aviso-calculo">⚠️ ' + a + '</p>'; });
    resExtra.innerHTML = html;
    res.classList.add('visible');
    if (window.QuimCalcHistorial) window.QuimCalcHistorial.registrar(resValor.textContent, resForm.textContent);
    res.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  selPar.addEventListener('change', elegirPar);
  document.querySelectorAll('.calculadora input').forEach(function (el) { el.addEventListener('input', limpiar); });
  $('btn-calcular').addEventListener('click', calcular);
  elegirPar();
});
