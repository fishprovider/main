import { log } from '@fishprovider/core';
import { initFishApi } from '@fishprovider/fish-api';

export const initLocalFirst = (params: {
  baseURL?: string,
}) => {
  log.info('Starting initLocalFirst');
  initFishApi(params);
  log.info('Started initLocalFirst');
};
