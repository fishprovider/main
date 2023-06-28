import newOrder from '@fishbot/swap/commands/newOrder';
import { getProvider } from '@fishbot/swap/utils/account';
import { getLiveOrders, getPendingOrders } from '@fishbot/swap/utils/order';
import { getPrices } from '@fishbot/swap/utils/price';
import { ErrorType } from '@fishbot/utils/constants/error';
import { OrderStatus } from '@fishbot/utils/constants/order';
import { getMajorPairs } from '@fishbot/utils/helpers/price';
import { getRoleProvider } from '@fishbot/utils/helpers/user';
import { validateOrderAdd } from '@fishbot/utils/helpers/validateOrder';
import type { OrderWithoutId } from '@fishbot/utils/types/Order.model';
import type { User } from '@fishbot/utils/types/User.model';
import _ from 'lodash';

const orderAdd = async ({ data, userInfo }: {
  data: {
    order: OrderWithoutId,
  },
  userInfo: User,
}) => {
  const { order } = data;
  const { providerId } = order;

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
    // todayOrders,
  ] = await Promise.all([
    getLiveOrders(providerId),
    getPendingOrders(providerId),
    // getDeals(providerId, { days: 1 }),
  ]);
  const prices = await getPrices(
    account.providerType,
    _.uniq([
      ...getMajorPairs(account.providerType),
      ...liveOrders.map((item) => item.symbol),
      ...pendingOrders.map((item) => item.symbol),
      ...(order.symbol ? [order.symbol] : []),
    ]),
  );
  const { error } = validateOrderAdd({
    user: userInfo,
    account,
    liveOrders,
    pendingOrders,
    // todayOrders,
    orderToNew: order,
    prices,
  });
  if (error) return { error };

  const orderToNew = {
    ...order,
    status: OrderStatus.idea,

    userId: userInfo.uid,
    userEmail: userInfo.email,
    userName: userInfo.name,
    userPicture: userInfo.picture,
  } as OrderWithoutId;

  const orderData = await newOrder({
    order: orderToNew,
    options: { config: account.config, prices },
  });
  return { result: orderData };
};

export default orderAdd;
