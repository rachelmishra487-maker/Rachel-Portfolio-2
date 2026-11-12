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

// 7. COMPREHENSIVE PROJECT SCREEN & SYSTEMS DATABASE FOR ALL CASE STUDIES
const projectScreenRegistry = {
  // ===================== GOUNI =====================
  onboarding: {
    project: 'gouni',
    src: 'project_gouni_screen_onboarding.svg',
    badge: 'GOUNI · ONBOARDING & PERSONALIZATION',
    title: 'Student Onboarding & Country Preference',
    desc: 'Low-friction onboarding flow establishing candidate country targets (UK, Germany, Canada), academic background (B.Des / B.Tech), and intake timelines to generate tailored recommendations.',
    patterns: 'Segmented country chips, degree selector, floating CTA, progress stepper',
    tokens: 'Peach Cream Surface (#FFF2DE), Brand Orange (#FF633E), Deep Plum (#30232D)',
    viewport: 'iPhone 16 Pro (393 × 852 pt)',
    isDesktop: false
  },
  discovery: {
    project: 'gouni',
    src: 'project_gouni_screen_discovery.svg',
    badge: 'GOUNI · DISCOVERY & SEARCH',
    title: 'University & Course Discovery',
    desc: 'Structured multi-country filtering, live search autocomplete, QS World Rankings, and estimated tuition fees to eliminate multi-tab comparison fatigue.',
    patterns: 'Horizontal filter pills, university cards, comparative badges, fee calculator',
    tokens: 'Active Orange (#FF6B35), Neutral Border (#EAE5DF), Surface Elevated (#FFFFFF)',
    viewport: 'iPhone 16 Pro (393 × 852 pt)',
    isDesktop: false
  },
  details: {
    project: 'gouni',
    src: 'project_gouni_screen_details.svg',
    badge: 'GOUNI · UNIVERSITY DETAILS',
    title: 'Academic Thresholds & Living Costs',
    desc: 'Comprehensive university specifications for University of Toronto: GPA & IELTS requirements with eligibility checks, living cost breakdown, and single-click checklist enrollment.',
    patterns: 'Key metrics strip, accordion criteria cards, living cost breakdown, sticky application CTA',
    tokens: 'Purple Accent (#2D1537), Success Green (#10B981), Orange Primary (#FF6B35)',
    viewport: 'iPhone 16 Pro (393 × 852 pt)',
    isDesktop: false
  },
  dashboard: {
    project: 'gouni',
    src: 'project_gouni_screen_dashboard.svg',
    badge: 'GOUNI · ROADMAP & DASHBOARD',
    title: 'Student Dashboard & Departure Roadmap',
    desc: 'Centralized student command center featuring departure readiness progress (52%), multi-university application tracker (Imperial, TU Munich), and urgent milestone notifications.',
    patterns: 'Progress ring/bar, multi-state status badges, actionable deadline cards, bottom tab-bar',
    tokens: 'Brand Orange (#FF6B35), Success Green (#10B981), Dark Plum Text (#1E1915)',
    viewport: 'iPhone 16 Pro (393 × 852 pt)',
    isDesktop: false
  },
  documents: {
    project: 'gouni',
    src: 'project_gouni_screen_documents.svg',
    badge: 'GOUNI · DOCUMENT VAULT',
    title: 'Document Upload & Verification Hub',
    desc: 'Secure academic credential vault with automatic verification tracking, passport validity checks, SOP review statuses, and banking solvency compliance alerts.',
    patterns: 'Progress indicators, verification badges, secure upload dropzones, file preview modals',
    tokens: 'Verified Green (#10B981), Pending Amber (#F59E0B), Border Default (#EAE5DF)',
    viewport: 'iPhone 16 Pro (393 × 852 pt)',
    isDesktop: false
  },
  visa: {
    project: 'gouni',
    src: 'project_gouni_screen_visa.svg',
    badge: 'GOUNI · VISA GUIDANCE',
    title: 'Visa Guidance & Compliance Hub',
    desc: 'Demystifying UK Student Route & Canadian SDS visa requirements: CAS code tracking, biometric appointment scheduling, and maintenance fund calculators ($1,334/mo).',
    patterns: 'Step-by-step compliance checklist, currency conversion helper, biometric appointment booking',
    tokens: 'Warning Amber (#F59E0B), Brand Orange (#FF6B35), Neutral Surface (#FFFFFF)',
    viewport: 'iPhone 16 Pro (393 × 852 pt)',
    isDesktop: false
  },
  accommodation: {
    project: 'gouni',
    src: 'project_gouni_screen_accommodation.svg',
    badge: 'GOUNI · ACCOMMODATION',
    title: 'Student Housing & Dormitory Finder',
    desc: 'Curated on-campus university halls and vetted private student apartments sorted by commute distance to faculties, weekly budget, and verified roommate compatibility.',
    patterns: 'Filter pills (Ensuite, Budget), distance-to-faculty badges, escrow verification badge',
    tokens: 'Brand Orange (#FF6B35), Success Pill (#10B981), Surface Card (#FFFFFF)',
    viewport: 'iPhone 16 Pro (393 × 852 pt)',
    isDesktop: false
  },
  community: {
    project: 'gouni',
    src: 'project_gouni_screen_community.svg',
    badge: 'GOUNI · COHORT COMMUNITY',
    title: 'Student Community & Peer Network',
    desc: 'Connecting incoming international students with city cohort discussion channels, flatmate matching, flight sharing, and verified senior student alumni mentors.',
    patterns: 'Cohort discussion feed, verified student badge, direct peer messaging, event countdown',
    tokens: 'Community Purple (#76518E), Brand Orange (#FF6B35), Surface Light (#FAF9F6)',
    viewport: 'iPhone 16 Pro (393 × 852 pt)',
    isDesktop: false
  },

  // ===================== THE HEALING CIRCLE =====================
  'hc-mobile': {
    project: 'healing',
    src: 'project_healing_circle_mobile.svg',
    badge: 'THE HEALING CIRCLE · CLINICAL COMPANION',
    title: 'Doctor Shift Decompression & Micro-Rituals',
    desc: 'Low-cognitive-load smartphone application built for hospital physicians on active duty: 1-min vagus nerve breathing reset, soundscape debriefing, cognitive saturation telemetry, and Sanctuary Pod bookings.',
    patterns: 'Vagal nerve reset wheel, cognitive load gauge, acoustic soundscape player, 1-tap debrief pod booking',
    tokens: 'Clinical Lime (#D4FF00), Electric Violet (#76518E), Dark Ambient (#0E1116)',
    viewport: 'iPhone 16 Pro (393 × 852 pt)',
    isDesktop: false
  },
  'hc-dashboard': {
    project: 'healing',
    src: 'project_healing_circle_dashboard.svg',
    badge: 'THE HEALING CIRCLE · HOSPITAL TELEMETRY',
    title: 'Clinical Staff Cognitive Load & Burnout Telemetry',
    desc: 'High-density administrative telemetry dashboard designed for ICU and emergency medicine department heads, tracking physician shift saturation, mandatory debrief compliance, and restorative pod occupancy in real time.',
    patterns: 'Ward saturation meters, Code Blue stress telemetry, debrief room occupancy grid, nurse/doctor shift distribution',
    tokens: 'Hospital Status Lime (#D4FF00), Warning Amber (#F59E0B), Critical Red (#EF4444), Dark Surface (#111620)',
    viewport: 'Desktop Hospital Dashboard (1200 × 800 px)',
    isDesktop: true
  },
  'hc-rituals': {
    project: 'healing',
    src: 'project_healing_circle_rituals.svg',
    badge: 'THE HEALING CIRCLE · SPATIAL BLUEPRINT',
    title: 'Physical Debrief Sanctuary & 4 Clinical Micro-Rituals',
    desc: 'Architectural specifications for sound-dampened hospital recovery pods featuring 2700K indirect circadian lighting, tactile weighted grounding stones, biophilic greens, and structured non-digital decompression rituals.',
    patterns: 'Circadian lighting timeline, acoustic dampening blueprint, tactile sensory anchors, 4-step debrief protocol',
    tokens: 'Warm Amber (2700K), Deep Plum (#38243E), Restorative Sage (#4E6B50)',
    viewport: 'Systems Design Blueprint',
    isDesktop: true
  },
  'hc-interviews': {
    project: 'healing',
    src: 'project_healing_circle_interviews.svg',
    badge: 'THE HEALING CIRCLE · FIELD RESEARCH',
    title: 'Doctor Qualitative Research & Persona Synthesis',
    desc: 'Contextual qualitative inquiries conducted with clinical specialists (Dr. Bhushan, Gastroenterology; Dr. Anushka, Pediatrics; Dr. Vipul, Forensic Medicine) documenting coping strategies, administrative overload, and acute screen aversion.',
    patterns: 'Qualitative affinity clusters, clinician empathy matrices, cognitive overload journey curves',
    tokens: 'Soft Blush (#F7E9E9), Muted Mauve (#76518E), Deep Plum (#38243E)',
    viewport: 'Qualitative Research Synthesis',
    isDesktop: true
  },
  'hc-concept': {
    project: 'healing',
    src: 'project_healing_circle_concept.svg',
    badge: 'THE HEALING CIRCLE · ECOSYSTEM ARCHITECTURE',
    title: 'Concentric Well-being Ecosystem Architecture',
    desc: 'System model establishing the boundary between inner non-digital physical decompression (sacred personal space) and outer institutional support layers.',
    patterns: 'Concentric systems topology, boundary protection protocols, multi-tier touchpoint mapping',
    tokens: 'Ivory Base (#F8F3EA), Dusty Rose (#D85C85), Muted Mauve (#76518E)',
    viewport: 'Ecosystem Architecture Model',
    isDesktop: true
  },
  'hc-flow': {
    project: 'healing',
    src: 'project_healing_circle_flow.svg',
    badge: 'THE HEALING CIRCLE · JOURNEY MAP',
    title: '5-Stage Clinical Recovery & Recalibration Flow',
    desc: 'End-to-end journey mapping from critical clinical trauma event (Code Blue, patient loss) through automated peer prompt, sanctuary pause, reflective debrief, and long-term shift load recalibration.',
    patterns: 'Emotional valence curve, trauma intervention triggers, institutional feedback loops',
    tokens: 'Deep Plum (#38243E), Burnt Orange (#E97845), Warm Ivory (#F8F3EA)',
    viewport: 'Service Design Flow',
    isDesktop: true
  },

  // ===================== PAWBRIDGE =====================
  'pb-operations': {
    project: 'pawbridge',
    src: 'project_pawbridge.png',
    badge: 'PAWBRIDGE · OPERATIONS OS',
    title: 'Shelter Operations OS & Live Intake Triage',
    desc: 'High-density desktop application (1440×1024) designed for shelter intake managers: keyboard-first triage shortcut execution, real-time kennel capacity allocation, and medical isolation tracking.',
    patterns: 'Keyboard-first triage shortcuts, live kennel grid matrix, patient intake stepper, multi-tab medical chart',
    tokens: 'Forest Green (#2E4032), Terracotta (#E97845), Surface Crisp (#FAF9F6)',
    viewport: 'Desktop High-Density (1440 × 1024 px)',
    isDesktop: true
  },
  'pb-verification': {
    project: 'pawbridge',
    src: 'project_pawbridge_verification.svg',
    badge: 'PAWBRIDGE · GOVERNANCE & AUDIT',
    title: 'NGO Trust & AWBI Verification Audit Engine',
    desc: 'Full governance and verification dashboard linking veterinary clinic bills, Animal Welfare Board of India (AWBI) certifications, and 12A/80G tax receipt disbursements to public transparency reports.',
    patterns: 'Audit checklist stepper, blockchain expense hash verification, multi-tier credential badges',
    tokens: 'Trust Emerald (#10B981), Amber Review (#F59E0B), Charcoal Surface (#243026)',
    viewport: 'Desktop Governance Portal (1200 × 800 px)',
    isDesktop: true
  },
  'pb-rescue': {
    project: 'pawbridge',
    src: 'project_pawbridge_mobile.svg',
    badge: 'PAWBRIDGE · MOBILE FIELD RESCUE',
    title: 'SOS Field Rescue & Trauma Triage Mobile App',
    desc: 'Critical field ambulance mobile application featuring live radar GPS beacon tracking, severe trauma scoring (Grade 1-4), emergency ambulance dispatch, and quick photo intake.',
    patterns: 'Live GPS radar pulse, one-tap emergency ambulance dispatch, veterinary triage category pills',
    tokens: 'Emergency Red (#EF4444), Tactical Forest (#243026), Titanium Chassis (#E8E2D8)',
    viewport: 'iPhone 16 Pro (393 × 852 pt)',
    isDesktop: false
  },
  'pb-psychology': {
    project: 'pawbridge',
    src: 'project_pawbridge_presentation.png',
    badge: 'PAWBRIDGE · USER RESEARCH',
    title: 'Supporter Psychology & Donor Hesitation Study',
    desc: 'Empirical user research analyzing psychological barriers that prevent animal lovers from donating: lack of outcome visibility, fake NGOs, and emotional desensitization.',
    patterns: 'Donor psychological barrier funnel, trust milestone taxonomy, evidence disclosure framework',
    tokens: 'Warm Ivory (#F8F3EA), Muted Mauve (#76518E), Deep Plum (#38243E)',
    viewport: 'Research Deck (1440 × 900 px)',
    isDesktop: true
  },

  // ===================== SKILL INDIA DIGITAL =====================
  'si-comparison': {
    project: 'skillindia',
    src: 'project_skill_india_comparison.svg',
    badge: 'SKILL INDIA · A/B USABILITY BENCHMARK',
    title: 'Skill India Digital — Before vs. After Usability Study',
    desc: 'Empirically tested redesign comparing Version A (legacy bureaucratic portal) against Version B (task-first redesigned portal): Task completion time reduced from 4.4 min to 2.04 min (-54%), task success increased from 60% to 100%, and enrollment drop-off reduced from 40% to 0%.',
    patterns: 'Side-by-side heuristic evaluation, task completion delta meters, visual bug taxonomy, usability testing metrics',
    tokens: 'Success Emerald (#10B981), Error Red (#EF4444), Primary Orange (#FF6B35)',
    viewport: 'A/B Usability Benchmark Study (1300 × 840 px)',
    isDesktop: true
  },
  'si-portal': {
    project: 'skillindia',
    src: 'project_skill_india.svg',
    badge: 'SKILL INDIA · NATIONAL PORTAL',
    title: 'Redesigned National Vocational Discovery Portal',
    desc: 'Task-driven, search-first national portal interface dismantling cognitive friction for non-tech-savvy learners across 12 official Indian languages, with NSQF Level 4/5 filtering and verified training center badges.',
    patterns: 'Task-based quick search bar, 12-language localization switch, NSQF level filter pills, verified training center badge',
    tokens: 'National Orange (#FF6B35), Deep Plum (#1C1814), Light Surface (#FAF8F5)',
    viewport: 'Desktop Portal Interface (1200 × 800 px)',
    isDesktop: true
  },
  'si-course': {
    project: 'skillindia',
    src: 'project_skill_india_course.svg',
    badge: 'SKILL INDIA · COURSE & STIPEND HUB',
    title: 'NSQF Course Details & ₹8,000/mo DBT Stipend Breakdown',
    desc: 'Course enrollment page for Solar PV Installer highlighting transparent curriculum breakdown (70% practical, 30% theory), direct benefit transfer (DBT) stipend disclosures, and 1-click DigiLocker application flow.',
    patterns: 'Stipend transparency badge, practical vs theory curriculum meter, training center metro proximity, 1-click DigiLocker apply',
    tokens: 'Stipend Emerald (#10B981), High-Employability Orange (#FF6B35), Deep Charcoal (#1C1814)',
    viewport: 'Desktop Course Hub (1200 × 800 px)',
    isDesktop: true
  },
  'si-mobile': {
    project: 'skillindia',
    src: 'project_skill_india_mobile.svg',
    badge: 'SKILL INDIA · MOBILE APPRENTICE APP',
    title: 'Mobile Vocational Discovery & DigiLocker Flow',
    desc: 'Accessible smartphone interface tailored for emerging tradespeople in tier-2 and tier-3 towns, featuring Hindi/regional voice search, instant DBT stipend calculator, and Aadhaar biometric KYC sync.',
    patterns: 'Regional language switch, guaranteed stipend calculator card, trade discovery feed, bottom navigation',
    tokens: 'Brand Orange (#FF6B35), DigiLocker Green (#10B981), Warm Surface (#FAF8F5)',
    viewport: 'iPhone 16 Pro (393 × 852 pt)',
    isDesktop: false
  }
};

// Project Groups for Next/Prev Navigation
const projectGroups = {
  gouni: ['onboarding', 'discovery', 'details', 'dashboard', 'documents', 'visa', 'accommodation', 'community'],
  healing: ['hc-mobile', 'hc-dashboard', 'hc-rituals', 'hc-interviews', 'hc-concept', 'hc-flow'],
  pawbridge: ['pb-operations', 'pb-verification', 'pb-rescue', 'pb-psychology'],
  skillindia: ['si-comparison', 'si-portal', 'si-course', 'si-mobile']
};

let currentActiveGroup = 'gouni';
let currentActiveScreenIndex = 0;

// Ensure lightbox modal is closed on page load
const initialLightbox = document.getElementById('gouniLightbox');
if (initialLightbox) {
  initialLightbox.classList.remove('active');
  initialLightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function openProjectLightbox(screenId) {
  const lightbox = document.getElementById('gouniLightbox');
  if (!lightbox) return;

  const data = projectScreenRegistry[screenId];
  if (!data) return;

  currentActiveGroup = data.project || 'gouni';
  const groupList = projectGroups[currentActiveGroup] || Object.keys(projectScreenRegistry);
  const foundIndex = groupList.indexOf(screenId);
  currentActiveScreenIndex = foundIndex !== -1 ? foundIndex : 0;

  updateProjectLightboxContent();
  lightbox.classList.add('active');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeProjectLightbox() {
  const lightbox = document.getElementById('gouniLightbox');
  if (!lightbox) return;
  lightbox.classList.remove('active');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function updateProjectLightboxContent() {
  const groupList = projectGroups[currentActiveGroup] || Object.keys(projectScreenRegistry);
  const key = groupList[currentActiveScreenIndex];
  const data = projectScreenRegistry[key];
  if (!data) return;

  const img = document.getElementById('gouniLightboxImg');
  const badge = document.getElementById('gouniLightboxBadge');
  const title = document.getElementById('gouniLightboxTitle');
  const desc = document.getElementById('gouniLightboxDesc');
  const viewport = document.getElementById('gouniLightboxViewport');
  const patterns = document.getElementById('gouniLightboxPatterns');
  const tokens = document.getElementById('gouniLightboxTokens');

  if (img) {
    img.src = data.src;
    img.alt = data.title;
    if (data.isDesktop) {
      img.classList.add('desktop-mode');
    } else {
      img.classList.remove('desktop-mode');
    }
  }
  if (badge) badge.textContent = data.badge;
  if (title) title.textContent = data.title;
  if (desc) desc.textContent = data.desc;
  if (viewport) viewport.textContent = data.viewport;
  if (patterns) patterns.textContent = data.patterns;
  if (tokens) tokens.textContent = data.tokens;
}

// Attach click and keyboard listeners to all interactive mockups and screen cards
document.querySelectorAll('[data-screen-id]').forEach(item => {
  item.addEventListener('click', () => {
    const screenId = item.dataset.screenId;
    if (screenId) {
      openProjectLightbox(screenId);
    }
  });
  item.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const screenId = item.dataset.screenId;
      if (screenId) {
        openProjectLightbox(screenId);
      }
    }
  });
});

// Lightbox Controls
const projectCloseBtn = document.getElementById('gouniLightboxClose');
const projectBackdrop = document.getElementById('gouniLightboxBackdrop');
const projectPrevBtn = document.getElementById('gouniLightboxPrev');
const projectNextBtn = document.getElementById('gouniLightboxNext');

if (projectCloseBtn) projectCloseBtn.addEventListener('click', closeProjectLightbox);
if (projectBackdrop) projectBackdrop.addEventListener('click', closeProjectLightbox);

if (projectPrevBtn) {
  projectPrevBtn.addEventListener('click', () => {
    const groupList = projectGroups[currentActiveGroup] || Object.keys(projectScreenRegistry);
    currentActiveScreenIndex = (currentActiveScreenIndex - 1 + groupList.length) % groupList.length;
    updateProjectLightboxContent();
  });
}
if (projectNextBtn) {
  projectNextBtn.addEventListener('click', () => {
    const groupList = projectGroups[currentActiveGroup] || Object.keys(projectScreenRegistry);
    currentActiveScreenIndex = (currentActiveScreenIndex + 1) % groupList.length;
    updateProjectLightboxContent();
  });
}

document.addEventListener('keydown', (e) => {
  const lightbox = document.getElementById('gouniLightbox');
  if (lightbox && lightbox.classList.contains('active')) {
    if (e.key === 'Escape') {
      closeProjectLightbox();
    } else if (e.key === 'ArrowLeft') {
      const groupList = projectGroups[currentActiveGroup] || Object.keys(projectScreenRegistry);
      currentActiveScreenIndex = (currentActiveScreenIndex - 1 + groupList.length) % groupList.length;
      updateProjectLightboxContent();
    } else if (e.key === 'ArrowRight') {
      const groupList = projectGroups[currentActiveGroup] || Object.keys(projectScreenRegistry);
      currentActiveScreenIndex = (currentActiveScreenIndex + 1) % groupList.length;
      updateProjectLightboxContent();
    }
  }
});

// Phone mockups visibility and entrance
const gouniPhonesStage = document.getElementById('gouniPhonesStage');
if (gouniPhonesStage) {
  const phoneMockups = gouniPhonesStage.querySelectorAll('.gouni-phone-mockup');
  phoneMockups.forEach(phone => {
    phone.style.opacity = '1';
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
