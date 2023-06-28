import moment from 'moment';

import getHistory from '~commands/getHistory';
import { createConnection, destroyConnection } from '~dev/utils';
import type { ConnectionType } from '~types/Connection.model';

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

test('getHistory', async () => {
  expect(connection).toBeDefined();
  const from = moment().subtract(1, 'd').toISOString();
  const to = moment().toISOString();
  const result = await getHistory(connection, from, to);
  Logger.debug(result);
  expect(result?.length).toBeGreaterThanOrEqual(0);
});
