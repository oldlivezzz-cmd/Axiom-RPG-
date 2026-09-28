const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

const userEl = document.getElementById('user');
const logEl = document.getElementById('log');
const btn = document.getElementById('actionBtn');

async function auth() {
  try {
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ initData: tg.initData })
    });
    if (!res.ok) {
      userEl.textContent = 'Ошибка авторизации';
      return;
    }
    const data = await res.json();
    userEl.textContent = 'Привет, ' + data.user.first_name + '!';
  } catch (e) {
    userEl.textContent = 'Нет связи с сервером';
  }
}

let score = 0;
btn.addEventListener('click', () => {
  score += Math.floor(Math.random() * 10) + 1;
  logEl.textContent = 'Опыт: ' + score;
  tg.HapticFeedback.impactOccurred('light');
});

auth();
