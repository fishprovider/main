import type { MetatraderAccountInformation } from 'metaapi.cloud-sdk';

import type { ConnectionType } from '~types/Connection.model';
import { sendRequest } from '~utils/url';

/*
{
  platform: 'mt4',
  broker: 'Exness Technologies Ltd',
  currency: 'USD',
  server: 'Exness-Trial8',
  balance: 956.34,
  equity: 916.53,
  margin: 46.09,
  freeMargin: 870.44,
  leverage: 50,
  marginLevel: 1988.5658494250379,
  name: 'Dev Pro',
  login: 69291513,
  credit: 0,
  tradeAllowed: true,
  investorMode: false,
  marginMode: 'ACCOUNT_MARGIN_MODE_RETAIL_HEDGING',
  type: 'ACCOUNT_TRADE_MODE_CONTEST'
}
*/

const getAccountInformation = async (
  connection: ConnectionType,
  accountId?: string,
) => {
  const res = await sendRequest<MetatraderAccountInformation>({
    url: `/users/current/accounts/${accountId || connection.accountId}/accountInformation`,
    clientSecret: connection.clientSecret,
  });
  return res;
};

export default getAccountInformation;
