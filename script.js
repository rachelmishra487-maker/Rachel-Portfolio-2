// ==========================================================================
// RACHEL MISHRA — PORTFOLIO JAVASCRIPT
// Features: Dynamic Year, Sticky Nav, Mobile Menu, Dual Fluid Cursor,
// Interactive Gallery Switchers, Skill Filtering, Figma Token Sandbox,
// and Accessible Clipboard Utility.
// ==========================================================================

// 1. Dynamic Footer Year
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// 2. Active Nav Link Detection
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

// 3. Sticky Navbar Elevation on Scroll
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

// 4. Mobile Nav Drawer Toggle & Accessibility
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

// 5. Dual Fluid Custom Cursor (Desktop Fine Pointer Only)
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

  // Lerp rendering loop for follower ring
  const renderCursor = () => {
    ringX += (mouseX - ringX) * 0.16;
    ringY += (mouseY - ringY) * 0.16;
    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top = `${ringY}px`;
    requestAnimationFrame(renderCursor);
  };
  requestAnimationFrame(renderCursor);

  // Hover expansion on interactive elements
  const interactiveSelectors = 'a, button, input, textarea, select, .explore-card, .ux-project-card, .ux-skill-card, .tool-card, .credential-card, .passion-card, .screen-tab, .showcase-thumb-btn, .btn, .nav-mark';
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

// 6. Copy to Clipboard Utility with Toast Feedback
window.copyToClipboard = (text, label) => {
  navigator.clipboard.writeText(text).then(() => {
    showToast(`${label || 'Text'} copied to clipboard!`);
  }).catch(() => {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast(`${label || 'Text'} copied to clipboard!`);
  });
};

const showToast = (message) => {
  let toast = document.getElementById('portfolioToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'portfolioToast';
    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: #1A3320;
      color: #FFFFFF;
      padding: 12px 20px;
      border-radius: 999px;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.88rem;
      font-weight: 600;
      box-shadow: 0 8px 24px rgba(26, 51, 32, 0.25);
      z-index: 10000;
      opacity: 0;
      transform: translateY(12px);
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      pointer-events: none;
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.opacity = '1';
  toast.style.transform = 'translateY(0)';
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(12px)';
  }, 2400);
};

// 7. GoUni Real Screen Switcher (Tabs & Thumbnails)
const gouniTabs = document.querySelectorAll('.screen-tab:not(.hc-tab):not(.pb-tab), .showcase-thumb-btn:not(.hc-thumb):not(.pb-thumb)');
const gouniMainImg = document.getElementById('gouniMainScreen');
const gouniCaption = document.getElementById('gouniScreenCaption');

if (gouniTabs.length && gouniMainImg) {
  const gouniScreens = {
    storyboard: {
      src: 'project_gouni.jpg',
      alt: 'GoUni UX Storyboard - Making studying abroad less overwhelming',
      caption: '<strong>Real Project Artifact:</strong> 6-stage UX Storyboard mapping student pain points, platform discovery, personalized application support, and international enrollment.'
    },
    components: {
      src: 'project_gouni_components.png',
      alt: 'GoUni Figma Component System & Interactive Card States',
      caption: '<strong>Figma Design System:</strong> Reusable university card component set featuring multi-state variants (Default, Hover, Active, Disabled) built with Auto-Layout 5.0.'
    }
  };

  gouniTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const screenKey = tab.dataset.screen;
      if (!gouniScreens[screenKey]) return;

      document.querySelectorAll('.screen-tab:not(.hc-tab):not(.pb-tab), .showcase-thumb-btn:not(.hc-thumb):not(.pb-thumb)').forEach(btn => {
        if (btn.dataset.screen === screenKey) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      gouniMainImg.style.opacity = '0.2';
      setTimeout(() => {
        gouniMainImg.src = gouniScreens[screenKey].src;
        gouniMainImg.alt = gouniScreens[screenKey].alt;
        gouniMainImg.style.opacity = '1';
        if (gouniCaption) {
          gouniCaption.innerHTML = gouniScreens[screenKey].caption;
        }
      }, 150);
    });
  });
}

// 8. The Healing Circle Real Screen Switcher
const hcTabs = document.querySelectorAll('.hc-tab, .hc-thumb');
const hcMainImg = document.getElementById('hcMainScreen');
const hcCaption = document.getElementById('hcScreenCaption');

if (hcTabs.length && hcMainImg) {
  const hcScreens = {
    concept: {
      src: 'project_healing_circle_concept.svg',
      alt: 'The Healing Circle Concept Diagram & Ecosystem Architecture',
      caption: '<strong>Real Academic Artifact:</strong> Concentric Healing Circle architecture separating the inner physical recovery sanctuary (Debrief zones, micro-rituals, peer circles) from the outer organizational layer (HR policy, soft digital layer).'
    },
    interviews: {
      src: 'project_healing_circle_interviews.svg',
      alt: 'Primary Doctor Interviews & Clinical Personas',
      caption: '<strong>Primary Doctor Field Research:</strong> Qualitative interviews with Dr. Bhushan (Gastroenterology), Dr. Anushka (Pediatrics), and Dr. Vipul (Forensic Medicine) revealing empathy fatigue and need for non-judgmental decompression.'
    },
    rituals: {
      src: 'project_healing_circle_rituals.svg',
      alt: 'Physical Debrief Sanctuary & 4 Clinical Micro-Rituals',
      caption: '<strong>Sanctuary & Micro-Rituals:</strong> Sound-dampened restorative rooms featuring 2700K lighting, biophilic greens, 1-min vagus nerve breathing reset, and anonymous gratitude reflection stations.'
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

      document.querySelectorAll('.hc-tab, .hc-thumb').forEach(btn => {
        if (btn.dataset.screen === screenKey) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      hcMainImg.style.opacity = '0.2';
      setTimeout(() => {
        hcMainImg.src = hcScreens[screenKey].src;
        hcMainImg.alt = hcScreens[screenKey].alt;
        hcMainImg.style.opacity = '1';
        if (hcCaption) {
          hcCaption.innerHTML = hcScreens[screenKey].caption;
        }
      }, 150);
    });
  });
}

// 9. PawBridge Real Screen Switcher
const pbTabs = document.querySelectorAll('.pb-tab, .pb-thumb');
const pbMainImg = document.getElementById('pbMainScreen');
const pbCaption = document.getElementById('pbScreenCaption');

if (pbTabs.length && pbMainImg) {
  const pbScreens = {
    workspace: {
      src: 'project_pawbridge.png',
      alt: 'PawBridge Desktop Operations Workspace & Shelter Intake Dashboard',
      caption: '<strong>Real Project Artifact:</strong> High-fidelity desktop operations workspace (1440×1024) featuring patient admission, live kennel capacity management, and medical case tracking.'
    },
    research: {
      src: 'project_pawbridge_presentation.png',
      alt: 'PawBridge Supporter Psychology & Field Research Presentation',
      caption: '<strong>UX Research Artifact:</strong> In-depth field research analyzing supporter hesitation, donor trust barriers, and the psychological progression from discovery to verifiable support.'
    }
  };

  pbTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const screenKey = tab.dataset.screen;
      if (!pbScreens[screenKey]) return;

      document.querySelectorAll('.pb-tab, .pb-thumb').forEach(btn => {
        if (btn.dataset.screen === screenKey) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      pbMainImg.style.opacity = '0.2';
      setTimeout(() => {
        pbMainImg.src = pbScreens[screenKey].src;
        pbMainImg.alt = pbScreens[screenKey].alt;
        pbMainImg.style.opacity = '1';
        if (pbCaption) {
          pbCaption.innerHTML = pbScreens[screenKey].caption;
        }
      }, 150);
    });
  });
}

// 10. Discipline Filter in Skills Page
const skillFilterBtns = document.querySelectorAll('.skill-filter-btn');
const uxSkillCards = document.querySelectorAll('.ux-skill-card');

if (skillFilterBtns.length && uxSkillCards.length) {
  skillFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      skillFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      uxSkillCards.forEach(card => {
        if (filter === 'all' || card.dataset.discipline === filter) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });
    });
  });
}

// 11. Interactive Figma Token & Component Sandbox
const initTokenSandbox = () => {
  const statePills = document.querySelectorAll('#statePills .sandbox-pill');
  const colorSwatches = document.querySelectorAll('#colorSwatches .swatch-btn');
  const densityPills = document.querySelectorAll('#densityPills .sandbox-pill');
  const demoCard = document.getElementById('demoCard');
  const demoBtn = document.getElementById('sandboxDemoBtn');
  const demoTokenName = document.getElementById('demoTokenName');
  const inspectorCode = document.getElementById('inspectorCode');

  if (!demoCard || !demoBtn) return;

  let currentState = 'default';
  let currentColor = '#1A3320';
  let currentTokenName = '$color-forest-primary';
  let currentPadding = '14px 28px';

  const updateSandbox = () => {
    // Update button styling
    demoBtn.style.background = currentColor;
    demoBtn.style.padding = currentPadding;

    if (currentState === 'hover') {
      demoBtn.style.opacity = '0.9';
      demoBtn.style.transform = 'translateY(-2px)';
      demoBtn.style.boxShadow = `0 8px 24px ${currentColor}44`;
    } else if (currentState === 'active') {
      demoBtn.style.opacity = '1';
      demoBtn.style.transform = 'scale(0.97)';
      demoBtn.style.boxShadow = `0 2px 8px ${currentColor}33`;
    } else if (currentState === 'loading') {
      demoBtn.style.opacity = '0.8';
      demoBtn.style.transform = 'none';
      demoBtn.style.boxShadow = 'none';
    } else if (currentState === 'disabled') {
      demoBtn.style.opacity = '0.45';
      demoBtn.style.transform = 'none';
      demoBtn.style.boxShadow = 'none';
      demoBtn.style.cursor = 'not-allowed';
    } else {
      demoBtn.style.opacity = '1';
      demoBtn.style.transform = 'none';
      demoBtn.style.boxShadow = `0 4px 16px ${currentColor}33`;
      demoBtn.style.cursor = 'pointer';
    }

    if (demoTokenName) {
      demoTokenName.textContent = currentTokenName;
    }

    if (inspectorCode) {
      inspectorCode.textContent = `/* Figma Token Output */
.btn-primary {
  --btn-bg: ${currentColor};
  --btn-token: ${currentTokenName};
  padding: ${currentPadding};
  border-radius: 999px;
  box-shadow: 0 4px 16px ${currentColor}33;
  transition: all 0.25s ease;
  /* State: ${currentState} */
}`;
    }
  };

  statePills.forEach(pill => {
    pill.addEventListener('click', () => {
      statePills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentState = pill.dataset.state;
      updateSandbox();
    });
  });

  colorSwatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      colorSwatches.forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');
      currentColor = swatch.dataset.color;
      currentTokenName = `$color-${swatch.dataset.token}-primary`;
      updateSandbox();
    });
  });

  densityPills.forEach(pill => {
    pill.addEventListener('click', () => {
      densityPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const d = pill.dataset.density;
      if (d === 'compact') currentPadding = '10px 20px';
      else if (d === 'spacious') currentPadding = '18px 36px';
      else currentPadding = '14px 28px';
      updateSandbox();
    });
  });

  updateSandbox();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTokenSandbox);
} else {
  initTokenSandbox();
}
