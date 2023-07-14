import authorizeAccountCTrader from '@fishprovider/ctrader/dist/commands/authorizeAccount';
import type { ConnectionType } from '@fishprovider/ctrader/dist/types/Connection.model';

import renewTokens from './renewTokens';

const authorizeAccount = async (params: {
  connection: ConnectionType,
  providerId: string,
  accountId: string,
  accessToken: string,
  refreshToken: string,
  enableRenewTokens?: boolean,
}) => {
  const {
    connection, providerId, accountId, accessToken, refreshToken,
    enableRenewTokens = true,
  } = params;
  try {
    await authorizeAccountCTrader(connection, accessToken, accountId);
    Logger.debug(`Authorized account ${providerId} ${accountId}`);
  } catch (err: any) {
    if (enableRenewTokens && err.message.includes('CH_ACCESS_TOKEN_INVALID')) {
      Logger.warn(`Invalid accessToken ${providerId} ${accountId}`);

      const tokens = await renewTokens(connection, refreshToken);

      await authorizeAccountCTrader(connection, tokens.accessToken, accountId);
      Logger.warn(`Re-authorized account ${providerId} ${accountId}`);
    }
    throw err;
  }
};

export default authorizeAccount;
