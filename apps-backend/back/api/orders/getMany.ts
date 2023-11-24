import fetchOrders from '@fishprovider/swap/dist/commands/fetchOrders';
import { getProvider } from '@fishprovider/swap/dist/utils/account';
import { getOrders } from '@fishprovider/swap/dist/utils/order';
import { ErrorType } from '@fishprovider/utils/dist/constants/error';
import { getRoleProvider } from '@fishprovider/utils/dist/helpers/user';
import type { User } from '@fishprovider/utils/dist/types/User.model';

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
    const { config, providerType, platform } = account;
    const result = await fetchOrders({
      providerId,
      providerType,
      platform,
      options: { config },
    });
    return { result };
  }

  const result = await getOrders(providerId);
  return { result };
};

export default orderGetMany;
