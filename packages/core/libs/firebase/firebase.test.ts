import { destroyAsync, start } from './firebase';

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

test('Firebase listUsers', async () => {
  const res = await Firebase.auth().listUsers();
  expect(res).toBeDefined();
});
