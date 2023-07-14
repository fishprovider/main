import newOrder from '@fishprovider/swap/dist/commands/newOrder';
import { getProvider } from '@fishprovider/swap/dist/utils/account';
import { getLiveOrders, getPendingOrders } from '@fishprovider/swap/dist/utils/order';
import { getPrices } from '@fishprovider/swap/dist/utils/price';
import { ErrorType } from '@fishprovider/utils/dist/constants/error';
import { OrderStatus } from '@fishprovider/utils/dist/constants/order';
import { getMajorPairs } from '@fishprovider/utils/dist/helpers/price';
import { getRoleProvider } from '@fishprovider/utils/dist/helpers/user';
import { validateOrderAdd } from '@fishprovider/utils/dist/helpers/validateOrder';
import type { OrderWithoutId } from '@fishprovider/utils/dist/types/Order.model';
import type { User } from '@fishprovider/utils/dist/types/User.model';
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
