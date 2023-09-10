import createTransfer from '@fishprovider/coin/dist/utils/transaction/createTransfer';
import createWithdraw from '@fishprovider/coin/dist/utils/transaction/createWithdraw';
import { ErrorType } from '@fishprovider/utils/dist/constants/error';
import { SourceType, TransactionType } from '@fishprovider/utils/dist/constants/pay';
import random from '@fishprovider/utils/dist/helpers/random';
import type { Wallet } from '@fishprovider/utils/dist/types/Pay.model';
import type { User } from '@fishprovider/utils/dist/types/User.model';

const withdrawAdd = async ({ data, userInfo }: {
  data: {
    amount: number,
    dstWalletId: string,
  }
  userInfo: User,
}) => {
  const { amount, dstWalletId } = data;
  if (!amount || !dstWalletId) {
    return { error: ErrorType.badRequest };
  }

  const { uid, email } = userInfo;
  if (!uid) {
    return { error: ErrorType.accessDenied };
  }

  const currency = 'USD';
  const srcWalletId = `${uid}-${currency}`;

  const srcWallet = await Mongo.collection<Wallet>('wallets').findOne({
    _id: srcWalletId,
  }, {
    projection: {
      balance: 1,
    },
  });
  if (!srcWallet) {
    return { error: ErrorType.walletNotFound };
  }
  if (!srcWallet.balance || srcWallet.balance < amount) {
    return { error: 'Insufficient funds' };
  }

  const dstWallet = await Mongo.collection<Wallet>('wallets').findOne({
    _id: dstWalletId,
  }, {
    projection: {
      name: 1,
      balance: 1,
      currency: 1,
      address: 1,
    },
  });
  if (!dstWallet || !dstWallet.currency || !dstWallet.address) {
    return { error: ErrorType.walletNotFound };
  }
  const { address } = dstWallet;

  const transferToTrustWallet = async () => {
    const srcType = SourceType.wallet;
    const srcId = srcWalletId;
    const payId = `${TransactionType.transfer}-${srcId}-${srcType}-${random()}`;

    await createTransfer({
      payId,
      userId: uid,

      srcType,
      srcId,
      srcCurrency: currency,
      srcAmount: amount,
      srcBalance: srcWallet.balance,
      srcData: {
        name: email,
      },

      dstId: dstWalletId,
      dstCurrency: currency,
      dstBalance: dstWallet.balance,

      dstData: {
        name: dstWallet.name,
      },
    });
  };

  const withdrawFromTrustWallet = async () => {
    const srcType = SourceType.wallet;
    const srcId = dstWalletId;
    const payId = `${TransactionType.withdraw}-${srcId}-${srcType}-${random()}`;

    const transaction = await createWithdraw({
      payId,
      userId: uid,

      srcType,
      srcId,
      srcCurrency: currency,
      srcAmount: amount,
      srcBalance: dstWallet.balance,
      srcData: {
        name: dstWallet.name,
      },

      dstId: address,
      dstCurrency: dstWallet.currency, // USDT/USDC
    });
    return transaction;
  };

  await transferToTrustWallet();
  const transaction = await withdrawFromTrustWallet();

  // cron will handle next and update transaction status to success

  return { result: transaction };
};

export default withdrawAdd;
