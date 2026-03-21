// analytics.js
// Version ultra-minimaliste, RGPD-friendly

console.log("Analytics ready (RGPD mode).");

// Exemple : simple compteur de pages vues
(function () {
  const count = parseInt(localStorage.getItem("page_views") || "0", 10) + 1;
  localStorage.setItem("page_views", count);
})();
