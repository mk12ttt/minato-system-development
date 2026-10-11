// 試作ページの動き。JS が動くときだけ .js を付け、隠してから出す（動かなければ全部見える）
const root = document.documentElement;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
root.classList.add('js');

// 開いた直後にヒーローを出す
const start = () => requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add('is-loaded')));
if (document.readyState === 'complete') start(); else window.addEventListener('load', start);
// 画像の読み込みが遅くても 1.5 秒で出す
setTimeout(() => root.classList.add('is-loaded'), 1500);

// ヘッダー：スクロールしたら白地に
const hd = document.getElementById('hd');
const floatCta = document.getElementById('floatCta');
const hero = document.querySelector('.hero');
const cta = document.getElementById('contact');
const onScroll = () => {
  hd.classList.toggle('is-scrolled', window.scrollY > 8);
  // 画面下の相談ボタン：ヒーローを過ぎたら出し、最後の問い合わせ欄が見えたら引っ込める
  const pastHero = hero.getBoundingClientRect().bottom < 0;
  const ctaVisible = cta.getBoundingClientRect().top < window.innerHeight;
  floatCta.classList.toggle('visible', pastHero && !ctaVisible);
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// メニュー（スマホ）
const nav = document.getElementById('nav');
const menuBtn = document.getElementById('menuBtn');
const navClose = document.getElementById('navClose');
const scrim = document.getElementById('navScrim');
const openMenu = () => {
  nav.classList.add('open'); scrim.classList.add('active');
  menuBtn.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
  navClose.focus({ preventScroll: true });
};
const closeMenu = () => {
  if (!nav.classList.contains('open')) return;
  nav.classList.remove('open'); scrim.classList.remove('active');
  menuBtn.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
  menuBtn.focus({ preventScroll: true });
};
menuBtn.addEventListener('click', openMenu);
navClose.addEventListener('click', closeMenu);
scrim.addEventListener('click', closeMenu);
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

// スクロールで現れる。同じ並びの項目は少しずつ遅らせる
const items = [...document.querySelectorAll('[data-reveal]')];
if (!reduceMotion && 'IntersectionObserver' in window) {
  items.forEach(el => {
    const sibs = [...el.parentElement.children].filter(c => c.hasAttribute('data-reveal'));
    const i = sibs.indexOf(el);
    if (i > 0) el.style.setProperty('--d', `${Math.min(i, 4) * 90}ms`);
  });
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -12% 0px' });
  items.forEach(el => io.observe(el));
} else {
  items.forEach(el => el.classList.add('is-in'));
}

// いま見ている場所をメニューに示す
const links = [...document.querySelectorAll('[data-link]')];
const areas = links.map(a => document.getElementById(a.dataset.link)).filter(Boolean);
let ticking = false;
const markCurrent = () => {
  ticking = false;
  const line = window.innerHeight * 0.35;
  let cur = '';
  areas.forEach(s => { if (s.getBoundingClientRect().top <= line) cur = s.id; });
  links.forEach(a => a.classList.toggle('is-current', a.dataset.link === cur));
};
window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(markCurrent); } }, { passive: true });
markCurrent();
