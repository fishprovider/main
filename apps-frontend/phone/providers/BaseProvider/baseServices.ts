import { driverWithDefaultSerialization } from '@aveq-research/localforage-asyncstorage-driver';
import { initApi } from '@fishprovider/cross/dist/libs/api';
import { initStore } from '@fishprovider/cross/dist/libs/store';
import { initStoreFirst } from '@fishprovider/store-first';

import { initAuth } from '~libs/auth';
import { initNotif } from '~libs/pushNotif';

const initialize = () => {
  const driver = driverWithDefaultSerialization();
  initStoreFirst({
    baseURL: `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/v3`,
    driver,
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
