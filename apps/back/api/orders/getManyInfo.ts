import { getProvider } from '@fishbot/swap/utils/account';
import { ErrorType } from '@fishbot/utils/constants/error';
import { getRoleProvider } from '@fishbot/utils/helpers/user';
import type { Order } from '@fishbot/utils/types/Order.model';
import type { User } from '@fishbot/utils/types/User.model';
import _ from 'lodash';

const orderGetManyInfo = async ({ data, userInfo }: {
  data: {
    providerId: string,
    orderIds: string[],
    fields?: string[],
  },
  userInfo: User,
}) => {
  const { providerId, orderIds, fields } = data;
  if (!providerId || !orderIds?.length) {
    return { error: ErrorType.badRequest };
  }

  const { isViewerProvider } = getRoleProvider(userInfo.roles, providerId);
  if (!isViewerProvider) {
    return { error: ErrorType.accessDenied };
  }

  const account = await getProvider(providerId);
  if (!account) {
    return { error: ErrorType.accountNotFound };
  }

  const orders = await Mongo.collection<Order>('orders').find(
    {
      _id: { $in: data.orderIds },
      providerId,
    },
    {
      projection: {
        providerData: 1,
        updatedLogs: 1,
        ..._.fromPairs(_.map(fields, (field) => [field, 1])),
      },
    },
  ).toArray();

  return { result: orders };
};

export default orderGetManyInfo;
