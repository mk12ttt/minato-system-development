// Header scroll effect
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
});

// Hamburger menu
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');
const navOverlay = document.getElementById('navOverlay');
const navClose = document.getElementById('navClose');

function openMenu() {
  nav.classList.add('open');
  navOverlay.classList.add('active');
  hamburger.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeMenu() {
  nav.classList.remove('open');
  navOverlay.classList.remove('active');
  hamburger.classList.remove('active');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  nav.classList.contains('open') ? closeMenu() : openMenu();
});
navClose.addEventListener('click', closeMenu);
navOverlay.addEventListener('click', closeMenu);
nav.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', closeMenu);
});

// Scroll reveal
const revealSelectors = [
  '.label',
  '.section-title',
  '.service__card',
  '.works__info',
  '.works__visual',
  '.philosophy__heading',
  '.philosophy__body',
  '.split-section__content',
  '.message h2', '.message p',
  '.company h2', '.company__table',
  '.contact h2', '.contact > p',
  '.contact__email',
].join(',');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll(revealSelectors).forEach((el, i) => {
  el.classList.add('reveal');
  const delay = (i % 4) * 0.08;
  el.style.transitionDelay = delay + 's';

  // Already in viewport on page load → show immediately
  const rect = el.getBoundingClientRect();
  if (rect.top < window.innerHeight && rect.bottom > 0) {
    el.classList.add('visible');
  } else {
    observer.observe(el);
  }
});

// Service cards staggered
document.querySelectorAll('.service__card').forEach((el, i) => {
  el.style.transitionDelay = (i * 0.1) + 's';
});
