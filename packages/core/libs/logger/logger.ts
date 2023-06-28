import type { LogLevelDesc } from 'loglevel';
import log from 'loglevel';

import { send } from '~libs/notif';

type Message = Error | object | string;

const env = {
  type: process.env.TYPE,
  typeId: process.env.TYPE_ID,
  typePre: process.env.TYPE_PRE,

  logsLevel: process.env.LOGS_LEVEL || 'info',
  notifChannelError: process.env.NOTIF_CHANNEL_ERROR || `${process.env.TYPE_PRE}-errors`,
};

const typeId = `${env.typePre}-${env.typeId}`;

const getString = (message: Message) => {
  if (message instanceof Error) return message.toString();
  if (typeof message === 'object') return JSON.stringify(message, null, 2);
  return `${message}`;
};

const warnHandler = async (messages: Message[]) => {
  const parsedMessages = messages.map((item) => getString(item));
  await send('@here', parsedMessages);
};

const errorHandler = async (messages: Message[]) => {
  const parsedMessages = messages.map((item) => getString(item));
  await send('@here', parsedMessages);
  await send(`[${typeId}] @here`, parsedMessages, env.notifChannelError);
};

const start = () => {
  global.Logger = log.noConflict();

  const originalFactory = log.methodFactory;
  log.methodFactory = (methodName, level, loggerName) => {
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
  log.setLevel(env.logsLevel as LogLevelDesc);
  console.log('[C] Logger started with level', env.logsLevel);
  Logger.info('[L] Logger started with level', env.logsLevel);
};

const destroy = () => {
  console.log('Logger destroyed');
};

const destroyAsync = async () => {
  console.log('Logger destroyed');
};

export { destroy, destroyAsync, start };
