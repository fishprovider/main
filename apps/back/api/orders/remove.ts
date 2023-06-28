import removeOrder from '@fishbot/swap/commands/removeOrder';
import removePosition from '@fishbot/swap/commands/removePosition';
import { getProvider } from '@fishbot/swap/utils/account';
import { getPrices } from '@fishbot/swap/utils/price';
import { ErrorType } from '@fishbot/utils/constants/error';
import { OrderStatus } from '@fishbot/utils/constants/order';
import { getMajorPairs } from '@fishbot/utils/helpers/price';
import { getRoleProvider } from '@fishbot/utils/helpers/user';
import { validateOrderRemove } from '@fishbot/utils/helpers/validateOrder';
import type { Order } from '@fishbot/utils/types/Order.model';
import type { User } from '@fishbot/utils/types/User.model';
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
