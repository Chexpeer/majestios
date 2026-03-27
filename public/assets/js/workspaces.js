// assets/js/workspaces.js
import { getWorkspaces, createWorkspace, deleteWorkspace } from "./workspaces-api.js";

const AUTH_API = "https://majestios-backend.onrender.com/api/auth";

function redirectToLogin() {
  window.location.href = "login.html";
}

function getTokenOrRedirect() {
  const token = localStorage.getItem("token");
  if (!token) redirectToLogin();
  return token;
}

async function loadUser() {
  const token = getTokenOrRedirect();
  const emailSpan = document.getElementById("userEmail");

  try {
    const res = await fetch(`${AUTH_API}/me`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    const data = await res.json();

    if (!res.ok || !data.user) {
      localStorage.removeItem("token");
      redirectToLogin();
      return;
    }

    if (emailSpan) emailSpan.textContent = data.user.email;

  } catch (err) {
    console.error(err);
    localStorage.removeItem("token");
    redirectToLogin();
  }
}

async function renderWorkspaces() {
  const token = getTokenOrRedirect();
  const list = document.getElementById("workspaceList");
  const message = document.getElementById("message");

  list.innerHTML = "<p style='opacity:0.7'>Chargement...</p>";
  if (message) message.textContent = "";

  try {
    const data = await getWorkspaces(token);

    if (!data || data.error) {
      list.innerHTML = "<p>Erreur lors du chargement des workspaces.</p>";
      if (message) message.textContent = data?.message || "Erreur réseau.";
      return;
    }

    if (!data.workspaces || data.workspaces.length === 0) {
      list.innerHTML = "<p style='opacity:0.7'>Aucun workspace pour le moment.</p>";
      return;
    }

    list.innerHTML = "";

    data.workspaces.forEach((ws) => {
      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <div class="card-title">${ws.name}</div>
        <p class="card-subtitle" style="opacity:0.7">ID : ${ws._id}</p>
        <div style="margin-top: 10px">
          <button class="btn btn-outline" data-delete="${ws._id}">Supprimer</button>
        </div>
      `;

      list.appendChild(card);
    });

    list.addEventListener("click", async (e) => {
      const btn = e.target.closest("button[data-delete]");
      if (!btn) return;

      const id = btn.getAttribute("data-delete");
      if (!id) return;

      if (!confirm("Supprimer ce workspace ?")) return;

      const token = getTokenOrRedirect();
      const data = await deleteWorkspace(id, token);

      if (!data || data.error) {
        if (message) message.textContent = data?.message || "Erreur lors de la suppression.";
        return;
      }

      if (message) message.textContent = "Workspace supprimé.";
      renderWorkspaces();
    });

  } catch (err) {
    console.error(err);
    list.innerHTML = "<p>Erreur réseau lors du chargement.</p>";
  }
}

function setupForm() {
  const form = document.getElementById("workspaceForm");
  const input = document.getElementById("workspaceName");
  const message = document.getElementById("message");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = input.value.trim();
    if (!name) return;

    const token = getTokenOrRedirect();
    const data = await createWorkspace(name, token);

    if (!data || data.error) {
      if (message) message.textContent = data?.message || "Erreur lors de la création.";
      return;
    }

    message.textContent = "Workspace créé.";
    input.value = "";
    renderWorkspaces();
  });
}

function setupLogout() {
  const btn = document.getElementById("logoutBtn");
  btn.addEventListener("click", () => {
    localStorage.removeItem("token");
    redirectToLogin();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  getTokenOrRedirect();
  loadUser();
  setupForm();
  setupLogout();
  renderWorkspaces();
});

