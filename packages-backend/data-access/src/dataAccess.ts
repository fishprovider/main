import { log } from '@fishprovider/core';
import {
  startFirebase, stopFirebase,
} from '@fishprovider/firebase';
import {
  startMongo, stopMongo,
} from '@fishprovider/mongo';
import {
  startRedis, stopRedis,
} from '@fishprovider/redis';

export const startDataAccess = async () => {
  log.info('Starting DataAccess');
  await Promise.all([
    startRedis(),
    startMongo(),
    startFirebase(),
  ]);
  log.info('Started DataAccess');
};

export const stopDataAccess = async () => {
  log.info('Stopping DataAccess');
  await Promise.all([
    stopRedis(),
    stopMongo(),
    stopFirebase(),
  ]);
  log.info('Stopped DataAccess');
};
