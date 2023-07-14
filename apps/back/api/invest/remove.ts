import createTransfer from '@fishprovider/coin/dist/utils/transaction/createTransfer';
import { ErrorType } from '@fishprovider/utils/dist/constants/error';
import { InvestStatus, SourceType, TransactionType } from '@fishprovider/utils/dist/constants/pay';
import random from '@fishprovider/utils/dist/helpers/random';
import type { Wallet } from '@fishprovider/utils/dist/types/Pay.model';
import type { User } from '@fishprovider/utils/dist/types/User.model';

const investRemove = async ({ data, userInfo }: {
  data: {
    walletId: string,
  }
  userInfo: User,
}) => {
  const { walletId } = data;
  if (!walletId) {
    return { error: ErrorType.badRequest };
  }

  const { uid, email } = userInfo;
  if (!uid) {
    return { error: ErrorType.accessDenied };
  }

  const srcWallet = await Mongo.collection<Wallet>('wallets').findOne({
    _id: walletId,
    userId: uid,
  }, {
    projection: {
      balance: 1,
      name: 1,
      investStatus: 1,
    },
  });
  if (!srcWallet) {
    return { error: ErrorType.walletNotFound };
  }

  if (srcWallet.investStatus === InvestStatus.new) {
    const currency = 'USD';
    const dstWalletId = `${uid}-${currency}`;

    const dstWallet = await Mongo.collection<Wallet>('wallets').findOne({
      _id: dstWalletId,
    }, {
      projection: {
        balance: 1,
      },
    });
    if (!dstWallet) {
      return { error: ErrorType.walletNotFound };
    }

    const updateData: Partial<Wallet> = {
      investStatus: InvestStatus.inactive,
    };
    await Mongo.collection<Wallet>('wallets').updateOne({
      _id: walletId,
    }, {
      $set: updateData,
    });

    const srcType = SourceType.wallet;
    const srcId = walletId;
    const payId = `${TransactionType.transfer}-${srcId}-${srcType}-${random()}`;

    await createTransfer({
      payId,
      userId: uid,

      srcType,
      srcId,
      srcCurrency: currency,
      srcAmount: srcWallet.balance,
      srcBalance: srcWallet.balance,
      srcData: {
        name: srcWallet.name,
      },

      dstId: dstWalletId,
      dstCurrency: currency,
      dstBalance: dstWallet.balance,

      dstData: {
        name: email,
        description: 'Remove funds',
      },
    });

    // cron will handle next and update transaction status to success

    return { result: { ...srcWallet, ...updateData } };
  }

  if (srcWallet.investStatus === InvestStatus.active) {
    const updateData: Partial<Wallet> = {
      investStatus: InvestStatus.stopping,
    };
    await Mongo.collection<Wallet>('wallets').updateOne({
      _id: walletId,
    }, {
      $set: updateData,
      $unset: {
        manualData: '',
      },
    });

    return { result: { ...srcWallet, ...updateData } };
  }

  return {
    result: srcWallet,
  };
};

export default investRemove;
