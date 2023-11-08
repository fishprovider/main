import { log } from '@fishprovider/core';
import { initFishApi } from '@fishprovider/fish-api';

export const initStoreFirst = (params: {
  baseURL?: string,
}) => {
  log.info('Starting initStoreFirst');
  initFishApi(params);
  log.info('Started initStoreFirst');
};
