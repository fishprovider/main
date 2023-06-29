import { CallbackType } from '@fishbot/ctrader/constants/openApi';
import type { ConnectionType } from '@fishbot/ctrader/types/Connection.model';
import type { CallbackPayload } from '@fishbot/ctrader/types/Event.model';

import type { ClientAccount } from '~types/Client.model';

import handleEventAccount from './handleEventAccount';
import handleEventMargin from './handleEventMargin';
import handleEventOrder from './handleEventOrder';

const onEvent = ({
  payload, getAccount, getConnection, onAppDisconnect, onAccountDisconnect, onTokenInvalid,
}: {
  payload: CallbackPayload,
  getAccount: (accountId: string) => ClientAccount | undefined,
  getConnection: () => ConnectionType | undefined,
  onAppDisconnect: (reason?: string) => Promise<void>,
  onAccountDisconnect: (accountId: string) => Promise<void>,
  onTokenInvalid: (accountIds: string[], reason: string) => Promise<void>,
}) => {
  const {
    type, accountId, accountIds, reason,
  } = payload;

  const account = getAccount(accountId);
  if (!account) {
    Logger.warn(`Unknown accountId ${accountId}`);
    return;
  }
  const connection = getConnection();
  if (!connection) {
    Logger.warn(`Unknown connection ${accountId}`);
    return;
  }

  switch (type) {
    case CallbackType.appDisconnect: {
      onAppDisconnect(reason);
      break;
    }
    case CallbackType.accountDisconnect: {
      onAccountDisconnect(accountId);
      break;
    }
    case CallbackType.tokenInvalid: {
      onTokenInvalid(accountIds, reason);
      break;
    }
    case CallbackType.account: {
      handleEventAccount(payload, account);
      break;
    }
    case CallbackType.margin: {
      handleEventMargin(payload, account);
      break;
    }
    case CallbackType.order: {
      handleEventOrder(payload, account, connection);
      break;
    }
    case CallbackType.symbol: {
      break;
    }
    default: {
      Logger.warn(`Unhandled callbackPayload type ${type}`);
    }
  }
};

export default onEvent;
