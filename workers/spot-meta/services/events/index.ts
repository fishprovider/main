import { CallbackType } from '@fishprovider/metatrader/constants/metaApi';
import type { ConnectionType } from '@fishprovider/metatrader/types/Connection.model';
import type { CallbackPayload } from '@fishprovider/metatrader/types/Event.model';
import type { ProviderType } from '@fishprovider/utils/constants/account';

import { spotTasks } from '~utils/tasks';

import handleEventPrice from './handleEventPrice';

const start = async () => {
};

const destroy = async () => {
};

const onEvent = ({
  providerType, payload, onAppDisconnect,
}: {
  providerType: ProviderType,
  payload: CallbackPayload,
  getConnection: () => ConnectionType | undefined,
  onAppDisconnect: () => Promise<void>,
}) => {
  const { type, accountId } = payload;

  switch (type) {
    case CallbackType.appDisconnect: {
      onAppDisconnect();
      Logger.warn(`appDisconnect ${accountId}`);
      break;
    }

    case CallbackType.price: {
      if (spotTasks.price) {
        handleEventPrice(providerType, payload);
      }
      break;
    }

    case CallbackType.account:
    case CallbackType.order:
    case CallbackType.completeOrder:
    case CallbackType.position:
    case CallbackType.removePosition:
    case CallbackType.history:
    case CallbackType.deal: {
      // Ignore
      break;
    }

    default: {
      Logger.warn(`Unhandled callbackPayload type ${type}`);
    }
  }
};

export default onEvent;

export { destroy, start };
