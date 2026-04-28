/* ============================================================
   CALCULADORA DE MASA MOLAR
   Archivo: herramientas/js/masa-molar.js

   El usuario ingresa una fórmula química como "H2SO4" o "Ca(OH)2"
   y el script suma los pesos atómicos de cada elemento.

   Lógica:
     1. Tabla de masas atómicas (primeros 56 elementos + comunes)
     2. Parser de fórmula química: maneja paréntesis y subíndices
     3. Suma de masas y muestra el resultado con desglose
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ── TABLA DE MASAS ATÓMICAS (g/mol) ────────────────────────
     Fuente: IUPAC 2021. Redondeadas a 3 decimales.
     ──────────────────────────────────────────────────────────── */
  const MASAS_ATOMICAS = {
    H:  1.008,   He: 4.003,   Li: 6.941,   Be: 9.012,
    B:  10.811,  C:  12.011,  N:  14.007,  O:  15.999,
    F:  18.998,  Ne: 20.180,  Na: 22.990,  Mg: 24.305,
    Al: 26.982,  Si: 28.086,  P:  30.974,  S:  32.065,
    Cl: 35.453,  Ar: 39.948,  K:  39.098,  Ca: 40.078,
    Sc: 44.956,  Ti: 47.867,  V:  50.942,  Cr: 51.996,
    Mn: 54.938,  Fe: 55.845,  Co: 58.933,  Ni: 58.693,
    Cu: 63.546,  Zn: 65.38,   Ga: 69.723,  Ge: 72.630,
    As: 74.922,  Se: 78.971,  Br: 79.904,  Kr: 83.798,
    Rb: 85.468,  Sr: 87.620,  Y:  88.906,  Zr: 91.224,
    Nb: 92.906,  Mo: 95.960,  Tc: 98.000,  Ru: 101.070,
    Rh: 102.906, Pd: 106.420, Ag: 107.868, Cd: 112.411,
    In: 114.818, Sn: 118.710, Sb: 121.760, Te: 127.600,
    I:  126.904, Xe: 131.293, Cs: 132.905, Ba: 137.327,
    La: 138.905, Ce: 140.116, Pb: 207.200, Hg: 200.590,
    Au: 196.967, Pt: 195.084, W:  183.840, U:  238.029,
  };

  /* ── Referencias ────────────────────────────────────────── */
  const inputFormula    = document.getElementById('formula');
  const botonCalcular   = document.getElementById('btn-calcular');
  const bloqueResultado = document.getElementById('resultado');
  const valorResultado  = document.getElementById('resultado-valor');
  const formulaResultado = document.getElementById('resultado-formula');
  const etiquetaResultado = document.getElementById('resultado-etiqueta');
  const desgloseResultado = document.getElementById('resultado-desglose');

  /* Calculamos también al presionar Enter en el input */
  inputFormula.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') botonCalcular.click();
  });

  botonCalcular.addEventListener('click', function () {

    const formula = inputFormula.value.trim();

    if (!formula) {
      mostrarError('Ingresá una fórmula química. Ej: H2SO4, Ca(OH)2, NaCl');
      return;
    }

    /* Intentamos parsear la fórmula */
    let composicion;
    try {
      composicion = parsearFormula(formula);
    } catch (e) {
      mostrarError(e.message);
      return;
    }

    /* Verificamos que todos los elementos estén en nuestra tabla */
    const elementosDesconocidos = Object.keys(composicion).filter(
      el => !(el in MASAS_ATOMICAS)
    );

    if (elementosDesconocidos.length > 0) {
      mostrarError(
        `Elemento(s) no reconocido(s): ${elementosDesconocidos.join(', ')}. ` +
        'Verificá que el símbolo esté bien escrito (ej: Fe, no fe ni FE).'
      );
      return;
    }

    /* ── Calculamos la masa molar total ─────────────────────
       Sumamos masa_atomica × cantidad para cada elemento.
       ──────────────────────────────────────────────────────── */
    let masaTotal = 0;
    const lineasDesglose = [];

    for (const [elemento, cantidad] of Object.entries(composicion)) {
      const masaAtom   = MASAS_ATOMICAS[elemento];
      const masaParcial = masaAtom * cantidad;
      masaTotal        += masaParcial;

      lineasDesglose.push(
        `${elemento}: ${cantidad} × ${masaAtom.toFixed(3)} g/mol = ${masaParcial.toFixed(3)} g/mol`
      );
    }

    mostrarResultado(
      masaTotal.toFixed(3) + ' g/mol',
      `Masa molar de ${formula}`,
      lineasDesglose
    );
  });

  /* ── PARSER DE FÓRMULA QUÍMICA ───────────────────────────
     Convierte "Ca(OH)2" → { Ca: 1, O: 2, H: 2 }
     Maneja:
       - Elementos con una o dos letras: H, Fe, Ca
       - Subíndices numéricos: H2O → { H:2, O:1 }
       - Paréntesis con subíndice: Ca(OH)2 → { Ca:1, O:2, H:2 }
       - Paréntesis anidados: no es común en química inorgánica básica
     ──────────────────────────────────────────────────────── */
  function parsearFormula(formula) {
    /* Usamos una función recursiva para manejar paréntesis */
    const resultado = {};

    /* Expresión regular que encuentra:
       - Paréntesis con contenido: \(([^()]+)\)(\d*)
       - Elemento + subíndice: ([A-Z][a-z]?)(\d*)
    */
    function parsearGrupo(str) {
      const conteo = {};

      /* Primero resolvemos los paréntesis de adentro hacia afuera */
      let texto = str;

      /* Reemplazamos grupos entre paréntesis por un marcador mientras procesamos */
      const regexParentesis = /\(([^()]+)\)(\d*)/g;
      let match;

      /* Seguimos mientras haya paréntesis */
      while (regexParentesis.test(texto)) {
        texto = texto.replace(/\(([^()]+)\)(\d*)/g, function (_, contenido, multiplicador) {
          const mult    = multiplicador ? parseInt(multiplicador) : 1;
          const subConteoParsed = parsearGrupo(contenido);

          /* Convertimos el subgrupo a una secuencia sin paréntesis */
          /* Ej: OH con mult 2 → O2H2 */
          let expansion = '';
          for (const [el, cant] of Object.entries(subConteoParsed)) {
            expansion += el + (cant * mult > 1 ? cant * mult : '');
          }
          return expansion;
        });

        regexParentesis.lastIndex = 0; /* Reset del índice para re-evaluar */
      }

      /* Ahora parseamos la cadena limpia (sin paréntesis) */
      const regexElemento = /([A-Z][a-z]?)(\d*)/g;
      let matchEl;

      while ((matchEl = regexElemento.exec(texto)) !== null) {
        const elemento  = matchEl[1];
        const cantidad  = matchEl[2] ? parseInt(matchEl[2]) : 1;

        if (!conteo[elemento]) conteo[elemento] = 0;
        conteo[elemento] += cantidad;
      }

      return conteo;
    }

    /* Validación básica: la fórmula solo debe tener letras, dígitos y paréntesis */
    if (!/^[A-Za-z0-9()]+$/.test(formula)) {
      throw new Error(
        'La fórmula contiene caracteres no válidos. ' +
        'Solo letras, números y paréntesis. Ej: Ca(OH)2, H2SO4'
      );
    }

    /* Verificamos que los paréntesis estén balanceados */
    let nivel = 0;
    for (const char of formula) {
      if (char === '(') nivel++;
      if (char === ')') nivel--;
      if (nivel < 0) throw new Error('Los paréntesis no están balanceados. Revisá la fórmula.');
    }
    if (nivel !== 0) throw new Error('Los paréntesis no están balanceados. Revisá la fórmula.');

    return parsearGrupo(formula);
  }

  /* ── Funciones de UI ────────────────────────────────────── */
  function mostrarResultado(valor, descripcion, lineasDesglose) {
    bloqueResultado.classList.remove('resultado--error');
    etiquetaResultado.textContent = descripcion;
    valorResultado.textContent    = valor;
    formulaResultado.textContent  = '';

    /* Mostramos el desglose elemento por elemento */
    desgloseResultado.innerHTML = '';
    lineasDesglose.forEach(function (linea) {
      const p = document.createElement('p');
      p.textContent = linea;
      p.style.cssText = 'font-size:0.85rem; color: var(--color-texto-suave); margin:0; font-family: monospace;';
      desgloseResultado.appendChild(p);
    });

    bloqueResultado.classList.add('visible');
    bloqueResultado.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function mostrarError(mensaje) {
    bloqueResultado.classList.add('resultado--error');
    etiquetaResultado.textContent = 'Error';
    valorResultado.textContent    = mensaje;
    formulaResultado.textContent  = '';
    desgloseResultado.innerHTML   = '';
    bloqueResultado.classList.add('visible');
  }

  inputFormula.addEventListener('input', function () {
    bloqueResultado.classList.remove('visible');
  });

});
