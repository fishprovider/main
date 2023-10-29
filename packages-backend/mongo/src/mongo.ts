import { log, promiseCreator } from '@fishprovider/core';
import { MongoClient } from 'mongodb';

const clientPromise = promiseCreator<MongoClient>();

export const startMongo = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error('Require MONGODB_URI');
  }
  log.info('Starting Mongo');
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  log.info('Started Mongo');
  clientPromise.resolveExec(client);
};

export const stopMongo = async () => {
  log.info('Stopping Mongo');
  const client = await clientPromise;
  await client.close();
  log.info('Stopped Mongo');
};

export const getMongo = async () => {
  const client = await clientPromise;
  return {
    client,
    db: client.db(),
  };
};
