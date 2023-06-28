import type { MetatraderTradeResponse } from 'metaapi.cloud-sdk';

import type { ConnectionType } from '~types/Connection.model';
import { sendRequest } from '~utils/url';

const cancelOrder = async (
  connection: ConnectionType,
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

export default cancelOrder;
