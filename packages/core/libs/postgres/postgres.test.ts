import { destroy, start } from './postgres';

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
      await destroy();
    } finally {
      done();
    }
  })();
});

test('Postgres select now', async () => {
  const res = await Postgres.pool.query('SELECT NOW()');
  expect(res).toBeDefined();
});
