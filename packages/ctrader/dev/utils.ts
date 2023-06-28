import { destroyAsync, start } from '@fishbot/core/libs/mongo';
import type { Account } from '@fishbot/utils/types/Account.model';

import authorizeAccount from '~commands/authorizeAccount';
import renewTokensCTrader from '~commands/renewTokens';
import Connection from '~Connection';
import type { ConnectionType } from '~types/Connection.model';
import type { CallbackPayload } from '~types/Event.model';

const env = {
  typeId: process.env.TYPE_ID || '',
};

const renewTokens = async (connection: ConnectionType, refreshToken: string) => {
  const tokens = await renewTokensCTrader(connection, refreshToken);
  Logger.warn('Got new tokens');

  await Mongo.collection<Account>('accounts').updateMany(
    {
      'config.refreshToken': refreshToken,
    },
    {
      $set: {
        'config.refreshToken': tokens.refreshToken,
        'config.accessToken': tokens.accessToken,
        'config.refreshedAt': new Date(),
      },
    },
  );
  Logger.warn('Saved new tokens');

  return tokens;
};

const getConfig = async () => {
  const account = await Mongo.collection<Account>('accounts').findOne(
    { _id: env.typeId },
    {
      projection: {
        config: 1,
      },
    },
  );
  if (!account) {
    throw new Error('Account not found');
  }
  return account.config;
};

const createConnection = async (
  onEvent?: (_: CallbackPayload) => void,
  configOverride?: any,
): Promise<ConnectionType> => {
  await start();

  const configRaw = await getConfig();
  const config = {
    ...configRaw,
    ...configOverride,
  };

  const connection = new Connection(
    config,
    onEvent || (() => undefined),
    (err: any) => Logger.error('Connection error', err),
    () => undefined,
  );
  await connection.start();

  const { accountId, accessToken, refreshToken } = connection;
  if (accountId) {
    if (!accessToken || !refreshToken) {
      Logger.error(`Missing accessToken or refreshToken ${accountId}`);
    } else {
      try {
        await authorizeAccount(connection);
        Logger.debug(`Authorized account ${accountId}`);
      } catch (err: any) {
        if (err.message.includes('CH_ACCESS_TOKEN_INVALID')) {
          Logger.warn(`Invalid accessToken ${accountId}`);

          const tokens = await renewTokens(connection, refreshToken);

          await authorizeAccount(connection, tokens.accessToken);
          Logger.warn(`Re-authorized account ${accountId}`);
        }
        throw err;
      }
    }
  }

  return connection;
};

const destroyConnection = async (connection: ConnectionType) => {
  if (connection) {
    await connection.destroy();
  }
  await destroyAsync();
};

export {
  createConnection, destroyConnection, getConfig, renewTokens,
};
