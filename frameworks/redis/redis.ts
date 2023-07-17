import { promiseCreator } from '@fishprovider/application-rules';
import type { RedisClientType } from 'redis';
import { createClient } from 'redis';

const env = {
  redisUrl: process.env.REDIS_URL,
  redisPass: process.env.REDIS_PASS,
};

let client: RedisClientType | undefined;
const clientPromise = promiseCreator();

const start = async () => {
  client = createClient({ url: env.redisUrl, password: env.redisPass });
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
