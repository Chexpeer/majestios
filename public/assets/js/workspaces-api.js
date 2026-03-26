// assets/js/workspaces-api.js

const WORKSPACE_API = "https://majestios-backend.onrender.com/api/workspaces";

export async function getWorkspaces(token) {
  const res = await fetch(WORKSPACE_API, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  return res.json();
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

  return res.json();
}

export async function deleteWorkspace(id, token) {
  const res = await fetch(`${WORKSPACE_API}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  return res.json();
}

