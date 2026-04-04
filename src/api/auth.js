// FRONTEND AUTH API
const API_BASE = "https://majestios-backend.onrender.com/api";

/* ---------------------------------------------------------
   TOKEN MANAGEMENT
--------------------------------------------------------- */

// Enregistre le token
export function saveToken(token) {
  localStorage.setItem("token", token);
}

// Récupère le token
export function getToken() {
  return localStorage.getItem("token");
}

// Déconnexion
export function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}

// Rendre logout global pour les boutons onclick
window.logout = logout;

/* ---------------------------------------------------------
   GOOGLE OAUTH TOKEN HANDLING
--------------------------------------------------------- */

// Récupération du token Google dans l'URL
const urlParams = new URLSearchParams(window.location.search);
const googleToken = urlParams.get("token");

if (googleToken) {
  saveToken(googleToken);
  // Nettoie l'URL (supprime ?token=...)
  window.history.replaceState({}, "", window.location.pathname);
}

/* ---------------------------------------------------------
   CHECK AUTH
--------------------------------------------------------- */

export async function checkAuth() {
  const token = getToken();
  if (!token) {
    window.location.href = "login.html";
    return null;
  }

  try {
    const res = await fetch(`${API_BASE}/user/me`, {
      method: "GET",
      headers: { Authorization: "Bearer " + token }
    });

    if (!res.ok) {
      logout();
      return null;
    }

    const data = await res.json();

    if (!data.user) {
      logout();
      return null;
    }

    // Injecte l'email dans la sidebar si elle existe
    const sidebarEmail = document.getElementById("sidebarEmail");
    if (sidebarEmail && data.user.email) {
      sidebarEmail.textContent = data.user.email;
    }

    return data.user;

  } catch (err) {
    console.error("AUTH CHECK ERROR:", err);
    logout();
    return null;
  }
}

/* ---------------------------------------------------------
   REGISTER
--------------------------------------------------------- */

export async function register(email, username, password) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, username, password })
  });

  return res.json();
}

/* ---------------------------------------------------------
   LOGIN
--------------------------------------------------------- */

export async function login(email, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  return res.json();
}

