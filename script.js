// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// Decorative cursor dot (desktop only — CSS already hides it on touch devices)
const cursorDot = document.getElementById('cursorDot');
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  window.addEventListener('mousemove', (e) => {
    cursorDot.style.opacity = '1';
    cursorDot.style.left = e.clientX + 'px';
    cursorDot.style.top = e.clientY + 'px';
  });
}

// Contact form
// This is a static site with no backend, so the form opens the visitor's
// email client with a pre-filled message addressed to you.
//
// To receive messages directly into your inbox without opening an email
// client, sign up at https://formspree.io (free), replace the form's
// behaviour below with a real POST to your Formspree endpoint, and remove
// the mailto fallback.
const form = document.getElementById('contactForm');
const status = document.getElementById('formStatus');
const CONTACT_EMAIL = 'rachelmishra487@gmail.com';

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!name || !email || !message) {
    status.textContent = 'Please fill in every field.';
    return;
  }

  const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
  const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;

  status.textContent = 'Opening your email app…';
  form.reset();
});
