import { getProvider } from '@fishbot/swap/utils/account';
import { ErrorType } from '@fishbot/utils/constants/error';
import { OrderStatus } from '@fishbot/utils/constants/order';
import { getRoleProvider } from '@fishbot/utils/helpers/user';
import type { Order } from '@fishbot/utils/types/Order.model';
import type { User } from '@fishbot/utils/types/User.model';
import _ from 'lodash';

const orderRemoveIdea = async ({ data, userInfo }: {
  data: {
    order: Order,
  },
  userInfo: User,
}) => {
  const { order } = data;
  const { providerId, status } = order;
  if (!providerId || status !== OrderStatus.idea) {
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

  await Mongo.collection<Order>('orders').updateOne({
    _id: order._id,
  }, {
    $set: {
      status: OrderStatus.closed,
    },
  });

  const orderData = {
    ...order,
    status: OrderStatus.closed,
  };

  return { result: orderData };
};

export default orderRemoveIdea;
