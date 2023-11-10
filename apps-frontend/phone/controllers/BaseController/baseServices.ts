import { initApi } from '@fishprovider/cross/dist/libs/api';
import { initStore } from '@fishprovider/cross/dist/libs/store';
import { initStoreFirst } from '@fishprovider/store-first';

import { localForageDriver } from '~libs/asyncStorage';
import { initAuth } from '~libs/auth';
import { initNotif } from '~libs/pushNotif';

const initialize = () => {
  initStoreFirst({
    baseURL: `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/v3`,
    driver: localForageDriver,
  });

  initApi({
    baseURL: `${process.env.EXPO_PUBLIC_BACKEND_URL}/api`,
    logDebug: Logger.debug,
    logError: Logger.error,
  });

  initStore({
    logDebug: Logger.debug,
    logError: Logger.error,
  });

  initAuth();
  initNotif();
};

export {
  initialize,
};
