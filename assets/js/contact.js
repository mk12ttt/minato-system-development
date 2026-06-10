const form = document.getElementById('contactForm');
if (!form) throw new Error('no form');

const rules = {
  name:     { el: document.getElementById('name'),     err: document.getElementById('nameError'),     check: v => v.trim().length > 0 },
  email:    { el: document.getElementById('email'),    err: document.getElementById('emailError'),    check: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
  category: { el: document.getElementById('category'), err: document.getElementById('categoryError'), check: v => v !== '' },
  message:  { el: document.getElementById('message'),  err: document.getElementById('messageError'),  check: v => v.trim().length > 10 },
  privacy:  { el: document.getElementById('privacy'),  err: document.getElementById('privacyError'),  check: v => document.getElementById('privacy').checked },
};

function validate(key) {
  const r = rules[key];
  const ok = r.check(r.el.value);
  r.el.classList.toggle('error', !ok);
  r.err.classList.toggle('visible', !ok);
  return ok;
}

// Validate on blur
Object.keys(rules).forEach(key => {
  rules[key].el.addEventListener('blur', () => validate(key));
  rules[key].el.addEventListener('input', () => {
    if (rules[key].el.classList.contains('error')) validate(key);
  });
});

form.addEventListener('submit', e => {
  e.preventDefault();
  const allValid = Object.keys(rules).map(validate).every(Boolean);
  if (!allValid) return;

  const btn = document.getElementById('submitBtn');
  btn.disabled = true;
  btn.textContent = '送信中...';

  // Simulate send (replace with actual fetch/FormSubmit/Netlify etc.)
  setTimeout(() => {
    form.style.display = 'none';
    document.getElementById('successMessage').classList.add('visible');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 1000);
});
