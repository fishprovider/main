import { initApi } from '@fishprovider/cross/libs/api';
import { initStore } from '@fishprovider/cross/libs/store';

import { initAuth } from '~libs/auth';
import { initNotif } from '~libs/pushNotif';

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

  initAuth();
  initNotif();
};

export {
  initialize,
};
