import { log } from '@fishprovider/core';
import { initFishApi } from '@fishprovider/fish-api';

export const initDataFetch = (params: {
  baseURL?: string,
}) => {
  log.info('Starting initDataFetch');
  initFishApi(params);
  log.info('Started initDataFetch');
};
