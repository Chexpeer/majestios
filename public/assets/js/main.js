// public/assets/js/main.js

import { checkAuth, logout, getToken } from "./auth.js";

// Pages protégées (nécessitent un token)
const protectedPages = [
  "dashboard.html",
  "workspaces.html",
  "app.html",
  "historique.html",
  "notifications.html",
  "settings.html",
  "profile.html"
];

// Vérifie si la page actuelle est protégée
function isProtectedPage() {
  const page = window.location.pathname.split("/").pop();
  return protectedPages.includes(page);
}

// Active le lien de la sidebar correspondant à la page
function highlightActiveLink() {
  const page = window.location.pathname.split("/").pop();
  const links = document.querySelectorAll(".nav-link");

  links.forEach(link => {
    if (link.getAttribute("href") === page) {
      link.classList.add("nav-link-active");
    } else {
      link.classList.remove("nav-link-active");
    }
  });
}

// Initialise la sidebar (email + logout)
async function initSidebar() {
  const user = await checkAuth();
  if (!user) return;

  const emailEl = document.getElementById("sidebarEmail");
  if (emailEl) emailEl.textContent = user.email;

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) logoutBtn.onclick = logout;
}

// Redirection automatique si pas connecté
async function enforceAuth() {
  if (!isProtectedPage()) return;

  const token = getToken();
  if (!token) {
    window.location.href = "login.html";
    return;
  }

  await checkAuth();
}

// INITIALISATION GLOBALE
document.addEventListener("DOMContentLoaded", async () => {
  highlightActiveLink();
  await enforceAuth();
  await initSidebar();
});
