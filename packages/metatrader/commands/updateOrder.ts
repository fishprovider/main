import type { MetatraderTradeResponse } from 'metaapi.cloud-sdk';

import type { ConnectionType } from '~types/Connection.model';
import { sendRequest } from '~utils/url';

interface UpdateOrderOptions extends Record<string, any> {
  openPrice?: number,
  stopLoss?: number,
  takeProfit?: number,
}

const updateOrder = (
  connection: ConnectionType,
  orderId: string,
  options: UpdateOrderOptions,
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

export default updateOrder;
