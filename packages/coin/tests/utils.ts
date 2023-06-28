// import * as agenda from '@fishbot/core/libs/agenda';
import * as firebase from '@fishbot/core/libs/firebase';
import * as mongo from '@fishbot/core/libs/mongo';
import * as redis from '@fishbot/core/libs/redis';

const beforeAllSetup = (
  done: jest.DoneCallback,
  handler: () => Promise<void> = async () => undefined,
) => {
  (async () => {
    try {
      await redis.start();
      await firebase.start();
      await mongo.start();
      // await agenda.start({} as any);
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
      // await agenda.destroyAsync();
      await mongo.destroyAsync();
      await firebase.destroyAsync();
      await redis.destroyAsync();
    } finally {
      done();
    }
  })();
};

export {
  afterAllSetup,
  beforeAllSetup,
};
