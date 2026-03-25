// REGISTER.JS – M@jestiOS

const API_URL = window.location.hostname.includes("localhost")
  ? "http://localhost:4000"
  : "https://majbackend.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");
  const errorBox = document.getElementById("errorBox");
  const successBox = document.getElementById("successBox");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();

    errorBox.style.display = "none";
    successBox.style.display = "none";

    if (password !== confirmPassword) {
      errorBox.innerText = "Les mots de passe ne correspondent pas.";
      errorBox.style.display = "block";
      return;
    }

    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
      successBox.innerText = "Compte créé avec succès ! Redirection...";
      successBox.style.display = "block";

      setTimeout(() => {
        window.location.href = "login.html";
      }, 1500);
    } else {
      errorBox.innerText = data.error || "Erreur lors de la création du compte.";
      errorBox.style.display = "block";
    }
  });
});
