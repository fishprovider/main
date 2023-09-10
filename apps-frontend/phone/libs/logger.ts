import { apiPost } from '@fishprovider/cross/dist/libs/api';
import { InteractionManager } from 'react-native';
import { consoleTransport, logger, type transportFunctionType } from 'react-native-logs';

const backendTransport: transportFunctionType = ({
  level, rawMsg,
}) => {
  if (['error', 'warn'].includes(level.text)) {
    apiPost('/logger', { methodName: level.text, messages: rawMsg }).catch(() => {
      console.error('Failed to call /logger');
    });
  }
};

const log = logger.createLogger({
  severity: process.env.EXPO_PUBLIC_LOGS_LEVEL || 'info',
  async: true,
  asyncFunc: InteractionManager.runAfterInteractions,
  transport: [
    consoleTransport,
    backendTransport,
  ],
});

// @ts-ignore not an error
global.Logger = log as any;
