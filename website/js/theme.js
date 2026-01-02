// =========================
// THEME TOGGLE & DROPDOWN
// =========================
const toggle = document.getElementById("themetoggle");
const dropdown = document.querySelector(".dropdown-menu");
const trigger = dropdown.querySelector(".trigger");

// Initialize theme from localStorage
if (localStorage.getItem("theme") === "light") {
  document.body.classList.add("light");
  toggle.checked = true;
}

// Theme toggle event
toggle.addEventListener("change", () => {
  if (toggle.checked) {
    document.body.classList.add("light");
    localStorage.setItem("theme", "light");
  } else {
    document.body.classList.remove("light");
    localStorage.setItem("theme", "dark");
  }
  updatePixelColors(); // update snowflake colors
});

// Dropdown toggle
trigger.addEventListener("click", () => {
  dropdown.classList.toggle("open");
  trigger.setAttribute("aria-expanded", dropdown.classList.contains("open"));
});

// Close dropdown when clicking outside
document.addEventListener("click", (e) => {
  if (!dropdown.contains(e.target)) {
    dropdown.classList.remove("open");
    trigger.setAttribute("aria-expanded", "false");
  }
});
