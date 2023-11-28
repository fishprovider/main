import { log } from '@fishprovider/core';
import { initFishApi } from '@fishprovider/fish-api';
import { initLocal, LocalForageDriver } from '@fishprovider/local';

export const initLocalFirst = async (params: {
  baseURL?: string,
  driver?: LocalForageDriver,
}) => {
  log.info('Starting initLocalFirst');
  initFishApi(params);
  await initLocal(params);
  log.info('Started initLocalFirst');
};
