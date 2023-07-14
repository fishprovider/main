import { ErrorType } from '@fishprovider/utils/dist/constants/error';
import { InvestStatus } from '@fishprovider/utils/dist/constants/pay';
import { getRoleProvider } from '@fishprovider/utils/dist/helpers/user';
import type { Wallet } from '@fishprovider/utils/dist/types/Pay.model';
import type { User } from '@fishprovider/utils/dist/types/User.model';

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
