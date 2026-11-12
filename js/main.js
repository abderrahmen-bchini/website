// First-visit hint for the keyboard-shortcuts panel.
(() => {
  if (!localStorage.getItem("shortcutHintShown")) {
    document.getElementById("shortcut-toast").classList.add("show");
    localStorage.setItem("shortcutHintShown", "true");
  }
})();
