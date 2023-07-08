import renewTokensCTrader from '@fishprovider/ctrader/commands/renewTokens';
import type { ConnectionType } from '@fishprovider/ctrader/types/Connection.model';

import saveTokens from './saveTokens';

const renewTokens = async (
  connection: ConnectionType,
  refreshToken: string,
) => {
  const { name, accountId, clientId } = connection;
  const label = name || accountId || clientId;
  const tokens = await renewTokensCTrader(connection, refreshToken);
  Logger.warn(`[${label}] Got new tokens`);

  await saveTokens(refreshToken, tokens);
  return tokens;
};

export default renewTokens;
