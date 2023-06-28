import type { MetatraderDeal } from 'metaapi.cloud-sdk';

import type { ConnectionType } from '~types/Connection.model';
import { sendRequest } from '~utils/url';

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

const getDeals = async (
  connection: ConnectionType,
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

export default getDeals;
