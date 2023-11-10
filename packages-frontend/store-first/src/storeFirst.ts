import { log } from '@fishprovider/core';
import { initFishApi } from '@fishprovider/fish-api';
import { initLocal, LocalForageDriver } from '@fishprovider/local';

export const initStoreFirst = (params: {
  baseURL?: string,
  driver?: LocalForageDriver,
}) => {
  log.info('Starting initStoreFirst');
  initFishApi(params);
  initLocal(params);
  log.info('Started initStoreFirst');
};
