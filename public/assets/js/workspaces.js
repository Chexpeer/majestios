// WORKSPACES.JS – M@jestiOS

// Auto-switch backend (Render / Localhost)
const API_URL = window.location.hostname.includes("localhost")
  ? "http://localhost:4000"
  : "https://majbackend.onrender.com";

/* ============================
   FETCH ALL WORKSPACES
============================ */
async function fetchWorkspaces() {
  const token = localStorage.getItem("token");
  if (!token) return;

  const response = await fetch(`${API_URL}/api/workspaces`, {
    headers: { Authorization: "Bearer " + token }
  });

  const data = await response.json();
  if (!response.ok) return;

  const list = document.getElementById("workspaceList");
  if (!list) return;

  list.innerHTML = "";

  data.workspaces.forEach(ws => {
    const li = document.createElement("li");
    li.className = "workspace-item";
    li.innerHTML = `
      <span>${ws.name}</span>
      <button data-id="${ws._id}" class="delete-workspace">Supprimer</button>
    `;
    list.appendChild(li);
  });

  // Bind delete buttons
  document.querySelectorAll(".delete-workspace").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");
      await deleteWorkspace(id);
      fetchWorkspaces();
    });
  });
}

/* ============================
   CREATE WORKSPACE
============================ */
async function createWorkspace(name) {
  const token = localStorage.getItem("token");
  if (!token) return;

  await fetch(`${API_URL}/api/workspaces`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify({ name })
  });
}

/* ============================
   DELETE WORKSPACE
============================ */
async function deleteWorkspace(id) {
  const token = localStorage.getItem("token");
  if (!token) return;

  await fetch(`${API_URL}/api/workspaces/${id}`, {
    method: "DELETE",
    headers: { Authorization: "Bearer " + token }
  });
}

/* ============================
   INIT PAGE
============================ */
document.addEventListener("DOMContentLoaded", async () => {
  await checkAuth(); // vient de auth.js

  const form = document.getElementById("workspaceForm");
  const input = document.getElementById("workspaceName");

  await fetchWorkspaces();

  if (form && input) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = input.value.trim();
      if (!name) return;
      await createWorkspace(name);
      input.value = "";
      fetchWorkspaces();
    });
  }
});
