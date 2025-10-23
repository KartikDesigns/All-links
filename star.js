// === Twinkling Stars (One by One, Red/Blue/Green/Yellow) ===
const canvas = document.getElementById("starCanvas");
const ctx = canvas.getContext("2d");

let stars = [];
const numStars = 120; // max stars
const colors = ["#ff4b4b", "#4b8bff", "#48ff4b", "#fff94b"]; // red, blue, green, yellow

// Mouse position for interactive stars
let mouseX = 0;
let mouseY = 0;
let mouseActive = false;

// Resize canvas
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  // Recreate stars on resize for better distribution
  stars = [];
  for (let i = 0; i < numStars; i++) {
    stars.push(createStar());
  }
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Track mouse movement for interactive stars
window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  mouseActive = true;
});

window.addEventListener('mouseleave', () => {
  mouseActive = false;
});

// Create a single star
function createStar() {
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 1.5 + 0.8,
    color: colors[Math.floor(Math.random() * colors.length)],
    alpha: Math.random() * 0.8 + 0.2, // start visible (0.2–1)
    alphaChange: (Math.random() * 0.02 + 0.005) * (Math.random() < 0.5 ? 1 : -1),
    // For interactive effect
    originalAlpha: Math.random() * 0.8 + 0.2,
    speed: Math.random() * 0.02 + 0.005
  };
}

// Add stars gradually
let starInterval = setInterval(() => {
  if (stars.length < numStars) {
    stars.push(createStar());
  } else {
    clearInterval(starInterval);
  }
}, 200); // add one star every 200ms

// Draw stars
function drawStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  stars.forEach(star => {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = star.color;
    ctx.globalAlpha = star.alpha;
    ctx.fill();
  });
  ctx.globalAlpha = 1; // reset alpha after drawing
}

// Animate twinkling with interactive effect
function animateStars() {
  stars.forEach(star => {
    // Regular twinkling
    star.alpha += star.alphaChange;
    if (star.alpha <= 0.2 || star.alpha >= 1) {
      star.alphaChange *= -1;
    }
    
    // Interactive effect when mouse is active
    if (mouseActive) {
      const dx = star.x - mouseX;
      const dy = star.y - mouseY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // If star is close to mouse, make it brighter
      if (distance < 100) {
        const influence = (100 - distance) / 100;
        star.alpha = Math.min(1, star.originalAlpha + influence * 0.5);
      }
    }
  });

  drawStars();
  requestAnimationFrame(animateStars);
}

animateStars();
