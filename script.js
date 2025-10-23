// 🌙 Go to Top Button
const goTopBtn = document.getElementById("goTopBtn");

window.onscroll = function () {
  if (document.body.scrollTop > 150 || document.documentElement.scrollTop > 150) {
    goTopBtn.style.display = "block";
  } else {
    goTopBtn.style.display = "none";
  }
};

// Smooth scroll with animation
goTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
  // Add a quick moon rotation for flair
  goTopBtn.style.transform = "rotate(360deg)";
  setTimeout(() => {
    goTopBtn.style.transform = "rotate(0deg)";
  }, 600);
});

// 🔍 Link Search Functionality
const searchInput = document.getElementById('linkSearch');
const linkItems = document.querySelectorAll('.list-group-item');

searchInput.addEventListener('input', function() {
  const searchTerm = this.value.toLowerCase();
  
  linkItems.forEach(item => {
    const linkText = item.textContent.toLowerCase();
    if (linkText.includes(searchTerm)) {
      item.classList.remove('hidden');
    } else {
      item.classList.add('hidden');
    }
  });
});

// Add keyboard shortcut for search focus (press / to focus search)
document.addEventListener('keydown', function(e) {
  if (e.key === '/' && document.activeElement !== searchInput) {
    e.preventDefault();
    searchInput.focus();
  }
});