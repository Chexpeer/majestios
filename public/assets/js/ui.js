// ui.js - Gestion des interactions UI et Rendu Dynamique

/**
 * Cette fonction affiche tes espaces de travail dans le menu "Mes Espaces"
 */
export function updateSidebarWorkspaces(workspaces) {
    const submenu = document.querySelector('#workspace-submenu');
    if (!submenu) return;

    if (!workspaces || workspaces.length === 0) {
        submenu.innerHTML = '<li style="padding:10px; font-size:12px; opacity:0.6; list-style:none;">Aucun espace</li>';
        return;
    }

    // On crée la liste des liens pour chaque workspace
    submenu.innerHTML = workspaces.map(ws => `
        <li style="list-style:none; margin: 5px 0;">
            <a href="app.html?id=${ws._id}" style="color:rgba(255,255,255,0.7); text-decoration:none; font-size:14px; display:block; padding: 5px 10px; border-radius:4px; transition: 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.1)'" onmouseout="this.style.background='transparent'">
                📁 ${ws.name}
            </a>
        </li>
    `).join('');
}

// --- Comportements visuels de base ---

// Scroll fluide pour les liens internes
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
        const target = document.querySelector(this.getAttribute("href"));
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
    });
});

// Masquer/Afficher le menu au scroll
let lastScroll = 0;
const header = document.querySelector(".app-header");
if (header) {
    window.addEventListener("scroll", () => {
        const current = window.scrollY;
        if (current > lastScroll && current > 80) {
            header.classList.add("header-hidden");
        } else {
            header.classList.remove("header-hidden");
        }
        lastScroll = current;
    });
}