import type { MetatraderTick } from 'metaapi.cloud-sdk';

import type { ConnectionType } from '~types/Connection.model';
import { sendRequest } from '~utils/url';

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

const getSymbolTick = async (
  connection: ConnectionType,
  symbol: string,
  accountId?: string,
) => {
  const res = await sendRequest<MetatraderTick>({
    url: `/users/current/accounts/${accountId || connection.accountId}/symbols/${symbol}/current-tick?keepSubscription=true`,
    clientSecret: connection.clientSecret,
  });

  return res;
};

export default getSymbolTick;
