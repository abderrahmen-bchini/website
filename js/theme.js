// =========================
// THEME TOGGLE & DROPDOWN
// =========================
(() => {
  const toggle = document.getElementById("themetoggle");
  const dropdown = document.querySelector(".dropdown-menu");
  const trigger = dropdown.querySelector(".trigger");

  // =========================
  // THEME INITIALIZATION
  // =========================
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "light") {
    document.body.classList.add("light");
    toggle.checked = true;
  }

  // =========================
  // THEME TOGGLE
  // =========================
  toggle.addEventListener("change", () => {
    const isLight = toggle.checked;

    document.body.classList.toggle("light", isLight);
    localStorage.setItem("theme", isLight ? "light" : "dark");
  });

  // =========================
  // DROPDOWN TOGGLE
  // =========================
  trigger.addEventListener("click", (e) => {
    e.stopPropagation();

    const isOpen = dropdown.classList.toggle("open");
    trigger.setAttribute("aria-expanded", String(isOpen));
  });

  // =========================
  // TOOLS SUBMENU (nested dropdown)
  // Hover opens it on desktop (CSS); the chevron click covers touch.
  // =========================
  const submenuItem = dropdown.querySelector(".has-submenu");
  const submenuTrigger = submenuItem && submenuItem.querySelector(".submenu-trigger");

  if (submenuTrigger) {
    submenuTrigger.addEventListener("click", (e) => {
      e.stopPropagation();

      const isOpen = submenuItem.classList.toggle("open");
      submenuTrigger.setAttribute("aria-expanded", String(isOpen));
    });
  }

  // =========================
  // CLOSE DROPDOWN (OUTSIDE CLICK)
  // Clicks inside the menu (e.g. the theme switch) must not close it,
  // otherwise the menu vanishes the moment you reach for the toggle.
  // =========================
  document.addEventListener("click", (e) => {
    if (dropdown.contains(e.target)) return;

    if (dropdown.classList.contains("open")) {
      dropdown.classList.remove("open");
      trigger.setAttribute("aria-expanded", "false");

      if (submenuItem) {
        submenuItem.classList.remove("open");
        submenuTrigger.setAttribute("aria-expanded", "false");
      }
    }
  });

  // =========================
  // CLOSE DROPDOWN (ESC KEY)
  // =========================
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && dropdown.classList.contains("open")) {
      dropdown.classList.remove("open");
      trigger.setAttribute("aria-expanded", "false");

      if (submenuItem) {
        submenuItem.classList.remove("open");
        submenuTrigger.setAttribute("aria-expanded", "false");
      }
    }
  });
})();
