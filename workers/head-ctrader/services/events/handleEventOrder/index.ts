import { start as startQueue } from '@fishprovider/core/dist/libs/queuePromise';
import { ExecutionType } from '@fishprovider/ctrader/dist/constants/openApi';
import type { ConnectionType } from '@fishprovider/ctrader/dist/types/Connection.model';
import type { CallbackPayload } from '@fishprovider/ctrader/dist/types/Event.model';
import { getSymbols } from '@fishprovider/swap/dist/utils/price';

import type { ClientAccount } from '~types/Client.model';
import { reloadOrdersAndAccount } from '~utils/order';

import handleOrderAccepted from './handleOrderAccepted';
import handleOrderCancelled from './handleOrderCancelled';
import handleOrderFilled from './handleOrderFilled';
import handleOrderReplaced from './handleOrderReplaced';

const env = {
  typeId: process.env.TYPE_ID,
};

const pQueuePromise = startQueue({
  name: env.typeId, sizeError: 200, sizeWarn: 100, concurrency: 2,
});

const numProviderRunsInQueue = 2;
const runs: Record<string, number> = {};

const handleEventOrder = async (
  payload: CallbackPayload,
  account: ClientAccount,
  connection: ConnectionType,
) => {
  const { executionType } = payload;
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
    switch (executionType) {
      case ExecutionType.ORDER_ACCEPTED: {
        await handleOrderAccepted(payload, account, symbolIds);
        break;
      }
      case ExecutionType.ORDER_FILLED: {
        await handleOrderFilled(payload, account, symbolIds);
        break;
      }
      case ExecutionType.ORDER_CANCELLED: {
        await handleOrderCancelled(payload, account, symbolIds);
        break;
      }
      case ExecutionType.ORDER_REPLACED: {
        await handleOrderReplaced(payload, account, symbolIds);
        break;
      }
      case ExecutionType.ORDER_REJECTED: {
        Logger.error(`[handleEventOrder] Order Rejected ${providerId}`);
        break;
      }
      case ExecutionType.ORDER_CANCEL_REJECTED: {
        Logger.error(`[handleEventOrder] Order Cancel Rejected ${providerId}`);
        break;
      }
      case ExecutionType.SWAP: {
        Logger.info(`[handleEventOrder] Order Swapped ${providerId}`);
        break;
      }
      case ExecutionType.DEPOSIT_WITHDRAW: {
        Logger.warn(`[handleEventOrder] Account Deposit/Withdraw ${providerId}`);
        break;
      }
      default: {
        Logger.error(`[handleEventOrder] Unhandled executionType ${providerId} ${executionType}`);
      }
    }
  } catch (err) {
    Logger.error('Failed to handleEventOrder', err);
  } finally {
    await reloadWithQueue();
  }
};

export default handleEventOrder;
