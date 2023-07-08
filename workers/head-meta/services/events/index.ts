import { CallbackType } from '@fishprovider/metatrader/constants/metaApi';
import type { ConnectionType } from '@fishprovider/metatrader/types/Connection.model';
import type { CallbackPayload } from '@fishprovider/metatrader/types/Event.model';

import type { ClientAccount } from '~types/Client.model';

import handleEventAccount from './handleEventAccount';
import handleEventOrder from './handleEventOrder';

const onEvent = async ({
  payload, getAccount, getConnection, onAppDisconnect,
}: {
  payload: CallbackPayload,
  getAccount: (accountId: string) => ClientAccount | undefined,
  getConnection: () => ConnectionType | undefined,
  onAppDisconnect: () => Promise<void>,
}) => {
  const { type, accountId } = payload;

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
      onAppDisconnect();
      Logger.warn(`appDisconnect ${accountId}`);
      break;
    }

    case CallbackType.account: {
      handleEventAccount(payload, account);
      break;
    }

    case CallbackType.order:
    case CallbackType.completeOrder:
    case CallbackType.position:
    case CallbackType.removePosition:
    case CallbackType.history:
    case CallbackType.deal: {
      handleEventOrder(payload, account, connection);
      break;
    }

    case CallbackType.price: {
      // Ignore
      break;
    }

    default: {
      Logger.warn(`Unhandled callbackPayload type ${type}`);
    }
  }
};

export default onEvent;
