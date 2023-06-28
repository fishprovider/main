import { createConnection, destroyConnection } from '~dev/utils';
import type { ConnectionType } from '~types/Connection.model';

import getAccountList from './getAccountList';

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

test('getAccountList', async () => {
  try {
    await getAccountList(connection, 'invalidAccessToken');
    fail('Expected error');
  } catch (err: any) {
    Logger.debug('Handled error', err.message);
    expect(err.message).toContain('CH_ACCESS_TOKEN_INVALID');
  }
});
