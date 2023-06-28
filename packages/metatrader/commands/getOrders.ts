import type { MetatraderOrder } from 'metaapi.cloud-sdk';

import type { ConnectionType } from '~types/Connection.model';
import { sendRequest } from '~utils/url';

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

const getOrders = async (
  connection: ConnectionType,
  accountId?: string,
) => {
  const res = await sendRequest<MetatraderOrder[]>({
    url: `/users/current/accounts/${accountId || connection.accountId}/orders`,
    clientSecret: connection.clientSecret,
  });
  return res;
};

export default getOrders;
