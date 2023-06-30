import { createConnection, destroyConnection } from '~dev/utils';
import type { ConnectionType } from '~types/Connection.model';

import getAccountInfoMarginCross from './getAccountInfoMarginCross';
import getAccountInfoMarginIsolated from './getAccountInfoMarginIsolated';
import getAccountInfoSpot from './getAccountInfoSpot';

let connection: ConnectionType;

beforeAll((done) => {
  (async () => {
    try {
      connection = await createConnection();
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

test('getAccountInfoSpot', async () => {
  const info = await getAccountInfoSpot(connection);
  expect(info).toBeDefined();
});

test('getAccountInfoMarginCross', async () => {
  const info = await getAccountInfoMarginCross(connection);
  expect(info).toBeDefined();
});

test('getAccountInfoMarginIsolated', async () => {
  const info = await getAccountInfoMarginIsolated(connection);
  expect(info).toBeDefined();
});
