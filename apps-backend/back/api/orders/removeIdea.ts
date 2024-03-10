import { getProvider } from '@fishprovider/swap/dist/utils/account';
import { ErrorType } from '@fishprovider/utils/dist/constants/error';
import { OrderStatus } from '@fishprovider/utils/dist/constants/order';
import { getRoleProvider } from '@fishprovider/utils/dist/helpers/user';
import type { Order } from '@fishprovider/utils/dist/types/Order.model';
import type { User } from '@fishprovider/utils/dist/types/User.model';

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

  const { isTraderAccount, isProtectorAccount } = getRoleProvider(userInfo.roles, providerId);
  if (!(isTraderAccount || isProtectorAccount)) {
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
