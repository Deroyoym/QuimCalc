/* ============================================================
   FILTRO DE CATEGORÍAS DEL BLOG
   Archivo: js/blog-filtro.js

   Filtra las tarjetas de post por categoría al hacer clic en el
   sidebar. Cada tarjeta trae data-categoria (lo genera
   sync_indexes.py) y cada link del sidebar también. La opción
   "Todas" (data-categoria="") muestra todo.
   ============================================================ */
(function () {
  'use strict';

  var lista = document.querySelector('.categorias-lista');
  if (!lista) return;

  var enlaces = lista.querySelectorAll('a[data-categoria]');
  var articulos = document.querySelectorAll('.lista-posts > article');
  if (!enlaces.length || !articulos.length) return;

  function filtrar(categoria) {
    articulos.forEach(function (art) {
      var card = art.querySelector('.post-card');
      var cat = card ? card.getAttribute('data-categoria') : '';
      art.hidden = !(categoria === '' || cat === categoria);
    });
    enlaces.forEach(function (a) {
      a.classList.toggle('activo', a.getAttribute('data-categoria') === categoria);
    });
  }

  enlaces.forEach(function (a) {
    a.addEventListener('click', function (ev) {
      ev.preventDefault();
      filtrar(a.getAttribute('data-categoria'));
    });
  });

})();
