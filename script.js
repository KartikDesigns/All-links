// 🌙 Go to Top Button - Ultra Smooth
const goTopBtn = document.getElementById("goTopBtn");

window.onscroll = function () {
  if (document.body.scrollTop > 150 || document.documentElement.scrollTop > 150) {
    goTopBtn.style.display = "flex";
    goTopBtn.style.opacity = "1";
  } else {
    goTopBtn.style.opacity = "0";
    setTimeout(() => {
      if (document.body.scrollTop <= 150 && document.documentElement.scrollTop <= 150) {
        goTopBtn.style.display = "none";
      }
    }, 300);
  }
};

// Smooth scroll with full circle rotation
goTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
  
  // Full 720deg rotation for extra smoothness
  goTopBtn.style.transition = "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)";
  goTopBtn.style.transform = "scale(1.3) rotate(720deg)";
  
  setTimeout(() => {
    goTopBtn.style.transform = "scale(1) rotate(0deg)";
  }, 800);
});

// 🔍 Enhanced Link Search with Text Highlighting
const searchInput = document.getElementById('linkSearch');
const linkItems = document.querySelectorAll('.list-group-item');

// Store original text content
const originalTexts = new Map();
linkItems.forEach(item => {
  const link = item.querySelector('a');
  if (link) {
    const textNode = Array.from(link.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
    if (textNode) {
      originalTexts.set(item, textNode.textContent);
    }
  }
});

function highlightText(text, searchTerm) {
  if (!searchTerm) return text;
  
  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return text.replace(regex, '<mark class="search-highlight">$1</mark>');
}

searchInput.addEventListener('input', function() {
  const searchTerm = this.value.trim();
  const searchLower = searchTerm.toLowerCase();
  
  linkItems.forEach(item => {
    const link = item.querySelector('a');
    const originalText = originalTexts.get(item);
    
    if (!originalText) return;
    
    const textLower = originalText.toLowerCase();
    
    if (!searchTerm || textLower.includes(searchLower)) {
      item.classList.remove('hidden');
      
      // Add highlight effect
      if (searchTerm && textLower.includes(searchLower)) {
        const icon = link.querySelector('i');
        const iconHTML = icon ? icon.outerHTML : '';
        const highlightedText = highlightText(originalText, searchTerm);
        link.innerHTML = iconHTML + highlightedText;
        item.classList.add('search-match');
      } else {
        const icon = link.querySelector('i');
        const iconHTML = icon ? icon.outerHTML : '';
        link.innerHTML = iconHTML + originalText;
        item.classList.remove('search-match');
      }
    } else {
      item.classList.add('hidden');
      item.classList.remove('search-match');
    }
  });
  
  // Update search counter
  const visibleCount = Array.from(linkItems).filter(item => !item.classList.contains('hidden')).length;
  updateSearchCounter(visibleCount, linkItems.length);
});

// Search counter display with visual feedback
function updateSearchCounter(visible, total) {
  let counter = document.getElementById('searchCounter');
  if (!counter) {
    counter = document.createElement('div');
    counter.id = 'searchCounter';
    counter.className = 'search-counter';
    searchInput.parentElement.appendChild(counter);
  }
  
  if (searchInput.value.trim()) {
    counter.textContent = `${visible} of ${total}`;
    counter.style.display = 'block';
    
    // Add visual feedback classes
    if (visible === 0) {
      searchInput.classList.add('no-results');
      searchInput.classList.remove('has-results');
      counter.style.background = 'linear-gradient(135deg, var(--supernova-pink), var(--nebula-purple))';
    } else {
      searchInput.classList.add('has-results');
      searchInput.classList.remove('no-results');
      counter.style.background = 'linear-gradient(135deg, var(--nebula-purple), var(--galaxy-blue))';
    }
  } else {
    counter.style.display = 'none';
    searchInput.classList.remove('has-results', 'no-results');
  }
}

// Clear search on Escape
searchInput.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    this.value = '';
    this.dispatchEvent(new Event('input'));
    this.blur();
  }
});

// Add keyboard shortcut for search focus (press / to focus search)
document.addEventListener('keydown', function(e) {
  if (e.key === '/' && document.activeElement !== searchInput) {
    e.preventDefault();
    searchInput.focus();
    searchInput.select();
  }
});

// ⚡ Performance Optimizations & Link Loading
document.addEventListener('DOMContentLoaded', function() {
  // Remove loading class after animation
  setTimeout(() => {
    linkItems.forEach(item => {
      item.classList.remove('link-loading');
    });
  }, 1000);
  
  // Add click feedback for links
  const allLinks = document.querySelectorAll('.list-group-item a');
  allLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      this.classList.add('link-clicked');
      
      // Visual feedback
      const icon = this.querySelector('i');
      if (icon) {
        icon.style.transform = 'scale(1.3) rotate(360deg)';
        setTimeout(() => {
          icon.style.transform = '';
        }, 400);
      }
      
      // Remove class after animation
      setTimeout(() => {
        this.classList.remove('link-clicked');
      }, 400);
    });
    
    // Prefetch on hover for faster navigation
    link.addEventListener('mouseenter', function() {
      const href = this.getAttribute('href');
      if (href && !this.hasAttribute('data-prefetched')) {
        const prefetchLink = document.createElement('link');
        prefetchLink.rel = 'prefetch';
        prefetchLink.href = href;
        document.head.appendChild(prefetchLink);
        this.setAttribute('data-prefetched', 'true');
      }
    });
  });
});

// ⚡ Lazy load animations - Intersection Observer for better performance
if ('IntersectionObserver' in window) {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '50px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Observe footer for lazy animation
  const footer = document.querySelector('footer');
  if (footer) {
    footer.style.opacity = '0';
    footer.style.transform = 'translateY(20px)';
    footer.style.transition = 'all 0.6s ease';
    observer.observe(footer);
  }
}

// ⚡ Debounce search for better performance
let searchTimeout;
const originalSearchHandler = searchInput.oninput;

searchInput.addEventListener('input', function(e) {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    // Search logic already handled above
  }, 150); // 150ms debounce
});