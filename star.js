// === REALISTIC COSMIC GALAXY STARS ===
const canvas = document.getElementById("starCanvas");
const ctx = canvas.getContext("2d");

let stars = [];
let nebulaClouds = [];
let shootingStars = [];
const numStars = 300; // More stars for realistic galaxy
const numNebulaClouds = 8;

// Realistic cosmic color palette with temperature variations
const starColors = {
  hot: ["#9bb0ff", "#aabfff", "#cad7ff", "#f8f7ff"], // Blue-white (hot stars)
  medium: ["#fff4ea", "#ffd2a1", "#ffcc6f"], // Yellow-white (sun-like)
  cool: ["#ffaa77", "#ff9966", "#ff7744"], // Orange-red (cool stars)
  nebula: ["#b794f6", "#6eb5ff", "#4dd4e8", "#9d7ff5", "#5ce1e6"],
  distant: ["#e8e8ff", "#f0f0ff", "#ffffff"] // Very distant stars
};

// Mouse position for interactive effects
let mouseX = 0;
let mouseY = 0;
let mouseActive = false;
let time = 0;

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

// Create realistic star with temperature and distance
function createStar() {
  const distance = Math.random(); // 0 = close, 1 = far
  const temperature = Math.random();
  
  let colorPalette;
  if (temperature < 0.2) colorPalette = starColors.cool;
  else if (temperature < 0.5) colorPalette = starColors.medium;
  else if (temperature < 0.8) colorPalette = starColors.hot;
  else colorPalette = starColors.distant;
  
  const baseAlpha = distance < 0.3 ? Math.random() * 0.4 + 0.6 : Math.random() * 0.5 + 0.2;
  const size = distance < 0.3 ? Math.random() * 2.5 + 1 : Math.random() * 1.5 + 0.3;
  
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    z: distance, // depth for parallax
    radius: size,
    color: colorPalette[Math.floor(Math.random() * colorPalette.length)],
    alpha: baseAlpha,
    targetAlpha: baseAlpha,
    originalAlpha: baseAlpha,
    twinkleSpeed: Math.random() * 0.015 + 0.005,
    phase: Math.random() * Math.PI * 2,
    glowIntensity: Math.random() * 0.6 + 0.4,
    temperature: temperature,
    distance: distance,
    // Realistic twinkling (atmospheric scintillation)
    scintillation: Math.random() * 0.3 + 0.1,
    // Parallax movement
    parallaxSpeed: (1 - distance) * 0.02
  };
}

// Create nebula cloud effect
function createNebula() {
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 150 + 100,
    color: starColors.nebula[Math.floor(Math.random() * starColors.nebula.length)],
    alpha: Math.random() * 0.08 + 0.02,
    drift: {
      x: (Math.random() - 0.5) * 0.1,
      y: (Math.random() - 0.5) * 0.1
    }
  };
}

// Create shooting star
function createShootingStar() {
  const startX = Math.random() * canvas.width;
  const startY = Math.random() * canvas.height * 0.5;
  const angle = Math.random() * Math.PI / 4 + Math.PI / 6;
  
  return {
    x: startX,
    y: startY,
    vx: Math.cos(angle) * (Math.random() * 3 + 4),
    vy: Math.sin(angle) * (Math.random() * 3 + 4),
    length: Math.random() * 80 + 40,
    alpha: 1,
    life: 1,
    decay: Math.random() * 0.015 + 0.01
  };
}

// Add stars gradually with smooth entrance
let starInterval = setInterval(() => {
  if (stars.length < numStars) {
    const star = createStar();
    star.alpha = 0; // start invisible
    star.targetAlpha = star.originalAlpha;
    stars.push(star);
  } else {
    clearInterval(starInterval);
  }
}, 150); // add one star every 150ms for smoother appearance

// Draw realistic cosmic scene
function drawStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw nebula clouds first (background layer)
  nebulaClouds.forEach(nebula => {
    const gradient = ctx.createRadialGradient(
      nebula.x, nebula.y, 0,
      nebula.x, nebula.y, nebula.radius
    );
    gradient.addColorStop(0, nebula.color + Math.floor(nebula.alpha * 255).toString(16).padStart(2, '0'));
    gradient.addColorStop(0.5, nebula.color + '10');
    gradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(nebula.x, nebula.y, nebula.radius, 0, Math.PI * 2);
    ctx.fill();
  });
  
  // Draw stars by distance (far to near for depth)
  const sortedStars = [...stars].sort((a, b) => b.z - a.z);
  
  sortedStars.forEach(star => {
    const currentColor = star.color;
    const glowSize = star.radius * (3 + star.glowIntensity);
    
    // Realistic glow with multiple layers
    const gradient = ctx.createRadialGradient(
      star.x, star.y, 0,
      star.x, star.y, glowSize
    );
    
    // Hot stars have blue glow, cool stars have red glow
    if (star.temperature > 0.7) {
      gradient.addColorStop(0, currentColor);
      gradient.addColorStop(0.3, currentColor + '80');
      gradient.addColorStop(0.6, '#aabfff40');
      gradient.addColorStop(1, 'transparent');
    } else if (star.temperature < 0.3) {
      gradient.addColorStop(0, currentColor);
      gradient.addColorStop(0.3, currentColor + '70');
      gradient.addColorStop(0.6, '#ff994430');
      gradient.addColorStop(1, 'transparent');
    } else {
      gradient.addColorStop(0, currentColor);
      gradient.addColorStop(0.4, currentColor + '60');
      gradient.addColorStop(1, 'transparent');
    }
    
    // Draw glow
    ctx.globalAlpha = star.alpha * star.glowIntensity * 0.8;
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(star.x, star.y, glowSize, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw star core with realistic shape
    ctx.globalAlpha = star.alpha;
    ctx.fillStyle = currentColor;
    ctx.beginPath();
    
    // Brighter stars have cross-shaped diffraction spikes
    if (star.alpha > 0.6 && star.radius > 1.5) {
      drawStarSpikes(star.x, star.y, star.radius, currentColor, star.alpha);
    } else {
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Add bright core for close stars
    if (star.distance < 0.3 && star.alpha > 0.7) {
      ctx.globalAlpha = star.alpha;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius * 0.3, 0, Math.PI * 2);
      ctx.fill();
    }
  });
  
  // Draw shooting stars
  shootingStars.forEach(star => {
    if (star.life <= 0) return;
    
    const gradient = ctx.createLinearGradient(
      star.x, star.y,
      star.x - star.vx * 10, star.y - star.vy * 10
    );
    gradient.addColorStop(0, `rgba(255, 255, 255, ${star.alpha})`);
    gradient.addColorStop(0.5, `rgba(200, 220, 255, ${star.alpha * 0.5})`);
    gradient.addColorStop(1, 'transparent');
    
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(star.x, star.y);
    ctx.lineTo(star.x - star.vx * star.length / 5, star.y - star.vy * star.length / 5);
    ctx.stroke();
    
    // Glow around shooting star
    ctx.globalAlpha = star.alpha * 0.3;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(star.x, star.y, 3, 0, Math.PI * 2);
    ctx.fill();
  });
  
  ctx.globalAlpha = 1;
}

// Draw realistic star with diffraction spikes
function drawStarSpikes(x, y, radius, color, alpha) {
  ctx.globalAlpha = alpha;
  
  // Draw main star body
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw 4 diffraction spikes
  const spikeLength = radius * 4;
  ctx.strokeStyle = color;
  ctx.lineWidth = radius * 0.3;
  ctx.globalAlpha = alpha * 0.6;
  
  for (let i = 0; i < 4; i++) {
    const angle = (i * Math.PI / 2) + Math.PI / 4;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(angle) * spikeLength, y + Math.sin(angle) * spikeLength);
    ctx.stroke();
  }
}

// Realistic cosmic animation
function animateStars() {
  time += 0.008;
  
  // Animate stars with realistic scintillation (atmospheric twinkling)
  stars.forEach((star, index) => {
    // Realistic twinkling - closer stars twinkle more
    const scintillationFactor = (1 - star.distance) * star.scintillation;
    const wave1 = Math.sin(time * star.twinkleSpeed + star.phase);
    const wave2 = Math.sin(time * star.twinkleSpeed * 1.7 + star.phase * 2);
    const combined = (wave1 + wave2 * 0.5) / 1.5;
    
    star.targetAlpha = star.originalAlpha + combined * scintillationFactor;
    star.alpha += (star.targetAlpha - star.alpha) * 0.1;
    
    // Glow intensity variation
    star.glowIntensity += (Math.sin(time * 0.3 + index * 0.1) * 0.3 + 0.7 - star.glowIntensity) * 0.05;
    
    // Subtle parallax movement for depth
    if (mouseActive) {
      const dx = mouseX - canvas.width / 2;
      const dy = mouseY - canvas.height / 2;
      star.x += dx * star.parallaxSpeed * 0.001;
      star.y += dy * star.parallaxSpeed * 0.001;
    }
    
    // Keep stars in bounds with wrapping
    if (star.x < -50) star.x = canvas.width + 50;
    if (star.x > canvas.width + 50) star.x = -50;
    if (star.y < -50) star.y = canvas.height + 50;
    if (star.y > canvas.height + 50) star.y = -50;
  });
  
  // Animate nebula clouds
  nebulaClouds.forEach(nebula => {
    nebula.x += nebula.drift.x;
    nebula.y += nebula.drift.y;
    
    // Wrap around
    if (nebula.x < -nebula.radius) nebula.x = canvas.width + nebula.radius;
    if (nebula.x > canvas.width + nebula.radius) nebula.x = -nebula.radius;
    if (nebula.y < -nebula.radius) nebula.y = canvas.height + nebula.radius;
    if (nebula.y > canvas.height + nebula.radius) nebula.y = -nebula.radius;
  });
  
  // Animate shooting stars
  shootingStars = shootingStars.filter(star => {
    star.x += star.vx;
    star.y += star.vy;
    star.life -= star.decay;
    star.alpha = star.life;
    return star.life > 0;
  });
  
  // Randomly create new shooting stars (rare)
  if (Math.random() < 0.002) {
    shootingStars.push(createShootingStar());
  }

  drawStars();
  requestAnimationFrame(animateStars);
}

// Initialize nebula clouds
for (let i = 0; i < numNebulaClouds; i++) {
  nebulaClouds.push(createNebula());
}

animateStars();
