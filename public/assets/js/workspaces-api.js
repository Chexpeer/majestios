// assets/js/workspaces-api.js

const WORKSPACE_API = "https://majestios-backend.onrender.com/api/workspaces";

async function safeJson(res) {
  let bodyText = "";
  try {
    bodyText = await res.text();        // on lit toujours la réponse
    return JSON.parse(bodyText);        // on tente de parser en JSON
  } catch (e) {
    console.error("Réponse non JSON de l’API workspaces :", bodyText);
    return {
      error: true,
      message: `Réponse invalide du serveur (status ${res.status})`,
      raw: bodyText,
    };
  }
}

export async function getWorkspaces(token) {
  const res = await fetch(WORKSPACE_API, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  return safeJson(res);
}

export async function createWorkspace(name, token) {
  const res = await fetch(WORKSPACE_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({ name }),
  });

  return safeJson(res);
}

export async function deleteWorkspace(id, token) {
  const res = await fetch(`${WORKSPACE_API}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  return safeJson(res);
}
