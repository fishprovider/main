import { log } from '@fishprovider/core';
import { LocalForageDriver } from '@fishprovider/local';
import { initLocalFirst } from '@fishprovider/local-first';

export const initStoreFirst = async (params: {
  baseURL?: string,
  driver?: LocalForageDriver,
}) => {
  log.info('Starting initStoreFirst');
  await initLocalFirst(params);
  log.info('Started initStoreFirst');
};
