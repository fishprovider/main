import { promiseCreator } from '@fishprovider/application-rules';
import assert from 'assert';
import { MongoClient } from 'mongodb';

let client: MongoClient | undefined;
const clientPromise = promiseCreator();

const start = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined');
  }
  client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  clientPromise.resolveExec();
  return client;
};

const stop = async () => {
  if (client) {
    await client.close();
  }
};

const get = async () => {
  await clientPromise;
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
