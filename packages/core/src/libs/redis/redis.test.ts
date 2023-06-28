import { destroyAsync, start } from './redis';

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

test('Redis get/set', async () => {
  const data = { foo: 'abc', baz: 'xyz' };

  await Redis.set('test', JSON.stringify(data));
  const rawData = await Redis.get('test');

  expect(rawData).toBeDefined();
  expect(JSON.parse(rawData || '')).toEqual(data);
});
