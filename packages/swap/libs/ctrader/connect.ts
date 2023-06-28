import Connection from '@fishbot/ctrader/Connection';
import type { Config } from '@fishbot/ctrader/types/Config.model';
import type { CallbackPayload } from '@fishbot/ctrader/types/Event.model';
import delay from '@fishbot/utils/helpers/delay';

import authorizeAccount from './authorizeAccount';

const retryOnServerMaintenanceMs = 1000 * 60 * 10; // 10 mins
const retryOnLimitExceededMs = 1000 * 60 * 2; // 2 mins

const connect = async ({
  providerId, config: configRaw, onEvent, onError, onClose,
}: {
  providerId: string,
  config: Config,
  onEvent: (_: CallbackPayload) => void,
  onError: (_: any) => void,
  onClose: () => void,
}) => {
  const config = {
    ...configRaw,
    name: providerId,
  };
  const connection = new Connection(
    config,
    onEvent,
    onError,
    onClose,
  );
  try {
    await connection.start();
  } catch (err: any) {
    if (err.message.includes('CANT_ROUTE_REQUEST')) {
      Logger.warn(`[Maintenance] Retry after ${retryOnServerMaintenanceMs}ms`);
      await delay(retryOnServerMaintenanceMs);
      await connection.start();
    } else if (err.message.includes('CONNECTIONS_LIMIT_EXCEEDED')) {
      Logger.warn(`[Limit Exceeded] Retry after ${retryOnLimitExceededMs}ms`);
      await delay(retryOnLimitExceededMs);
      await connection.start();
    } else {
      Logger.error('🔥 Failed to connect', err);
      throw err;
    }
  }

  const { accountId, accessToken, refreshToken } = connection;
  if (accountId) {
    if (!accessToken || !refreshToken) {
      Logger.error(`Missing accessToken or refreshToken ${providerId} ${accountId}`);
    } else {
      await authorizeAccount({
        connection, providerId, accountId, accessToken, refreshToken,
      });
    }
  }

  return connection;
};

export default connect;
