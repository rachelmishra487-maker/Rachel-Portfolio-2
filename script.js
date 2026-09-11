// Footer year
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// Active nav link highlight based on current page
const currentPath = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPath || (currentPath === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

// Decorative cursor dot (desktop only — CSS already hides it on touch devices)
const cursorDot = document.getElementById('cursorDot');
if (cursorDot && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  window.addEventListener('mousemove', (e) => {
    cursorDot.style.opacity = '1';
    cursorDot.style.left = e.clientX + 'px';
    cursorDot.style.top = e.clientY + 'px';
  });
}

// Contact form (only runs on contact.html)
const form = document.getElementById('contactForm');
if (form) {
  const status = document.getElementById('formStatus');
  const CONTACT_EMAIL = 'rachelmishra487@gmail.com';

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) {
      if (status) status.textContent = 'Please fill in every field.';
      return;
    }

    const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;

    if (status) status.textContent = 'Opening your email app…';
    form.reset();
  });
}

