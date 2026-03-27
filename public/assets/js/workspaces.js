import { getWorkspaces, createWorkspace, deleteWorkspace } from "./workspaces-api.js";
import { updateSidebarWorkspaces } from "./ui.js";

const AUTH_API = "https://majestios-backend.onrender.com/api/auth";

function redirectToLogin() {
    window.location.href = "login.html";
}

function getTokenOrRedirect() {
    const token = localStorage.getItem("token");
    if (!token) {
        redirectToLogin();
        return null;
    }
    return token;
}

// Affiche l'email de l'utilisateur connecté
async function loadUser() {
    const token = getTokenOrRedirect();
    if (!token) return;

    const emailSpan = document.getElementById("userEmail");

    try {
        const res = await fetch(`${AUTH_API}/me`, {
            method: "GET",
            headers: { "Authorization": "Bearer " + token }
        });

        const data = await res.json();

        if (!res.ok || !data.user) {
            localStorage.removeItem("token");
            redirectToLogin();
            return;
        }

        if (emailSpan) emailSpan.textContent = data.user.email;
    } catch (err) {
        console.error("Erreur de connexion au serveur");
        localStorage.removeItem("token");
        redirectToLogin();
    }
}

// Charge et affiche les espaces de travail (Liste + Menu)
async function renderWorkspaces() {
    const token = getTokenOrRedirect();
    if (!token) return;

    const list = document.getElementById("workspaceList");
    const message = document.getElementById("message");

    if (list) list.innerHTML = "<p style='opacity:0.7'>Chargement...</p>";

    try {
        const data = await getWorkspaces(token);

        if (!data || data.error) {
            if (list) list.innerHTML = "<p>Erreur lors du chargement.</p>";
            return;
        }

        // MET À JOUR LE MENU "MES ESPACES" DANS LA BARRE LATÉRALE
        updateSidebarWorkspaces(data.workspaces);

        // MET À JOUR LA LISTE AU CENTRE DE LA PAGE
        if (!list) return;

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
                <p class="card-subtitle" style="opacity:0.5; font-size:0.8rem;">ID : ${ws._id}</p>
                <div style="margin-top: 15px">
                    <button class="btn btn-outline btn-sm" data-delete="${ws._id}">Supprimer</button>
                    <a href="app.html?id=${ws._id}" class="btn btn-primary btn-sm">Ouvrir</a>
                </div>
            `;
            list.appendChild(card);
        });

    } catch (err) {
        console.error("Erreur réseau");
        if (list) list.innerHTML = "<p>Le serveur ne répond pas.</p>";
    }
}

// Gère la création d'un nouveau workspace
function setupForm() {
    const form = document.getElementById("workspaceForm");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const input = document.getElementById("workspaceName");
        const message = document.getElementById("message");
        const name = input.value.trim();
        
        if (!name) return;

        const token = getTokenOrRedirect();
        const data = await createWorkspace(name, token);

        if (!data || data.error) {
            if (message) message.textContent = data?.message || "Erreur de création.";
            return;
        }

        if (message) message.textContent = "Workspace créé !";
        input.value = "";
        renderWorkspaces(); // Recharge tout
    });
}

// Gère le bouton supprimer
function setupDeleteHandler() {
    const list = document.getElementById("workspaceList");
    if (!list) return;

    list.addEventListener("click", async (e) => {
        const btn = e.target.closest("button[data-delete]");
        if (!btn) return;

        const id = btn.getAttribute("data-delete");
        if (!id || !confirm("Voulez-vous vraiment supprimer cet espace ?")) return;

        const token = getTokenOrRedirect();
        const data = await deleteWorkspace(id, token);

        if (!data || data.error) {
            alert("Erreur lors de la suppression.");
            return;
        }

        renderWorkspaces(); 
    });
}

// Gère la déconnexion
function setupLogout() {
    const btn = document.getElementById("logoutBtn");
    if (btn) {
        btn.addEventListener("click", () => {
            localStorage.removeItem("token");
            redirectToLogin();
        });
    }
}

// Lancement automatique au chargement de la page
document.addEventListener("DOMContentLoaded", () => {
    loadUser();
    setupForm();
    setupLogout();
    setupDeleteHandler();
    renderWorkspaces();
});
