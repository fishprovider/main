import { log } from '@fishprovider/core';
import {
  startMongo, stopMongo,
} from '@fishprovider/mongo';
import {
  startRedis, stopRedis,
} from '@fishprovider/redis';

export const startCacheFirst = async () => {
  log.info('Starting CacheFirst');
  await Promise.all([
    startRedis(),
    startMongo(),
  ]);
  log.info('Started CacheFirst');
};

export const stopCacheFirst = async () => {
  log.info('Stopping CacheFirst');
  await Promise.all([
    stopRedis(),
    stopMongo(),
  ]);
  log.info('Stopped CacheFirst');
};
