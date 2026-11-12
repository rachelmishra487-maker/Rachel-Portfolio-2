// ==========================================================================
// RACHEL MISHRA — PORTFOLIO SCRIPT
// Features: Dynamic Year, Sticky Nav, Mobile Menu, Dual Fluid Cursor,
// Interactive Gallery Switchers, Figma Token Sandbox, Scroll Reveals,
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
  const interactiveSelectors = 'a, button, input, textarea, select, .project-editorial-card, .skills-category-card, .timeline-card, .passion-card, .playground-card, .screen-tab, .showcase-thumb-btn, .btn, .nav-mark';
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
      background: #38243E;
      color: #F8F3EA;
      border: 1px solid #DF4A7A;
      padding: 12px 24px;
      border-radius: 999px;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.88rem;
      font-weight: 600;
      box-shadow: 0 8px 24px rgba(56, 36, 62, 0.25);
      z-index: 10000;
      opacity: 0;
      transform: translateY(14px);
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
    toast.style.transform = 'translateY(14px)';
  }, 2400);
};

// 7. GoUni Flagship Interactive Showcase & Lightbox Inspector
const gouniScreensData = {
  onboarding: {
    src: 'project_gouni_screen_onboarding.svg',
    badge: 'SCREEN 01 · ONBOARDING',
    title: 'Welcome & Threshold Verification',
    desc: 'Welcomes prospective international applicants with verified threshold requirements, global coverage (12,000+ programs across 24 countries), and a clear friction-free enrollment funnel.',
    patterns: 'Visual branding banner, value proposition checklist, dual primary/ghost CTA buttons',
    tokens: 'Brand Orange (#FF6B35), Primary Green (#10B981), Neutral Background (#FAF9F6)'
  },
  discovery: {
    src: 'project_gouni_screen_discovery.svg',
    badge: 'SCREEN 02 · DISCOVERY',
    title: 'University & Course Discovery',
    desc: 'Structured multi-country filtering, live search autocomplete, QS World Rankings, and estimated tuition fees to eliminate multi-tab comparison fatigue.',
    patterns: 'Horizontal filter pills, university cards, comparative badges, fee calculator',
    tokens: 'Active Orange (#FF6B35), Neutral Border (#EAE5DF), Surface Elevated (#FFFFFF)'
  },
  details: {
    src: 'project_gouni_screen_details.svg',
    badge: 'SCREEN 03 · UNIVERSITY DETAILS',
    title: 'Academic Thresholds & Living Costs',
    desc: 'Comprehensive university specifications for University of Toronto: GPA & IELTS requirements with eligibility checks, living cost breakdown, and single-click checklist enrollment.',
    patterns: 'Key metrics strip, accordion criteria cards, living cost breakdown, sticky application CTA',
    tokens: 'Purple Accent (#2D1537), Success Green (#10B981), Orange Primary (#FF6B35)'
  },
  dashboard: {
    src: 'project_gouni_screen_dashboard.svg',
    badge: 'SCREEN 04 · ROADMAP & DASHBOARD',
    title: 'Student Dashboard & Departure Roadmap',
    desc: 'Centralized student command center featuring departure readiness progress (52%), multi-university application tracker (Imperial, TU Munich), and urgent milestone notifications.',
    patterns: 'Progress ring/bar, multi-state status badges, actionable deadline cards, bottom tab-bar',
    tokens: 'Brand Orange (#FF6B35), Success Green (#10B981), Dark Plum Text (#1E1915)'
  },
  documents: {
    src: 'project_gouni_screen_documents.svg',
    badge: 'SCREEN 05 · DOCUMENT VAULT',
    title: 'Document Upload & Verification Hub',
    desc: 'Secure academic credential vault with automatic verification tracking, passport validity checks, SOP review statuses, and banking solvency compliance alerts.',
    patterns: 'Progress indicators, verification badges, secure upload dropzones, file preview modals',
    tokens: 'Verified Green (#10B981), Pending Amber (#F59E0B), Border Default (#EAE5DF)'
  },
  visa: {
    src: 'project_gouni_screen_visa.svg',
    badge: 'SCREEN 06 · VISA GUIDANCE',
    title: 'Visa Guidance & Compliance Hub',
    desc: 'Demystifying UK Student Route & Canadian SDS visa requirements: CAS code tracking, biometric appointment scheduling, and maintenance fund calculators ($1,334/mo).',
    patterns: 'Step-by-step compliance checklist, currency conversion helper, biometric appointment booking',
    tokens: 'Warning Amber (#F59E0B), Brand Orange (#FF6B35), Neutral Surface (#FFFFFF)'
  },
  accommodation: {
    src: 'project_gouni_screen_accommodation.svg',
    badge: 'SCREEN 07 · ACCOMMODATION',
    title: 'Student Housing & Dormitory Finder',
    desc: 'Curated on-campus university halls and vetted private student apartments sorted by commute distance to faculties, weekly budget, and verified roommate compatibility.',
    patterns: 'Filter pills (Ensuite, Budget), distance-to-faculty badges, escrow verification badge',
    tokens: 'Brand Orange (#FF6B35), Success Pill (#10B981), Surface Card (#FFFFFF)'
  },
  community: {
    src: 'project_gouni_screen_community.svg',
    badge: 'SCREEN 08 · COHORT COMMUNITY',
    title: 'Student Community & Peer Network',
    desc: 'Connecting incoming international students with city cohort discussion channels, flatmate matching, flight sharing, and verified senior student alumni mentors.',
    patterns: 'Cohort discussion feed, verified student badge, direct peer messaging, event countdown',
    tokens: 'Community Purple (#76518E), Brand Orange (#FF6B35), Surface Light (#FAF9F6)'
  }
};

const gouniScreenKeys = Object.keys(gouniScreensData);
let currentGouniScreenIndex = 0;

function openGouniLightbox(screenId) {
  const lightbox = document.getElementById('gouniLightbox');
  if (!lightbox) return;
  const index = gouniScreenKeys.indexOf(screenId);
  if (index !== -1) {
    currentGouniScreenIndex = index;
  }
  updateGouniLightboxContent();
  lightbox.classList.add('active');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeGouniLightbox() {
  const lightbox = document.getElementById('gouniLightbox');
  if (!lightbox) return;
  lightbox.classList.remove('active');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function updateGouniLightboxContent() {
  const key = gouniScreenKeys[currentGouniScreenIndex];
  const data = gouniScreensData[key];
  if (!data) return;

  const img = document.getElementById('gouniLightboxImg');
  const badge = document.getElementById('gouniLightboxBadge');
  const title = document.getElementById('gouniLightboxTitle');
  const desc = document.getElementById('gouniLightboxDesc');
  const patterns = document.getElementById('gouniLightboxPatterns');
  const tokens = document.getElementById('gouniLightboxTokens');

  if (img) {
    img.src = data.src;
    img.alt = data.title;
  }
  if (badge) badge.textContent = data.badge;
  if (title) title.textContent = data.title;
  if (desc) desc.textContent = data.desc;
  if (patterns) patterns.textContent = data.patterns;
  if (tokens) tokens.textContent = data.tokens;
}

// Attach click and keyboard listeners to phone mockups and gallery cards
document.querySelectorAll('.gouni-phone-mockup, .inside-screen-card').forEach(item => {
  item.addEventListener('click', () => {
    const screenId = item.dataset.screenId;
    if (screenId) {
      openGouniLightbox(screenId);
    }
  });
  item.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const screenId = item.dataset.screenId;
      if (screenId) {
        openGouniLightbox(screenId);
      }
    }
  });
});

// Lightbox Controls
const gouniCloseBtn = document.getElementById('gouniLightboxClose');
const gouniBackdrop = document.getElementById('gouniLightboxBackdrop');
const gouniPrevBtn = document.getElementById('gouniLightboxPrev');
const gouniNextBtn = document.getElementById('gouniLightboxNext');

if (gouniCloseBtn) gouniCloseBtn.addEventListener('click', closeGouniLightbox);
if (gouniBackdrop) gouniBackdrop.addEventListener('click', closeGouniLightbox);

if (gouniPrevBtn) {
  gouniPrevBtn.addEventListener('click', () => {
    currentGouniScreenIndex = (currentGouniScreenIndex - 1 + gouniScreenKeys.length) % gouniScreenKeys.length;
    updateGouniLightboxContent();
  });
}
if (gouniNextBtn) {
  gouniNextBtn.addEventListener('click', () => {
    currentGouniScreenIndex = (currentGouniScreenIndex + 1) % gouniScreenKeys.length;
    updateGouniLightboxContent();
  });
}

document.addEventListener('keydown', (e) => {
  const lightbox = document.getElementById('gouniLightbox');
  if (lightbox && lightbox.classList.contains('active')) {
    if (e.key === 'Escape') {
      closeGouniLightbox();
    } else if (e.key === 'ArrowLeft') {
      currentGouniScreenIndex = (currentGouniScreenIndex - 1 + gouniScreenKeys.length) % gouniScreenKeys.length;
      updateGouniLightboxContent();
    } else if (e.key === 'ArrowRight') {
      currentGouniScreenIndex = (currentGouniScreenIndex + 1) % gouniScreenKeys.length;
      updateGouniLightboxContent();
    }
  }
});

// Gentle scroll entrance for GoUni overlapping phone mockups
const gouniPhonesStage = document.getElementById('gouniPhonesStage');
if (gouniPhonesStage && 'IntersectionObserver' in window) {
  const phoneMockups = gouniPhonesStage.querySelectorAll('.gouni-phone-mockup');
  phoneMockups.forEach((phone, idx) => {
    phone.style.opacity = '0';
    phone.style.transition = `transform 0.65s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 0.08}s, opacity 0.5s ease ${idx * 0.08}s, filter 0.4s ease`;
  });

  const phonesObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        phoneMockups.forEach(phone => {
          phone.style.opacity = '1';
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  phonesObserver.observe(gouniPhonesStage);
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
      caption: '<strong>Real Academic Artifact:</strong> Concentric Healing Circle architecture separating the inner physical recovery sanctuary (Debrief zones, micro-rituals, peer circles) from the outer organizational layer.'
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

// 10. Interactive Figma Token & Component Sandbox (Both Homepage & Playground)
const initTokenSandbox = () => {
  const statePills = document.querySelectorAll('#statePills .sandbox-btn-pill');
  const colorSwatches = document.querySelectorAll('#colorSwatches .swatch-item-btn, #colorSwatches .swatch-circle');
  const densityPills = document.querySelectorAll('#densityPills .sandbox-btn-pill');
  const demoCard = document.getElementById('demoCard');
  const demoBtn = document.getElementById('sandboxDemoBtn');
  const demoTokenName = document.getElementById('demoTokenName');
  const demoStateBadge = document.getElementById('demoStateBadge');
  const demoHexBadge = document.getElementById('demoHexBadge');
  const demoBtnIcon = document.getElementById('demoBtnIcon');
  const demoBtnLabel = document.getElementById('demoBtnLabel');
  const demoBtnArrow = document.getElementById('demoBtnArrow');
  const inspectorCode = document.getElementById('inspectorCode');
  const copyCssBtn = document.getElementById('copyCssBtn');

  if (!demoCard || !demoBtn) return;

  let currentState = 'default';
  let currentColor = '#DF4A7A';
  let currentTokenName = '$color-chic-rose';
  let currentPadding = '14px 28px';

  const updateSandbox = () => {
    demoBtn.style.background = currentColor;
    demoBtn.style.padding = currentPadding;

    if (currentState === 'hover') {
      demoBtn.style.opacity = '0.92';
      demoBtn.style.transform = 'translateY(-3px)';
      demoBtn.style.boxShadow = `0 10px 28px ${currentColor}77`;
      demoBtn.style.cursor = 'pointer';
      if (demoStateBadge) demoStateBadge.textContent = 'STATE: HOVER';
      if (demoBtnLabel) demoBtnLabel.textContent = 'Explore Prototype';
      if (demoBtnIcon) demoBtnIcon.textContent = '↗';
      if (demoBtnArrow) demoBtnArrow.textContent = '→';
    } else if (currentState === 'active') {
      demoBtn.style.opacity = '1';
      demoBtn.style.transform = 'scale(0.96) translateY(1px)';
      demoBtn.style.boxShadow = `0 2px 6px ${currentColor}44`;
      demoBtn.style.cursor = 'pointer';
      if (demoStateBadge) demoStateBadge.textContent = 'STATE: ACTIVE';
      if (demoBtnLabel) demoBtnLabel.textContent = 'Pressed (Active)';
      if (demoBtnIcon) demoBtnIcon.textContent = '✓';
      if (demoBtnArrow) demoBtnArrow.textContent = '✓';
    } else if (currentState === 'loading') {
      demoBtn.style.opacity = '0.78';
      demoBtn.style.transform = 'none';
      demoBtn.style.boxShadow = 'none';
      demoBtn.style.cursor = 'wait';
      if (demoStateBadge) demoStateBadge.textContent = 'STATE: LOADING';
      if (demoBtnLabel) demoBtnLabel.textContent = 'Syncing Tokens...';
      if (demoBtnIcon) demoBtnIcon.textContent = '⟳';
      if (demoBtnArrow) demoBtnArrow.textContent = '...';
    } else if (currentState === 'disabled') {
      demoBtn.style.opacity = '0.40';
      demoBtn.style.transform = 'none';
      demoBtn.style.boxShadow = 'none';
      demoBtn.style.cursor = 'not-allowed';
      if (demoStateBadge) demoStateBadge.textContent = 'STATE: DISABLED';
      if (demoBtnLabel) demoBtnLabel.textContent = 'Action Disabled';
      if (demoBtnIcon) demoBtnIcon.textContent = '⊘';
      if (demoBtnArrow) demoBtnArrow.textContent = '—';
    } else {
      demoBtn.style.opacity = '1';
      demoBtn.style.transform = 'none';
      demoBtn.style.boxShadow = `0 4px 16px ${currentColor}55`;
      demoBtn.style.cursor = 'pointer';
      if (demoStateBadge) demoStateBadge.textContent = 'STATE: DEFAULT';
      if (demoBtnLabel) demoBtnLabel.textContent = 'Explore Prototype';
      if (demoBtnIcon) demoBtnIcon.textContent = '→';
      if (demoBtnArrow) demoBtnArrow.textContent = '→';
    }

    if (demoTokenName) {
      demoTokenName.textContent = currentTokenName;
    }

    if (demoHexBadge) {
      demoHexBadge.textContent = `HEX: ${currentColor.toUpperCase()}`;
    }

    if (inspectorCode) {
      inspectorCode.textContent = `/* Figma Design Token Spec */
.btn-primary {
  --btn-bg: ${currentColor};
  --btn-token: ${currentTokenName};
  padding: ${currentPadding};
  border-radius: 999px;
  font-family: 'DM Sans', -apple-system, sans-serif;
  font-weight: 600;
  border: 1px solid var(--line);
  box-shadow: 0 4px 16px rgba(56, 36, 62, 0.12);
  /* Active Variant State: ${currentState} */
}

/* State Pseudo-class */
.btn-primary:${currentState === 'hover' ? 'hover' : currentState === 'active' ? 'active' : currentState === 'disabled' ? 'disabled' : 'focus'} {
  transform: ${currentState === 'hover' ? 'translateY(-3px)' : currentState === 'active' ? 'scale(0.96)' : 'none'};
  opacity: ${currentState === 'disabled' ? '0.40' : currentState === 'loading' ? '0.78' : '1'};
}`;
    }
  };

  const setState = (st) => {
    currentState = st;
    statePills.forEach(p => {
      if (p.dataset.state === st) p.classList.add('active');
      else p.classList.remove('active');
    });
    updateSandbox();
  };

  statePills.forEach(pill => {
    pill.addEventListener('click', () => {
      setState(pill.dataset.state);
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

  // Direct Two-Way Component Interactions on Stage Button
  demoBtn.addEventListener('mouseenter', () => {
    if (currentState === 'default') {
      setState('hover');
    }
  });

  demoBtn.addEventListener('mouseleave', () => {
    if (currentState === 'hover') {
      setState('default');
    }
  });

  demoBtn.addEventListener('mousedown', () => {
    if (currentState !== 'disabled' && currentState !== 'loading') {
      setState('active');
    }
  });

  demoBtn.addEventListener('mouseup', () => {
    if (currentState === 'active') {
      setState('hover');
    }
  });

  // Copy CSS Action
  if (copyCssBtn && inspectorCode) {
    copyCssBtn.addEventListener('click', () => {
      const codeText = inspectorCode.textContent;
      navigator.clipboard.writeText(codeText).then(() => {
        copyCssBtn.classList.add('copied');
        const originalHtml = copyCssBtn.innerHTML;
        copyCssBtn.innerHTML = '<span>✓ Copied!</span>';
        if (typeof showToast === 'function') {
          showToast('CSS Token Spec copied to clipboard!');
        }
        setTimeout(() => {
          copyCssBtn.classList.remove('copied');
          copyCssBtn.innerHTML = originalHtml;
        }, 2200);
      }).catch(() => {
        if (typeof showToast === 'function') {
          showToast('Code copied to clipboard!');
        }
      });
    });
  }

  updateSandbox();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTokenSandbox);
} else {
  initTokenSandbox();
}

// 11. Page Entrance Transition
const markPageLoaded = () => {
  document.body.classList.add('page-loaded');
};
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', markPageLoaded);
} else {
  markPageLoaded();
}

// 12. Hero Portrait Interactive Parallax & 3D Tilt
const heroSection = document.getElementById('hero');
const portraitCard = document.querySelector('.portrait-editorial-card');
if (heroSection && portraitCard && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  let heroTargetX = 0, heroTargetY = 0;
  let heroCurrentX = 0, heroCurrentY = 0;
  let isHoveringHero = false;

  heroSection.addEventListener('mousemove', (e) => {
    const rect = heroSection.getBoundingClientRect();
    const normX = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const normY = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    heroTargetX = normX * 14;
    heroTargetY = normY * 12;
    isHoveringHero = true;
  });

  heroSection.addEventListener('mouseleave', () => {
    heroTargetX = 0;
    heroTargetY = 0;
    isHoveringHero = false;
  });

  const updateHeroParallax = () => {
    heroCurrentX += (heroTargetX - heroCurrentX) * 0.1;
    heroCurrentY += (heroTargetY - heroCurrentY) * 0.1;
    if (Math.abs(heroCurrentX) > 0.05 || Math.abs(heroCurrentY) > 0.05 || isHoveringHero) {
      portraitCard.style.transform = `perspective(1000px) rotateY(${heroCurrentX * 0.45}deg) rotateX(${-heroCurrentY * 0.45}deg) translate3d(${heroCurrentX * 0.4}px, ${heroCurrentY * 0.4}px, 0)`;
    } else {
      portraitCard.style.transform = '';
    }
    requestAnimationFrame(updateHeroParallax);
  };
  requestAnimationFrame(updateHeroParallax);
}

// 13. Playground Lab Image Interactive Cursor Response
const playgroundCards = document.querySelectorAll('.playground-card');
if (playgroundCards.length && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  playgroundCards.forEach(card => {
    const previewImg = card.querySelector('.playground-preview-frame img');
    if (!previewImg) return;

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const normX = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const normY = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
      previewImg.style.transform = `scale(1.06) translate3d(${normX * 6}px, ${normY * 6}px, 0)`;
    });

    card.addEventListener('mouseleave', () => {
      previewImg.style.transform = '';
    });
  });
}

// 14. Staggered Scroll Reveal Animations
const revealElements = document.querySelectorAll('.project-editorial-card, .skills-category-card, .timeline-card, .passion-card, .playground-card, .section-header');
if ('IntersectionObserver' in window && revealElements.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  revealElements.forEach((el, index) => {
    el.classList.add('reveal-on-scroll');
    el.style.setProperty('--stagger', (index % 4).toString());
    observer.observe(el);
  });
}

// 15. Accessible Restrained Interactions
// (Particle bursts removed to preserve editorial studio focus)

// 16. Smooth Offset Scroll for On-Page Anchor Links
document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href').slice(1);
    const target = document.getElementById(targetId);
    if (target) {
      e.preventDefault();
      const navHeight = 80;
      const targetPos = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
      window.scrollTo({
        top: targetPos,
        behavior: 'smooth'
      });
    }
  });
});
