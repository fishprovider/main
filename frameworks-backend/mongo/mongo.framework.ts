import { promiseCreator } from '@fishprovider/application';
import assert from 'assert';
import { MongoClient } from 'mongodb';

const clientPromise = promiseCreator<MongoClient>();

const start = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined');
  }
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  console.info('Started mongo.framework');
  clientPromise.resolveExec(client);
  return client;
};

const stop = async () => {
  const client = await clientPromise;
  if (client) {
    await client.close();
  }
  console.info('Stopped mongo.framework');
};

const get = async () => {
  const client = await clientPromise;
  assert(client);
  return {
    client,
    db: client.db(),
  };
};

export const mongo = {
  start,
  stop,
  get,
};
