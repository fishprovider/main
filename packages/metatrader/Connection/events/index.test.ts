import startAccount from '~commands/startAccount';
import subAccount from '~commands/subAccount';
// import subSpot from '~commands/subSpot';
import { CallbackType } from '~constants/metaApi';
import { createConnection, destroyConnection } from '~dev/utils';
import type { ConnectionType } from '~types/Connection.model';

/*
{
  type: 'appStatus',
  accountId: 'bbbb4df6-b4cd-4286-9c5f-4eadd0cc94f6',
  connected: true
}
{
  type: 'account',
  accountId: '5b05a086-65e5-4c66-9ab5-586952e3f949',
  accountInformation: {
    platform: 'mt4',
    broker: 'Exness Technologies Ltd',
    currency: 'USD',
    server: 'Exness-Trial8',
    balance: 2017.91,
    equity: 2017.7900000000002,
    margin: 13.29,
    freeMargin: 2004.5000000000002,
    leverage: 50,
    marginLevel: 15182.768999247557,
    name: 'Dev Pro',
    login: 69291513,
    credit: 0,
    tradeAllowed: true,
    investorMode: false,
    marginMode: 'ACCOUNT_MARGIN_MODE_RETAIL_HEDGING',
    type: 'ACCOUNT_TRADE_MODE_CONTEST'
  }
}
{
  type: 'price',
  accountId: 'bbbb4df6-b4cd-4286-9c5f-4eadd0cc94f6',
  price: {
    time: 2023-04-14T20:20:43.000Z,
    brokerTime: '2023-04-14 20:20:43.000',
    symbol: 'XAGUSD',
    ask: 25.393,
    bid: 25.363,
    accountCurrencyExchangeRate: 1,
    profitTickValue: 5,
    lossTickValue: 5,
    timestamps: {
      eventGenerated: 2023-04-14T20:20:43.500Z,
      serverProcessingStarted: 2023-04-14T20:20:43.369Z,
      serverProcessingFinished: 2023-04-14T20:20:43.371Z
    },
    equity: 918.03
  }
}
{
  type: 'position',
  accountId: '5b05a086-65e5-4c66-9ab5-586952e3f949',
  position: {
    id: '187604575',
    platform: 'mt4',
    type: 'POSITION_TYPE_BUY',
    symbol: 'AUDUSD',
    magic: 0,
    time: 2022-11-21T02:58:39.000Z,
    brokerTime: '2022-11-21 02:58:39.000',
    updateTime: 2022-11-21T02:58:39.000Z,
    openPrice: 0.66433,
    volume: 0.01,
    swap: 0,
    realizedSwap: 0,
    unrealizedSwap: 0,
    commission: 0,
    realizedCommission: 0,
    unrealizedCommission: 0,
    realizedProfit: 0,
    reason: 'POSITION_REASON_UNKNOWN',
    accountCurrencyExchangeRate: 1,
    stopLoss: 2000,
    takeProfit: 4000,
    unrealizedProfit: -0.12,
    profit: -0.12,
    currentPrice: 0.66424,
    currentTickValue: 1,
    updateSequenceNumber: 1668999519000008
  }
}
{
  type: 'removePosition',
  accountId: 'bbbb4df6-b4cd-4286-9c5f-4eadd0cc94f6',
  positionId: '264495914'
}
{
  type: 'order',
  accountId: 'bbbb4df6-b4cd-4286-9c5f-4eadd0cc94f6',
  order: {
    id: '264497204',
    platform: 'mt4',
    type: 'ORDER_TYPE_BUY_LIMIT',
    state: 'ORDER_STATE_PLACED',
    symbol: 'NZDUSD',
    magic: 0,
    time: 2023-04-14T06:15:20.000Z,
    brokerTime: '2023-04-14 06:15:20.000',
    openPrice: 0.62333,
    volume: 0.01,
    currentVolume: 0.01,
    positionId: '264497204',
    reason: 'ORDER_REASON_UNKNOWN',
    fillingMode: 'ORDER_FILLING_FOK',
    expirationType: 'ORDER_TIME_SPECIFIED',
    currentPrice: 0.63054,
    accountCurrencyExchangeRate: 1,
    stopLoss: 2000,
    takeProfit: 4000,
    updateSequenceNumber: 1681452920000010
  }
}
{
  type: 'completeOrder',
  accountId: 'bbbb4df6-b4cd-4286-9c5f-4eadd0cc94f6',
  orderId: '264497204'
}
{
  type: 'history',
  accountId: 'bbbb4df6-b4cd-4286-9c5f-4eadd0cc94f6',
  order: {
    id: '266667398',
    platform: 'mt4',
    type: 'ORDER_TYPE_BUY',
    state: 'ORDER_STATE_FILLED',
    symbol: 'XAGUSD',
    magic: 0,
    time: 2023-04-20T05:12:25.000Z,
    brokerTime: '2023-04-20 05:12:25.000',
    openPrice: 25.087,
    volume: 0.01,
    currentVolume: 0,
    positionId: '266667398',
    reason: 'ORDER_REASON_UNKNOWN',
    fillingMode: 'ORDER_FILLING_FOK',
    expirationType: 'ORDER_TIME_SPECIFIED',
    doneTime: 2023-04-20T05:12:25.000Z,
    doneBrokerTime: '2023-04-20 05:12:25.000',
    accountCurrencyExchangeRate: 1,
    brokerComment: 'copy-329808940',
    comment: 'copy-329808940',
    updateSequenceNumber: 1681986949000049
  }
}
{
  type: 'deal',
  accountId: 'bbbb4df6-b4cd-4286-9c5f-4eadd0cc94f6',
  deal: {
    id: '266657555',
    platform: 'mt4',
    type: 'DEAL_TYPE_SELL',
    time: 2023-04-20T04:23:18.000Z,
    brokerTime: '2023-04-20 04:23:18.000',
    commission: 0,
    swap: 0,
    profit: 0,
    symbol: 'AUDUSD',
    magic: 0,
    orderId: '266657555',
    positionId: '266657555',
    reason: 'DEAL_REASON_UNKNOWN',
    brokerComment: 'copy-66544323',
    comment: 'copy-66544323',
    entryType: 'DEAL_ENTRY_IN',
    volume: 0.01,
    price: 0.67049,
    accountCurrencyExchangeRate: 1,
    updateSequenceNumber: 1681986949000050
  }
}
{
  type: 'deal',
  accountId: 'bbbb4df6-b4cd-4286-9c5f-4eadd0cc94f6',
  deal: {
    id: '266582522',
    platform: 'mt4',
    type: 'DEAL_TYPE_BUY',
    time: 2023-04-20T02:55:57.000Z,
    brokerTime: '2023-04-20 02:55:57.000',
    commission: 0,
    swap: 0,
    profit: 2.79,
    symbol: 'NZDUSD',
    magic: 0,
    orderId: '266582522',
    positionId: '266582421',
    reason: 'DEAL_REASON_UNKNOWN',
    brokerComment: 'from #266582421',
    entryType: 'DEAL_ENTRY_OUT',
    volume: 0.03,
    price: 0.61605,
    accountCurrencyExchangeRate: 1,
    updateSequenceNumber: 1681986949000050
  }
}
*/

let connection: ConnectionType;

beforeAll((done) => {
  (async () => {
    try {
      connection = await createConnection(
        (payload) => {
          const ignoreLogEvents = [
            CallbackType.account,
            CallbackType.price,
          ];
          if (!ignoreLogEvents.includes(payload.type)) {
            console.log('onEvent', payload);
          }
        },
      );
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

test('default', async () => {
  await connection.start();
  await startAccount(connection);
  await subAccount(connection);

  await new Promise((resolve) => {
    setTimeout(async () => {
      resolve(true);
    }, 5000);
  });
});

// test('spot', async () => {
//   await connection.start();
//   await startAccount(connection);
//   await subAccount(connection);

//   await subSpot(connection, 'EURUSD');
//   await subSpot(connection, 'XAUUSD');
//   await subSpot(connection, 'ETHUSD');

//   await new Promise((resolve) => {
//     setTimeout(async () => {
//       resolve(true);
//     }, 5000);
//   });
// });
