import { mongo } from '@fishprovider/repository-mongo';
import { redis } from '@fishprovider/repository-redis';

const start = async () => {
  await Promise.all([
    redis.start(),
    mongo.start(),
  ]);
  console.info('Started cacheFirst.framework');
};

const stop = async () => {
  await Promise.all([
    mongo.stop(),
    redis.stop(),
  ]);
  console.info('Stopped cacheFirst.framework');
};

const get = async () => ({
  redis: await redis.get(),
  mongo: await mongo.get(),
});

export const cacheFirst = {
  start,
  stop,
  get,
};
