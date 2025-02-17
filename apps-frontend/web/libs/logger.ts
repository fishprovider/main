import { apiPost } from '@fishprovider/cross/dist/libs/api';
import type { LogLevelDesc } from 'loglevel';
import log from 'loglevel';

const env = {
  typeId: process.env.NEXT_PUBLIC_TYPE_ID,
  logsLevel: process.env.NEXT_PUBLIC_LOGS_LEVEL || 'info',
};

global.Logger = log.noConflict();

const originalMethodFactory = log.methodFactory;
log.methodFactory = (methodName, level, loggerName) => {
  const loggingMethod = originalMethodFactory(methodName, level, loggerName);
  return async (...messages) => {
    if (['error', 'warn'].includes(methodName)) {
      await apiPost('/logger', { methodName, messages }).catch(() => {
        console.error('Failed to call /logger');
      });
    }
    loggingMethod(`[${env.typeId}]`, ...messages);
  };
};

// error > warn > info > debug
log.setLevel((env.logsLevel) as LogLevelDesc);
