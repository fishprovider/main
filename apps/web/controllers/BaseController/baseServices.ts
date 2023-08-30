import { initApi } from '@fishprovider/cross/dist/libs/api';
import { initStore } from '@fishprovider/cross/dist/libs/store';
import { fishApi } from '@fishprovider/framework-fish-api';
import { store } from '@fishprovider/framework-store';
import moment from 'moment-timezone';

import { initAnalytics } from '~libs/analytics';
import { initAuth } from '~libs/auth';
import { cacheRead } from '~libs/cache';
// import { initLiveChat } from '~libs/liveChat';
import { initSW } from '~libs/sw';
import {
  isBrowser, isLive, isProd, isTrack,
} from '~utils';

const env = {
  backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL || '',
  demoBackendUrl: process.env.NEXT_PUBLIC_DEMO_BACKEND_URL || '',
  api: process.env.NEXT_PUBLIC_API || '/api',
};

const initialize = () => {
  initApi({
    baseURL: `${isLive ? env.backendUrl : env.demoBackendUrl}${env.api}`,
    logDebug: Logger.debug,
    logError: Logger.info,
  });

  fishApi.start({
    baseURL: `${isLive ? env.backendUrl : env.demoBackendUrl}${env.api}/v3`,
    logDebug: Logger.debug,
    logError: Logger.info,
  });

  initStore({
    logDebug: Logger.debug,
    logError: Logger.info,
  });

  store.start({
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
      if (!cacheTimezone) return;
      moment.tz.setDefault(cacheTimezone);
    });

    // initLiveChat();
  }
};

export {
  initialize,
};
