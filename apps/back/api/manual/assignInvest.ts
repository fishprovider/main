import { ErrorType } from '@fishprovider/utils/constants/error';
import { InvestStatus } from '@fishprovider/utils/constants/pay';
import { getRoleProvider } from '@fishprovider/utils/helpers/user';
import type { Wallet } from '@fishprovider/utils/types/Pay.model';
import type { User } from '@fishprovider/utils/types/User.model';

const assignInvest = async ({ data, userInfo }: {
  data: {
    walletId: string,
  }
  userInfo: User,
}) => {
  const { walletId } = data;
  if (!walletId) {
    return { error: ErrorType.badRequest };
  }

  const { uid, roles } = userInfo;
  const { isManagerWeb } = getRoleProvider(roles);
  if (!isManagerWeb) {
    return { error: ErrorType.accessDenied };
  }

  const wallet = await Mongo.collection<Wallet>('wallets').findOne({
    _id: walletId,
    'manualData.userId': { $exists: false },
  });
  if (!wallet) {
    return { error: ErrorType.walletNotFound };
  }

  const updateData: Partial<Wallet> = {
    investStatus: InvestStatus.pending,
    manualData: {
      userId: uid,
      description: 'Assign invest',
      startedAt: new Date(),
    },
  };
  await Mongo.collection<Wallet>('wallets').updateOne({
    _id: walletId,
  }, {
    $set: updateData,
  });

  return { result: { ...wallet, ...updateData } };
};

export default assignInvest;
