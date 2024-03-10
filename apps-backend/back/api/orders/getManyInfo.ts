import { getProvider } from '@fishprovider/swap/dist/utils/account';
import { ErrorType } from '@fishprovider/utils/dist/constants/error';
import { getRoleProvider } from '@fishprovider/utils/dist/helpers/user';
import type { Order } from '@fishprovider/utils/dist/types/Order.model';
import type { User } from '@fishprovider/utils/dist/types/User.model';
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

  const { isViewerAccount } = getRoleProvider(userInfo.roles, providerId);
  if (!isViewerAccount) {
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
