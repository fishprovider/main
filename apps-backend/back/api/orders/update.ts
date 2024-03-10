import updateOrder from '@fishprovider/swap/dist/commands/updateOrder';
import updatePosition from '@fishprovider/swap/dist/commands/updatePosition';
import { getProvider } from '@fishprovider/swap/dist/utils/account';
import { getLiveOrders, getPendingOrders } from '@fishprovider/swap/dist/utils/order';
import { getPrices } from '@fishprovider/swap/dist/utils/price';
import { ErrorType } from '@fishprovider/utils/dist/constants/error';
import { OrderStatus } from '@fishprovider/utils/dist/constants/order';
import { getMajorPairs } from '@fishprovider/utils/dist/helpers/price';
import { getRoleProvider } from '@fishprovider/utils/dist/helpers/user';
import { validateOrderUpdate } from '@fishprovider/utils/dist/helpers/validateOrder';
import type { Order } from '@fishprovider/utils/dist/types/Order.model';
import type { User } from '@fishprovider/utils/dist/types/User.model';
import _ from 'lodash';

const orderUpdate = async ({ data, userInfo }: {
  data: {
    order: Order,
    options?: {
      stopLoss?: number;
      lockSL?: number;
      lockSLAmt?: number;
      takeProfit?: number;
      limitPrice?: number;
      stopPrice?: number;
      volume?: number;
    }
  },
  userInfo: User,
}) => {
  const { order, options } = data;
  const { providerId, status } = order;
  if (!providerId || !status) {
    return { error: ErrorType.badRequest };
  }

  const { isTraderAccount } = getRoleProvider(userInfo.roles, providerId);
  if (!isTraderAccount) {
    return { error: ErrorType.accessDenied };
  }

  const account = await getProvider(providerId);
  if (!account) {
    return { error: ErrorType.accountNotFound };
  }

  const [
    liveOrders,
    pendingOrders,
  ] = await Promise.all([
    getLiveOrders(providerId),
    getPendingOrders(providerId),
  ]);
  const prices = await getPrices(
    account.providerType,
    _.uniq([
      ...getMajorPairs(account.providerType),
      ...liveOrders.map((item) => item.symbol),
      ...pendingOrders.map((item) => item.symbol),
      order.symbol,
    ]),
  );
  const { error } = validateOrderUpdate({
    user: userInfo,
    account,
    liveOrders,
    pendingOrders,
    orderToUpdate: { ...order, ...options },
    prices,
  });
  if (error) return { error };

  const optionsToUpdate = {
    ...options,
    config: account.config,
    prices,

    userId: userInfo.uid,
    userEmail: userInfo.email,
    userName: userInfo.name,
    userPicture: userInfo.picture,
  };

  if (status === OrderStatus.live) {
    const orderData = await updatePosition({
      order,
      options: optionsToUpdate,
    });
    return { result: orderData };
  }

  const orderData = await updateOrder({
    order,
    options: optionsToUpdate,
  });
  return { result: orderData };
};

export default orderUpdate;
