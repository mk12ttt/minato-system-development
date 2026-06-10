// Header scroll effect
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
});

// Hamburger menu
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');
hamburger.addEventListener('click', () => {
  nav.classList.toggle('open');
});
nav.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => nav.classList.remove('open'));
});

// Scroll reveal
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Add reveal classes dynamically
document.querySelectorAll([
  '.label', '.section-title', '.service__card',
  '.works__info', '.works__visual',
  '.philosophy__heading', '.philosophy__body',
  '.split-section__content',
  '.message h2', '.message p',
  '.company h2', '.company__table',
  '.contact h2', '.contact > p'
].join(',')).forEach((el, i) => {
  el.classList.add('reveal');
  if (i % 4 === 1) el.classList.add('reveal-delay-1');
  if (i % 4 === 2) el.classList.add('reveal-delay-2');
  if (i % 4 === 3) el.classList.add('reveal-delay-3');
});

document.querySelectorAll('.service__card').forEach((el, i) => {
  el.classList.add('reveal', `reveal-delay-${i % 4}`);
});
