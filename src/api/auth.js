// FRONTEND AUTH API
const API_URL = "https://majestios-backend.onrender.com/api/auth";

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

// Vérifie si l'utilisateur est connecté
export async function checkAuth() {
  const token = getToken();
  if (!token) {
    window.location.href = "login.html";
    return null;
  }

  try {
    const res = await fetch(`${API_URL}/me`, {
      method: "GET",
      headers: { Authorization: "Bearer " + token }
    });

    const data = await res.json();

    if (!data.user) {
      logout();
      return null;
    }

    // Injecte l'email dans la sidebar si elle existe
    const sidebarEmail = document.getElementById("sidebarEmail");
    if (sidebarEmail) sidebarEmail.textContent = data.user.email;

    return data.user;

  } catch (err) {
    console.error("AUTH CHECK ERROR:", err);
    logout();
    return null;
  }
}

// REGISTER
export async function register(email, username, password) {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, username, password })
  });

  return res.json();
}

// LOGIN
export async function login(email, password) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  return res.json();
}

