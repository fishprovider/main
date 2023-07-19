import { promiseCreator } from '@fishprovider/application-rules';
import type { RedisClientType } from '@redis/client';
import { createClient } from 'redis';

let client: RedisClientType | undefined;
const clientPromise = promiseCreator();

const start = async () => {
  if (!process.env.REDIS_HOST) {
    throw new Error('REDIS_HOST is not defined');
  }
  client = createClient({
    name: `${process.env.TYPE}-${process.env.TYPE_ID}`,
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    ...(process.env.REDIS_KEY && { password: process.env.REDIS_KEY }),
  });
  await client.connect();
  clientPromise.resolveExec();
  return client;
};

const stop = async () => {
  if (client) {
    await client.quit();
  }
};

const get = async () => {
  await clientPromise;
  return client;
};

export const redis = {
  start,
  stop,
  get,
};
