import { promiseCreator } from '@fishprovider/application-rules';
import type { RedisClientType } from '@redis/client';
import { createClient } from 'redis';

let client: RedisClientType | undefined;
const clientPromise = promiseCreator();

const start = async () => {
  if (!process.env.REDIS_URL) {
    throw new Error('REDIS_URL is not defined');
  }
  client = createClient({
    url: process.env.REDIS_URL,
    password: process.env.REDIS_PASS,
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
