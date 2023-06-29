import TelegramBot, { CallbackQuery, InlineQuery, Message } from 'node-telegram-bot-api';
import {
  InlineKeyboard,
  InlineKeyboardButton,
  KeyboardButton,
  ReplyKeyboard,
  Row,
} from 'node-telegram-keyboard-wrapper';

const env = {
  telegramToken: process.env.TELEGRAM_VERIFY_TOKEN || '',
};

const bot = new TelegramBot(env.telegramToken, { polling: true });

const linkAccountBtn = new InlineKeyboardButton('Link Account', 'login_url', {
  url: 'https://www.fishprovider.com/telegram-auth',
  forward_text: 'Link Account',
  bot_username: 'fishprovider_verify_bot',
  // @ts-ignore bool is required
  request_write_access: true,
});

const linkAccountInlineKeyboards = new InlineKeyboard(
  new Row<InlineKeyboardButton>(
    linkAccountBtn,
  ),
);

const homeInlineKeyboards = new InlineKeyboard(
  new Row<InlineKeyboardButton>(
    linkAccountBtn,
    new InlineKeyboardButton('Invest Now', 'url', 'https://www.fishprovider.com/strategies'),
  ),
);

const homeReplyKeyboards = new ReplyKeyboard(
  new Row<KeyboardButton>(
    new KeyboardButton('Verify Phone', { request_contact: true }),
  ),
  new Row<KeyboardButton>(
    new KeyboardButton('Main Menu'),
  ),
);

const onError = (err: Error) => {
  Logger.error(err);
};

const onStart = (msg: Message) => {
  bot.sendMessage(msg.chat.id, 'Welcome to FishProvider!', {
    reply_markup: homeReplyKeyboards.getMarkup(),
  });
  bot.sendMessage(msg.chat.id, 'Commands', {
    reply_markup: homeInlineKeyboards.getMarkup(),
  });
};

const onContact = async (msg: Message) => {
  const { contact } = msg;
  if (!contact) {
    bot.sendMessage(msg.chat.id, 'Please share your phone number to verify');
    return;
  }

  const { user_id, phone_number } = contact;

  const userCheckId = await Mongo.collection('users').findOne({
    'telegram.userId': `${user_id}`,
  }, {
    projection: {
      _id: 1,
    },
  });
  if (!userCheckId) {
    bot.sendMessage(msg.chat.id, 'Click here to link your account first', {
      reply_markup: linkAccountInlineKeyboards.getMarkup(),
    });
    return;
  }

  const userCheckPhone = await Mongo.collection('users').findOne({
    'telegram.phoneNumber': phone_number,
  }, {
    projection: {
      _id: 1,
    },
  });
  if (userCheckPhone) {
    if (userCheckPhone._id === userCheckId._id) {
      bot.sendMessage(msg.chat.id, '📱✅ Your phone is verified');
      return;
    }
    bot.sendMessage(msg.chat.id, '❌ Your phone is already verified by another user');
    return;
  }

  await Mongo.collection('users').updateOne({
    _id: userCheckId._id,
  }, {
    $set: {
      'telegram.phoneNumber': phone_number,
    },
  });
  bot.sendMessage(msg.chat.id, '📱✅ Your phone is verified');
};

const onCallbackQuery = async (query: CallbackQuery) => {
  console.log(query);
  // await bot.answerCallbackQuery(query.id, { text: 'Action received!' });
};

const onInlineQuery = async (query: InlineQuery) => {
  console.log(query);
  // await bot.answerCallbackQuery(query.id, { text: 'Action received!' });
};

const startTelegramVerify = async () => {
  bot.on('polling_error', onError);
  bot.on('webhook_error', onError);
  bot.on('error', onError);

  bot.onText(/\/start/, onStart);
  bot.onText(/Main Menu/, onStart);

  bot.on('contact', onContact);

  bot.on('callback_query', onCallbackQuery);
  bot.on('inline_query', onInlineQuery);

  Logger.info('Telegram bot started');
};

export {
  startTelegramVerify,
};
