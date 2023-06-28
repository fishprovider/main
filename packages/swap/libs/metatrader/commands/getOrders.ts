import type { ConnectionType } from '@fishbot/metatrader/types/Connection.model';
import type { ProviderType } from '@fishbot/utils/constants/account';
import type { Config } from '@fishbot/utils/types/Account.model';
import type { OrderWithoutId } from '@fishbot/utils/types/Order.model';

import getLiveOrders from './getLiveOrders';
import getPendingOrders from './getPendingOrders';

const getOrders = async (params: {
  providerId: string,
  providerType: ProviderType,
  config?: Config,
  connection?: ConnectionType,
  accountId?: string,
  updateClosedOrders?: boolean,
  getLive?: boolean,
  getPending?: boolean,
}) => {
  const {
    getLive = true,
    getPending = true,
    updateClosedOrders,
  } = params;

  const res: {
    positions: OrderWithoutId[],
    orders: OrderWithoutId[],
    providerData?: any,
  } = {
    positions: [],
    orders: [],
    providerData: {},
  };

  const runLiveOrders = async () => {
    if (!getLive) return;

    const { positions, providerData } = await getLiveOrders(params);
    res.positions = positions;
    res.providerData.liveOrders = providerData;
  };

  const runPendingOrders = async () => {
    if (!getPending) return;

    const { orders, providerData } = await getPendingOrders(params);
    res.orders = orders;
    res.providerData.pendingOrders = providerData;
  };

  await Promise.all([
    runLiveOrders(),
    runPendingOrders(),
  ]);

  return {
    ...res,
    updateClosedOrders,
    updatedAt: new Date(),
  };
};

export default getOrders;
