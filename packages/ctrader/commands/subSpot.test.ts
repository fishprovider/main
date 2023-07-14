import delay from '@fishprovider/utils/dist/helpers/delay';
import { jest } from '@jest/globals';

import * as handleEventPrice from '~Connection/events/price';
import { createConnection, destroyConnection } from '~dev/utils';
import type { ConnectionType } from '~types/Connection.model';

import getSymbolList from './getSymbolList';
import subSpot from './subSpot';
import unsubSpot from './unsubSpot';

let connection: ConnectionType;
let symbolId = '';

beforeAll((done) => {
  (async () => {
    try {
      connection = await createConnection();
      const { symbols } = await getSymbolList(connection);
      const symbol = symbols.find(({ symbolName }) => symbolName === 'EURUSD');
      symbolId = symbol?.symbolId || '';
    } catch (err) {
      Logger.error('Failed to connect', err);
    } finally {
      done();
    }
  })();
});

afterAll((done) => {
  (async () => {
    try {
      await destroyConnection(connection);
    } catch (err) {
      Logger.error('Failed to destroy', err);
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

test.skip('subSpot', async () => {
  expect(connection).toBeDefined();
  const spy = jest.spyOn(handleEventPrice, 'default').mockImplementation((payload) => {
    console.log(payload);
  });

  try {
    await subSpot(connection, symbolId);

    await waitForSpyObjCalled(spy);

    expect(spy).toBeCalled();
  } finally {
    await unsubSpot(connection, symbolId);
  }
});
