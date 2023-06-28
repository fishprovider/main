import fetchOrders from '@fishbot/swap/commands/fetchOrders';
import { getProvider } from '@fishbot/swap/utils/account';
import { getOrders } from '@fishbot/swap/utils/order';
import { ErrorType } from '@fishbot/utils/constants/error';
import { getRoleProvider } from '@fishbot/utils/helpers/user';
import type { User } from '@fishbot/utils/types/User.model';

const orderGetMany = async ({ data, userInfo }: {
  data: {
    providerId: string,
    reload?: boolean,
  },
  userInfo: User,
}) => {
  const { providerId, reload } = data;
  if (!providerId) {
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

  if (reload) {
    const { config, providerType, providerPlatform } = account;
    const result = await fetchOrders({
      providerId,
      providerType,
      providerPlatform,
      options: { config },
    });
    return { result };
  }

  const result = await getOrders(providerId);
  return { result };
};

export default orderGetMany;
