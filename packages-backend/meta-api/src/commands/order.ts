import {
  MetatraderDeal, MetatraderOrder, MetatraderPosition, MetatraderTradeResponse,
} from 'metaapi.cloud-sdk';

import { ActionType, sendRequest, TMetaApiConnection } from '..';

/*
{
  "id": "266126022",
  "platform": "mt4",
  "type": "ORDER_TYPE_BUY",
  "state": "ORDER_STATE_FILLED",
  "symbol": "AUDUSD",
  "magic": 0,
  "time": "2023-04-19T06:12:31.000Z",
  "brokerTime": "2023-04-19 06:12:31.000",
  "openPrice": 0.67187,
  "volume": 0.01,
  "currentVolume": 0,
  "positionId": "266126022",
  "reason": "ORDER_REASON_UNKNOWN",
  "fillingMode": "ORDER_FILLING_FOK",
  "expirationType": "ORDER_TIME_SPECIFIED",
  "doneTime": "2023-04-19T06:12:31.000Z",
  "doneBrokerTime": "2023-04-19 06:12:31.000",
  "accountCurrencyExchangeRate": 1,
  "brokerComment": "copy-66449427",
  "comment": "copy-66449427"
},
{
  "id": "266006159",
  "platform": "mt4",
  "type": "ORDER_TYPE_SELL",
  "state": "ORDER_STATE_FILLED",
  "symbol": "USDJPY",
  "magic": 0,
  "time": "2023-04-19T06:13:59.000Z",
  "brokerTime": "2023-04-19 06:13:59.000",
  "openPrice": 134.619,
  "volume": 0.01,
  "currentVolume": 0,
  "positionId": "266006159",
  "reason": "ORDER_REASON_UNKNOWN",
  "fillingMode": "ORDER_FILLING_FOK",
  "expirationType": "ORDER_TIME_SPECIFIED",
  "doneTime": "2023-04-19T06:13:59.000Z",
  "doneBrokerTime": "2023-04-19 06:13:59.000",
  "accountCurrencyExchangeRate": 1,
  "stopLoss": 134.103,
  "takeProfit": 135,
  "brokerComment": "copy-66439726",
  "comment": "copy-66439726"
},
*/
export const getHistory = async (
  connection: TMetaApiConnection,
  fromTimeISO: string, // 2023-04-18T10:00:00.000Z
  toTimeISO: string, // 2023-04-19T10:00:00.000Z
  accountId?: string,
) => {
  const res = await sendRequest<MetatraderDeal[]>({
    url: `/users/current/accounts/${accountId || connection.accountId}/history-orders/time/${fromTimeISO}/${toTimeISO}`,
    clientSecret: connection.clientSecret,
  });
  return res;
};

/*
{
  id: '265658209',
  platform: 'mt4',
  type: 'DEAL_TYPE_BUY',
  time: '2023-04-19T08:31:08.000Z',
  brokerTime: '2023-04-19 08:31:08.000',
  commission: 0,
  swap: 0,
  profit: 2.17,
  symbol: 'AUDUSD',
  magic: 0,
  orderId: '265658209',
  positionId: '265658209',
  reason: 'DEAL_REASON_UNKNOWN',
  brokerComment: 'copy-114869221',
  comment: 'copy-114869221',
  entryType: 'DEAL_ENTRY_OUT',
  volume: 0.01,
  price: 0.67113,
  stopLoss: 0.71305,
  takeProfit: 0.6693,
  accountCurrencyExchangeRate: 1,
  updateSequenceNumber: 1681893068000007
},
{
  id: '266235155',
  platform: 'mt4',
  type: 'DEAL_TYPE_BUY',
  time: '2023-04-19T08:54:21.000Z',
  brokerTime: '2023-04-19 08:54:21.000',
  commission: 0,
  swap: 0,
  profit: 0,
  symbol: 'GBPUSD',
  magic: 0,
  orderId: '266235155',
  positionId: '266235155',
  reason: 'DEAL_REASON_UNKNOWN',
  brokerComment: 'copy-66472932',
  comment: 'copy-66472932',
  entryType: 'DEAL_ENTRY_IN',
  volume: 0.01,
  price: 1.24365,
  accountCurrencyExchangeRate: 1,
  updateSequenceNumber: 1681894461000012
},
*/
export const getDeals = async (
  connection: TMetaApiConnection,
  fromTimeISO: string, // 2023-04-18T10:00:00.000Z
  toTimeISO: string, // 2023-04-19T10:00:00.000Z
  accountId?: string,
) => {
  const res = await sendRequest<MetatraderDeal[]>({
    url: `/users/current/accounts/${accountId || connection.accountId}/history-deals/time/${fromTimeISO}/${toTimeISO}`,
    clientSecret: connection.clientSecret,
  });
  return res;
};

/*
[
  {
    id: '264950920',
    platform: 'mt4',
    type: 'ORDER_TYPE_BUY_LIMIT',
    state: 'ORDER_STATE_PLACED',
    symbol: 'XAUUSD',
    magic: 0,
    time: '2023-04-14T20:24:36.000Z',
    brokerTime: '2023-04-14 20:24:36.000',
    openPrice: 2000,
    volume: 0.01,
    currentVolume: 0.01,
    positionId: '264950920',
    reason: 'ORDER_REASON_UNKNOWN',
    fillingMode: 'ORDER_FILLING_FOK',
    expirationType: 'ORDER_TIME_SPECIFIED',
    currentPrice: 2004.29,
    accountCurrencyExchangeRate: 1,
    stopLoss: 1000,
    takeProfit: 3000,
    updateSequenceNumber: 1681507392000000
  },
  {
    id: '264954504',
    platform: 'mt4',
    type: 'ORDER_TYPE_BUY_LIMIT',
    state: 'ORDER_STATE_PLACED',
    symbol: 'BTCUSD',
    magic: 0,
    time: '2023-04-14T21:23:12.000Z',
    brokerTime: '2023-04-14 21:23:12.000',
    openPrice: 28713.26,
    volume: 0.01,
    currentVolume: 0.01,
    positionId: '264954504',
    reason: 'ORDER_REASON_UNKNOWN',
    fillingMode: 'ORDER_FILLING_FOK',
    expirationType: 'ORDER_TIME_SPECIFIED',
    currentPrice: 30306.35,
    accountCurrencyExchangeRate: 1,
    updateSequenceNumber: 1681507392000000
  }
]
*/
export const getOrders = async (
  connection: TMetaApiConnection,
  accountId?: string,
) => {
  const res = await sendRequest<MetatraderOrder[]>({
    url: `/users/current/accounts/${accountId || connection.accountId}/orders`,
    clientSecret: connection.clientSecret,
  });
  return res;
};

/*
{
  numericCode: 0,
  stringCode: 'ERR_NO_ERROR',
  message: 'No error returned',
  orderId: '264984968',
  tradeExecutionTime: '2023-04-16T00:28:57.500Z',
  tradeStartTime: '2023-04-16T00:28:57.742Z'
}
*/
export const newOrder = (
  connection: TMetaApiConnection,
  options: {
    symbol: string,
    actionType: ActionType,
    lot: number,

    openPrice?: number,
    stopLoss?: number,
    takeProfit?: number,
    comment?: string,
  },
  accountId?: string,
) => sendRequest<MetatraderTradeResponse>({
  method: 'post',
  url: `/users/current/accounts/${accountId || connection.accountId}/trade`,
  clientSecret: connection.clientSecret,
  data: {
    symbol: options.symbol,
    actionType: options.actionType,
    volume: options.lot,
    openPrice: options.openPrice,
    ...(options.stopLoss && {
      stopLoss: options.stopLoss,
    }),
    ...(options.takeProfit && {
      takeProfit: options.takeProfit,
    }),
    comment: options.comment,
  },
});

export const updateOrder = (
  connection: TMetaApiConnection,
  orderId: string,
  options: {
    openPrice?: number,
    stopLoss?: number,
    takeProfit?: number,
  },
  accountId?: string,
) => sendRequest<MetatraderTradeResponse>({
  method: 'post',
  url: `/users/current/accounts/${accountId || connection.accountId}/trade`,
  clientSecret: connection.clientSecret,
  data: {
    actionType: 'ORDER_MODIFY',
    orderId,
    openPrice: options.openPrice,
    ...(options.stopLoss && {
      stopLoss: options.stopLoss,
    }),
    ...(options.takeProfit && {
      takeProfit: options.takeProfit,
    }),
  },
});

export const cancelOrder = async (
  connection: TMetaApiConnection,
  orderId: string,
  accountId?: string,
) => sendRequest<MetatraderTradeResponse>({
  method: 'post',
  url: `/users/current/accounts/${accountId || connection.accountId}/trade`,
  clientSecret: connection.clientSecret,
  data: {
    actionType: 'ORDER_CANCEL',
    orderId,
  },
});

/*
[
  {
    id: '264499346',
    platform: 'mt4',
    type: 'POSITION_TYPE_BUY',
    symbol: 'XAUUSD',
    magic: 0,
    time: '2023-04-14T06:27:02.000Z',
    brokerTime: '2023-04-14 06:27:02.000',
    updateTime: '2023-04-14T06:27:02.000Z',
    openPrice: 2043.3,
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
    currentPrice: 2004.29,
    currentTickValue: 0.1,
    unrealizedProfit: -39.01,
    profit: -39.01,
    updateSequenceNumber: 1681453622000000
  },
  {
    id: '264984805',
    platform: 'mt4',
    type: 'POSITION_TYPE_BUY',
    symbol: 'ETHUSD',
    magic: 0,
    time: '2023-04-16T00:15:59.000Z',
    brokerTime: '2023-04-16 00:15:59.000',
    updateTime: '2023-04-16T00:15:59.000Z',
    openPrice: 2089.9900000000002,
    volume: 1,
    swap: 0,
    realizedSwap: 0,
    unrealizedSwap: 0,
    commission: 0,
    realizedCommission: 0,
    unrealizedCommission: 0,
    realizedProfit: 0,
    reason: 'POSITION_REASON_UNKNOWN',
    accountCurrencyExchangeRate: 1,
    unrealizedProfit: 1.3,
    profit: 1.3,
    currentPrice: 2091.29,
    currentTickValue: 0.01,
    updateSequenceNumber: 1681604159000013
  }
]
*/
export const getPositions = async (
  connection: TMetaApiConnection,
  accountId?: string,
) => {
  const res = await sendRequest<MetatraderPosition[]>({
    url: `/users/current/accounts/${accountId || connection.accountId}/positions`,
    clientSecret: connection.clientSecret,
  });
  return res;
};

export const updatePosition = (
  connection: TMetaApiConnection,
  positionId: string,
  options: {
    stopLoss?: number,
    takeProfit?: number,
  },
  accountId?: string,
) => sendRequest<MetatraderTradeResponse>({
  method: 'post',
  url: `/users/current/accounts/${accountId || connection.accountId}/trade`,
  clientSecret: connection.clientSecret,
  data: {
    actionType: 'POSITION_MODIFY',
    positionId,
    ...(options.stopLoss && {
      stopLoss: options.stopLoss,
    }),
    ...(options.takeProfit && {
      takeProfit: options.takeProfit,
    }),
  },
});

export const closePosition = (
  connection: TMetaApiConnection,
  positionId: string,
  accountId?: string,
) => sendRequest<MetatraderTradeResponse>({
  method: 'post',
  url: `/users/current/accounts/${accountId || connection.accountId}/trade`,
  clientSecret: connection.clientSecret,
  data: {
    actionType: 'POSITION_CLOSE_ID',
    positionId,
  },
});
