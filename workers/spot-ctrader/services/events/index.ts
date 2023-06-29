import { CallbackType } from '@fishbot/ctrader/constants/openApi';
import type { ConnectionType } from '@fishbot/ctrader/types/Connection.model';
import type { CallbackPayload } from '@fishbot/ctrader/types/Event.model';
import type { ProviderType } from '@fishbot/utils/constants/account';

import { spotTasks } from '~utils/tasks';

import handleEventBars, { destroy as destroyBarHandler, start as startBarHandler } from './handleEventBars';
import handleEventPrice from './handleEventPrice';
import handleEventSymbol from './handleEventSymbol';

const start = async () => {
  await startBarHandler();
};

const destroy = async () => {
  await destroyBarHandler();
};

const onEvent = ({
  providerType, payload, getConnection, onAppDisconnect, onAccountDisconnect, onTokenInvalid,
}: {
  providerType: ProviderType,
  payload: CallbackPayload,
  getConnection: () => ConnectionType | undefined,
  onAppDisconnect: (reason?: string) => Promise<void>,
  onAccountDisconnect: () => Promise<void>,
  onTokenInvalid: () => Promise<void>,
}) => {
  const { type } = payload;
  switch (type) {
    case CallbackType.appDisconnect: {
      const { reason } = payload;
      onAppDisconnect(reason);
      break;
    }
    case CallbackType.accountDisconnect: {
      onAccountDisconnect();
      break;
    }
    case CallbackType.tokenInvalid: {
      onTokenInvalid();
      break;
    }
    case CallbackType.symbol: {
      handleEventSymbol(providerType, payload, getConnection);
      break;
    }
    case CallbackType.price: {
      if (spotTasks.price) {
        handleEventPrice(providerType, payload);
      }
      if (spotTasks.bar) {
        handleEventBars(providerType, payload);
      }
      break;
    }
    case CallbackType.order: {
      Logger.debug(`Ignored callbackPayload type ${type}`);
      break;
    }
    default: {
      Logger.warn(`Unhandled callbackPayload type ${type}`);
    }
  }
};

export default onEvent;

export { destroy, start };
