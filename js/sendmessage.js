const form = document.getElementById("contact-form");
const toast = document.getElementById("form-toast");
const input = form.message;

function showToast(text, type = "success") {
  toast.textContent = text;
  toast.className = `form-toast show ${type}`;

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const message = input.value.trim();

  // Custom validation (no browser popup)
  if (!message) {
    input.classList.add("error");
    showToast("Message cannot be empty", "error");
    return;
  }

  input.classList.remove("error");

  try {
    const res = await fetch("/api/send-message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    if (!res.ok) throw new Error();

    // Clear BEFORE showing success
    form.reset();
    showToast("Message sent successfully ✔", "success");

  } catch {
    showToast("Failed to send message", "error");
  }
});

// Remove error glow while typing
input.addEventListener("input", () => {
  input.classList.remove("error");
});
