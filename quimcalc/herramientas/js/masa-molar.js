/* ============================================================
   CALCULADORA DE MASA MOLAR
   Archivo: herramientas/js/masa-molar.js

   El usuario ingresa una fórmula química como "H2SO4", "Ca(OH)2",
   "CuSO4·5H2O" o "K4[Fe(CN)6]" y el script suma las masas atómicas.

   Lógica:
     1. Masas atómicas de los 118 elementos (masas-atomicas.js, CIAAW/IUPAC)
     2. Analizador estricto: cualquier carácter que no forme parte de un
        símbolo, número, paréntesis o corchete da error (antes «h2o»
        devolvía 0 sin avisar)
     3. Hidratos con «·», «•», «*» o «.», y coeficiente inicial («2H2O»)
     4. Suma de masas con desglose y % en masa de cada elemento
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* Coma decimal para todo texto visible */
  function conComa(s) { return String(s).replace(/(\d)\.(\d)/g, '$1,$2'); }

  const MASAS_ATOMICAS = window.QCMasasAtomicas.MASAS;

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
    if (e.key === 'Enter') { e.preventDefault(); botonCalcular.click(); }
  });

  botonCalcular.addEventListener('click', function () {

    const formula = inputFormula.value.trim();

    if (!formula) {
      mostrarError('Ingresa una fórmula química. Ej: H2SO4, Ca(OH)2, CuSO4·5H2O');
      return;
    }

    let composicion;
    try {
      composicion = parsearFormula(formula);
    } catch (e) {
      mostrarError(e.message);
      return;
    }

    /* ── Masa molar total y % en masa de cada elemento ───── */
    let masaTotal = 0;
    for (const [el, n] of Object.entries(composicion)) masaTotal += MASAS_ATOMICAS[el] * n;

    const lineasDesglose = Object.entries(composicion).map(function ([el, n]) {
      const masaAtom = MASAS_ATOMICAS[el];
      const parcial  = masaAtom * n;
      return `${el}: ${n} × ${masaAtom} g/mol = ${parcial.toFixed(3)} g/mol (${(parcial / masaTotal * 100).toFixed(2)} %)`;
    });

    mostrarResultado(masaTotal.toFixed(3) + ' g/mol', formula, lineasDesglose);
  });

  /* ── ANALIZADOR DE FÓRMULAS ──────────────────────────────
     Convierte "Ca(OH)2" → { Ca: 1, O: 2, H: 2 }
       - Símbolos de una o dos letras (mayúscula + minúscula opcional)
       - Subíndices: H2O; paréntesis y corchetes anidados: K4[Fe(CN)6]
       - Hidratos: CuSO4·5H2O (también con •, * o .)
       - Coeficiente inicial: 2H2O → H4O2
     Cualquier otro carácter da un error explicativo.
     ──────────────────────────────────────────────────────── */
  function parsearFormula(texto) {
    const limpio = texto.replace(/\s+/g, '')
      .replace(/[\[{]/g, '(').replace(/[\]}]/g, ')')
      .replace(/[₀-₉]/g, function (c) { return String(c.charCodeAt(0) - 0x2080); });

    const total = {};
    const partes = limpio.split(/[·•*.]/);
    if (partes.some(function (p) { return p === ''; })) {
      throw new Error('Revisa los separadores de hidrato: deben ir entre dos partes de la fórmula (ej: CuSO4·5H2O).');
    }

    partes.forEach(function (parte) {
      /* Coeficiente inicial de cada parte («5H2O») */
      const m = parte.match(/^(\d+)(.*)$/);
      const coef = m ? parseInt(m[1], 10) : 1;
      const resto = m ? m[2] : parte;
      if (coef === 0) throw new Error('Un coeficiente no puede ser 0.');
      if (!resto) throw new Error('Falta la fórmula después del número ' + coef + '.');
      const conteo = analizar(resto);
      for (const el in conteo) total[el] = (total[el] || 0) + conteo[el] * coef;
    });
    return total;
  }

  function analizar(f) {
    let pos = 0;

    function numero() {
      const m = f.slice(pos).match(/^\d+/);
      if (!m) return 1;
      pos += m[0].length;
      const n = parseInt(m[0], 10);
      if (n === 0) throw new Error('Un subíndice no puede ser 0.');
      return n;
    }

    function grupo(dentro) {
      const conteo = {};
      let vacio = true;
      while (pos < f.length) {
        const c = f[pos];
        if (c === '(') {
          pos++;
          const sub = grupo(true);
          if (f[pos] !== ')') throw new Error('Falta cerrar un paréntesis. Revisa la fórmula.');
          pos++;
          const k = numero();
          for (const el in sub) conteo[el] = (conteo[el] || 0) + sub[el] * k;
          vacio = false;
        } else if (c === ')') {
          if (!dentro) throw new Error('Hay un paréntesis de cierre sin su apertura.');
          break;
        } else if (/[A-Z]/.test(c)) {
          let simbolo = c;
          if (/[a-z]/.test(f[pos + 1] || '')) simbolo += f[pos + 1];
          if (!(simbolo in MASAS_ATOMICAS)) {
            throw new Error(`Elemento no reconocido: «${simbolo}». Verifica el símbolo (ej: Fe, Cl, Ca).`);
          }
          pos += simbolo.length;
          const k = numero();
          conteo[simbolo] = (conteo[simbolo] || 0) + k;
          vacio = false;
        } else if (/[a-z]/.test(c)) {
          throw new Error(`Los símbolos empiezan con mayúscula: revisa «${c}» (ej: Fe, no fe; H2O, no h2o).`);
        } else if (/\d/.test(c)) {
          throw new Error('Hay un número en un lugar inesperado. Los subíndices van después del símbolo o del paréntesis (ej: H2O, Ca(OH)2).');
        } else {
          throw new Error(`Carácter no válido: «${c}». Usa letras, números, paréntesis o corchetes, y «·» para los hidratos.`);
        }
      }
      if (vacio) throw new Error(dentro ? 'Hay un paréntesis vacío.' : 'No se encontró ningún elemento en la fórmula.');
      return conteo;
    }

    const res = grupo(false);
    if (pos < f.length) throw new Error('Hay un paréntesis de cierre sin su apertura.');
    return res;
  }

  /* Fórmula con subíndices para mostrar (sin pasar por text-transform) */
  function formulaVisible(f) {
    const span = document.createElement('span');
    span.style.textTransform = 'none';
    span.textContent = f.replace(/([A-Za-z)\]])(\d+)/g, function (_, a, n) {
      return a + n.replace(/\d/g, function (d) { return '₀₁₂₃₄₅₆₇₈₉'[d]; });
    });
    return span;
  }

  /* ── Funciones de UI ────────────────────────────────────── */
  function mostrarResultado(valor, descripcion, lineasDesglose) {
    valor = conComa(valor);
    if (window.QuimCalcHistorial) window.QuimCalcHistorial.registrar(valor, 'Masa molar de ' + descripcion);
    bloqueResultado.classList.remove('resultado--error');
    etiquetaResultado.textContent = 'Masa molar de ';
    etiquetaResultado.appendChild(formulaVisible(descripcion));
    valorResultado.textContent    = valor;
    formulaResultado.textContent  = '';

    /* Mostramos el desglose elemento por elemento */
    desgloseResultado.innerHTML = '';
    lineasDesglose.forEach(function (linea) {
      const p = document.createElement('p');
      p.textContent = conComa(linea);
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
