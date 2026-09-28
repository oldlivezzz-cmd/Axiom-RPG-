require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);
const WEBAPP_URL = process.env.WEBAPP_URL;

bot.start((ctx) => {
  ctx.reply(
    'Добро пожаловать в Axiom!',
    Markup.inlineKeyboard([Markup.button.webApp('Открыть игру', WEBAPP_URL)])
  );
});

bot.launch().then(() => console.log('Bot started'));
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
