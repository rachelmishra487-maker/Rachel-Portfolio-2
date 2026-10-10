// Footer year
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// Active nav link highlight based on current page URL (supports clean URLs and file names)
const normalizePageName = (path) => {
  if (!path) return 'index';
  const clean = path.split('?')[0].split('#')[0].replace(/\.html$/, '');
  return clean === '' ? 'index' : clean;
};

const rawCurrent = window.location.pathname.split('/').filter(Boolean).pop() || 'index';
const normalizedCurrent = normalizePageName(rawCurrent);

document.querySelectorAll('.nav-links a').forEach(link => {
  const href = link.getAttribute('href');
  if (!href || href.startsWith('http') || href.endsWith('.pdf')) return;
  const linkNorm = normalizePageName(href.split('/').pop());
  if (linkNorm === normalizedCurrent) {
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

// Mobile nav toggle with accessible state, backdrop, escape key, and scroll lock
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');
const navBackdrop = document.getElementById('navBackdrop');

const closeMobileNav = () => {
  if (navLinks) navLinks.classList.remove('open');
  if (navToggle) {
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }
  if (navBackdrop) navBackdrop.classList.remove('active');
  document.body.classList.remove('no-scroll');
};

const openMobileNav = () => {
  if (navLinks) navLinks.classList.add('open');
  if (navToggle) {
    navToggle.classList.add('open');
    navToggle.setAttribute('aria-expanded', 'true');
  }
  if (navBackdrop) navBackdrop.classList.add('active');
  document.body.classList.add('no-scroll');
};

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.contains('open');
    if (isOpen) {
      closeMobileNav();
    } else {
      openMobileNav();
    }
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMobileNav);
  });

  if (navBackdrop) {
    navBackdrop.addEventListener('click', closeMobileNav);
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      closeMobileNav();
    }
  });
}

// ---------- FLUID CUSTOM DUAL CURSOR (DESKTOP ONLY) ----------
const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (isFinePointer) {
  let cursorDot = document.getElementById('cursorDot');
  if (!cursorDot) {
    cursorDot = document.createElement('div');
    cursorDot.id = 'cursorDot';
    cursorDot.className = 'cursor-dot';
    document.body.appendChild(cursorDot);
  }

  let cursorRing = document.getElementById('cursorRing');
  if (!cursorRing) {
    cursorRing = document.createElement('div');
    cursorRing.id = 'cursorRing';
    cursorRing.className = 'cursor-ring';
    document.body.appendChild(cursorRing);
  }

  let mouseX = -100, mouseY = -100;
  let ringX = -100, ringY = -100;
  let isCursorVisible = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!isCursorVisible) {
      isCursorVisible = true;
      cursorDot.style.opacity = '1';
      cursorRing.style.opacity = '1';
    }
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  }, { passive: true });

  document.addEventListener('mouseleave', () => {
    isCursorVisible = false;
    cursorDot.style.opacity = '0';
    cursorRing.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    isCursorVisible = true;
    cursorDot.style.opacity = '1';
    cursorRing.style.opacity = '1';
  });

  // Smooth Lerp loop for follower ring (60fps fluid lag)
  const renderCursor = () => {
    ringX += (mouseX - ringX) * 0.16;
    ringY += (mouseY - ringY) * 0.16;
    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top = `${ringY}px`;
    requestAnimationFrame(renderCursor);
  };
  requestAnimationFrame(renderCursor);

  // Interactive hover state on clickable elements
  const interactiveSelectors = 'a, button, input, textarea, select, .explore-card, .ux-project-card, .ux-skill-card, .tool-card, .screen-tab, .showcase-thumb-btn, .btn, .nav-mark';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactiveSelectors)) {
      document.body.classList.add('cursor-active');
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactiveSelectors)) {
      document.body.classList.remove('cursor-active');
    }
  });
}

// ---------- SMOOTH SCROLL REVEAL (INTERSECTION OBSERVER) ----------
const initScrollReveal = () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const revealSelectors = [
    '.explore-card',
    '.featured-project-card',
    '.ux-project-card',
    '.ux-skill-card',
    '.tool-card',
    '.contact-tile',
    '.recruiter-snapshot-card',
    '.about-photo-wrapper',
    '.about-journey-content',
    '.about-philosophy-card',
    '.education-card',
    '.contact-reachout-card',
    '.skills-section-header',
    '.explore-heading'
  ];

  // Auto-stagger children in grid containers
  const gridParents = document.querySelectorAll(
    '.explore-grid, .ux-projects-grid, .ux-skills-grid, .tools-grid, .contact-grid, .philosophy-grid, .about-hero-grid'
  );
  gridParents.forEach(grid => {
    const children = Array.from(grid.children);
    children.forEach((child, index) => {
      child.classList.add('reveal-on-scroll');
      child.style.transitionDelay = `${Math.min(index * 0.08, 0.4)}s`;
    });
  });

  document.querySelectorAll(revealSelectors.join(', ')).forEach(el => {
    if (!el.classList.contains('reveal-on-scroll')) {
      el.classList.add('reveal-on-scroll');
    }
  });

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -30px 0px'
  });

  document.querySelectorAll('.reveal-on-scroll').forEach(el => {
    observer.observe(el);
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initScrollReveal);
} else {
  initScrollReveal();
}

// ---------- DYNAMIC CARD SPOTLIGHT & MICRO-TILT ----------
if (isFinePointer && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const interactiveCards = document.querySelectorAll(
    '.explore-card, .featured-project-card, .ux-project-card, .ux-skill-card, .tool-card, .contact-tile, .recruiter-snapshot-card, .about-photo-card, .about-philosophy-card, .education-card'
  );

  interactiveCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      // Gentle micro-tilt (clamped to max ±2deg for calm, refined tactile feel)
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const tiltX = ((x - centerX) / centerX) * 2;
      const tiltY = ((y - centerY) / centerY) * 2;

      card.style.transform = `perspective(1000px) rotateY(${tiltX.toFixed(2)}deg) rotateX(${(-tiltY).toFixed(2)}deg) translateY(-5px)`;
    }, { passive: true });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.removeProperty('--mouse-x');
      card.style.removeProperty('--mouse-y');
    });
  });
}

// ---------- SUBTLE HERO BACKGROUND PARALLAX ----------
const heroSection = document.querySelector('.hero');
const shape1 = document.querySelector('.shape-1');
const shape2 = document.querySelector('.shape-2');

if (heroSection && shape1 && shape2 && isFinePointer && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  heroSection.addEventListener('mousemove', (e) => {
    const rect = heroSection.getBoundingClientRect();
    const normX = (e.clientX - rect.left) / rect.width - 0.5;
    const normY = (e.clientY - rect.top) / rect.height - 0.5;

    shape1.style.transform = `translate3d(${(-normX * 22).toFixed(1)}px, ${(-normY * 22).toFixed(1)}px, 0)`;
    shape2.style.transform = `translate3d(${(normX * 16).toFixed(1)}px, ${(normY * 16).toFixed(1)}px, 0)`;
  }, { passive: true });

  heroSection.addEventListener('mouseleave', () => {
    shape1.style.transform = '';
    shape2.style.transform = '';
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

// ---------- SKILLS PAGE: ANIMATED PROFICIENCY METERS & COUNTERS ----------
const initSkillMeters = () => {
  const meterCards = document.querySelectorAll('.tool-card');
  if (!meterCards.length) return;

  const animateCounter = (valEl, target) => {
    const duration = 1400;
    const startTime = performance.now();
    const startVal = 0;

    const tick = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.floor(startVal + (target - startVal) * ease);
      valEl.textContent = `${current}%`;

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        valEl.textContent = `${target}%`;
      }
    };
    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const card = entry.target;
        const fillBar = card.querySelector('.tool-meter-fill');
        const valEl = card.querySelector('.tool-meter-val');

        if (fillBar && valEl && !card.dataset.animated) {
          card.dataset.animated = 'true';
          const target = parseInt(valEl.dataset.target, 10) || 90;
          fillBar.style.width = `${target}%`;
          animateCounter(valEl, target);
        }
        obs.unobserve(card);
      }
    });
  }, {
    threshold: 0.2,
    rootMargin: '0px 0px -30px 0px'
  });

  meterCards.forEach(card => observer.observe(card));
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSkillMeters);
} else {
  initSkillMeters();
}

// ---------- SKILLS PAGE: UX DISCIPLINE FILTER TABS ----------
const initSkillFilters = () => {
  const filterBtns = document.querySelectorAll('.skill-filter-btn');
  const skillCards = document.querySelectorAll('.ux-skill-card');
  if (!filterBtns.length || !skillCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      skillCards.forEach(card => {
        const discipline = card.dataset.discipline;
        if (filter === 'all' || discipline === filter) {
          card.classList.remove('filtered-out');
        } else {
          card.classList.add('filtered-out');
        }
      });
    });
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSkillFilters);
} else {
  initSkillFilters();
}

// ---------- SKILLS PAGE: FIGMA COMPONENT & TOKEN SANDBOX ----------
const initSandbox = () => {
  const sandbox = document.getElementById('sandboxApp');
  if (!sandbox) return;

  const statePills = document.querySelectorAll('#statePills .sandbox-pill');
  const densityPills = document.querySelectorAll('#densityPills .sandbox-pill');
  const colorSwatches = document.querySelectorAll('#colorSwatches .swatch-btn');
  const demoBtn = document.getElementById('sandboxDemoBtn');
  const demoCard = document.getElementById('demoCard');
  const tokenNameEl = document.getElementById('demoTokenName');
  const paddingReadout = document.getElementById('paddingReadout');
  const codeEl = document.getElementById('inspectorCode');

  let currentState = 'default';
  let currentColor = '#FF2A3A';
  let currentRgb = '255, 42, 58';
  let currentTokenName = '$color-brand-primary';
  let currentDensity = 'default';
  let currentPadding = '14px 28px';

  const updateInspector = () => {
    if (!codeEl) return;
    codeEl.textContent = `/* Figma Token Output */
.btn-primary {
  --token: ${currentTokenName};
  --btn-bg: ${currentColor};
  padding: ${currentPadding};
  border-radius: 999px;
  box-shadow: 0 8px 24px rgba(${currentRgb}, 0.38);
  /* State: ${currentState} */
  transition: all 0.25s ease;
}`;
  };

  // State Handler
  statePills.forEach(pill => {
    pill.addEventListener('click', () => {
      statePills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentState = pill.dataset.state;

      demoBtn.className = 'demo-action-btn';
      if (currentState === 'active') {
        demoBtn.classList.add('state-active');
      } else if (currentState === 'loading') {
        demoBtn.classList.add('state-loading');
      } else if (currentState === 'disabled') {
        demoBtn.classList.add('state-disabled');
      }
      updateInspector();
    });
  });

  // Color Swatch Handler
  colorSwatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      colorSwatches.forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');
      currentColor = swatch.dataset.color;
      currentRgb = swatch.dataset.rgb;
      const token = swatch.dataset.token;

      if (token === 'crimson') currentTokenName = '$color-brand-primary';
      else if (token === 'cyan') currentTokenName = '$color-accent-cyan';
      else if (token === 'violet') currentTokenName = '$color-accent-violet';
      else if (token === 'emerald') currentTokenName = '$color-accent-emerald';

      demoCard.style.setProperty('--sandbox-accent', currentColor);
      demoCard.style.setProperty('--sandbox-accent-rgb', currentRgb);
      if (tokenNameEl) tokenNameEl.textContent = currentTokenName;
      updateInspector();
    });
  });

  // Density Handler
  densityPills.forEach(pill => {
    pill.addEventListener('click', () => {
      densityPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentDensity = pill.dataset.density;

      if (currentDensity === 'compact') {
        currentPadding = '8px 18px';
      } else if (currentDensity === 'spacious') {
        currentPadding = '20px 36px';
      } else {
        currentPadding = '14px 28px';
      }

      demoCard.style.setProperty('--sandbox-padding', currentPadding);
      if (paddingReadout) paddingReadout.textContent = currentPadding;
      updateInspector();
    });
  });

  // Clicking demo button feedback
  if (demoBtn) {
    demoBtn.addEventListener('click', () => {
      if (currentState === 'disabled' || currentState === 'loading') return;
      demoBtn.classList.add('state-active');
      setTimeout(() => {
        if (currentState !== 'active') demoBtn.classList.remove('state-active');
      }, 200);
    });
  }

  updateInspector();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSandbox);
} else {
  initSandbox();
}



// The Healing Circle Real Screen Switcher (Tabs & Thumbnails)
const hcTabs = document.querySelectorAll('.hc-tab, .hc-thumb');
const hcMainScreenImg = document.getElementById('hcMainScreen');
const hcScreenCaption = document.getElementById('hcScreenCaption');

if (hcTabs.length && hcMainScreenImg) {
  const hcScreens = {
    concept: {
      src: 'project_healing_circle_concept.svg',
      alt: 'The Healing Circle Concept Diagram & Ecosystem Architecture',
      caption: '<strong>Real Academic Artifact:</strong> Concentric Healing Circle architecture separating the inner physical recovery sanctuary (Debrief zones, micro-rituals, peer circles) from the outer organizational layer (HR policy, soft digital layer).'
    },
    interviews: {
      src: 'project_healing_circle_interviews.svg',
      alt: 'Primary Doctor Interviews & Clinical Personas - Dr. Bhushan, Dr. Anushka, Dr. Vipul',
      caption: '<strong>Primary Doctor Interviews:</strong> Field research with Dr. Bhushan (Gastroenterology), Dr. Anushka (Pediatrics), and Dr. Vipul (Forensic Medicine) revealing empathy fatigue and need for non-judgmental decompression.'
    },
    rituals: {
      src: 'project_healing_circle_rituals.svg',
      alt: 'Physical Debrief Sanctuary & 4 Clinical Micro-Rituals',
      caption: '<strong>Sanctuary & Micro-Rituals:</strong> Sound-dampened restorative rooms featuring 2700K lighting, biophilic greens, 1-min vagus nerve breathing reset, and anonymous gratitude walls.'
    },
    flow: {
      src: 'project_healing_circle_flow.svg',
      alt: '5-Stage Interaction Touchpoints & End-to-End Hospital Flow Map',
      caption: '<strong>End-to-End Hospital Flow:</strong> 5-stage transformation turning acute traumatic events into debrief pauses, peer reflection, and weekly hospital scheduling adjustments.'
    }
  };

  hcTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const screenKey = tab.dataset.screen;
      if (!hcScreens[screenKey]) return;

      // Sync active state across header tabs and thumbnail buttons
      document.querySelectorAll('.hc-tab, .hc-thumb').forEach(btn => {
        if (btn.dataset.screen === screenKey) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      // Smooth crossfade transition
      hcMainScreenImg.style.opacity = '0.2';
      setTimeout(() => {
        hcMainScreenImg.src = hcScreens[screenKey].src;
        hcMainScreenImg.alt = hcScreens[screenKey].alt;
        hcMainScreenImg.style.opacity = '1';
        if (hcScreenCaption) {
          hcScreenCaption.innerHTML = hcScreens[screenKey].caption;
        }
      }, 150);
    });
  });
}
