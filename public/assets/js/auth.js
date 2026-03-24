/* ============================
   AUTH.JS – M@jestiOS
   Gestion globale de l’authentification
============================ */

// Auto‑switch backend (Render / Localhost)
const API_URL = window.location.hostname.includes("localhost")
  ? "http://localhost:4000"
  : "https://majbackend.onrender.com"; // ← Mets ton vrai backend Render ici

/* ============================
   LOGIN
============================ */
async function login(email, password) {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error || "Identifiants incorrects." };
    }

    // Stocker le token
    localStorage.setItem("token", data.token);

    return { success: true };

  } catch (err) {
    return { error: "Impossible de contacter le serveur." };
  }
}

/* ============================
   CHECK AUTH (pages privées)
============================ */
async function checkAuth() {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "login.html";
    return;
  }

  try {
    const response = await fetch(`${API_URL}/auth/me`, {
      method: "GET",
      headers: { "Authorization": "Bearer " + token }
    });

    const data = await response.json();

    if (!response.ok) {
      localStorage.removeItem("token");
      window.location.href = "login.html";
      return;
    }

    // Injecter l'email dans le header
    const emailSpan = document.getElementById("userEmail");
    if (emailSpan) emailSpan.innerText = data.user.email;

  } catch (err) {
    localStorage.removeItem("token");
    window.location.href = "login.html";
  }
}

/* ============================
   LOGOUT
============================ */
function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}

/* ============================
   LOGIN FORM HANDLER
============================ */
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const errorBox = document.getElementById("errorBox");

    const result = await login(email, password);

    if (result.error) {
      errorBox.style.display = "block";
      errorBox.innerText = result.error;
      return;
    }

    window.location.href = "dashboard.html";
  });
});
