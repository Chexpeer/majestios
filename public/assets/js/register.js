const API_URL = "https://majestios-backend.onrender.com/api/auth/register";

const form = document.getElementById("registerForm");
const errorBox = document.getElementById("errorBox");
const successBox = document.getElementById("successBox");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  errorBox.style.display = "none";
  successBox.style.display = "none";

  if (password !== confirmPassword) {
    errorBox.innerText = "Les mots de passe ne correspondent pas.";
    errorBox.style.display = "block";
    return;
  }

  const res = await fetch(API_URL, {
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
    errorBox.innerText = data.message || "Erreur lors de la création du compte.";
    errorBox.style.display = "block";
  }
});
