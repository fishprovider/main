import type { MetatraderTradeResponse } from 'metaapi.cloud-sdk';

import type { ConnectionType } from '~types/Connection.model';
import { sendRequest } from '~utils/url';

const closePosition = (
  connection: ConnectionType,
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

export default closePosition;
