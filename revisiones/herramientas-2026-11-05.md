# Revisión de herramientas — 2026-11-05

**Alcance:**
- Se auditaron 17 de las 24 herramientas. Las 7 restantes ya se habían revisado entre octubre y noviembre: pH, reactivo comercial y las 6 del piloto en inglés.
- Se investigaron herramientas nuevas.

**Método:** 4 agentes en paralelo, sin editar archivos. Hicieron:
- unos 80 casos recalculados con Python;
- pruebas en Playwright a 375 px;
- contraste de datos con CIAAW/IUPAC, CRC, Harris y Sigma.

**Resultado general:**
- Ninguna página tiene errores de JS ni scroll horizontal.
- La coma decimal funciona en todas.
- Las fórmulas son correctas en los casos normales.
- Los problemas aparecen en tres lugares: el **formato de resultados** (valores chicos que se muestran como 0), el **parser de masa molar** y algunos **datos de las tablas de referencia**.

Scripts y capturas de los agentes en el scratchpad de la sesión (`auditA/`, `auditB/`, `auditC/`), no versionados.

---

## 1. Críticos (resultado o dato incorrecto)

| # | Herramienta | Problema | Evidencia | Corrección |
|---|---|---|---|---|
| C1 | Molaridad, diluciones, diluciones seriadas, solución desde sólido, conversor M↔N | Se redondea a un número fijo de decimales (`toFixed`), así que los valores chicos se muestran como 0 o pierden cifras | 1e-4 M · 10 mL · 40 g/mol → «0,0000 g» (molaridad.js:83). V₁ = 1e-5 mL → «0,0000» (diluciones.js:219). Una transferencia de 1 µL → «0,00 mL» (diluciones-serie.js:95). 1e-5 M × 2 → «0,0000 N» (conversor.js:298) | **Formateador común** con cifras significativas, «× 10ⁿ» y paso automático a mg/µg/µL |
| C2 | Masa molar | Las minúsculas se ignoran sin aviso | «h2o» → 0,000; «fe2O3» → 47,997 (esperado 159,69) (masa-molar.js:154, 169) | Tokenizador estricto que dé error ante cualquier carácter no reconocido |
| C3 | Temperatura | Acepta valores en °F por debajo del cero absoluto | −500 °F → −22,4 K (temperatura.js:60-69) | Validar `F < −459,67` |
| C4 | Tabla de solubilidad | Compuestos inexistentes o mal clasificados | AgOH «S» (precipita Ag₂O); Ag₂CrO₄ «LP» (es insoluble: es el punto final de Mohr); CuI₂ «S» y FeI₃ «S» (no existen: hay reacción redox) | AgOH → I (Ag₂O); Ag₂CrO₄ → I; CuI₂ y FeI₃ → «—» |
| C5 | Tabla de indicadores | «Uso típico» invertido | Azul de bromofenol figura como «ác. débil–base fuerte» y es ác. fuerte–base débil. Azul de timol (2.ª) figura como «bases débiles» y es ác. débil–base fuerte | Corregir las dos filas |

## 2. Altos

**Masa molar**
- No acepta hidratos ni corchetes: «CuSO4·5H2O» y «K4[Fe(CN)6]» dan error.
- Ignora el coeficiente inicial: «2H2O» → 18,015.
- Faltan elementos (Bi, Tl, Th, Nd, Gd, Ta, Os, Ir…).
- Masas no actualizadas según IUPAC (S 32,065, Li 6,941, B 10,811, Mo 95,96, Cd, Si). Además difieren de las de la tabla periódica. H₂SO₄ da 98,077; el valor IUPAC es 98,072.

**Tabla periódica**
- Uranio: dice «3 isótopos estables», pero no tiene ninguno.
- Las celdas no son accesibles con teclado.
- Los textos de las celdas miden 5,5–7 px, ilegibles.
- Li, Mo y Gd no tienen las masas actuales (CIAAW 2024).

**Tabla de pKa**
- Los buffers de Good figuran con valores a 20 °C rotulados como 25 °C. Ejemplos: MES 6,15 → 6,10; HEPES 7,55 → 7,48; PIPES; BICINE; CHES.
- La cita «Good et al.» no corresponde para CHES, CAPS y MOPS.
- La búsqueda no funciona en la práctica: «H3PO4», «acetico», «ácido acético» y «amoniaco» dan 0 resultados.

**Tabla de solubilidad**
- Los sulfuros alcalinotérreos figuran como «I», lo que contradice la regla de la propia página.
- Pb(CH₃COO)₂, HgCl₂ y Hg(CH₃COO)₂ figuran como «LP», pero son solubles.
- Falta Hg₂²⁺.
- El filtro «Solubles» no filtra (muestra 17 de 17) e ignora el buscador.

**Calculadoras**
- **Buffers:** usa Henderson-Hasselbalch sin aviso de validez, lo que no es coherente con la calculadora de pH. 1e-4/1e-4 M da 4,76, cuando el valor exacto es 4,88.
- **Titulación:** calcula el % sin factor de alícuota/matraz, así que lo subestima cuando se titula una parte. Si falta la valencia, no avisa.
- **Molaridad:** solo calcula la masa (no despeja M, V ni masa molar) y no tiene unidades mM, µM, µL ni mg.
- **Diluciones seriadas:** los valores mayores o iguales a 10⁴ se muestran como «1,000e+4», que se puede leer como 1.
- **Solución desde sólido:** muestra 4 decimales fijos («0,0001 g» cuando el valor es 5,87·10⁻⁵, un error del 70 %). Después de un error quedan visibles los valores anteriores.

## 3. Medios y bajos (resumen)

**Dureza**
- 0,5 mmol/L se muestra como «5,0000e-1».
- La página atribuye a la OMS un límite de 400 mg/L, que en realidad es del Código Alimentario Argentino. La clasificación 60/120/180 es de USGS.
- «°F» se confunde con Fahrenheit; usar °fH/°dH.
- Falta un modo desde Ca/Mg.

**Rendimiento**
- Un resultado mayor al 100 % se bloquea como error; debería mostrarse con una advertencia.

**Diluciones**
- El resultado no lleva unidad.
- No avisa si C₂ > C₁.
- No informa el solvente a agregar ni el factor de dilución.

**Diluciones seriadas**
- «Copiar» no copia la tabla y no hay CSV.
- «2,7 pasos» se acepta como 2.
- Matizar la frase «mínimo error acumulado».

**Concentración %**
- No se puede partir de la masa de solución, aunque el ejemplo de la página lo hace.
- Falta el modo % p/p + densidad → M.

**Conversores**
- La fórmula muestra ruido de coma flotante (0,30000000000000004).
- Una densidad ≤ 0 se reemplaza por 1 sin aviso.
- Un valor negativo no muestra mensaje.
- Copiar una tarjeta no incluye la unidad.

**Solución desde sólido**
- Exige masa molar también en g/L, donde no hace falta.
- Ejemplo de la página: dice 2,936 g; el correcto es 2,937.
- El enlace describe a la calculadora de molaridad como «sin pureza», pero sí tiene pureza.

**Transversales**
- «1.000,5» y «1,2,3» se truncan sin avisar (entrada-decimal.js:275).
- Enter no calcula.
- «Copiar resultado» copia la etiqueta en MAYÚSCULAS.
- Valores enormes desbordan la caja.

**Tabla periódica**
- Isótopos «estables» de C y K.
- Lr con ²⁶²Lr en lugar de ²⁶⁶Lr.
- Ho: 1878, no 1867.
- Mn no es cúbico simple.
- He sólido HCP.
- ²⁰⁹Po: t½ 124 años.
- La búsqueda no ignora tildes.

**Tabla de pKa**
- H₂SO₃ pKa₂ 7,17, ftálico pKa₂ 5,41, tartárico 3,04/4,37, HNO₂ 3,15.
- Cita a «NIST», que no publica pKa.
- EDTA con pKa₃ y pKa₄ en la misma celda.
- La glicina figura como «complejante».

**Tabla de indicadores**
- Faltan el verde y el púrpura de bromocresol.
- Nombres inconsistentes del azul de timol.
- Orden por rango incorrecto.
- No hay mensaje de «sin resultados».

**Tabla de solubilidad**
- Li₃PO₄ → I; CaCrO₄ → S; ZnCrO₄ → I; FeCrO₄, Fe₂S₃ y HgSO₄ → «—».
- Los cationes no tienen `th scope=row`.
- Contraste de la pastilla «—»: 4,34:1.

**Bajos sueltos**
- Buffers muestra 4 decimales de pH.
- B(OH)₃/B(OH)₄⁻.
- Titulación: placeholder «12.5» y el campo de resultado vacío en el modo volumen.
- Masa molar: acepta «()», muestra la fórmula en mayúsculas y su FAQ sobre uma es confusa.

## 4. Herramientas nuevas (investigación)

No hay datos de volumen de búsqueda. La demanda se estimó a partir de la competencia y la presencia en buscadores, así que conviene confirmarla con Search Console o Keyword Planner.

| Prioridad | Herramienta | Por qué | Esfuerzo |
|---|---|---|---|
| **Alta** | **Karl Fischer** (título con tartrato o agua, % H₂O) | El post ya existe y no tiene calculadora. No hay ninguna calculadora ni en español ni en inglés | S |
| **Alta** | **Factor de corrección / estandarización** (NaOH-KHP, HCl-Na₂CO₃, EDTA, tiosulfato, KMnO₄; réplicas y CV %) | No se encontró ninguna calculadora. Se conecta con 3 posts y con titulación | S–M |
| **Alta** | **Normalidad y peso equivalente** | El post normalidad-vs-molaridad no tiene calculadora; la competencia en español es floja | S |
| **Alta** | **Calibración gravimétrica de material volumétrico** (factor Z, ISO 4787/8655) | Solo existe software comercial. Hay un post y encaja con el piloto en inglés de QC | M |
| Media-alta | Ley de Beer-Lambert | Post de espectrofotometría | S |
| Media-alta | Prueba t / F para laboratorio | Validación de métodos | M |
| Media-alta | Carta de control (Levey-Jennings + Westgard) | En español solo hay metricgate | M |
| Media-alta | Receta de tampón en gramos (fosfato, acetato, Tris, PBS) | No hay ninguna en español; puede ser un modo de buffers | M |
| Media | Reactivo limitante / estequiometría | Mucha demanda escolar pero mucha competencia; reutiliza el parser de masa molar | M–L |
| Media | Alcalinidad y DQO | Grupo «agua» junto con dureza (88 impresiones) | S–M |
| Media | Humedad, cenizas y base seca/húmeda | Alimentos y agro | S |
| Baja-media | Gases ideales y conversor de presión | Competencia muy fuerte | S |

## 5. Agentes y proceso

Hoy los 4 agentes del repo (`revisor-tecnico`, `corrector-estilo`, `revisor-seo` e `investigador-temas`) son para el blog. Esta revisión mostró que en las herramientas los errores son de otro tipo: formato numérico, casos límite, parsers, datos de tablas y accesibilidad. Esos problemas los detecta mejor una **batería de pruebas fija** que un agente.

Recomendación:
1. **`scripts/test_calculadoras.mjs` (prioritario, no es un agente).** Casos de prueba por calculadora (entrada → salida esperada, incluidos valores chicos y entradas inválidas), más controles comunes:
   - sin errores de JS;
   - sin scroll horizontal a 375 px;
   - coma decimal;
   - ningún resultado «0,0000» cuando el valor esperado no es 0.

   Se corre antes de cada merge y evita volver a introducir los errores que se corrijan ahora.
2. **Agente `auditor-calculadoras`** (Read, Grep, Bash; no edita):
   - verifica fórmulas y datos contra referencias;
   - recalcula con Python;
   - propone casos nuevos para la batería.

   Es el equivalente de `revisor-tecnico` para las herramientas, y además revisa la sección educativa de cada página.
3. **Comando `/nueva-herramienta`.** Checklist para crear una herramienta:
   - plantilla HTML;
   - `entrada-decimal`, `historial` y `copiar-resultado`;
   - formateador común;
   - schema y FAQ;
   - `tools.json`, `sync_indexes` y `build_layout`;
   - casos en la batería;
   - pasada de `auditor-calculadoras` y de `revisor-seo`.
4. **Comando `/revisar-herramienta <slug>`.** Coordina `auditor-calculadoras`, la batería de pruebas y `revisor-seo` sobre una herramienta existente, con informe en `revisiones/`, igual que `/revisar-articulo`.

No hace falta un agente de navegador aparte: esa parte la cubre la batería de pruebas. Tampoco uno de traducción por ahora.

## 6. Plan propuesto

| Fase | Contenido | Esfuerzo |
|---|---|---|
| **1. Correcciones** | Formateador común en `js/` y aplicarlo en todas las calculadoras (C1). Validación estricta en entrada-decimal y Enter para calcular. Masa molar: parser estricto, hidratos, corchetes y coeficiente, 118 elementos con masas IUPAC en una fuente única compartida con la tabla periódica (C2). °F (C3). Datos de solubilidad, indicadores, tabla periódica y pKa (C4, C5 y los altos). Atribuciones de dureza. Rendimiento > 100 % con advertencia | M |
| **2. Proceso** | Batería `test_calculadoras.mjs`, agente `auditor-calculadoras` y comandos `/nueva-herramienta` y `/revisar-herramienta` | S–M |
| **3. Herramientas nuevas rápidas** | Karl Fischer, factor de corrección/estandarización, normalidad | M |
| **4. Mejoras de las existentes** | Molaridad multi-incógnita y desde % + densidad; receta de buffer con cálculo exacto; titulación con alícuota, blanco y modo molar; diluciones con unidades, solvente y CSV; búsqueda robusta y filtros en las tablas; enlaces pKa → buffers y tabla periódica → masa molar; selector de indicador | L |
| **5. Herramientas nuevas medianas** | Calibración gravimétrica, Beer-Lambert, carta de control, t/F, reactivo limitante | L |

---

## 7. Aplicado el 2026-11-05 (fases 1 y 2)

**Fase 1: correcciones**
- [x] C1: formateador común `js/formato-numero.js` (`QCFormato`). Se aplicó en molaridad, diluciones, diluciones seriadas, solución desde sólido, conversor M↔N y ppm, dureza, concentración %, titulación y relación de buffers.
- [x] C2: masa molar.
  - Analizador estricto: minúsculas, caracteres raros, «()» y separadores mal puestos dan error.
  - Acepta hidratos (·, •, *, .), corchetes y coeficiente inicial.
  - 118 elementos en `herramientas/js/masas-atomicas.js` (CIAAW/IUPAC 2021 + 2024).
  - % en masa por elemento.
  - Ejemplo: H₂SO₄ 98,072. FAQ de M<sub>r</sub>/u corregida.
- [x] C3: °F por debajo de −459,67 da error.
- [x] C4: solubilidad.
  - AgOH → I (Ag₂O); Ag₂CrO₄ → I; CuI₂, FeI₃, Fe₂S₃ y FeCrO₄ → «—».
  - MgS y CaS → «—»; BaS → S; Pb(OAc)₂ → S; HgCl₂ y Hg(OAc)₂ → S; HgSO₄ → «—»; Li₃PO₄ → I; CaCrO₄ → S; ZnCrO₄ → I.
  - Fila Hg₂²⁺ nueva; cationes con `th scope=row`; reglas corregidas.
  - «Resaltar» atenúa celdas y combina con el buscador; contraste de «—» corregido.
- [x] C5: indicadores.
  - «Uso típico» corregido en azul de bromofenol y azul de timol (2.ª).
  - Verde y púrpura de bromocresol agregados (17 indicadores); orden por rango.
  - Búsqueda sin tildes, aviso «sin resultados» y nota de la fenolftaleína a pH > 12.
- [x] Tabla periódica.
  - U sin isótopos estables; C y K corregidos; Lr ²⁶⁶Lr; Ho 1878; Mn cúbica compleja; He HCP; ²⁰⁹Po 124 a.
  - Masas Li 6,94, Mo 95,95 y Gd 157,25.
  - Celdas accesibles con teclado (Tab, flechas, Enter); leyenda con `aria-pressed`.
  - Letra ≥ 8 px; búsqueda sin tildes; `aria-live` en la ficha.
- [x] Tabla de pKa.
  - Buffers de Good a 25 °C (Sigma); H₂SO₃, ftálico, tartárico y HNO₂ (Harris).
  - EDTA con sus 6 pKa (Harris); fuentes corregidas, sin «NIST WebBook».
  - Búsqueda con subíndices, tildes, «ácido» y sinónimos; contador con `aria-live`.
- [x] Buffers: aviso con el pH exacto (balance de carga) cuando Henderson-Hasselbalch se aparta más de 0,05; aviso si la relación sale de 0,1–10. pH con 2 decimales; B(OH)₃/B(OH)₄⁻.
- [x] Titulación: campo «volumen del matraz» (factor de alícuota), aviso si falta la valencia, placeholder con coma, el modo volumen completa el campo.
- [x] Dureza.
  - Sin «e-1»; °fH/°dH.
  - Factores 17,848, 14,254 y 17,118.
  - Atribuciones corregidas (la OMS no fija valor guía; los 400 mg/L son del CAA; la clasificación es de USGS).
- [x] Rendimiento > 100 %: resultado con aviso; FAQ corregida.
- [x] Diluciones: aviso si C₂ > C₁, unidad aclarada, factor de dilución y solvente a agregar.
- [x] Diluciones seriadas: µL automático, sin «e+4», pasos enteros, frase del error acumulado.
- [x] Solución desde sólido: g/L sin masa molar, grilla limpia tras error, barra de pureza > 100 %, ejemplo 2,937 g y 15 mg.
- [x] Conversores: densidad ≤ 0 da error; sin ruido de coma flotante; valor negativo con mensaje; copiar con unidad.
- [x] Transversales: `entrada-decimal.js` rechaza «1.000,5» y «1,2,3» (`aria-invalid`); Enter calcula; «Copiar resultado» sin MAYÚSCULAS.

**Fase 2: proceso**
- [x] `scripts/test_calculadoras.mjs`: 80 pruebas. Incluye las 30 páginas de herramientas (ES y EN), los casos por calculadora, las tablas y las masas atómicas.
- [x] Agente `auditor-calculadoras`.
- [x] Comandos `/revisar-herramienta` y `/nueva-herramienta`.
- [x] INSTRUCCIONES.md, sección 7.

**Pendiente (fases 3–5):**
- Herramientas nuevas.
- Molaridad con varias incógnitas.
- Receta de buffer.
- Retrotitulación y modo molar.
- Dureza desde Ca/Mg.
- CSV en diluciones seriadas.
- Enlaces pKa → buffers y tabla periódica → masa molar.
- Selector de indicador.
- Kps.
