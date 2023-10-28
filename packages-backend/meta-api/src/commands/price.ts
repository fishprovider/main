import { MetatraderSymbolSpecification, MetatraderTick } from 'metaapi.cloud-sdk';

import { sendRequest, TMetaApiConnection } from '..';

/*
[
  'AAPL',   'ABBV',   'ABT',    'ADAUSD', 'ADBE',   'ADP',
  'AMD',    'AMGN',   'AMT',    'AMZN',   'ATVI',   'AUDCAD',
  'AUDCHF', 'AUDCZK', 'AUDDKK', 'AUDHKX', 'AUDHUF', 'AUDJPX',
  'AUDJPY', 'AUDMXN', 'AUDNOK', 'AUDNZD', 'AUDPLN', 'AUDSEK',
  'AUDSGD', 'AUDTRY', 'AUDUSD', 'AUDUSX', 'AUDZAR', 'AUS200',
  'AUXAUD', 'AUXTHB', 'AUXUSD', 'AUXZAR', 'AVGO',   'BA',
  'BABA',   'BAC',    'BATUSD', 'BCHUSD', 'BIIB',   'BMY',
  'BNBUSD', 'BTCAUD', 'BTCCNH', 'BTCJPY', 'BTCKRW', 'BTCTHB',
  'BTCUSD', 'BTCXAG', 'BTCXAU', 'BTCZAR', 'C',      'CADCHF',
  'CADCZK', 'CADJPY', 'CADMXN', 'CADNOK', 'CADPLN', 'CADTRY',
  'CHFDKK', 'CHFHUF', 'CHFJPY', 'CHFMXN', 'CHFNOK', 'CHFPLN',
  'CHFSEK', 'CHFSGD', 'CHFTRY', 'CHFZAR', 'CHTR',   'CMCSA',
  'CME',    'COST',   'CSCO',   'CSX',    'CVS',    'CZKPLN',
  'DE30',   'DKKCZK', 'DKKHUF', 'DKKJPY', 'DKKPLN', 'DKKSGD',
  'DKKZAR', 'DOTUSD', 'DXY',    'EA',     'EBAY',   'ENJUSD',
  'EQIX',   'ETHUSD', 'EURAUD', 'EURAUX', 'EURCAD', 'EURCHF',
  'EURCZK', 'EURDKK', 'EURGBP', 'EURGBX',
  ... 313 more items
]
*/
export const getSymbolList = async (
  connection: TMetaApiConnection,
  accountId?: string,
) => {
  const res = await sendRequest<string[]>({
    url: `/users/current/accounts/${accountId || connection.accountId}/symbols`,
    clientSecret: connection.clientSecret,
  });
  return res;
};

/*
{
  symbol: 'EURUSD',
  tickSize: 0.00001,
  fillingModes: [ 'SYMBOL_FILLING_FOK' ],
  contractSize: 100000,
  quoteSessions: {
    SUNDAY: [ [Object] ],
    MONDAY: [ [Object] ],
    TUESDAY: [ [Object] ],
    WEDNESDAY: [ [Object] ],
    THURSDAY: [ [Object] ],
    FRIDAY: [ [Object] ],
    SATURDAY: []
  },
  tradeSessions: {
    SUNDAY: [ [Object] ],
    MONDAY: [ [Object] ],
    TUESDAY: [ [Object] ],
    WEDNESDAY: [ [Object] ],
    THURSDAY: [ [Object] ],
    FRIDAY: [ [Object] ],
    SATURDAY: []
  },
  initialMargin: 0,
  maintenanceMargin: 0,
  hedgedMargin: 0,
  hedgedMarginUsesLargerLeg: false,
  priceCalculationMode: 'SYMBOL_CALC_MODE_FOREX',
  marginCurrency: 'EUR',
  baseCurrency: 'EUR',
  swapMode: 'SYMBOL_SWAP_MODE_POINTS',
  allowedExpirationModes: [ 'SYMBOL_EXPIRATION_SPECIFIED' ],
  allowedOrderTypes: [
    'SYMBOL_ORDER_MARKET',
    'SYMBOL_ORDER_LIMIT',
    'SYMBOL_ORDER_STOP',
    'SYMBOL_ORDER_SL',
    'SYMBOL_ORDER_TP',
    'SYMBOL_ORDER_CLOSEBY'
  ],
  digits: 5,
  description: 'Euro vs US Dollar',
  stopsLevel: 0,
  freezeLevel: 0,
  swapLong: -6.2,
  swapShort: 0,
  swapRollover3Days: 'WEDNESDAY',
  minVolume: 0.01,
  maxVolume: 200,
  volumeStep: 0.01,
  executionMode: 'SYMBOL_TRADE_EXECUTION_REQUEST',
  tradeMode: 'SYMBOL_TRADE_MODE_FULL',
  pipSize: 0.0001,
  lotSize: 100000
}
*/
export const getSymbolDetail = async (
  connection: TMetaApiConnection,
  symbol: string,
  accountId?: string,
) => {
  const res = await sendRequest<MetatraderSymbolSpecification>({
    url: `/users/current/accounts/${accountId || connection.accountId}/symbols/${symbol}/specification`,
    clientSecret: connection.clientSecret,
  });

  return res;
};

/*
{
  "symbol": "AUDNZD",
  "time": "2020-04-07T03:45:00.000Z",
  "brokerTime": "2020-04-07 06:45:00.000",
  "bid": 1.05297,
  "ask": 1.05309,
  "last": 0.5298,
  "volume": 0.13,
  "side": "buy"
*/
export const getSymbolTick = async (
  connection: TMetaApiConnection,
  symbol: string,
  accountId?: string,
) => {
  const res = await sendRequest<MetatraderTick>({
    url: `/users/current/accounts/${accountId || connection.accountId}/symbols/${symbol}/current-tick?keepSubscription=true`,
    clientSecret: connection.clientSecret,
  });

  return res;
};

export const subSpot = async (
  connection: TMetaApiConnection,
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
};

export const unsubSpot = async (
  connection: TMetaApiConnection,
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
};
