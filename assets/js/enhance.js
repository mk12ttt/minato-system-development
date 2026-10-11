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

  // トップ：光の点と線がゆっくり動く
  const hero = document.querySelector('.sec-hero');
  if (hero && !reduce) {
    const cv = document.createElement('canvas');
    cv.className = 'hero-net';
    cv.setAttribute('aria-hidden', 'true');
    hero.insertBefore(cv, hero.querySelector('.sec-hero__content'));
    const ctx = cv.getContext('2d');
    let w, h, pts, raf, visible = true;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      w = hero.clientWidth; h = hero.clientHeight;
      cv.width = w * dpr; cv.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(70, (w * h) / 16000));
      pts = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.22, vy: (Math.random() - 0.5) * 0.22,
        r: Math.random() * 1.4 + 0.4,
      }));
    };
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
      }
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const a = pts[i], b = pts[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 120) {
            ctx.strokeStyle = `rgba(154,215,227,${(1 - d / 120) * 0.35})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      for (const p of pts) {
        ctx.fillStyle = 'rgba(214,190,140,0.9)';
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      }
      if (visible) raf = requestAnimationFrame(draw);
    };
    resize(); draw();
    window.addEventListener('resize', resize);
    // 画面外では止める（電池のため）
    new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) { cancelAnimationFrame(raf); raf = requestAnimationFrame(draw); }
    }).observe(hero);
  }

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
