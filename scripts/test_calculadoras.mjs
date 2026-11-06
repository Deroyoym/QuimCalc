#!/usr/bin/env node
// ============================================================
// test_calculadoras.mjs — Batería de pruebas de las herramientas
// ============================================================
// Abre cada herramienta en Chromium (Playwright) y comprueba:
//   1. Controles comunes en TODAS las páginas de herramientas (ES y EN):
//      sin errores de JavaScript y sin scroll horizontal a 375 px.
//   2. Casos por calculadora: entrada → resultado esperado, incluidos
//      valores muy chicos, entradas inválidas y avisos.
//   3. En español, ningún resultado con punto decimal ni «0,0000»
//      cuando el valor esperado no es cero.
//   4. Datos: las masas de la tabla periódica coinciden con
//      herramientas/js/masas-atomicas.js (fuente única, CIAAW/IUPAC).
//
// Uso (desde la raíz del repo):
//   node scripts/test_calculadoras.mjs            → todo
//   node scripts/test_calculadoras.mjs masa-molar → solo las páginas que contengan ese texto
//
// Requiere Playwright (igual que build_og_images.mjs):
//   npm i --no-save playwright && npx playwright install chromium
// o, con un Chromium ya instalado: CHROMIUM_PATH=/ruta/al/chrome node scripts/…
//
// Para agregar un caso: sumarlo a CASOS con los pasos y lo esperado.
// Correr antes de cada merge a main. Sale con código 1 si algo falla.
// ============================================================

import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { resolve, dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = resolve(ROOT, 'quimcalc');
const FILTRO = process.argv[2] || '';

function loadChromium() {
  const require = createRequire(resolve(ROOT, 'package.json'));
  for (const mod of ['playwright', 'playwright-core']) {
    try { return require(mod).chromium; } catch { /* probar el siguiente */ }
  }
  console.error('✗ Falta Playwright. Instalalo con: npm i --no-save playwright && npx playwright install chromium');
  process.exit(1);
}

// ── Servidor estático mínimo ─────────────────────────────────
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon', '.webmanifest': 'application/manifest+json',
  '.txt': 'text/plain', '.xml': 'application/xml' };

function servidor() {
  const srv = createServer((req, res) => {
    let ruta = decodeURIComponent(req.url.split('?')[0]);
    let archivo = join(SITE, ruta);
    if (!archivo.startsWith(SITE)) { res.writeHead(403); return res.end(); }
    if (existsSync(archivo) && statSync(archivo).isDirectory()) archivo = join(archivo, 'index.html');
    if (!existsSync(archivo)) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'Content-Type': MIME[extname(archivo)] || 'application/octet-stream' });
    res.end(readFileSync(archivo));
  });
  return new Promise(ok => srv.listen(0, '127.0.0.1', () => ok(srv)));
}

// ── Casos por calculadora ────────────────────────────────────
// pasos: [accion, selector, valor]. Acciones: fill, select, click, press.
// espera: lista de { sel, contiene | regex | no | visible | clase | aria }.
const CALC = (pagina, nombre, pasos, espera) => ({ pagina, nombre, pasos, espera });
const fill = (sel, v) => ['fill', sel, String(v)];
const select = (sel, v) => ['select', sel, v];
const click = (sel = '#btn-calcular') => ['click', sel];
const press = (sel, tecla) => ['press', sel, tecla];
const RV = '#resultado-valor';

const CASOS = [
  // Molaridad
  CALC('calculadora-molaridad', 'NaOH 0,1 M en 500 mL, pureza 98 %',
    [fill('#molaridad', '0,1'), fill('#volumen', 500), fill('#peso-molecular', 40), fill('#pureza', 98), click()],
    [{ sel: RV, contiene: '2,0408 g' }]),
  CALC('calculadora-molaridad', 'Masa chica: se pasa a µg (antes «0,0000 g»)',
    [fill('#molaridad', '0,0001'), fill('#volumen', 10), fill('#peso-molecular', 40), fill('#pureza', 100), click()],
    [{ sel: RV, contiene: '40,000 µg' }]),
  CALC('calculadora-molaridad', 'Separador de miles «1.000,5»: error, no 1',
    [fill('#molaridad', '1.000,5'), fill('#volumen', 500), fill('#peso-molecular', 40), fill('#pureza', 100), click()],
    [{ sel: '#resultado', clase: 'resultado--error' }, { sel: '#molaridad', aria: ['aria-invalid', 'true'] }]),
  CALC('calculadora-molaridad', 'Enter calcula',
    [fill('#molaridad', '0,1'), fill('#volumen', 500), fill('#peso-molecular', 40), fill('#pureza', 98), press('#pureza', 'Enter')],
    [{ sel: RV, contiene: '2,0408 g' }]),

  // Diluciones C1V1 = C2V2
  CALC('calculadora-diluciones', 'V₁ con solvente y factor',
    [fill('#c1', 1), fill('#c2', '0,1'), fill('#v2', 100), click()],
    [{ sel: RV, contiene: '10,000' }, { sel: '#resultado-formula', contiene: 'Solvente a agregar: V₂ − V₁ = 90,000' },
     { sel: '#resultado-formula', contiene: 'Factor de dilución: 1:10,00' }]),
  CALC('calculadora-diluciones', 'Volumen traza: notación científica (antes «0,0000»)',
    [fill('#c1', 1000), fill('#c2', '0,001'), fill('#v2', 10), click()],
    [{ sel: RV, contiene: '1,0000 × 10⁻⁵' }]),
  CALC('calculadora-diluciones', 'C₂ > C₁: error',
    [fill('#c1', '0,1'), fill('#c2', 1), fill('#v2', 100), click()],
    [{ sel: '#resultado', clase: 'resultado--error' }]),

  // Diluciones seriadas
  CALC('diluciones-seriadas', 'Transferencia de 1 µL (antes «0,00 mL») y 10 000 sin «e+4»',
    [fill('#conc-inicial', 10000), fill('#factor', 1000), fill('#pasos', 2), fill('#vol-final', 1), click()],
    [{ sel: '#resultado-formula', contiene: '1,000 µL' }, { sel: '#contenedor-tabla', contiene: 'Madre 10 000' },
     { sel: '#contenedor-tabla', no: 'e+' }]),
  CALC('diluciones-seriadas', 'Pasos no enteros: error',
    [fill('#conc-inicial', 100), fill('#factor', 10), fill('#pasos', '2,7'), fill('#vol-final', 10), click()],
    [{ sel: '#resultado', clase: 'resultado--error' }]),

  // Solución desde sólido
  CALC('solucion-desde-solido', 'NaCl 0,1 M en 500 mL, pureza 99,5 % (ejemplo de la página)',
    [fill('#c-deseada', '0,1'), fill('#v-final', 500), fill('#masa-molar', '58,44'), fill('#pureza', '99,5'), click()],
    [{ sel: '#res-masa', contiene: '2,9367 g' }]),
  CALC('solucion-desde-solido', 'Masa chica en µg',
    [fill('#c-deseada', '0,00001'), fill('#v-final', 100), fill('#masa-molar', '58,44'), fill('#pureza', '99,5'), click()],
    [{ sel: '#res-masa', contiene: '58,734 µg' }]),
  CALC('solucion-desde-solido', 'g/L sin masa molar',
    [select('#unidad-c', 'g/L'), fill('#c-deseada', 10), fill('#v-final', 100), fill('#masa-molar', ''), fill('#pureza', 100), click()],
    [{ sel: '#res-masa', contiene: '1,0000 g' }]),

  // Conversor ppm / normalidad
  CALC('conversor-ppm-mgl', 'mg/L → ppm con densidad 1,02',
    [select('#tipo-conversion', 'ppm'), select('#dir-ppm', 'mgl-a-ppm'), fill('#valor-ppm', '4,08'), fill('#densidad-ppm', '1,02'), click()],
    [{ sel: RV, contiene: '4 ppm' }]),
  CALC('conversor-ppm-mgl', 'Densidad negativa: error (antes se usaba 1 sin avisar)',
    [select('#tipo-conversion', 'ppm'), fill('#valor-ppm', 10), fill('#densidad-ppm', -3), click()],
    [{ sel: '#resultado', clase: 'resultado--error' }]),
  CALC('conversor-ppm-mgl', 'M → N muy chico (antes «0,0000 N»)',
    [select('#tipo-conversion', 'norm'), select('#dir-norm', 'mol-a-norm'), fill('#valor-mol', '0,00001'), fill('#valencia', 2), click()],
    [{ sel: RV, contiene: '2 × 10⁻⁵ N' }]),

  // Dureza
  CALC('dureza-agua', '0,5 mmol/L sin notación «e-1»',
    [fill('#valor-dureza', '0,5'), select('#unidad-de', 'mmol'), click()],
    [{ sel: RV, contiene: '50,045 mg/L CaCO₃' }, { sel: '#contenedor-resultados', no: 'e-' }]),

  // Temperatura
  CALC('conversor-temperatura', '121 °C → °F',
    [fill('#valor-temp', 121), select('#unidad-de', 'C'), select('#unidad-a', 'F'), click()],
    [{ sel: RV, contiene: '249,8' }]),
  CALC('conversor-temperatura', '−500 °F: bajo el cero absoluto',
    [fill('#valor-temp', -500), select('#unidad-de', 'F'), select('#unidad-a', 'K'), click()],
    [{ sel: '#resultado', clase: 'resultado--error' }]),

  // Rendimiento
  CALC('calculadora-rendimiento', '> 100 %: resultado con aviso',
    [fill('#masa-obtenida', '5,3'), fill('#masa-teorica', '5,2'), click()],
    [{ sel: RV, contiene: '101,9' }, { sel: '#resultado-etiqueta', contiene: 'supera el 100' }]),

  // Buffers
  CALC('calculadora-buffers', 'H-H válida: acético 0,1/0,1',
    [select('#incognita', 'ph'), fill('#pka', '4,76'), fill('#conc-base', '0,1'), fill('#conc-acido', '0,1'), click()],
    [{ sel: RV, contiene: 'pH = 4,76' }, { sel: '#resultado-etiqueta', no: '⚠️' }]),
  CALC('calculadora-buffers', 'H-H no válida en 1e-4 M: aviso con pH exacto 4,88',
    [select('#incognita', 'ph'), fill('#pka', '4,76'), fill('#conc-base', '0,0001'), fill('#conc-acido', '0,0001'), click()],
    [{ sel: '#resultado-etiqueta', contiene: 'pH exacto (balance de carga, 25 °C) es 4,88' }]),

  // Titulación
  CALC('calculadora-titulacion', 'Alícuota de un matraz: % corregido',
    [fill('#n-titulante', '0,1'), fill('#v-titulante', '18,5'), fill('#v-muestra', 10), fill('#valencia-analito', 1),
     fill('#pm-analito', '60,05'), fill('#masa-muestra', 10), fill('#vol-matraz', 100), click()],
    [{ sel: RV, contiene: '0,18500 N' }, { sel: '#resultado-extra', contiene: '11,109 %' }]),
  CALC('calculadora-titulacion', 'Sin valencia: aviso',
    [fill('#n-titulante', '0,1'), fill('#v-titulante', '18,5'), fill('#v-muestra', 10), fill('#pm-analito', '60,05'), click()],
    [{ sel: '#resultado-extra', contiene: 'Falta la valencia' }]),

  // Masa molar
  ...[
    ['H2SO4', '98,072 g/mol'], ['NaCl', '58,440 g/mol'], ['CuSO4·5H2O', '249,677 g/mol'], ['CuSO4*5H2O', '249,677 g/mol'],
    ['K4[Fe(CN)6]', '368,345 g/mol'], ['2H2O', '36,030 g/mol'], ['Bi(NO3)3', '394,992 g/mol'], ['((CH3)3C)2O', '130,231 g/mol'],
  ].map(([f, esp]) => CALC('masa-molar', `Fórmula ${f}`, [fill('#formula', f), click()], [{ sel: RV, contiene: esp }])),
  ...['h2o', 'fe2O3', 'H2O()', 'Xx2', 'H2O·'].map(f =>
    CALC('masa-molar', `Fórmula inválida «${f}»: error`, [fill('#formula', f), click()], [{ sel: '#resultado', clase: 'resultado--error' }])),

  // Concentración %
  CALC('concentracion-pp', '25 g en 225 g de agua → 10 % p/p',
    [select('#tipo-porc', 'pp'), fill('#masa-soluto', 25), fill('#masa-solvente', 225), click()],
    [{ sel: RV, contiene: '10 % p/p' }]),

  // Karl Fischer
  CALC('calculadora-karl-fischer', 'Factor con agua pura (ejemplo del post)',
    [select('#modo', 'factor'), select('#patron', 'agua'), fill('#rep-m-1', '15,2'), fill('#rep-v-1', '3,12'), click()],
    [{ sel: RV, contiene: 'F = 4,8718 mg/mL' }]),
  CALC('calculadora-karl-fischer', 'Factor con tartrato',
    [select('#modo', 'factor'), select('#patron', 'tartrato'), fill('#rep-m-1', '150,0'), fill('#rep-v-1', '4,70'), click()],
    [{ sel: RV, contiene: 'F = 4,9978 mg/mL' }]),
  CALC('calculadora-karl-fischer', 'Réplica incompleta: error',
    [select('#modo', 'factor'), fill('#rep-m-1', '15,2'), click()],
    [{ sel: '#resultado', clase: 'resultado--error' }]),
  CALC('calculadora-karl-fischer', '% de agua volumétrico',
    [select('#modo', 'volumetrico'), fill('#vol-factor', '4,998'), fill('#vol-v', '2,35'), fill('#vol-masa', 1), click()],
    [{ sel: RV, contiene: '1,175 %' }, { sel: '#resultado-extra', contiene: '11 745 mg/kg' }]),
  CALC('calculadora-karl-fischer', '% de agua coulométrico',
    [select('#modo', 'coulometrico'), fill('#cou-ug', 1250), fill('#cou-masa', '0,5'), click()],
    [{ sel: RV, contiene: '0,2500 %' }, { sel: '#resultado-extra', contiene: '2500 mg/kg' }]),

  // Normalidad
  CALC('calculadora-normalidad', 'H₂SO₄ 0,1 M → 0,2 N y peso equivalente',
    [select('#reactivo', 'h2so4'), select('#modo', 'convertir'), fill('#conc', '0,1'), select('#unidad-conc', 'M'), click()],
    [{ sel: RV, contiene: '0,20000 eq/L' }, { sel: '#resultado-extra', contiene: '49,036 g/eq' }]),
  CALC('calculadora-normalidad', 'Na₂CO₃ 0,1 N en 250 mL',
    [select('#reactivo', 'na2co3'), select('#modo', 'preparar'), fill('#n-deseada', '0,1'), fill('#v-prep', 250), click()],
    [{ sel: RV, contiene: '1,3249 g' }]),
  CALC('calculadora-normalidad', 'KMnO₄ 0,1 N en 1 L',
    [select('#reactivo', 'kmno4'), select('#modo', 'preparar'), fill('#n-deseada', '0,1'), fill('#v-prep', 1), select('#unidad-v', 'L'), click()],
    [{ sel: RV, contiene: '3,1606 g' }]),
  CALC('calculadora-normalidad', 'Factor de equivalencia vacío: error',
    [select('#reactivo', 'otro'), fill('#masa-molar', 100), fill('#conc', '0,1'), click()],
    [{ sel: '#resultado', clase: 'resultado--error' }]),

  // Factor de corrección
  CALC('factor-correccion-estandarizacion', 'NaOH con KHP, una réplica',
    [select('#par', 'naoh-khp'), fill('#c-nominal', '0,1'), fill('#pureza-patron', '99,95'), fill('#rep-m-1', '0,5105'), fill('#rep-v-1', '24,85'), click()],
    [{ sel: RV, contiene: 'f = 1,0054' }]),
  CALC('factor-correccion-estandarizacion', 'NaOH con KHP, tres réplicas (media y CV)',
    [select('#par', 'naoh-khp'), fill('#c-nominal', '0,1'), fill('#pureza-patron', '99,95'),
     fill('#rep-m-1', '0,5105'), fill('#rep-v-1', '24,85'), fill('#rep-m-2', '0,5022'), fill('#rep-v-2', '24,42'),
     fill('#rep-m-3', '0,5187'), fill('#rep-v-3', '25,27'), click()],
    [{ sel: RV, contiene: 'f = 1,0055' }, { sel: '#resultado-extra', contiene: '0,0947 %' }]),
  CALC('factor-correccion-estandarizacion', 'Tiosulfato con KIO₃ (r = 6)',
    [select('#par', 'tio-kio3'), fill('#c-nominal', '0,1'), fill('#rep-m-1', '0,1427'), fill('#rep-v-1', '40,00'), click()],
    [{ sel: RV, contiene: 'f = 1,0003' }]),
  CALC('factor-correccion-estandarizacion', 'Volumen menor que el blanco: error',
    [select('#par', 'naoh-khp'), fill('#c-nominal', '0,1'), fill('#v-blanco', 5), fill('#rep-m-1', '0,5'), fill('#rep-v-1', 4), click()],
    [{ sel: '#resultado', clase: 'resultado--error' }]),

  // Casos de la auditoría de las herramientas nuevas (2026-11-05)
  CALC('calculadora-karl-fischer', 'Blanco volumétrico inválido: error',
    [select('#modo', 'volumetrico'), fill('#vol-factor', '4,998'), fill('#vol-v', '2,35'), fill('#vol-blanco', '1,2,3'), fill('#vol-masa', 1), click()],
    [{ sel: '#resultado', clase: 'resultado--error' }]),
  CALC('calculadora-karl-fischer', 'Blanco coulométrico inválido: error',
    [select('#modo', 'coulometrico'), fill('#cou-ug', 1250), fill('#cou-blanco', '1.000,5'), fill('#cou-masa', '0,5'), click()],
    [{ sel: '#resultado', clase: 'resultado--error' }]),
  CALC('calculadora-karl-fischer', 'Tartrato, 3 réplicas: media y CV',
    [select('#modo', 'factor'), select('#patron', 'tartrato'), fill('#rep-m-1', '152,3'), fill('#rep-v-1', '4,78'), fill('#rep-m-2', '148,9'), fill('#rep-v-2', '4,66'), fill('#rep-m-3', '155,0'), fill('#rep-v-3', '4,86'), click()],
    [{ sel: RV, contiene: 'F = 4,9959 mg/mL' }, { sel: '#resultado-extra', contiene: '0,145 %' }]),
  CALC('calculadora-karl-fischer', 'Factor con CV > 1 %: aviso',
    [select('#modo', 'factor'), select('#patron', 'agua'), fill('#rep-m-1', '20,0'), fill('#rep-v-1', '4,00'), fill('#rep-m-2', '20,0'), fill('#rep-v-2', '4,20'), click()],
    [{ sel: RV, contiene: 'F = 4,8810 mg/mL' }, { sel: '#resultado-extra', contiene: 'supera el 1 %' }]),
  CALC('calculadora-karl-fischer', 'Estándar líquido 10 mg/g',
    [select('#modo', 'factor'), select('#patron', 'estandar'), fill('#contenido', '10,0'), fill('#rep-m-1', 1500), fill('#rep-v-1', '3,05'), click()],
    [{ sel: RV, contiene: 'F = 4,9180 mg/mL' }]),
  CALC('calculadora-karl-fischer', 'Volumétrico con blanco',
    [select('#modo', 'volumetrico'), fill('#vol-factor', '5,012'), fill('#vol-v', '3,48'), fill('#vol-blanco', '0,06'), fill('#vol-masa', '0,2513'), click()],
    [{ sel: RV, contiene: '6,821 %' }, { sel: '#resultado-extra', contiene: '68 209 mg/kg' }, { sel: '#resultado-formula', contiene: '(3,48 − 0,06) mL' }]),
  CALC('calculadora-karl-fischer', 'Coulométrico trazas: notación científica y aviso',
    [select('#modo', 'coulometrico'), fill('#cou-ug', '8,5'), fill('#cou-blanco', '1,2'), fill('#cou-masa', 2), click()],
    [{ sel: RV, contiene: '3,650 × 10⁻⁴ %' }, { sel: '#resultado-extra', contiene: 'Menos de 10 µg' }]),
  CALC('calculadora-karl-fischer', 'Coulométrico > 100 %: aviso',
    [select('#modo', 'coulometrico'), fill('#cou-ug', 5000), fill('#cou-masa', '0,001'), click()],
    [{ sel: '#resultado-extra', contiene: 'supera el 100 %' }]),
  CALC('calculadora-normalidad', 'f no entero: aviso y coma decimal en la fórmula',
    [select('#reactivo', 'otro'), fill('#masa-molar', 100), fill('#feq', '2,5'), fill('#conc', 1), select('#unidad-conc', 'M'), click()],
    [{ sel: RV, contiene: '2,5000 eq/L' }, { sel: '#resultado-extra', contiene: 'suele ser un entero' }, { sel: '#resultado-formula', no: '2.5' }]),
  CALC('calculadora-normalidad', 'KMnO₄ 0,1 N → 0,02 M',
    [select('#reactivo', 'kmno4'), fill('#conc', '0,1'), select('#unidad-conc', 'N'), click()],
    [{ sel: RV, contiene: '0,020000 mol/L' }, { sel: '#resultado-extra', contiene: '31,606 g/eq' }]),
  CALC('calculadora-normalidad', 'Masa muy chica en µg',
    [select('#reactivo', 'kmno4'), select('#modo', 'preparar'), fill('#n-deseada', '0,00001'), fill('#v-prep', 10), click()],
    [{ sel: RV, contiene: '3,1606 µg' }]),
  CALC('calculadora-normalidad', 'Masa muy grande en kg',
    [select('#reactivo', 'agno3'), select('#modo', 'preparar'), fill('#n-deseada', 5), fill('#v-prep', 1000), select('#unidad-v', 'L'), click()],
    [{ sel: RV, contiene: '849,37 kg' }]),
  CALC('calculadora-normalidad', 'NaOH con pureza 98 %: masa y aviso de estandarizar',
    [select('#reactivo', 'naoh'), select('#modo', 'preparar'), fill('#n-deseada', '0,1'), fill('#v-prep', 500), fill('#pureza', 98), click()],
    [{ sel: RV, contiene: '2,0407 g' }, { sel: '#resultado-extra', contiene: 'estandarízala' }]),
  CALC('calculadora-normalidad', 'H₂SO₄: aviso de líquido concentrado con M = N / f',
    [select('#reactivo', 'h2so4'), select('#modo', 'preparar'), fill('#n-deseada', 1), fill('#v-prep', 1), select('#unidad-v', 'L'), click()],
    [{ sel: RV, contiene: '49,036 g' }, { sel: '#resultado-extra', contiene: '0,5000 mol/L' }]),
  CALC('calculadora-normalidad', 'Ca(OH)₂ 0,1 N: aviso de solubilidad',
    [select('#reactivo', 'caoh2'), select('#modo', 'preparar'), fill('#n-deseada', '0,1'), fill('#v-prep', 1), select('#unidad-v', 'L'), click()],
    [{ sel: '#resultado-extra', contiene: 'Supera la solubilidad' }]),
  CALC('calculadora-normalidad', 'I₂: aviso de KI',
    [select('#reactivo', 'iodo'), select('#modo', 'preparar'), fill('#n-deseada', '0,1'), fill('#v-prep', 1), select('#unidad-v', 'L'), click()],
    [{ sel: '#resultado-extra', contiene: 'KI' }]),
  CALC('calculadora-normalidad', 'Volumen «1.000,5»: error',
    [select('#modo', 'preparar'), fill('#n-deseada', '0,1'), fill('#v-prep', '1.000,5'), click()],
    [{ sel: '#resultado', clase: 'resultado--error' }]),
  CALC('calculadora-normalidad', 'Pureza 120 %: error',
    [select('#modo', 'preparar'), fill('#n-deseada', '0,1'), fill('#v-prep', 100), fill('#pureza', 120), click()],
    [{ sel: '#resultado', clase: 'resultado--error' }]),
  CALC('calculadora-normalidad', 'Concentración 1e400: error',
    [fill('#conc', '1e400'), click()],
    [{ sel: '#resultado', clase: 'resultado--error' }]),
  CALC('factor-correccion-estandarizacion', 'HCl con Na₂CO₃ (r = 2)',
    [select('#par', 'hcl-na2co3'), fill('#c-nominal', '0,1'), fill('#pureza-patron', '99,95'), fill('#rep-m-1', '0,2120'), fill('#rep-v-1', '39,80'), click()],
    [{ sel: RV, contiene: 'f = 1,0046' }]),
  CALC('factor-correccion-estandarizacion', 'HCl con bórax (r = 2)',
    [select('#par', 'hcl-borax'), fill('#c-nominal', '0,1'), fill('#rep-m-1', '0,3814'), fill('#rep-v-1', '19,95'), click()],
    [{ sel: RV, contiene: 'f = 1,0026' }]),
  CALC('factor-correccion-estandarizacion', 'Tiosulfato con K₂Cr₂O₇ (r = 6)',
    [select('#par', 'tio-k2cr2o7'), fill('#c-nominal', '0,1'), fill('#rep-m-1', '0,0490'), fill('#rep-v-1', '10,05'), click()],
    [{ sel: RV, contiene: 'f = 0,99441' }]),
  CALC('factor-correccion-estandarizacion', 'KMnO₄ con oxalato (r = 0,4) y blanco',
    [select('#par', 'kmno4-oxalato'), fill('#c-nominal', '0,02'), fill('#v-blanco', '0,03'), fill('#rep-m-1', '0,1675'), fill('#rep-v-1', '25,00'), click()],
    [{ sel: RV, contiene: 'f = 1,0012' }, { sel: '#resultado-extra', contiene: '0,020024 mol/L' }]),
  CALC('factor-correccion-estandarizacion', 'Concentración muy chica en notación × 10ⁿ',
    [select('#par', 'naoh-khp'), fill('#c-nominal', '0,00001'), fill('#rep-m-1', '0,0001'), fill('#rep-v-1', 12), click()],
    [{ sel: '#resultado-extra', contiene: '4,0805 × 10⁻⁵ mol/L' }]),
  CALC('factor-correccion-estandarizacion', 'Tres réplicas: desvío estándar',
    [select('#par', 'naoh-khp'), fill('#c-nominal', '0,1'), fill('#pureza-patron', '99,95'),
     fill('#rep-m-1', '0,5105'), fill('#rep-v-1', '24,85'), fill('#rep-m-2', '0,5022'), fill('#rep-v-2', '24,42'),
     fill('#rep-m-3', '0,5187'), fill('#rep-v-3', '25,27'), click()],
    [{ sel: '#resultado-extra', contiene: '9,52 × 10⁻⁴' }]),
  CALC('factor-correccion-estandarizacion', 'CV alto: aviso',
    [select('#par', 'naoh-khp'), fill('#c-nominal', '0,1'), fill('#rep-m-1', '0,5105'), fill('#rep-v-1', '24,85'), fill('#rep-m-2', '0,5105'), fill('#rep-v-2', '25,30'), click()],
    [{ sel: '#resultado-extra', contiene: 'supera 0,2 %' }]),
  CALC('factor-correccion-estandarizacion', 'Masa «1,2,3»: error',
    [select('#par', 'naoh-khp'), fill('#c-nominal', '0,1'), fill('#rep-m-1', '1,2,3'), fill('#rep-v-1', '24,85'), click()],
    [{ sel: '#resultado', clase: 'resultado--error' }]),
  CALC('factor-correccion-estandarizacion', 'Blanco «1,2,3»: error',
    [select('#par', 'naoh-khp'), fill('#c-nominal', '0,1'), fill('#v-blanco', '1,2,3'), fill('#rep-m-1', '0,5105'), fill('#rep-v-1', '24,85'), click()],
    [{ sel: '#resultado', clase: 'resultado--error' }]),
  CALC('factor-correccion-estandarizacion', 'Concentración nominal 1e999: error',
    [select('#par', 'naoh-khp'), fill('#c-nominal', '1e999'), fill('#rep-m-1', '0,5105'), fill('#rep-v-1', '24,85'), click()],
    [{ sel: '#resultado', clase: 'resultado--error' }]),

  // pH (revisada en octubre; caso de regresión)
  CALC('calculadora-ph', 'Ácido acético 0,1 M → pH 2,88',
    [select('#tipo-sustancia', 'acido-debil'), fill('#concentracion', '0,1'), fill('#ka', '1,8e-5'), click()],
    [{ sel: RV, contiene: '2,875' }]),
];

// ── Casos de tablas de referencia ────────────────────────────
const TABLAS = [
  ['tabla-pka', 'Buscar «H3PO4» (sin subíndices)', async p => { await p.fill('#buscador', 'H3PO4'); return (await p.textContent('#n-visibles')).trim() === '1'; }],
  ['tabla-pka', 'Buscar «acido acetico» (sin tildes)', async p => { await p.fill('#buscador', 'acido acetico'); return Number(await p.textContent('#n-visibles')) >= 1; }],
  ['tabla-pka', 'Buscar «amoniaco»', async p => { await p.fill('#buscador', 'amoniaco'); return (await p.textContent('#n-visibles')).trim() === '1'; }],
  ['tabla-indicadores', 'Buscar «fenolftaleina» (sin tilde)', async p => {
    await p.fill('#buscador', 'fenolftaleina');
    return (await p.locator('#tabla-principal tbody tr:not(.oculta)').count()) >= 1 && await p.locator('#sin-resultados').isHidden(); }],
  ['tabla-indicadores', 'Sin resultados: aviso', async p => { await p.fill('#buscador', 'zzzz'); return p.locator('#sin-resultados').isVisible(); }],
  ['tabla-indicadores', 'Azul de bromofenol: ácido fuerte–base débil', async p =>
    (await p.locator('#tabla-principal tr', { hasText: 'Azul de bromofenol' }).textContent()).includes('ácido fuerte–base débil')],
  ['tabla-solubilidad', 'Ag⁺: hidróxido y cromato insolubles', async p => {
    const celdas = await p.locator('#cuerpo-tabla tr[data-cation^="plata"] td').allTextContents();
    return celdas[3].trim() === 'I' && celdas[8].trim() === 'I'; }],
  ['tabla-solubilidad', 'CuI₂ y FeI₃ no existen', async p => {
    const cu = await p.locator('#cuerpo-tabla tr[data-cation^="cobre"] td').allTextContents();
    const fe = await p.locator('#cuerpo-tabla tr[data-cation^="hierro fe3"] td').allTextContents();
    return cu[9].trim() === '—' && fe[9].trim() === '—'; }],
  ['tabla-solubilidad', '«Resaltar» combina con el buscador', async p => {
    await p.fill('#buscador', 'plata'); await p.click('.filtro-btn[data-filtro="i"]');
    const visibles = await p.locator('#cuerpo-tabla tr:not(.fila-oculta)').count();
    const atenuadas = await p.locator('#cuerpo-tabla tr:not(.fila-oculta) .pastilla.atenuada').count();
    return visibles === 1 && atenuadas > 0; }],
  ['tabla-periodica', 'Buscar «oxigeno» (sin tilde)', async p => {
    await p.fill('#tp-buscar, input[type="search"]', 'oxigeno');
    return (await p.locator('.el-cel:not(.dim)').count()) === 1; }],
  ['tabla-periodica', 'Teclado: Tab + flecha derecha va de H a He', async p => {
    await p.locator('.el-cel').first().focus(); await p.keyboard.press('ArrowRight');
    return (await p.evaluate(() => document.activeElement.getAttribute('aria-label'))).startsWith('Helio'); }],
];

// ── Datos: tabla periódica vs masas atómicas ─────────────────
function revisarMasas() {
  const require = createRequire(import.meta.url);
  const { MASAS } = require(resolve(SITE, 'herramientas/js/masas-atomicas.js'));
  const src = readFileSync(resolve(SITE, 'herramientas/js/tabla-periodica.js'), 'utf8');
  const errores = [];
  const filas = [...src.matchAll(/\[(\d+),'([A-Z][a-z]?)','[^']+','([^']+)'/g)];
  if (filas.length !== 118) errores.push(`la tabla periódica tiene ${filas.length} elementos, no 118`);
  for (const [, , sym, masaTxt] of filas) {
    const ref = MASAS[sym];
    if (ref === undefined) { errores.push(`${sym}: falta en masas-atomicas.js`); continue; }
    const m = masaTxt.replace(/[()]/g, '');
    const dec = (m.split('.')[1] || '').length;
    // La tabla muestra menos cifras: basta con que coincida al redondear (± media unidad de la última cifra)
    if (Math.abs(parseFloat(m) - ref) > 0.5 * 10 ** -dec + 1e-9) errores.push(`${sym}: tabla ${masaTxt} ≠ ${ref}`);
  }
  if (Object.keys(MASAS).length !== 118) errores.push(`masas-atomicas.js tiene ${Object.keys(MASAS).length} elementos`);
  return errores;
}

// ── Ejecución ────────────────────────────────────────────────
const resultados = [];
const ok = (nombre) => resultados.push({ ok: true, nombre });
const falla = (nombre, detalle) => resultados.push({ ok: false, nombre, detalle });

const errMasas = revisarMasas();
errMasas.length ? falla('Datos: masas de la tabla periódica', errMasas.join('; ')) : ok('Datos: masas de la tabla periódica = masas-atomicas.js');

const srv = await servidor();
const BASE = `http://127.0.0.1:${srv.address().port}`;
const chromium = loadChromium();
const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const ctx = await browser.newContext({ viewport: { width: 375, height: 800 } });
// Sin analíticas ni recursos externos durante las pruebas
await ctx.route(/googletagmanager|google-analytics|_vercel|fonts\.(googleapis|gstatic)/, r => r.abort());
await ctx.addInitScript(() => { try { localStorage.setItem('quimcalc-consent', 'denied'); } catch (e) {} });

async function abrir(ruta) {
  const page = await ctx.newPage();
  const errores = [];
  page.on('pageerror', e => errores.push(e.message));
  await page.goto(`${BASE}/${ruta}`, { waitUntil: 'load' });
  const banner = page.locator('[data-consent=denied]');
  if (await banner.count() && await banner.first().isVisible()) await banner.first().click();
  return { page, errores };
}

// 1. Controles comunes en todas las páginas de herramientas
const paginas = [
  ...readdirSync(resolve(SITE, 'herramientas')).filter(f => f.endsWith('.html')).map(f => `herramientas/${f}`),
  ...(existsSync(resolve(SITE, 'en/tools')) ? readdirSync(resolve(SITE, 'en/tools')).filter(f => f.endsWith('.html')).map(f => `en/tools/${f}`) : []),
].filter(p => p.includes(FILTRO));

for (const ruta of paginas) {
  const { page, errores } = await abrir(ruta);
  const ancho = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  if (errores.length) falla(`${ruta}: errores de JS`, errores.join(' | '));
  else if (ancho > 0) falla(`${ruta}: scroll horizontal a 375 px`, `${ancho} px de más`);
  else ok(`${ruta}: carga sin errores ni scroll horizontal`);
  await page.close();
}

// 2. Casos por calculadora
for (const c of CASOS.filter(c => c.pagina.includes(FILTRO))) {
  const nombre = `${c.pagina} — ${c.nombre}`;
  const { page, errores } = await abrir(`herramientas/${c.pagina}.html`);
  try {
    for (const [acc, sel, val] of c.pasos) {
      if (acc === 'fill') await page.fill(sel, val);
      else if (acc === 'select') await page.selectOption(sel, val);
      else if (acc === 'click') await page.click(sel);
      else if (acc === 'press') await page.press(sel, val);
    }
    const fallos = [];
    for (const e of c.espera) {
      const loc = page.locator(e.sel).first();
      // textContent (no innerText): no depende del text-transform del CSS
      const texto = ((await loc.textContent().catch(() => '')) || '').replace(/\s+/g, ' ');
      if (e.contiene && !texto.includes(e.contiene)) fallos.push(`«${e.sel}» no contiene «${e.contiene}» (dice: «${texto.slice(0, 160)}»)`);
      if (e.no && texto.includes(e.no)) fallos.push(`«${e.sel}» contiene «${e.no}»`);
      if (e.clase && !(await loc.getAttribute('class') || '').includes(e.clase)) fallos.push(`«${e.sel}» no tiene la clase ${e.clase}`);
      if (e.aria && (await loc.getAttribute(e.aria[0])) !== e.aria[1]) fallos.push(`«${e.sel}» no tiene ${e.aria[0]}="${e.aria[1]}"`);
    }
    // Reglas generales para los resultados en español
    const valor = (await page.locator(RV).first().innerText().catch(() => '')) || '';
    if (/\d\.\d/.test(valor)) fallos.push(`resultado con punto decimal: «${valor}»`);
    if (/\b0,0+\b(?! ×)/.test(valor) && !/resultado--error/.test(await page.locator('#resultado').first().getAttribute('class').catch(() => '') || '')) {
      fallos.push(`resultado «0,000…»: «${valor}»`);
    }
    if (errores.length) fallos.push('errores de JS: ' + errores.join(' | '));
    fallos.length ? falla(nombre, fallos.join('; ')) : ok(nombre);
  } catch (err) {
    falla(nombre, err.message.split('\n')[0]);
  }
  await page.close();
}

// 3. Tablas de referencia
for (const [pag, nombre, prueba] of TABLAS.filter(t => t[0].includes(FILTRO))) {
  const { page, errores } = await abrir(`herramientas/${pag}.html`);
  try {
    const bien = await prueba(page);
    bien && !errores.length ? ok(`${pag} — ${nombre}`) : falla(`${pag} — ${nombre}`, errores.join(' | ') || 'no se cumple');
  } catch (err) {
    falla(`${pag} — ${nombre}`, err.message.split('\n')[0]);
  }
  await page.close();
}

await browser.close();
srv.close();

// ── Informe ──────────────────────────────────────────────────
const fallidos = resultados.filter(r => !r.ok);
for (const r of resultados) console.log(`${r.ok ? '✓' : '✗'} ${r.nombre}${r.ok ? '' : '\n    → ' + r.detalle}`);
console.log(`\n${resultados.length - fallidos.length}/${resultados.length} pruebas correctas.`);
process.exit(fallidos.length ? 1 : 0);
