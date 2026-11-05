/* ============================================================
   FORMATO NUMÉRICO COMÚN — QuimCalc
   Archivo: js/formato-numero.js

   Reemplaza los toFixed(n) de las calculadoras. toFixed(4) mostraba
   «0,0000» para valores chicos (4 × 10⁻⁵ g) y no respetaba las cifras
   significativas. Este módulo formatea por cifras significativas:

     QCFormato.num(0.000040)        → «4,0000 × 10⁻⁵»
     QCFormato.num(2.040816)        → «2,0408»
     QCFormato.num(1803.2, 4)       → «1803»
     QCFormato.num(-3.2, 3)         → «−3,20»  (signo menos tipográfico)
     QCFormato.num(250000)          → «250 000»
     QCFormato.num(4.5, 6, true)    → «4,5»   (sin ceros de relleno)
     QCFormato.masa(0.00004)        → «40,000 µg»   (g → mg → µg)
     QCFormato.volumen(0.001)       → «1,0000 µL»   (mL → µL)

   Coma decimal en español, punto en inglés (según <html lang>).
   Notación científica con «× 10ⁿ» (nunca «e+4», que con coma
   decimal se confunde: «1,000e+4» parece 1).
   ============================================================ */
(function () {
  'use strict';

  var EN = (document.documentElement.lang || '').slice(0, 2) === 'en';
  var SUP = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
  var ESP_MILES = ' '; // espacio fino no separable: «250 000»

  function sup(n) { return String(n).replace(/[-0-9]/g, function (c) { return SUP[c]; }); }

  function local(s) {
    s = s.replace(/^-/, '−');
    if (EN) return s;
    return s.replace('.', ',');
  }

  function miles(entero) {
    // Agrupa de a tres solo a partir de 5 cifras (norma RAE/SI: «1803», «25 000»)
    if (entero.replace(/^[-−]/, '').length < 5) return entero;
    return entero.replace(/\B(?=(\d{3})+(?!\d))/g, EN ? ',' : ESP_MILES);
  }

  /**
   * Número con `cifras` cifras significativas (por defecto 5).
   * Fuera de [10⁻³, 10⁶) usa notación científica «a,bcd × 10ⁿ».
   */
  function num(x, cifras, recortar) {
    cifras = cifras || 5;
    if (recortar) return sinCeros(num(x, cifras));
    if (typeof x !== 'number' || !isFinite(x)) return '—';
    if (x === 0) return '0';
    var abs = Math.abs(x);
    if (abs < 1e-3 || abs >= 1e6) {
      var partes = x.toExponential(cifras - 1).split('e');
      var exp = parseInt(partes[1], 10);
      return local(partes[0]) + ' × 10' + sup(exp);
    }
    var mag = Math.floor(Math.log10(abs));
    var dec = Math.max(0, cifras - 1 - mag);
    var s = x.toFixed(dec);
    // Redondeo que sube de magnitud (9,99995 → 10,0000): recortar a las cifras pedidas
    if (Math.floor(Math.log10(Math.abs(parseFloat(s)))) > mag && dec > 0) s = x.toFixed(dec - 1);
    var p = s.split('.');
    return local(miles(p[0]) + (p[1] !== undefined ? '.' + p[1] : ''));
  }

  /** Quita ceros de relleno: «4,50000» → «4,5»; «2,000 × 10⁻⁵» → «2 × 10⁻⁵». */
  function sinCeros(s) {
    var sep = EN ? '\\.' : ',';
    return s.replace(new RegExp('(' + sep + '\\d*?)0+(?=$| )'), '$1').replace(new RegExp(sep + '(?=$| )'), '');
  }

  /** Masa en gramos → texto con la unidad más legible (g, mg o µg). */
  function masa(g, cifras) {
    var abs = Math.abs(g);
    if (g !== 0 && abs < 1e-4) return num(g * 1e6, cifras) + ' µg';   // < 0,1 mg: menos que lo que lee una balanza analítica
    if (g !== 0 && abs < 1e-2) return num(g * 1e3, cifras) + ' mg';
    return num(g, cifras) + ' g';
  }

  /** Volumen en mL → texto en mL o µL (por debajo de 0,1 mL). */
  function volumen(mL, cifras) {
    if (mL !== 0 && Math.abs(mL) < 0.1) return num(mL * 1000, cifras) + ' µL';
    return num(mL, cifras) + ' mL';
  }

  window.QCFormato = { num: num, masa: masa, volumen: volumen };
})();
