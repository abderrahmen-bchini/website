import { updatePixelColors } from "./background.js";

function isTypingInInput(e) {
  const tag = e.target.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    e.target.isContentEditable
  );
}

const panel = document.getElementById("shortcut-panel");

function toggleShortcutPanel(force) {
  const open = force ?? !panel.classList.contains("open");
  panel.classList.toggle("open", open);
  panel.setAttribute("aria-hidden", !open);
}

document.addEventListener("keydown", (e) => {
  if (isTypingInInput(e)) return;
  if (e.repeat) return;

  /* ? key */
  if (e.key === "h") {
    e.preventDefault();
    toggleShortcutPanel();
  }

  /* Esc key */
  if (e.key === "Escape") {
    toggleShortcutPanel(false);
  }

  /* T key for theme */
  if (e.key.toLowerCase() === "t") {
    const toggle = document.getElementById("themetoggle");
    if (!toggle) return;

    toggle.checked = !toggle.checked;
    toggle.dispatchEvent(new Event("change"));
  }

  /* Shift + arrows for scrolling */
  if (e.shiftKey && e.key === "ArrowUp") {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  if (e.shiftKey && e.key === "ArrowDown") {
    e.preventDefault();
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }
});

/* Click outside closes the panel */
panel.addEventListener("click", (e) => {
  if (e.target === panel) toggleShortcutPanel(false);
});
