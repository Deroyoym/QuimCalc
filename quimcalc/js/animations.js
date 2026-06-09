// animations.js — QuimCalc
// Fade-in on scroll para cards de blog y herramientas.
// Usa IntersectionObserver y respeta prefers-reduced-motion.
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.06, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.post-card, .indice-item, .seccion-sobre').forEach(function (el) {
    el.classList.add('fade-in');
    observer.observe(el);
  });
})();
