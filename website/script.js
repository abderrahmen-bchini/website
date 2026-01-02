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


// =========================
// PIXEL-ART FALLING SQUARES
// =========================
const canvas = document.getElementById('pixel-bg');
const ctx = canvas.getContext('2d');

// Set canvas size
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Create pixels
const pixelCount = 150;
const pixels = [];
for (let i = 0; i < pixelCount; i++) {
  pixels.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.floor(Math.random() * 6) + 2, // 2-7px
    speed: Math.random() * 2 + 0.5,
    color: '' // will assign dynamically
  });
}

// Update pixel colors based on theme
function updatePixelColors() {
  const isLight = document.body.classList.contains('light');
  pixels.forEach(pixel => {
    if (isLight) {
      pixel.color = `rgba(0,0,0,${Math.random()})`; // black in light mode
    } else {
      pixel.color = `rgba(255,255,255,${Math.random()})`; // white in dark mode
    }
  });
}

// Initial color assignment
updatePixelColors();

// Animate pixels
function animatePixels() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  pixels.forEach(pixel => {
    pixel.y += pixel.speed;
    if (pixel.y > canvas.height) {
      pixel.y = -pixel.size;
      pixel.x = Math.random() * canvas.width;
    }

    ctx.fillStyle = pixel.color;
    ctx.fillRect(pixel.x, pixel.y, pixel.size, pixel.size);
  });

  requestAnimationFrame(animatePixels);
}

// Start animation
animatePixels();
