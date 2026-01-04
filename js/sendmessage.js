const form = document.getElementById("contact-form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const message = form.message.value;

  const res = await fetch("/api/send-message", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  if (res.ok) {
    alert("Message sent!");
    form.reset();
  } else {
    alert("Something went wrong.");
  }
});
