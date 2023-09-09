import * as firebase from '@fishprovider/old-core/dist/libs/firebase';
import * as mongo from '@fishprovider/old-core/dist/libs/mongo';
import * as redis from '@fishprovider/old-core/dist/libs/redis';
import { ErrorType } from '@fishprovider/utils/dist/constants/error';
import type { Account } from '@fishprovider/utils/dist/types/Account.model';
import type { User } from '@fishprovider/utils/dist/types/User.model';

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
    throw new Error(ErrorType.accountNotFound);
  }
  return account.config;
};

const getUser = async () => {
  const user = await Mongo.collection<User>('users').findOne(
    { _id: 'test' },
  );
  if (!user) {
    throw new Error(ErrorType.userNotFound);
  }
  return user;
};

const beforeAllSetup = (
  done: any,
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
  done: any,
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
  getUser,
};
