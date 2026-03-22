// theme.js
// Gestion du mode sombre / clair automatique + toggle manuel

const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
const root = document.documentElement;

function applyTheme(dark) {
  root.setAttribute("data-theme", dark ? "dark" : "light");
  localStorage.setItem("theme", dark ? "dark" : "light");
}

function initTheme() {
  const saved = localStorage.getItem("theme");

  if (saved) {
    applyTheme(saved === "dark");
  } else {
    applyTheme(prefersDark.matches);
  }
}

prefersDark.addEventListener("change", e => {
  applyTheme(e.matches);
});

initTheme();
