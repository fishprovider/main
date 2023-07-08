import { ErrorType } from '@fishprovider/utils/constants/error';
import type { WalletType } from '@fishprovider/utils/constants/pay';
import type { Wallet } from '@fishprovider/utils/types/Pay.model';
import type { User } from '@fishprovider/utils/types/User.model';

const walletGetMany = async ({ data, userInfo }: {
  data: {
    type?: WalletType,
  }
  userInfo: User,
}) => {
  const { uid } = userInfo;
  if (!uid) {
    return { error: ErrorType.badRequest };
  }

  const { type } = data;

  const wallets = await Mongo.collection<Wallet>('wallets').find({
    userId: uid,
    deleted: { $ne: true },
    ...(type && { type }),
  }).toArray();

  return { result: wallets };
};

export default walletGetMany;
