import { log } from '@fishprovider/core-utils';

import { initFishApi, initStore } from '..';

export const initOfflineFirst = async (params: {
  baseURL?: string,
  logDebug?: (...args: any[]) => void
  logError?: (...args: any[]) => void
}) => {
  log.info('Starting OfflineFirst');
  await Promise.all([
    initFishApi(params),
    initStore(params),
  ]);
  log.info('Started OfflineFirst');
};
