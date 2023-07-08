import fetchDeals from '@fishprovider/swap/commands/fetchDeals';
import { getProvider } from '@fishprovider/swap/utils/account';
import { getDeals } from '@fishprovider/swap/utils/order';
import { ErrorType } from '@fishprovider/utils/constants/error';
import { getRoleProvider } from '@fishprovider/utils/helpers/user';
import type { User } from '@fishprovider/utils/types/User.model';

const orderGetHistory = async ({ data, userInfo }: {
  data: {
    providerId: string,
    weeks?: number,
    days?: number,
    reload?: boolean,
  },
  userInfo: User,
}) => {
  const {
    providerId, weeks, days, reload,
  } = data;
  if (!providerId || !(weeks || days)) {
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
    const { deals } = await fetchDeals({
      providerId,
      providerType,
      providerPlatform,
      options: {
        config,
        weeks,
        days,
      },
    });
    return { result: deals };
  }

  const deals = await getDeals(providerId, { weeks, days });
  return { result: deals };
};

export default orderGetHistory;
