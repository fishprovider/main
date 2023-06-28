import type { MetatraderTradeResponse } from 'metaapi.cloud-sdk';

import type { ConnectionType } from '~types/Connection.model';
import { sendRequest } from '~utils/url';

interface UpdatePositionOptions extends Record<string, any> {
  stopLoss?: number,
  takeProfit?: number,
}

const updatePosition = (
  connection: ConnectionType,
  positionId: string,
  options: UpdatePositionOptions,
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

export default updatePosition;
