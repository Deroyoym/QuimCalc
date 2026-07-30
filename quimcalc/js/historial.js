/* ============================================================
   HISTORIAL DE CÁLCULOS (por herramienta) — QuimCalc
   Archivo: js/historial.js

   Guarda los últimos 10 resultados de cada herramienta en
   localStorage (clave derivada del nombre de la página) y los
   muestra en un panel flotante. Cada herramienta lo usa llamando:
       QuimCalcHistorial.registrar(valor, detalle)
   normalmente desde su función mostrarResultado(). El módulo se
   encarga solo de la persistencia y de su propia UI; no requiere
   HTML adicional en la página.
   ============================================================ */
(function () {
  'use strict';

  var MAX = 10;
  var pagina = (location.pathname.split('/').pop() || 'index').replace('.html', '') || 'index';
  var CLAVE = 'quimcalc-hist-' + pagina;

  var store;
  try { store = window.localStorage; } catch (e) { store = null; }

  function leer() {
    if (!store) return [];
    try { return JSON.parse(store.getItem(CLAVE)) || []; }
    catch (e) { return []; }
  }
  function escribir(arr) {
    if (!store) return;
    try { store.setItem(CLAVE, JSON.stringify(arr.slice(0, MAX))); } catch (e) {}
  }

  function tiempoRelativo(ts) {
    var seg = Math.round((Date.now() - ts) / 1000);
    if (seg < 60) return 'hace instantes';
    var min = Math.round(seg / 60);
    if (min < 60) return 'hace ' + min + ' min';
    var hs = Math.round(min / 60);
    if (hs < 24) return 'hace ' + hs + ' h';
    return 'hace ' + Math.round(hs / 24) + ' d';
  }

  /* ── UI ── */
  var boton, panel, lista;

  function construirUI() {
    boton = document.createElement('button');
    boton.className = 'historial-boton';
    boton.type = 'button';
    boton.setAttribute('aria-expanded', 'false');
    boton.setAttribute('aria-controls', 'historial-panel');

    panel = document.createElement('div');
    panel.className = 'historial-panel';
    panel.id = 'historial-panel';
    panel.hidden = true;
    panel.innerHTML =
      '<div class="historial-panel__cab">' +
        '<span class="historial-panel__titulo">Tus últimos cálculos</span>' +
        '<button type="button" class="historial-panel__borrar">Borrar</button>' +
      '</div>' +
      '<ul class="historial-lista"></ul>';
    lista = panel.querySelector('.historial-lista');

    boton.addEventListener('click', function () {
      var abierto = !panel.hidden;
      panel.hidden = abierto;
      boton.setAttribute('aria-expanded', String(!abierto));
    });
    panel.querySelector('.historial-panel__borrar').addEventListener('click', function () {
      escribir([]);
      render();
    });

    document.body.appendChild(panel);
    document.body.appendChild(boton);
  }

  function render() {
    if (!boton) construirUI();
    var arr = leer();

    if (!arr.length) {
      boton.hidden = true;
      panel.hidden = true;
      boton.setAttribute('aria-expanded', 'false');
      return;
    }

    boton.hidden = false;
    boton.textContent = '🕘 Historial (' + arr.length + ')';

    lista.innerHTML = arr.map(function (e) {
      var detalle = e.d ? '<span class="historial-item__detalle">' + e.d + '</span>' : '';
      return '<li class="historial-item">' +
        '<span class="historial-item__valor">' + e.r + '</span>' +
        detalle +
        '<span class="historial-item__tiempo">' + tiempoRelativo(e.t) + '</span>' +
        '</li>';
    }).join('');
  }

  window.QuimCalcHistorial = {
    registrar: function (valor, detalle) {
      if (!store || valor == null || valor === '') return;
      var arr = leer();
      arr.unshift({ r: String(valor), d: detalle ? String(detalle) : '', t: Date.now() });
      escribir(arr);
      render();
    }
  };

  if (document.body) render();
  else document.addEventListener('DOMContentLoaded', render);

})();
