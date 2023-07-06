import { initApi } from '@fishbot/cross/libs/api';
import { initStore } from '@fishbot/cross/libs/store';

const env = {
  backendUrl: process.env.EXPO_PUBLIC_BACKEND_URL,
  api: '/api',
};

const initialize = () => {
  initApi({
    baseURL: `${env.backendUrl}${env.api}`,
    logDebug: console.debug,
    logError: console.info,
  });

  initStore({
    logDebug: console.debug,
    logError: console.info,
  });
};

export {
  initialize,
};
