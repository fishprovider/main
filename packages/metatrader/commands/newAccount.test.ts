import { ProviderType } from '@fishbot/utils/constants/account';
import { ErrorType } from '@fishbot/utils/constants/error';

import newAccount from '~commands/newAccount';
import removeAccount from '~commands/removeAccount';
import { createConnection, destroyConnection } from '~dev/utils';
import type { ConnectionType } from '~types/Connection.model';

let connection: ConnectionType;

beforeAll((done) => {
  (async () => {
    try {
      connection = await createConnection();

      const clientId = 'marco.dinh91@gmail.com';
      const client = await Mongo.collection<{ clientSecret: string }>('clientSecrets').findOne({
        providerType: ProviderType.exness,
        clientId,
      }, {
        projection: {
          clientSecret: 1,
        },
      });
      if (!client) {
        throw new Error(ErrorType.accountNotFound);
      }

      connection.clientSecret = client.clientSecret;
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

test('newAccount', async () => {
  expect(connection).toBeDefined();
  const result = await newAccount(connection, {
    name: 'test',
    platform: 'mt4',
    login: '69358719',
    password: 'Test1234',
    server: 'Exness-Trial8',
  });
  expect(result?.id).toBeDefined();

  await removeAccount(connection, result.id);
});
