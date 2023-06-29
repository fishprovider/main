import * as firebase from '@fishbot/core/libs/firebase';
import * as mongo from '@fishbot/core/libs/mongo';
import * as redis from '@fishbot/core/libs/redis';
import type { Account } from '@fishbot/utils/types/Account.model';

const env = {
  typeId: process.env.TYPE_ID || '',
};

const getConfig = async () => {
  const account = await Mongo.collection<Account>('accounts').findOne(
    { _id: env.typeId },
    {
      projection: {
        config: 1,
      },
    },
  );
  if (!account) {
    throw new Error('Account not found');
  }
  return account.config;
};

const beforeAllSetup = (
  done: jest.DoneCallback,
  handler: () => Promise<void> = async () => undefined,
) => {
  (async () => {
    try {
      await mongo.start();
      await firebase.start();
      await redis.start();
      await handler();
    } finally {
      done();
    }
  })();
};

const afterAllSetup = (
  done: jest.DoneCallback,
  handler: () => Promise<void> = async () => undefined,
) => {
  (async () => {
    try {
      await handler();
      await redis.destroyAsync();
      await firebase.destroyAsync();
      await mongo.destroyAsync();
    } finally {
      done();
    }
  })();
};

export {
  afterAllSetup,
  beforeAllSetup,
  getConfig,
};
