import { destroyAsync, runDBTransaction, start } from './mongo';

beforeAll((done) => {
  (async () => {
    try {
      await start();
    } finally {
      done();
    }
  })();
});

afterAll((done) => {
  (async () => {
    try {
      await destroyAsync();
    } finally {
      done();
    }
  })();
});

test('Mongo stats', async () => {
  const res = await Mongo.stats();
  expect(res).toBeDefined();
});

test('Mongo users', async () => {
  const res = await Mongo.collection('users').find().toArray();
  expect(res.length).toBeGreaterThan(0);
});

describe('runDBTransaction', () => {
  test('bad command', async () => {
    const dummyField = 'dummyField';
    const dummyValue = 'dummyValue';

    const account = await Mongo.collection('accounts').findOne();
    expect(account).toBeDefined();
    expect(account?.dummyField).toBeUndefined();

    try {
      await runDBTransaction(async (session) => {
        expect(session).toBeDefined();

        await Mongo.collection('accounts').updateOne({
          _id: account?._id,
        }, {
          $set: {
            _id: dummyValue,
            [dummyField]: dummyValue,
          },
        }, {
          session,
        });
      });
    } catch (err) {
      expect(err).toBeDefined();
    }

    const accountAfter = await Mongo.collection('accounts').findOne();
    expect(accountAfter).toBeDefined();
    expect(accountAfter?.dummyField).toBeUndefined();
  });

  test('throw Error', async () => {
    const dummyField = 'dummyField';
    const dummyValue = 'dummyValue';

    const account = await Mongo.collection('accounts').findOne();
    expect(account).toBeDefined();
    expect(account?.dummyField).toBeUndefined();

    try {
      await runDBTransaction(async (session) => {
        expect(session).toBeDefined();

        await Mongo.collection('accounts').updateOne({
          _id: account?._id,
        }, {
          $set: {
            [dummyField]: dummyValue,
          },
        }, {
          session,
        });

        const accountSession = await Mongo.collection('accounts').findOne({}, { session });
        expect(accountSession).toBeDefined();
        expect(accountSession?.dummyField).toBe(dummyValue);

        throw new Error('Dummy error');
      });
    } catch (err) {
      expect(err).toBeDefined();
    }

    const accountAfter = await Mongo.collection('accounts').findOne();
    expect(accountAfter).toBeDefined();
    expect(accountAfter?.dummyField).toBeUndefined();
  });

  test('abortTransaction', async () => {
    const dummyField = 'dummyField';
    const dummyValue = 'dummyValue';

    const account = await Mongo.collection('accounts').findOne();
    expect(account).toBeDefined();
    expect(account?.dummyField).toBeUndefined();

    const res = await runDBTransaction(async (session) => {
      expect(session).toBeDefined();

      await Mongo.collection('accounts').updateOne({
        _id: account?._id,
      }, {
        $set: {
          [dummyField]: dummyValue,
        },
      }, {
        session,
      });

      const accountSession = await Mongo.collection('accounts').findOne({}, { session });
      expect(accountSession).toBeDefined();
      expect(accountSession?.dummyField).toBe(dummyValue);

      await session.abortTransaction();
    });
    expect(res).toBeUndefined();

    const accountAfter = await Mongo.collection('accounts').findOne();
    expect(accountAfter).toBeDefined();
    expect(accountAfter?.dummyField).toBeUndefined();
  });
});
