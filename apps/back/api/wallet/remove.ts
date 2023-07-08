import { ErrorType } from '@fishprovider/utils/constants/error';
import type { Wallet } from '@fishprovider/utils/types/Pay.model';
import type { User } from '@fishprovider/utils/types/User.model';

const walletRemove = async ({ data, userInfo }: {
  data: {
    walletId: string,
  }
  userInfo: User,
}) => {
  const { walletId } = data;
  if (!walletId) {
    return { error: ErrorType.badRequest };
  }

  const { uid } = userInfo;
  if (!uid) {
    return { error: ErrorType.accessDenied };
  }

  const srcWallet = await Mongo.collection<Wallet>('wallets').findOne({
    _id: walletId,
    userId: uid,
  }, {
    projection: {
      _id: 1,
    },
  });
  if (!srcWallet) {
    return { error: ErrorType.walletNotFound };
  }

  await Mongo.collection<Wallet>('wallets').updateOne({
    _id: walletId,
  }, {
    $set: {
      deleted: true,
      deletedAt: new Date(),
    },
  });

  return {
    result: {
      _id: walletId,
    },
  };
};

export default walletRemove;
