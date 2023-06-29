import { start as startQueue } from '@fishbot/core/libs/queuePromise';
import { CallbackType } from '@fishbot/metatrader/constants/metaApi';
import type { ConnectionType } from '@fishbot/metatrader/types/Connection.model';
import type { CallbackPayload } from '@fishbot/metatrader/types/Event.model';
import { getSymbols } from '@fishbot/swap/utils/price';

import type { ClientAccount } from '~types/Client.model';
import { reloadOrdersAndAccount } from '~utils/order';

import handleOrderDeal from './handleOrderDeal';
import handleOrderHistory from './handleOrderHistory';
import handleOrderRemove from './handleOrderRemove';
import handleOrderUpdate from './handleOrderUpdate';

const env = {
  typeId: process.env.TYPE_ID,
};

const pQueuePromise = startQueue({
  name: env.typeId, sizeError: 200, sizeWarn: 100, concurrency: 2,
});

const numProviderRunsInQueue = 1;
const runs: Record<string, number> = {};

const handleEventOrder = async (
  payload: CallbackPayload,
  account: ClientAccount,
  connection: ConnectionType,
) => {
  const { type } = payload;
  const { _id: providerId, providerType } = account;

  const { symbolIds } = await getSymbols(providerType);

  const reloadWithQueue = async () => {
    const pQueue = await pQueuePromise;

    if (!runs[providerId]) {
      runs[providerId] = 0;
    }
    if (runs[providerId] as number >= numProviderRunsInQueue) {
      return;
    }
    runs[providerId] += 1;

    pQueue.add(() => reloadOrdersAndAccount(payload, account, connection).catch((err) => {
      Logger.error('Failed to reloadOrdersAndAccount', err);
    }).finally(() => {
      runs[providerId] -= 1;
    }));
  };

  try {
    switch (type) {
      case CallbackType.order:
      case CallbackType.position: {
        await handleOrderUpdate(payload, account, symbolIds);
        break;
      }
      case CallbackType.completeOrder:
      case CallbackType.removePosition: {
        await handleOrderRemove(payload, account);
        break;
      }
      case CallbackType.history: {
        await handleOrderHistory(payload, account, symbolIds);
        break;
      }
      case CallbackType.deal: {
        await handleOrderDeal(payload, account, symbolIds);
        break;
      }
      default:
        Logger.error(`[handleEventOrder] Unhandled executionType ${providerId} ${type}`);
    }
  } catch (err) {
    Logger.error('Failed to handleEventOrder', err);
  } finally {
    await reloadWithQueue();
  }
};

export default handleEventOrder;
