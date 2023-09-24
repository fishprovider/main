import type { ClientSession } from 'mongodb';
import { MongoClient, MongoNetworkError } from 'mongodb';

const env = {
  mongodbUri: process.env.MONGODB_URI,
  mongodbMaxPoolSize: process.env.MONGODB_MAX_POOLSIZE || 10,
  mongodbMaxConnection: process.env.MONGODB_MAX_CONNECTION || 10,
};

let _mongoClient: MongoClient | undefined;

const start = async () => {
  if (!env.mongodbUri) {
    throw new Error('MongoDB URI is not defined');
  }

  _mongoClient = new MongoClient(env.mongodbUri, {
    maxPoolSize: +env.mongodbMaxPoolSize,
    maxConnecting: +env.mongodbMaxConnection,
  });
  await _mongoClient.connect();

  _mongoClient.on('close', (reason: any) => {
    if (reason instanceof MongoNetworkError) {
      Logger.error('MongoDB connection closed due to a network error:', reason);
      // Handle the network error appropriately, e.g. retry the connection
      // TODO: retry the connection
    } else {
      Logger.warn('MongoDB connection closed:', reason);
    }
  });

  global.MongoConnection = _mongoClient;
  global.Mongo = _mongoClient.db();
};

const destroy = () => {
  console.log('Mongo destroying...');
  if (_mongoClient) {
    _mongoClient.close(true).catch((err) => Logger.error(`Failed to stop Mongo: ${err}`));
    _mongoClient = undefined;
  }
  console.log('Mongo destroyed');
};

const destroyAsync = async () => {
  console.log('Mongo destroying...');
  if (_mongoClient) {
    await _mongoClient.close(true);
    _mongoClient = undefined;
  }
  console.log('Mongo destroyed');
};

const runDBTransaction = async <T>(handler: (session: ClientSession) => Promise<T>) => {
  const session = MongoConnection.startSession({
    defaultTransactionOptions: {
      readConcern: { level: 'snapshot' },
      writeConcern: { w: 'majority' },
    },
  });
  try {
    /* eslint-disable max-len */
    /*
      * This function session.withTransaction:
      * - Will return the command response from the final commitTransaction if every operation is successful (can be used as a truthy object)
      * - Will return `undefined` if the transaction is explicitly aborted with `await session.abortTransaction()`
      * - Will throw if one of the operations throws or `throw` statement is used inside the `withTransaction` callback
    */
    /* eslint-enable max-len */
    const res = await session.withTransaction(() => handler(session));
    if (res) {
      await session.commitTransaction();
    }
    return res;
  } finally {
    await session.endSession();
  }
};

export {
  destroy, destroyAsync, runDBTransaction, start,
};
