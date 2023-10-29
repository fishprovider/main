import { delay } from '@fishprovider/core';

import {
  authorizeAccount, Connection, CTraderCallbackPayload, CTraderConfig, renewTokens,
} from '..';

const retryOnServerMaintenanceMs = 1000 * 60 * 10; // 10 mins
const retryOnLimitExceededMs = 1000 * 60 * 2; // 2 mins

type Tokens = Awaited<ReturnType<typeof renewTokens>>;

async function authorize(params: {
  connection: Connection,
  accountId: string,
  accessToken: string,
  refreshToken: string,
  onTokens: (tokens: Tokens) => void | Promise<void>,
}) {
  const {
    connection, accountId, accessToken, refreshToken,
    onTokens,
  } = params;
  try {
    await authorizeAccount(connection, accessToken, accountId);
    console.debug(`Authorized account ${accountId}`);
  } catch (err: any) {
    if (err.message.includes('CH_ACCESS_TOKEN_INVALID')) {
      console.warn(`Invalid accessToken ${accountId}`);

      const tokens = await renewTokens(connection, refreshToken);
      await onTokens(tokens);

      await authorizeAccount(connection, tokens.accessToken, accountId);
      console.warn(`Re-authorized account ${accountId}`);
    }
    throw err;
  }
}

export async function connect({
  config,
  onEvent = () => undefined,
  onError = () => undefined,
  onClose = () => undefined,
  onTokens = () => undefined,
}: {
  config: CTraderConfig,
  onEvent?: (_: CTraderCallbackPayload) => void,
  onError?: (_: any) => void,
  onClose?: () => void,
  onTokens?: (tokens: Tokens) => void | Promise<void>,
}) {
  const connection = new Connection(config, onEvent, onError, onClose);
  try {
    await connection.start();
  } catch (err: any) {
    if (err.message.includes('CANT_ROUTE_REQUEST')) {
      console.warn(`[Maintenance] Retry after ${retryOnServerMaintenanceMs}ms`);
      await delay(retryOnServerMaintenanceMs);
      await connection.start();
    } else if (err.message.includes('CONNECTIONS_LIMIT_EXCEEDED')) {
      console.warn(`[Limit Exceeded] Retry after ${retryOnLimitExceededMs}ms`);
      await delay(retryOnLimitExceededMs);
      await connection.start();
    } else {
      console.error('🔥 Failed to connect', err);
      throw err;
    }
  }

  const { accountId, accessToken, refreshToken } = connection;
  if (accountId) {
    if (!accessToken || !refreshToken) {
      console.error(`Missing accessToken or refreshToken ${accountId}`);
    } else {
      await authorize({
        connection,
        accountId,
        accessToken,
        refreshToken,
        onTokens,
      });
    }
  }

  return connection;
}

export async function connectAndRun<T>({
  config,
  handler,
}: {
  config: CTraderConfig,
  handler: (_: Connection) => Promise<T>,
}) {
  const connection = await connect({ config });
  let res;
  try {
    res = await handler(connection);
  } finally {
    await connection.destroy();
  }
  return res;
}
