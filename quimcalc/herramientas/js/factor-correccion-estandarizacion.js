/* ============================================================
   FACTOR DE CORRECCIÓN / ESTANDARIZACIÓN DE SOLUCIONES
   Archivo: herramientas/js/factor-correccion-estandarizacion.js

   Para cada réplica:
     n(patrón)    = m × (P/100) / M(patrón)
     n(titulante) = n(patrón) × r            (r = mol titulante / mol patrón)
     C(real)      = n(titulante) / ((V − V_blanco) / 1000)
     f            = C(real) / C(nominal)
   Resultado: media, desvío estándar y CV % de f.

   Las masas molares de los patrones salen de masas-atomicas.js.
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  const A = window.QCMasasAtomicas.MASAS;
  const masa = function (comp) {
    return Object.keys(comp).reduce(function (s, el) { return s + A[el] * comp[el]; }, 0);
  };

  /* [titulante, patrón, composición del patrón, r = mol titulante / mol patrón, reacción e indicador] */
  const PARES = {
    'naoh-khp':     ['NaOH', 'biftalato de potasio (KHP)', { C: 8, H: 5, K: 1, O: 4 }, 1, 'HP⁻(ac) + OH⁻(ac) → P²⁻(ac) + H₂O(l). Indicador: fenolftaleína.'],
    'hcl-na2co3':   ['HCl', 'carbonato de sodio', { Na: 2, C: 1, O: 3 }, 2, 'CO₃²⁻(ac) + 2 H⁺(ac) → CO₂(g) + H₂O(l). Indicador: anaranjado de metilo o verde de bromocresol, hirviendo cerca del punto final para eliminar el CO₂.'],
    'hcl-borax':    ['HCl', 'bórax (Na₂B₄O₇·10H₂O)', { Na: 2, B: 4, O: 17, H: 20 }, 2, 'B₄O₇²⁻(ac) + 2 H⁺(ac) + 5 H₂O(l) → 4 H₃BO₃(ac). Indicador: rojo de metilo.'],
    'hcl-tris':     ['HCl', 'TRIS (tris(hidroximetil)aminometano)', { C: 4, H: 11, N: 1, O: 3 }, 1, 'RNH₂(ac) + H⁺(ac) → RNH₃⁺(ac). Indicador: verde de bromocresol.'],
    'edta-caco3':   ['EDTA', 'carbonato de calcio', { Ca: 1, C: 1, O: 3 }, 1, 'Ca²⁺(ac) + Y⁴⁻(ac) → CaY²⁻(ac), con el CaCO₃ disuelto en HCl. Indicador: negro de eriocromo T o calmagita a pH 10 (con un poco de Mg-EDTA), o calcón a pH 12–13.'],
    'edta-zn':      ['EDTA', 'zinc metálico', { Zn: 1 }, 1, 'Zn²⁺(ac) + Y⁴⁻(ac) → ZnY²⁻(ac). Indicador: negro de eriocromo T a pH 10.'],
    'tio-kio3':     ['Na₂S₂O₃', 'yodato de potasio', { K: 1, I: 1, O: 3 }, 6, 'IO₃⁻ + 5 I⁻ + 6 H⁺ → 3 I₂ + 3 H₂O; 3 I₂ + 6 S₂O₃²⁻ → 6 I⁻ + 3 S₄O₆²⁻ (todo en solución acuosa). Indicador: almidón, cerca del punto final.'],
    'tio-k2cr2o7':  ['Na₂S₂O₃', 'dicromato de potasio', { K: 2, Cr: 2, O: 7 }, 6, 'Cr₂O₇²⁻ + 6 I⁻ + 14 H⁺ → 2 Cr³⁺ + 3 I₂ + 7 H₂O; 3 I₂ + 6 S₂O₃²⁻ → 6 I⁻ + 3 S₄O₆²⁻ (todo en solución acuosa). Indicador: almidón, cerca del punto final.'],
    'kmno4-oxalato':['KMnO₄', 'oxalato de sodio', { Na: 2, C: 2, O: 4 }, 0.4, '2 MnO₄⁻(ac) + 5 C₂O₄²⁻(ac) + 16 H⁺(ac) → 2 Mn²⁺(ac) + 10 CO₂(g) + 8 H₂O(l), en caliente. El permanganato actúa como su propio indicador.'],
    'agno3-nacl':   ['AgNO₃', 'cloruro de sodio', { Na: 1, Cl: 1 }, 1, 'Ag⁺(ac) + Cl⁻(ac) → AgCl(s). Indicador: cromato de potasio (Mohr) o fluoresceína (Fajans).'],
    'otro':         ['Titulante', 'patrón', null, null, 'Ingresa la masa molar del patrón y la relación estequiométrica.'],
  };

  const $ = function (id) { return document.getElementById(id); };
  const selPar = $('par'), inM = $('m-patron'), inR = $('relacion'), nota = $('nota-par');
  const res = $('resultado'), resEtiq = $('resultado-etiqueta'), resValor = $('resultado-valor'),
        resForm = $('resultado-formula'), resExtra = $('resultado-extra');
  const F = QCFormato.num;
  const E = function (x) { return QCFormato.num(x, 6, true); };   // repetir una entrada sin ceros de relleno
  const NREP = 5;

  /* null = campo vacío; NaN = texto que no es un número */
  function leer(id) {
    const t = String($(id).value).trim();
    return t === '' ? null : parseFloat(t);
  }
  const ok = function (x) { return x !== null && isFinite(x); };

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
    const Pl = leer('pureza-patron'), P = Pl === null ? 100 : Pl;
    const Vbl = leer('v-blanco'), Vb = Vbl === null ? 0 : Vbl;
    if (!ok(Cn) || Cn <= 0) return mostrarError('Ingresa la concentración nominal del titulante (mol/L): un número mayor que 0.');
    if (!ok(Mp) || Mp <= 0) return mostrarError('Ingresa la masa molar del patrón (g/mol): un número mayor que 0.');
    if (!ok(r) || r <= 0) return mostrarError('Ingresa la relación estequiométrica (mol de titulante por mol de patrón): un número mayor que 0.');
    if (!isFinite(P) || P <= 0 || P > 100) return mostrarError('La pureza del patrón debe ser un número mayor que 0 y hasta 100 % (o déjala vacía para usar 100 %).');
    if (!isFinite(Vb) || Vb < 0) return mostrarError('El volumen del blanco no es válido: déjalo vacío o ingresa un número mayor o igual a 0.');

    const filas = [];
    for (let i = 1; i <= NREP; i++) {
      const m = leer('rep-m-' + i), V = leer('rep-v-' + i);
      if (m === null && V === null) continue;
      if (m === null || V === null) return mostrarError('Réplica ' + i + ': completa la masa y el volumen, o deja los dos vacíos.');
      if (!isFinite(m)) return mostrarError('Réplica ' + i + ': la masa no es un número válido.');
      if (!isFinite(V)) return mostrarError('Réplica ' + i + ': el volumen no es un número válido.');
      if (m <= 0 || V <= 0) return mostrarError('Réplica ' + i + ': la masa y el volumen deben ser mayores que 0.');
      if (V <= Vb) return mostrarError('Réplica ' + i + ': el volumen gastado debe ser mayor que el blanco.');
      const nPat = m * (P / 100) / Mp;
      const C = nPat * r / ((V - Vb) / 1000);
      filas.push({ i: i, m: m, V: V, C: C, f: C / Cn });
    }
    if (!filas.length) return mostrarError('Completa al menos una réplica (masa del patrón y volumen gastado).');

    const n = filas.length;
    const fs = filas.map(function (x) { return x.f; });
    const media = fs.reduce(function (a, b) { return a + b; }, 0) / n;
    const s = n > 1 ? Math.sqrt(fs.reduce(function (a, v) { return a + (v - media) * (v - media); }, 0) / (n - 1)) : null;
    const cv = s !== null ? 100 * s / media : null;

    const avisos = [];
    if (n < 3) avisos.push('Con menos de 3 réplicas no se puede evaluar bien la repetibilidad. Lo habitual es estandarizar por triplicado.');
    if (cv !== null && cv > 0.2) avisos.push('El CV entre réplicas supera 0,2 %, un criterio frecuente para estandarizar titulantes (orientativo: sigue el de tu procedimiento). Revisa las réplicas que se alejan de la media.');
    if (media < 0.95 || media > 1.05) avisos.push('El factor está fuera de 0,95–1,05: la solución se aparta más de un 5 % de lo nominal (algunas farmacopeas piden 0,970–1,030). Revisa los datos o prepara la solución de nuevo.');
    if (P < 90) avisos.push('La pureza es menor del 90 %, poco habitual en un patrón primario. ¿La escribiste como fracción (0,9995) en lugar de porcentaje (99,95)?');
    if (filas.some(function (x) { return x.V - Vb < 10; })) avisos.push('Algún volumen gastado es menor de 10 mL: con una bureta de 25 o 50 mL el error relativo de lectura crece. Conviene pesar más patrón.');
    if (filas.some(function (x) { return x.m < 0.1; })) avisos.push('Alguna masa de patrón es menor de 0,1 g: con una balanza de 0,1 mg el error de pesada supera el 0,1 %. Si usas una alícuota de una solución madre del patrón, ingresa la masa equivalente: m × V(alícuota) / V(total).');

    res.classList.remove('resultado--error');
    resEtiq.innerHTML = 'Factor de corrección del <span class="sin-mayus">' + par[0] + '</span>' + (n > 1 ? ' (media de ' + n + ' réplicas)' : '');
    resValor.textContent = 'f = ' + F(media, 5);
    resForm.textContent = 'C(real) = m × (P/100) / M × r / [(V − V blanco) / 1000];  f = C(real) / ' + E(Cn) + ' mol/L';
    const minis = [['Concentración real', F(media * Cn, 5) + ' mol/L'], ['Réplicas', String(n)]];
    if (s !== null) { minis.push(['Desvío estándar de f', F(s, 3)]); minis.push(['CV', F(cv, 3) + ' %']); }
    let html = '<div class="resultados-grilla">' + minis.map(function (x) {
      return '<div class="resultado-mini"><p class="resultado-mini__etiqueta">' + x[0] + '</p><p class="resultado-mini__valor">' + x[1] + '</p></div>';
    }).join('') + '</div>';
    html += '<ul class="detalle-replicas">' + filas.map(function (x) {
      return '<li>Réplica ' + x.i + ': ' + E(x.m) + ' g, ' + E(x.V) + ' mL → ' + F(x.C, 5) + ' mol/L (f = ' + F(x.f, 5) + ')</li>';
    }).join('') + '</ul>';
    avisos.forEach(function (a) { html += '<p class="aviso-calculo">⚠️ ' + a + '</p>'; });
    resExtra.innerHTML = html;
    res.classList.add('visible');
    if (window.QuimCalcHistorial) window.QuimCalcHistorial.registrar(par[0] + ': ' + resValor.textContent, resForm.textContent);
    res.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  selPar.addEventListener('change', elegirPar);
  document.querySelectorAll('.calculadora input').forEach(function (el) { el.addEventListener('input', limpiar); });
  $('btn-calcular').addEventListener('click', calcular);
  elegirPar();
});
