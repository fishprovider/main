import fetchDeals from '@fishprovider/swap/dist/commands/fetchDeals';
import { getProvider } from '@fishprovider/swap/dist/utils/account';
import { getDeals } from '@fishprovider/swap/dist/utils/order';
import { ErrorType } from '@fishprovider/utils/dist/constants/error';
import { getRoleProvider } from '@fishprovider/utils/dist/helpers/user';
import type { User } from '@fishprovider/utils/dist/types/User.model';

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
    const { config, providerType, platform } = account;
    const { deals } = await fetchDeals({
      providerId,
      providerType,
      platform,
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
