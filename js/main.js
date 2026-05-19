import "./background.js";
import "./theme.js";
import "./shortcut.js"
import "./sendmessage.js"
import "./title.js"
if (!localStorage.getItem("shortcutHintShown")) {
  const toast = document.getElementById("shortcut-toast");
  toast.style.display = "block";
  localStorage.setItem("shortcutHintShown", "true");
}
