import { initApi } from '@fishprovider/cross/dist/libs/api';
import { initStore } from '@fishprovider/cross/dist/libs/store';
import { initStoreFirst } from '@fishprovider/store-first';
import moment from 'moment-timezone';

import { initAnalytics } from '~libs/analytics';
import { initAuth } from '~libs/auth';
import { cacheRead } from '~libs/cache';
// import { initLiveChat } from '~libs/liveChat';
import { initSW } from '~libs/sw';
import {
  isBrowser, isLive, isProd, isSecondary,
  isTrack, secondaryBackendUrl,
} from '~utils';

const env = {
  backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL || '',
  demoBackendUrl: process.env.NEXT_PUBLIC_DEMO_BACKEND_URL || '',
  api: process.env.NEXT_PUBLIC_API || '/api',
};

const getBaseUrl = () => {
  if (isLive) {
    if (isSecondary) {
      return secondaryBackendUrl;
    }
    return env.backendUrl;
  }
  return env.demoBackendUrl;
};

const initialize = () => {
  initStoreFirst({
    baseURL: `${getBaseUrl()}${env.api}/v3`,
  });

  initApi({
    baseURL: `${isLive ? env.backendUrl : env.demoBackendUrl}${env.api}`,
    logDebug: Logger.debug,
    logError: Logger.info,
  });

  initStore({
    logDebug: Logger.debug,
    logError: Logger.info,
  });

  if (isBrowser) {
    initAuth();

    if (isTrack) {
      initAnalytics();
    }

    if (isProd) {
      initSW();
    }

    cacheRead<string>('timezone').then((cacheTimezone) => {
      moment.tz.setDefault(cacheTimezone || moment.tz.guess(true));
    });

    // initLiveChat();
  }
};

export {
  initialize,
};
