import { promiseCreator } from '@fishprovider/core-new';
import { createClient } from 'redis';

import { log } from '../..';

const clientPromise = promiseCreator<ReturnType<typeof createClient>>();

export const startRedis = async () => {
  if (!process.env.REDIS_HOST) {
    throw new Error('REDIS_HOST is not defined');
  }
  log.info('Starting Redis');
  const client = createClient({
    name: `${process.env.TYPE}-${process.env.TYPE_ID}`,
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    ...(process.env.REDIS_KEY && { password: process.env.REDIS_KEY }),
  });
  await client.connect();
  log.info('Started Redis');
  clientPromise.resolveExec(client);
  return client;
};

export const stopRedis = async () => {
  log.info('Stopping Redis');
  const client = await clientPromise;
  await client.quit();
  log.info('Stopped Redis');
};

export const getRedis = async () => {
  const client = await clientPromise;
  return {
    client,
  };
};
