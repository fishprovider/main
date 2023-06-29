import type { ParseMode } from 'node-telegram-bot-api';
import TelegramBot from 'node-telegram-bot-api';

const env = {
  telegramToken: process.env.TELEGRAM_SIGNALS_TOKEN || '',
  telegramChannel: process.env.TELEGRAM_SIGNALS_CHANNEL || '',
};

const bot = new TelegramBot(env.telegramToken, { polling: true });

const sendMessage = async (msg: string, parse_mode: ParseMode = 'HTML') => {
  await bot.sendMessage(env.telegramChannel, msg, {
    parse_mode,
    disable_web_page_preview: true,
    protect_content: true,
    allow_sending_without_reply: true,
  });
};

export {
  sendMessage,
};
