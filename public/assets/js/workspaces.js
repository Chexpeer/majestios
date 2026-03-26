// ===============================
//  PROTECTION D’ACCÈS
// ===============================
const token = localStorage.getItem("token");
if (!token) {
  window.location.href = "login.html";
}

// ===============================
//  CHARGER L’UTILISATEUR
// ===============================
async function loadUser() {
  try {
    const res = await fetch("https://majestios-backend.onrender.com/api/auth/me", {
      method: "GET",
      headers: { Authorization: "Bearer " + token }
    });

    const data = await res.json();

    if (!res.ok) {
      console.log("Erreur auth:", data);
      window.location.href = "login.html";
      return;
    }

    document.getElementById("userEmail").textContent = data.user.email;

  } catch (err) {
    console.error(err);
    window.location.href = "login.html";
  }
}

// ===============================
//  CHARGER LES WORKSPACES
// ===============================
async function loadWorkspaces() {
  const list = document.getElementById("workspaceList");
  list.innerHTML = "<p style='opacity:0.7'>Chargement...</p>";

  try {
    const res = await fetch("https://majestios-backend.onrender.com/api/workspaces", {
      method: "GET",
      headers: { Authorization: "Bearer " + token }
    });

    const data = await res.json();

    if (!res.ok) {
      list.innerHTML = "<p>Erreur lors du chargement.</p>";
      return;
    }

    if (data.workspaces.length === 0) {
      list.innerHTML = "<p style='opacity:0.7'>Aucun workspace pour le moment.</p>";
      return;
    }

    list.innerHTML = "";

    data.workspaces.forEach(ws => {
      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <h3>${ws.name}</h3>
        <p style="opacity:0.7">${ws._id}</p>
        <button class="btn btn-outline" onclick="deleteWorkspace('${ws._id}')">Supprimer</button>
      `;

      list.appendChild(card);
    });

  } catch (err) {
    console.error(err);
    list.innerHTML = "<p>Erreur réseau.</p>";
  }
}

// ===============================
//  CRÉER UN WORKSPACE
// ===============================
document.getElementById("workspaceForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("workspaceName").value.trim();

  if (!name) return;

  try {
    const res = await fetch("https://majestios-backend.onrender.com/api/workspaces", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify({ name })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Erreur");
      return;
    }

    document.getElementById("workspaceName").value = "";
    loadWorkspaces();

  } catch (err) {
    console.error(err);
    alert("Erreur réseau");
  }
});

// ===============================
//  SUPPRIMER UN WORKSPACE
// ===============================
async function deleteWorkspace(id) {
  if (!confirm("Supprimer ce workspace ?")) return;

  try {
    const res = await fetch(`https://majestios-backend.onrender.com/api/workspaces/${id}`, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token }
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Erreur");
      return;
    }

    loadWorkspaces();

  } catch (err) {
    console.error(err);
    alert("Erreur réseau");
  }
}

// ===============================
//  LOGOUT
// ===============================
function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}

// ===============================
//  INITIALISATION
// ===============================
loadUser();
loadWorkspaces();
