/* eGohm-Website: dezente Interaktionen – ohne Framework, ohne externe Requests. */
(function () {
  'use strict';

  // Blöcke beim Scrollen einblenden
  var targets = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && targets.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );
    targets.forEach(function (el) {
      io.observe(el);
    });
  } else {
    targets.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  // Sicherheitsnetz: Falls der Observer nie auslöst (z. B. in
  // Screenshot-/Crawler-Umgebungen), nach kurzer Zeit alles zeigen.
  window.setTimeout(function () {
    document.documentElement.classList.remove('js');
  }, 2500);

  // Aktuelles Jahr in der Fußzeile
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
