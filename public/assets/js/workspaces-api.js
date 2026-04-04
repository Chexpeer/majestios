const API_URL = "https://majestios-backend.onrender.com/api/workspaces";

/* ---------------------------------------------------------
   Récupérer les workspaces
--------------------------------------------------------- */
export async function getWorkspaces(token) {
  try {
    const res = await fetch(API_URL, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json"
      }
    });

    if (!res.ok) {
      return { workspaces: [], message: "Erreur serveur" };
    }

    const data = await res.json();
    return data; // { workspaces: [...] }

  } catch (err) {
    console.error("GET WORKSPACES ERROR:", err);
    return { workspaces: [], message: "Erreur réseau" };
  }
}

/* ---------------------------------------------------------
   Créer un workspace
--------------------------------------------------------- */
export async function createWorkspace(name, token) {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name })
    });

    const data = await res.json();

    if (!res.ok) {
      return { message: data.message || "Erreur serveur" };
    }

    return { workspace: data };

  } catch (err) {
    console.error("CREATE WORKSPACE ERROR:", err);
    return { message: "Erreur réseau" };
  }
}

