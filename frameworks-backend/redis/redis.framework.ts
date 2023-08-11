import { promiseCreator } from '@fishprovider/application';
import assert from 'assert';
import { createClient } from 'redis';

const clientPromise = promiseCreator<ReturnType<typeof createClient>>();

const start = async () => {
  if (!process.env.REDIS_HOST) {
    throw new Error('REDIS_HOST is not defined');
  }
  const client = createClient({
    name: `${process.env.TYPE}-${process.env.TYPE_ID}`,
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    ...(process.env.REDIS_KEY && { password: process.env.REDIS_KEY }),
  });
  await client.connect();
  console.info('Started redis.framework');
  clientPromise.resolveExec(client);
  return client;
};

const stop = async () => {
  const client = await clientPromise;
  if (client) {
    await client.quit();
  }
  console.info('Stopped redis.framework');
};

const get = async () => {
  const client = await clientPromise;
  assert(client);
  return client;
};

export const redis = {
  start,
  stop,
  get,
};
