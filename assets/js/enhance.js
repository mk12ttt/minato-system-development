// 見た目の動き（main.js の後に読む）。トップページ以外では、無い要素は飛ばす
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // スクロール進捗バー
  const bar = document.getElementById('scrollProgress');
  const onScroll = () => {
    if (!bar) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.setProperty('--p', max > 0 ? (window.scrollY / max).toFixed(4) : 0);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // トップの見出しを1文字ずつに分ける（改行はそのまま）
  const heading = document.querySelector('.sec-hero__heading');
  if (heading && !reduce) {
    let n = 0;
    heading.innerHTML = heading.innerHTML.split(/(<br\s*\/?>)/i).map(part =>
      /^<br/i.test(part) ? part : [...part].map(c => `<span class="ch" style="--n:${n++}">${c}</span>`).join('')
    ).join('');
    heading.classList.add('is-split');
  }

  // （トップの光の点と線は 2026-10-11 にやめた。高級寄りに統一するため）
  const hero = document.querySelector('.sec-hero');

  // カード：マウスの位置をほのかに光らせる
  if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.service-card, .works__card, .contact').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${e.clientX - r.left}px`);
        el.style.setProperty('--my', `${e.clientY - r.top}px`);
      });
      el.addEventListener('pointerleave', () => { el.style.setProperty('--mx', '-999px'); el.style.setProperty('--my', '-999px'); });
    });
  }

  // PC のメニュー：光の板が、乗せた項目・いまの場所を追いかける
  const links = document.querySelector('.menu-links');
  if (links) {
    const ind = document.createElement('span');
    ind.className = 'menu-indicator';
    ind.setAttribute('aria-hidden', 'true');
    links.prepend(ind);
    const moveTo = el => {
      if (!el || window.innerWidth <= 768) { ind.classList.remove('on'); return; }
      ind.style.left = `${el.offsetLeft}px`;
      ind.style.width = `${el.offsetWidth}px`;
      ind.classList.add('on');
    };
    const toCurrent = () => moveTo(links.querySelector('.menu-link.is-current'));
    links.querySelectorAll('.menu-link').forEach(a => a.addEventListener('mouseenter', () => moveTo(a)));
    links.addEventListener('mouseleave', toCurrent);
    // main.js が is-current を付け替えるのを見て追従する
    // （光の板自身の変化には反応しないよう、項目だけを見る）
    const mo = new MutationObserver(records => {
      if (records.some(r => r.target.classList.contains('menu-link')) && !links.matches(':hover')) toCurrent();
    });
    links.querySelectorAll('.menu-link').forEach(a => mo.observe(a, { attributes: true, attributeFilter: ['class'] }));
    window.addEventListener('resize', toCurrent);
    toCurrent();
  }

  // 画面下の問い合わせボタン（スマホ）：最初の画面を過ぎたら出し、お問い合わせ欄が見えたら引っ込める
  const floatCta = document.getElementById('floatCta');
  const contactBox = document.getElementById('contact');
  if (floatCta && hero && contactBox) {
    const update = () => {
      const past = hero.getBoundingClientRect().bottom < 0;
      const near = contactBox.getBoundingClientRect().top < window.innerHeight;
      floatCta.classList.toggle('visible', past && !near);
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
  }
})();
