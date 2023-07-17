import { promiseCreator } from '@fishprovider/application-rules';
import assert from 'assert';
import { MongoClient } from 'mongodb';

const env = {
  mongoUrl: process.env.MONGO_URL || '',
};

let client: MongoClient | undefined;
const clientPromise = promiseCreator();

const start = async () => {
  client = new MongoClient(env.mongoUrl);
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
