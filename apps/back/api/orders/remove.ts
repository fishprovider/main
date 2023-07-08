import removeOrder from '@fishprovider/swap/commands/removeOrder';
import removePosition from '@fishprovider/swap/commands/removePosition';
import { getProvider } from '@fishprovider/swap/utils/account';
import { getPrices } from '@fishprovider/swap/utils/price';
import { ErrorType } from '@fishprovider/utils/constants/error';
import { OrderStatus } from '@fishprovider/utils/constants/order';
import { getMajorPairs } from '@fishprovider/utils/helpers/price';
import { getRoleProvider } from '@fishprovider/utils/helpers/user';
import { validateOrderRemove } from '@fishprovider/utils/helpers/validateOrder';
import type { Order } from '@fishprovider/utils/types/Order.model';
import type { User } from '@fishprovider/utils/types/User.model';
import _ from 'lodash';

const orderRemove = async ({ data, userInfo }: {
  data: {
    order: Order,
    options?: {
      volume?: number,
    }
  },
  userInfo: User,
}) => {
  const { order, options } = data;
  const { providerId, status } = order;
  if (!providerId || !status) {
    return { error: ErrorType.badRequest };
  }

  const { isTraderProvider, isProtectorProvider } = getRoleProvider(userInfo.roles, providerId);
  if (!(isTraderProvider || isProtectorProvider)) {
    return { error: ErrorType.accessDenied };
  }

  const account = await getProvider(providerId);
  if (!account) {
    return { error: ErrorType.accountNotFound };
  }

  const prices = await getPrices(
    account.providerType,
    _.uniq([
      ...getMajorPairs(account.providerType),
      order.symbol,
    ]),
  );
  const { error } = validateOrderRemove({
    user: userInfo,
    account,
    orderToRemove: { ...order, ...options },
    prices,
  });
  if (error) return { error };

  const optionsToRemove = {
    ...options,
    config: account.config,
    prices,

    userId: userInfo.uid,
    userEmail: userInfo.email,
    userName: userInfo.name,
    userPicture: userInfo.picture,
  };

  if (status === OrderStatus.live) {
    const orderData = await removePosition({
      order,
      options: optionsToRemove,
    });
    return { result: orderData };
  }

  const orderData = await removeOrder({
    order,
    options: optionsToRemove,
  });
  return { result: orderData };
};

export default orderRemove;
