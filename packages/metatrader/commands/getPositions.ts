import type { MetatraderPosition } from 'metaapi.cloud-sdk';

import type { ConnectionType } from '~types/Connection.model';
import { sendRequest } from '~utils/url';

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

const getPositions = async (
  connection: ConnectionType,
  accountId?: string,
) => {
  const res = await sendRequest<MetatraderPosition[]>({
    url: `/users/current/accounts/${accountId || connection.accountId}/positions`,
    clientSecret: connection.clientSecret,
  });
  return res;
};

export default getPositions;
