import delay from '@fishbot/utils/helpers/delay';
import { jest } from '@jest/globals';

import ServerCommands from '~constants/serverCommands';
import * as serverCommandHandlers from '~controllers/serverCommandHandlers/serverCommandHandlers';
import type { Adapter } from '~types/Adapter.model';

import { destroyAsync, initialize, start } from './agenda';

const env = {
  typeId: process.env.TYPE_ID,
  typePre: process.env.TYPE_PRE,
};

const prefix = `${env.typePre}-${env.typeId}`;

beforeAll((done) => {
  (async () => {
    try {
      await initialize();
      await start({
        enableHeartbeat: true,
        enableLocalRemote: true,
      } as Adapter);
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

const waitForSpyObjCalled = async (spyObj: any) => {
  Logger.debug('waitForSpyObjCalled start', spyObj.mock.results);
  let isCalled = spyObj.mock.results.length > 0;
  while (!isCalled) {
    Logger.debug('waitForSpyObjCalled wait', spyObj.mock.results.length);
    await delay(500);
    isCalled = spyObj.mock.results.length > 0;
  }

  const res = await spyObj.mock.results[0]?.value;
  Logger.debug('waitForSpyObjCalled end', spyObj.mock.results, res);
  return res;
};

test('Agenda heartbeat', async () => {
  const jobName = `${prefix}-heartbeat`;
  const jobs = await Agenda.jobs({
    name: jobName,
  });

  expect(jobs.length).toBeGreaterThan(0);
});

test.skip('Agenda local remote', async () => {
  const spy = jest.spyOn(serverCommandHandlers, 'default');

  await Agenda.now(`${prefix}-remote`, {
    command: ServerCommands.status,
  });

  await waitForSpyObjCalled(spy);

  expect(spy).toBeCalledTimes(1);
  expect(spy).toBeCalledWith({ command: ServerCommands.status });
});
