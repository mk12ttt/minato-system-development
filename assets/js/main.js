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
  hamburger.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
  navClose.focus({ preventScroll: true });
}
function closeMenu() {
  if (!nav.classList.contains('open')) return;
  nav.classList.remove('open');
  navOverlay.classList.remove('active');
  hamburger.classList.remove('active');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
  hamburger.focus({ preventScroll: true });
}

hamburger.addEventListener('click', openMenu);
navClose.addEventListener('click', closeMenu);
navOverlay.addEventListener('click', closeMenu);
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
// Esc キーでも閉じる
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeMenu();
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ページの先頭に戻るボタン（少しスクロールしたら出す）
const toTop = document.createElement('button');
toTop.className = 'to-top';
toTop.type = 'button';
toTop.setAttribute('aria-label', 'ページの先頭へ戻る');
toTop.innerHTML = '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M10 15V5M5 10l5-5 5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
document.body.appendChild(toTop);
toTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
});
window.addEventListener('scroll', () => {
  toTop.classList.toggle('visible', window.scrollY > 600);
}, { passive: true });

// スクロールで見出し・文章・項目がふわっと現れる。
// JavaScript が動かない環境や「視差効果を減らす」設定の人には、最初から全部見せる。
if (!reduceMotion && 'IntersectionObserver' in window) {
  const targets = new Set(document.querySelectorAll([
    '.sec-philosophy .sec-label', '.sec-vision .sec-label', '.sec-growth .sec-label',
    '.sec-philosophy .sec-heading', '.sec-vision .sec-heading', '.sec-growth .sec-heading',
    '.sec-philosophy .sec-accent', '.sec-vision .sec-accent', '.sec-growth .sec-accent',
    '.sec-philosophy .sec-body', '.sec-vision .sec-body', '.sec-growth .sec-body',
    '.sec-service__header', '.service-card', '.sec-service__tagline',
    '.works .section-header', '.works__card',
    '.message', '.company', '.contact',
    '.policy > *',
  ].join(',')));

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      io.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -10% 0px' });

  targets.forEach(el => {
    // 同じ並びの項目は少しずつ遅らせて順に出す（サービスの4項目など）
    const order = [...el.parentElement.children].filter(c => targets.has(c)).indexOf(el);
    if (order > 0) el.style.setProperty('--reveal-delay', `${Math.min(order, 5) * 90}ms`);
    el.classList.add('reveal');
    io.observe(el);
  });
}

// PC のメニューで、いま見ている場所に下線を付ける
const navLinks = [...nav.querySelectorAll('a[href^="#"]')];
const navAreas = [...document.querySelectorAll('[data-nav]')];
if (navLinks.length && navAreas.length) {
  let ticking = false;
  const updateCurrent = () => {
    ticking = false;
    const line = window.innerHeight * 0.4;
    let current = '';
    navAreas.forEach(area => {
      if (area.getBoundingClientRect().top <= line) current = area.dataset.nav;
    });
    navLinks.forEach(a => a.classList.toggle('is-current', a.getAttribute('href') === `#${current}`));
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(updateCurrent); }
  }, { passive: true });
  updateCurrent();
}
