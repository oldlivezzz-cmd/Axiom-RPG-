require('dotenv').config();
const express = require('express');
const crypto = require('crypto');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const BOT_TOKEN = process.env.BOT_TOKEN;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

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

app.post('/api/auth', (req, res) => {
  const user = validateInitData(req.body.initData);
  if (!user) return res.status(401).json({ error: 'invalid initData' });
  res.json({ ok: true, user });
});

app.listen(PORT, () => console.log('Server: http://localhost:' + PORT));
