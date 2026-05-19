// title.js
const messages = [
  "💻 Abderrahmen Bchini",
  "⚡ Full Stack Developer",
  "🚀 Building Cool Projects",
  "🧠 AI & Cybersecurity",
  "🔥 Welcome To My Portfolio"
];

let messageIndex = 0;
let charIndex = 1;
let isDeleting = false;
let animationTimeout = null;

function setTitle(text) {
  document.title = text || messages[messageIndex][0];
}

function animateTitle() {
  const currentMessage = messages[messageIndex];

  if (!isDeleting) {
    setTitle(currentMessage.substring(0, charIndex));
    charIndex++;

    if (charIndex > currentMessage.length) {
      isDeleting = true;
      animationTimeout = setTimeout(animateTitle, 1400);
      return;
    }
  } else {
    charIndex--;
    // Always keep at least the first character visible
    if (charIndex <= 1) {
      setTitle(currentMessage[0]); // explicitly hold first char
      isDeleting = false;
      messageIndex = (messageIndex + 1) % messages.length;
      charIndex = 1;
      animationTimeout = setTimeout(animateTitle, 300);
      return;
    }
    setTitle(currentMessage.substring(0, charIndex));
  }

  animationTimeout = setTimeout(animateTitle, isDeleting ? 40 : 90);
}

// Start
animateTitle();

// Tab visibility handling
let tabNotification = null;
let savedTitle = "";

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    savedTitle = document.title;
    clearTimeout(animationTimeout); // pause animation while away
    tabNotification = setInterval(() => {
      document.title =
        document.title === "👀 Come Back!"
          ? "🚀 Portfolio Waiting"
          : "👀 Come Back!";
    }, 1000);
  } else {
    clearInterval(tabNotification);
    tabNotification = null;
    setTitle(savedTitle || messages[messageIndex][0]);
    animationTimeout = setTimeout(animateTitle, 200);
  }
});