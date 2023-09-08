import type { LogLevelDesc } from 'loglevel';
import loglevel from 'loglevel';

import { sendNotif } from '..';

type Message = Error | object | string;

const typeId = `${process.env.TYPE_PRE}-${process.env.TYPE_ID}`;

const getString = (message: Message) => {
  if (message instanceof Error) return message.toString();
  if (typeof message === 'object') return JSON.stringify(message, null, 2);
  return `${message}`;
};

const warnHandler = async (messages: Message[]) => {
  console.warn(...messages);
  const parsedMessages = messages.map((item) => getString(item));
  await sendNotif('[Warning]', parsedMessages);
};

const errorHandler = async (messages: Message[]) => {
  console.error(...messages);
  const parsedMessages = messages.map((item) => getString(item));
  await sendNotif('[Error]', parsedMessages);
  await sendNotif(`[${typeId}]`, parsedMessages, process.env.NOTIF_CHANNEL_ERROR || `${process.env.TYPE_PRE}-errors`);
};

const originalFactory = loglevel.methodFactory;
loglevel.methodFactory = (methodName, level, loggerName) => {
  const rawMethod = originalFactory(methodName, level, loggerName);
  return async (...messages) => {
    switch (methodName) {
      case 'error': {
        await errorHandler(messages);
        break;
      }
      case 'warn': {
        await warnHandler(messages);
        break;
      }
      default:
    }
    rawMethod(`[${typeId}]`, ...messages);
  };
};

// error > warn > info > debug
loglevel.setLevel('info' as LogLevelDesc);

if (process.env.LOGS_LEVEL) {
  loglevel.setLevel(process.env.LOGS_LEVEL as LogLevelDesc);
}

export const log = loglevel;
