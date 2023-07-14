import type { ProviderType } from '@fishprovider/utils/dist/constants/account';
import { ErrorType } from '@fishprovider/utils/dist/constants/error';
import type { Price } from '@fishprovider/utils/dist/types/Price.model';
import type { User } from '@fishprovider/utils/dist/types/User.model';

const priceGetDetail = async ({ data, userInfo }: {
  data: {
    providerType: ProviderType,
    symbol: string,
  },
  userInfo: User,
}) => {
  const { providerType, symbol } = data;
  if (!providerType || !symbol) {
    return { error: ErrorType.badRequest };
  }

  const { uid } = userInfo;
  if (!uid) {
    return { error: ErrorType.accessDenied };
  }

  const price = await Mongo.collection<Price>('price').findOne({
    _id: `${providerType}-${symbol}`,
  }, {
    projection: {
      providerData: 1,
    },
  });

  return {
    result: price,
  };
};

export default priceGetDetail;
