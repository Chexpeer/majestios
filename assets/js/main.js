// main.js
// Logique générale de l'application M@jestiOS

document.addEventListener("DOMContentLoaded", () => {
  console.log("M@jestiOS loaded.");

  // --- Navigation mobile ---
  const links = document.querySelectorAll(".nav-link");
  const menu = document.querySelector(".nav");
  const toggle = document.querySelector(".menu-toggle");

  links.forEach(link => {
    link.addEventListener("click", () => {
      if (menu) menu.classList.remove("nav-open");
    });
  });

  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      menu.classList.toggle("nav-open");
    });
  }

  // --- Header auto-hide on scroll ---
  let lastScroll = 0;
  const header = document.querySelector(".app-header");

  window.addEventListener("scroll", () => {
    const current = window.scrollY;

    if (!header) return;

    if (current > lastScroll && current > 80) {
      header.classList.add("header-hidden");
    } else {
      header.classList.remove("header-hidden");
    }

    lastScroll = current;
  });

  // --- Chargement des données JSON (models, settings, user, workspaces) ---

  async function loadJSON(path) {
    try {
      const response = await fetch(path);
      if (!response.ok) throw new Error("Erreur de chargement : " + path);
      return await response.json();
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  // Exemple : pré-charger les données clés de l’OS
  Promise.all([
    loadJSON("assets/data/models.json"),
    loadJSON("assets/data/settings.json"),
    loadJSON("assets/data/user.json"),
    loadJSON("assets/data/workspaces.json")
  ]).then(([models, settings, user, workspaces]) => {
    console.log("Models:", models);
    console.log("Settings:", settings);
    console.log("User:", user);
    console.log("Workspaces:", workspaces);
    // Ici tu pourras plus tard brancher la logique d’UI / routing / préférences
  });
});
