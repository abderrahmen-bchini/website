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
