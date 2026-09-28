require('dotenv').config();
const express = require('express');
const crypto = require('crypto');
const path = require('path');
const { Telegraf, Markup } = require('telegraf');

const app = express();
const PORT = process.env.PORT || 3000;
const BOT_TOKEN = process.env.BOT_TOKEN;
const WEBAPP_URL = process.env.WEBAPP_URL || 'https://axiom-rpg.onrender.com';

const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) => {
  ctx.reply(
    'Добро пожаловать в Axiom!',
    Markup.inlineKeyboard([Markup.button.webApp('Открыть игру', WEBAPP_URL)])
  );
});

bot.command('play', (ctx) => {
  ctx.reply(
    'Открыть игру:',
    Markup.inlineKeyboard([Markup.button.webApp('Открыть игру', WEBAPP_URL)])
  );
});

function validateInitData(initData) {
  if (!initData) return null;
  const params = new URLSearchParams(initData);
  const hash = params.get('hash');
  if (!hash) return null;
  params.delete('hash');
  const dataCheckString = [...params.entries()]
    .map(([k, v]) => k + '=' + v)
    .sort()
    .join('\n');
  const secretKey = crypto.createHmac('sha256', 'WebAppData').update(BOT_TOKEN).digest();
  const calc = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');
  if (calc !== hash) return null;
  const userJson = params.get('user');
  return userJson ? JSON.parse(userJson) : null;
}

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/auth', (req, res) => {
  const user = validateInitData(req.body.initData);
  if (!user) return res.status(401).json({ error: 'invalid initData' });
  res.json({ ok: true, user });
});

app.use(bot.webhookCallback('/webhook'));

app.listen(PORT, async () => {
  console.log('Server: http://localhost:' + PORT);
  try {
    await bot.telegram.setWebhook(WEBAPP_URL + '/webhook');
    console.log('Webhook set:', WEBAPP_URL + '/webhook');
  } catch (e) {
    console.error('Webhook error:', e.message);
  }
});
