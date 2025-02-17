import { log, promiseCreator } from '@fishprovider/core';
import { createClient } from 'redis';

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
    clientJson: client.json,
    client,
  };
};

export const convertUndefinedToNull = (obj: Record<string, any>) => JSON.parse(
  JSON.stringify(obj, (_key, value) => (value === undefined ? null : value)),
);
