/* ============================================================
   CALCULADORA DE MOLARIDAD Y MASA
   Archivo: herramientas/js/molaridad.js
   
   Este script maneja toda la lógica de la calculadora.
   El HTML lo llama con <script src="./js/molaridad.js">
   ============================================================ */

/* ── Esperamos a que el HTML esté completamente cargado ──────
   Esto evita errores de "elemento no encontrado".
   ──────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function () {

  /* ── Referencias a los elementos del HTML ────────────────
     Guardamos cada elemento en una variable para no buscarlo
     cada vez que lo necesitemos.
     ──────────────────────────────────────────────────────── */
  const inputMolaridad  = document.getElementById('molaridad');
  const inputVolumen    = document.getElementById('volumen');
  const selectUnidad    = document.getElementById('unidad-volumen');
  const inputPM         = document.getElementById('peso-molecular');
  const inputPureza     = document.getElementById('pureza');
  const botonCalcular   = document.getElementById('btn-calcular');
  const bloqueResultado = document.getElementById('resultado');
  const valorResultado  = document.getElementById('resultado-valor');
  const formulaResultado = document.getElementById('resultado-formula');
  const etiquetaResultado = document.getElementById('resultado-etiqueta');

  /* ── Función principal: se ejecuta cuando el usuario presiona "Calcular" ── */
  botonCalcular.addEventListener('click', function () {

    /* Leemos los valores de los inputs y los convertimos a número */
    const molaridad      = parseFloat(inputMolaridad.value);
    const volumen        = parseFloat(inputVolumen.value);
    const unidad         = selectUnidad.value;        // "mL" o "L"
    const pesoMolecular  = parseFloat(inputPM.value);
    const pureza         = parseFloat(inputPureza.value);

    /* ── Validación: verificamos que todos los campos tengan datos válidos ── */
    const camposInvalidos = [];

    if (isNaN(molaridad) || molaridad <= 0)
      camposInvalidos.push('Concentración (Molaridad)');

    if (isNaN(volumen) || volumen <= 0)
      camposInvalidos.push('Volumen final');

    if (isNaN(pesoMolecular) || pesoMolecular <= 0)
      camposInvalidos.push('Peso Molecular');

    if (isNaN(pureza) || pureza <= 0 || pureza > 100)
      camposInvalidos.push('Pureza (debe estar entre 1 y 100)');

    /* Si hay campos inválidos, mostramos el error y detenemos el cálculo */
    if (camposInvalidos.length > 0) {
      mostrarError('Revisá los siguientes campos: ' + camposInvalidos.join(', ') + '.');
      return; /* "return" detiene la función acá */
    }

    /* ── Conversión de unidades ──────────────────────────────
       La fórmula siempre trabaja en Litros.
       Si el usuario eligió "mL", dividimos por 1000 para pasar a L.
       ──────────────────────────────────────────────────────── */
    const volumenLitros = (unidad === 'mL') ? volumen / 1000 : volumen;

    /* ── FÓRMULA PRINCIPAL ───────────────────────────────────
       masa (g) = (molaridad × volumen_L × pesoMolecular) / (pureza / 100)
       
       Ejemplo: NaOH 0.1 M, 500 mL, PM = 40 g/mol, pureza 98%
       masa = (0.1 × 0.5 × 40) / (98/100) = 2 / 0.98 = 2.0408 g
       ──────────────────────────────────────────────────────── */
    const masa = (molaridad * volumenLitros * pesoMolecular) / (pureza / 100);

    /* ── Mostramos el resultado ──────────────────────────────
       toFixed(4) muestra 4 decimales: ej. 2.0408
       ──────────────────────────────────────────────────────── */
    const textoFormula =
      `masa = (${molaridad} mol/L × ${volumenLitros} L × ${pesoMolecular} g/mol) / (${pureza}% / 100)`;

    mostrarResultado(masa.toFixed(4) + ' g', textoFormula);
  });

  /* ── Función auxiliar: muestra un resultado exitoso ──────── */
  function mostrarResultado(valor, formula) {
    /* Quitamos clase de error por si venía de antes */
    bloqueResultado.classList.remove('resultado--error');

    etiquetaResultado.textContent  = 'Masa de soluto necesaria';
    valorResultado.textContent     = valor;
    formulaResultado.textContent   = formula;

    /* Hacemos visible el bloque de resultado */
    bloqueResultado.classList.add('visible');

    /* Scrolleamos suavemente al resultado para que el usuario lo vea */
    bloqueResultado.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  /* ── Función auxiliar: muestra un mensaje de error ────────── */
  function mostrarError(mensaje) {
    bloqueResultado.classList.add('resultado--error');

    etiquetaResultado.textContent  = 'Error';
    valorResultado.textContent     = mensaje;
    formulaResultado.textContent   = '';

    bloqueResultado.classList.add('visible');
  }

  /* ── Limpiamos el resultado cuando el usuario empieza a editar ──
     Esto evita que quede un resultado desactualizado en pantalla.
     ──────────────────────────────────────────────────────────── */
  [inputMolaridad, inputVolumen, selectUnidad, inputPM, inputPureza].forEach(function (campo) {
    campo.addEventListener('input', function () {
      bloqueResultado.classList.remove('visible');
    });
  });

}); /* Fin del DOMContentLoaded */
