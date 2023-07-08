import { ErrorType } from '@fishprovider/utils/constants/error';
import { InvestStatus } from '@fishprovider/utils/constants/pay';
import { getRoleProvider } from '@fishprovider/utils/helpers/user';
import type { AccountPublic } from '@fishprovider/utils/types/Account.model';
import type { Wallet } from '@fishprovider/utils/types/Pay.model';
import type { User } from '@fishprovider/utils/types/User.model';

const startInvest = async ({ data, userInfo }: {
  data: {
    walletId: string,
    dstProviderId?: string,
  }
  userInfo: User,
}) => {
  const { walletId, dstProviderId } = data;
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
    'manualData.userId': uid,
    investStatus: InvestStatus.pending,
  });
  if (!wallet?.investData) {
    return { error: ErrorType.walletNotFound };
  }

  const account = await Mongo.collection<AccountPublic>('accounts').findOne({
    _id: dstProviderId || wallet.investData.providerId,
  }, {
    projection: {
      name: 1,
      balance: 1,
    },
  });
  if (!account) {
    return { error: ErrorType.accountNotFound };
  }

  const updateData: Partial<Wallet> = {
    investStatus: InvestStatus.active,
    investData: {
      ...wallet.investData,

      ...(dstProviderId && {
        dstProviderId,
        dstProviderName: account.name,
      }),

      startedAt: new Date(),
      balanceStart: wallet.balance,
    },
  };
  await Mongo.collection<Wallet>('wallets').updateOne({
    _id: walletId,
  }, {
    $set: updateData,
  });

  return { result: { ...wallet, ...updateData } };
};

export default startInvest;
