// Header: transparent at top, dark when scrolled
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// Hamburger menu
const hamburger = document.getElementById('hamburger');
const nav       = document.getElementById('nav');
const navOverlay = document.getElementById('navOverlay');
const navClose  = document.getElementById('navClose');

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

hamburger.addEventListener('click', openMenu);
navClose.addEventListener('click', closeMenu);
navOverlay.addEventListener('click', closeMenu);
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
