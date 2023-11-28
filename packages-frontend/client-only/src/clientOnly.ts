import { log } from '@fishprovider/core';
import { initLocal, LocalForageDriver } from '@fishprovider/local';

export const initClientOnly = async (params: {
  driver?: LocalForageDriver,
}) => {
  log.info('Starting initClientOnly');
  await initLocal(params);
  log.info('Started initClientOnly');
};
