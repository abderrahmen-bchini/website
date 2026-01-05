// =========================
// THEME TOGGLE & DROPDOWN
// =========================
import { updatePixelColors } from "./background.js";

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

  updatePixelColors();
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
// CLOSE DROPDOWN (OUTSIDE CLICK)
// =========================
document.addEventListener("click", () => {
  if (dropdown.classList.contains("open")) {
    dropdown.classList.remove("open");
    trigger.setAttribute("aria-expanded", "false");
  }
});

// =========================
// CLOSE DROPDOWN (ESC KEY)
// =========================
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && dropdown.classList.contains("open")) {
    dropdown.classList.remove("open");
    trigger.setAttribute("aria-expanded", "false");
  }
});

