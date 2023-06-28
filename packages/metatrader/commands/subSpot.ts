import type { ConnectionType } from '~types/Connection.model';

const subSpot = async (
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

  // await stream.subscribeToMarketData(symbol, [
  //   { type: 'quotes', intervalInMilliseconds: 5000 },
  //   { type: 'candles', timeframe: '1m', intervalInMilliseconds: 10000 },
  //   { type: 'ticks' },
  //   { type: 'marketDepth', intervalInMilliseconds: 5000 },
  // ]);

  const prevSubscription = stream.subscriptions(symbol)?.find((item) => item.type === 'quotes');
  if (prevSubscription) {
    await stream.unsubscribeFromMarketData(symbol, [prevSubscription]);
  }

  const timeoutInSeconds = 30;
  await Promise.all([
    stream.subscribeToMarketData(
      symbol,
      [{ type: 'quotes', intervalInMilliseconds: 1000 }],
      timeoutInSeconds,
    ),
    new Promise((_1, reject) => {
      setTimeout(() => {
        reject(new Error('timeout'));
      }, timeoutInSeconds * 1000);
    }),
  ]);

  Logger.debug('subSpot', stream.subscriptions(symbol), stream.subscribedSymbols);
};

export default subSpot;
