import type { ConnectionType } from '~types/Connection.model';

const unsubSpot = async (
  connection: ConnectionType,
  symbol: string,
  accountId?: string,
) => {
  if (!connection.api) {
    throw new Error('api not found');
  }

  const accId = accountId || connection.accountId;
  if (!accId) {
    throw new Error('accountId not found');
  }

  const account = await connection.api.metatraderAccountApi.getAccount(accId);

  const stream = account.getStreamingConnection();
  await stream.connect();
  await stream.waitSynchronized({});

  await stream.unsubscribeFromMarketData(symbol, [
    { type: 'quotes' },
  ]);

  Logger.debug('unsubSpot', stream.subscriptions(symbol), stream.subscribedSymbols);
};

export default unsubSpot;
