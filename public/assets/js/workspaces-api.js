const API_URL = "https://majestios-backend.onrender.com/api/workspaces";

export async function getWorkspaces(token) {
  try {
    const res = await fetch(API_URL, {
      headers: {
        Authorization: "Bearer " + token
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

export async function createWorkspace(name, token) {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify({ name })
    });

    if (!res.ok) {
      const data = await res.json();
      return { message: data.message || "Erreur serveur" };
    }

    const workspace = await res.json();
    return { workspace };

  } catch (err) {
    console.error("CREATE WORKSPACE ERROR:", err);
    return { message: "Erreur réseau" };
  }
}
