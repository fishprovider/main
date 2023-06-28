import { destroyAsync, start } from '~libs/mongo';

import { start as startSysInfo } from './sysinfo';

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

test('SysInfo start', async () => {
  const sysInfoId = await startSysInfo();

  const res = await Mongo.collection<{ _id: string }>('sysinfo').findOne({
    _id: sysInfoId,
  });

  expect(res).toBeDefined();
});
