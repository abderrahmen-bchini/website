// =========================
// CONTACT FORM
// =========================
(() => {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const toast = document.getElementById("form-toast");
  const input = form.message;
  const button = form.querySelector("button");
  let hideTimer = null;

  function showToast(text, type = "success") {
    toast.textContent = text;
    toast.className = `form-toast show ${type}`;

    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const message = input.value.trim();

    if (!message) {
      input.classList.add("error");
      showToast("Message cannot be empty", "error");
      return;
    }

    input.classList.remove("error");
    button.disabled = true;

    try {
      const res = await fetch("/api/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      if (!res.ok) throw new Error();

      form.reset();
      showToast("Message sent ✔");
    } catch {
      showToast("Failed to send message", "error");
    } finally {
      button.disabled = false;
    }
  });

  input.addEventListener("input", () => {
    input.classList.remove("error");
  });
})();
