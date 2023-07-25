import { logger } from 'react-native-logs';

const log = logger.createLogger({
  severity: process.env.EXPO_PUBLIC_LOGS_LEVEL || 'info',
});

global.Logger = log as any;
