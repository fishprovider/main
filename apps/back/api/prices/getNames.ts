import { getSymbols } from '@fishbot/swap/utils/price';
import type { ProviderType } from '@fishbot/utils/constants/account';
import { ErrorType } from '@fishbot/utils/constants/error';
import type { User } from '@fishbot/utils/types/User.model';
import _ from 'lodash';

const priceGetNames = async ({ data, userInfo }: {
  data: {
    providerType: ProviderType,
  },
  userInfo: User,
}) => {
  const { providerType } = data;
  if (!providerType) {
    return { error: ErrorType.badRequest };
  }

  const { uid } = userInfo;
  if (!uid) {
    return { error: ErrorType.accessDenied };
  }

  const { symbolNames } = await getSymbols(providerType);

  const prices = _.map(symbolNames, (item) => ({
    ...item,
    _id: `${providerType}-${item.symbol}`,
    providerType,
  }));

  return { result: prices };
};

export default priceGetNames;
