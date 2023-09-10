import { log } from '@fishprovider/core-utils';

import {
  startFirebase, startMongo, startRedis, stopFirebase, stopMongo, stopRedis,
} from '..';

export const startCacheFirst = async () => {
  log.info('Starting CacheFirst');
  await Promise.all([
    startRedis(),
    startMongo(),
    startFirebase(),
  ]);
  log.info('Started CacheFirst');
};

export const stopCacheFirst = async () => {
  log.info('Stopping CacheFirst');
  await Promise.all([
    stopRedis(),
    stopMongo(),
    stopFirebase(),
  ]);
  log.info('Stopped CacheFirst');
};
