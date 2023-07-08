import { getProvider } from '@fishprovider/swap/utils/account';
import { ErrorType } from '@fishprovider/utils/constants/error';
import { OrderStatus } from '@fishprovider/utils/constants/order';
import { getRoleProvider } from '@fishprovider/utils/helpers/user';
import type { Order } from '@fishprovider/utils/types/Order.model';
import type { User } from '@fishprovider/utils/types/User.model';
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
