const form = document.getElementById('contactForm');
if (!form) throw new Error('no form');

const rules = {
  name:     { el: document.getElementById('name'),     err: document.getElementById('nameError'),     check: v => v.trim().length > 0 },
  email:    { el: document.getElementById('email'),    err: document.getElementById('emailError'),    check: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
  category: { el: document.getElementById('category'), err: document.getElementById('categoryError'), check: v => v !== '' },
  message:  { el: document.getElementById('message'),  err: document.getElementById('messageError'),  check: v => v.trim().length >= 10 },
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

// お問い合わせ内容の文字数。10文字に届いたら色を変える。
const messageEl    = document.getElementById('message');
const messageCount = document.getElementById('messageCount');
const updateCount = () => {
  const n = messageEl.value.trim().length;
  messageCount.textContent = `${n}文字（10文字以上）`;
  messageCount.classList.toggle('ok', n >= 10);
};
messageEl.addEventListener('input', updateCount);
updateCount();

// 送信は FormSubmit（https://formsubmit.co）経由で、下のアドレスにメールで届く。
// 初回の送信時に、このアドレスへ「有効化」のメールが届く。それを承認するまでは届かない。
const ENDPOINT = 'https://formsubmit.co/ajax/msd1230.info@gmail.com';

const submitBtn   = document.getElementById('submitBtn');
const submitLabel = submitBtn.innerHTML;
const sendError   = document.getElementById('sendError');

form.addEventListener('submit', async e => {
  e.preventDefault();
  const allValid = Object.keys(rules).map(validate).every(Boolean);
  if (!allValid) return;

  // 迷惑メール対策の隠し項目。人には見えないので、入っていたら機械の送信とみなす。
  if (form.elements._honey.value) return;

  submitBtn.disabled = true;
  submitBtn.textContent = '送信中...';
  sendError.classList.remove('visible');

  const category = document.getElementById('category');
  const payload = {
    _subject:  '【HP】お問い合わせ：' + category.options[category.selectedIndex].text,
    _template: 'table',
    _replyto:  form.elements.email.value.trim(),
    '会社名':           form.elements.company.value.trim() || '（未入力）',
    'お名前':           form.elements.name.value.trim(),
    'メールアドレス':   form.elements.email.value.trim(),
    '電話番号':         form.elements.phone.value.trim() || '（未入力）',
    'お問い合わせ種別': category.options[category.selectedIndex].text,
    'お問い合わせ内容': form.elements.message.value.trim(),
  };

  try {
    const res  = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || String(data.success) !== 'true') throw new Error(data.message || res.status);

    form.style.display = 'none';
    document.getElementById('successMessage').classList.add('visible');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (err) {
    // 届いていないのに完了と出さない。メールで直接送れるよう案内する。
    sendError.classList.add('visible');
    submitBtn.disabled = false;
    submitBtn.innerHTML = submitLabel;
  }
});
