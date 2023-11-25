import { log } from '@fishprovider/core';
import { initLocal, LocalForageDriver } from '@fishprovider/local';

export const initClientOnly = (params: {
  driver?: LocalForageDriver,
}) => {
  log.info('Starting initClientOnly');
  initLocal(params);
  log.info('Started initClientOnly');
};
