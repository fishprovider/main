import updateOrder from '@fishbot/swap/commands/updateOrder';
import updatePosition from '@fishbot/swap/commands/updatePosition';
import { getProvider } from '@fishbot/swap/utils/account';
import { getLiveOrders, getPendingOrders } from '@fishbot/swap/utils/order';
import { getPrices } from '@fishbot/swap/utils/price';
import { ErrorType } from '@fishbot/utils/constants/error';
import { OrderStatus } from '@fishbot/utils/constants/order';
import { getMajorPairs } from '@fishbot/utils/helpers/price';
import { getRoleProvider } from '@fishbot/utils/helpers/user';
import { validateOrderUpdate } from '@fishbot/utils/helpers/validateOrder';
import type { Order } from '@fishbot/utils/types/Order.model';
import type { User } from '@fishbot/utils/types/User.model';
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

  const { isTraderProvider } = getRoleProvider(userInfo.roles, providerId);
  if (!isTraderProvider) {
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
