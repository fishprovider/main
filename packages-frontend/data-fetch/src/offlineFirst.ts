import { log } from '@fishprovider/core-utils';
import { initFishApi } from '@fishprovider/fish-api';

export const initOfflineFirst = (params: {
  baseURL?: string,
}) => {
  log.info('Starting initOfflineFirst');
  initFishApi(params);
  log.info('Started initOfflineFirst');
};
