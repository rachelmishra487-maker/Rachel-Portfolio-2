// Footer year
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// Active nav link highlight based on current page URL
const currentPath = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPath || (currentPath === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

// Sticky navbar scroll elevation
const navbar = document.querySelector('.nav');
if (navbar) {
  const handleScroll = () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

// Mobile nav toggle with accessible state and smooth animation
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Decorative cursor dot (desktop only)
const cursorDot = document.getElementById('cursorDot');
if (cursorDot && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  window.addEventListener('mousemove', (e) => {
    cursorDot.style.opacity = '1';
    cursorDot.style.left = e.clientX + 'px';
    cursorDot.style.top = e.clientY + 'px';
  });
}

// Copy to clipboard utility for contact tiles
function copyToClipboard(text, label) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(`${label} copied to clipboard!`);
  }).catch(() => {
    // Fallback
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    showToast(`${label} copied!`);
  });
}

function showToast(message) {
  let toast = document.getElementById('copyToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'copyToast';
    toast.className = 'copy-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

// GoUni Real Screen Switcher (Tabs & Thumbnails)
const screenTabs = document.querySelectorAll('.screen-tab, .showcase-thumb-btn');
const mainScreenImg = document.getElementById('gouniMainScreen');
const screenCaption = document.getElementById('gouniScreenCaption');

if (screenTabs.length && mainScreenImg) {
  const gouniScreens = {
    storyboard: {
      src: 'project_gouni.jpg',
      alt: 'GoUni UX Storyboard - Making studying abroad less overwhelming',
      caption: '<strong>Real Project Artifact:</strong> 6-stage UX Storyboard mapping student pain points, platform discovery, personalized application support, and international enrollment.'
    },
    components: {
      src: 'project_gouni_components.png',
      alt: 'GoUni Figma UI Design System Components and Course Cards',
      caption: '<strong>Real Project Artifact:</strong> Scalable Figma component architecture showing 3 interactive course card variants (Default, Hover, Active) and university profile tiles.'
    }
  };

  screenTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const screenKey = tab.dataset.screen;
      if (!gouniScreens[screenKey]) return;

      // Sync active state on both header tabs and thumbnail buttons
      document.querySelectorAll('.screen-tab, .showcase-thumb-btn').forEach(btn => {
        if (btn.dataset.screen === screenKey) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      // Smooth crossfade
      mainScreenImg.style.opacity = '0.2';
      setTimeout(() => {
        mainScreenImg.src = gouniScreens[screenKey].src;
        mainScreenImg.alt = gouniScreens[screenKey].alt;
        mainScreenImg.style.opacity = '1';
        if (screenCaption) {
          screenCaption.innerHTML = gouniScreens[screenKey].caption;
        }
      }, 150);
    });
  });
}

