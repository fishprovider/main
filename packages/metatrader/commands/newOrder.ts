import type { MetatraderTradeResponse } from 'metaapi.cloud-sdk';

import type { ActionType } from '~constants/metaApi';
import type { ConnectionType } from '~types/Connection.model';
import { sendRequest } from '~utils/url';

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

interface NewOrderOptions extends Record<string, any> {
  symbol: string,
  actionType: ActionType,
  lot: number,

  openPrice?: number,
  stopLoss?: number,
  takeProfit?: number,
  comment?: string,
}

const newOrder = (
  connection: ConnectionType,
  options: NewOrderOptions,
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

export default newOrder;
