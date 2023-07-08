import createTransfer from '@fishprovider/coin/utils/transaction/createTransfer';
import createSpot from '@fishprovider/coin/utils/wallet/createSpot';
import { ErrorType } from '@fishprovider/utils/constants/error';
import { SourceType, TransactionType, WalletType } from '@fishprovider/utils/constants/pay';
import random from '@fishprovider/utils/helpers/random';
import type { Wallet } from '@fishprovider/utils/types/Pay.model';
import type { User } from '@fishprovider/utils/types/User.model';
import _ from 'lodash';

const transferAdd = async ({ data, userInfo }: {
  data: {
    amount: number,
    email: string,
  }
  userInfo: User,
}) => {
  const { amount, email: emailRaw } = data;

  const email = _.trim(emailRaw.toLowerCase());

  if (!amount || !email) {
    return { error: ErrorType.badRequest };
  }

  const { uid } = userInfo;
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

  let dstWallet = await Mongo.collection<Wallet>('wallets').findOne({
    type: WalletType.spot,
    userEmail: email,
  }, {
    projection: {
      balance: 1,
    },
  });
  if (!dstWallet) {
    const dstUser = await Mongo.collection<User>('users').findOne({
      email,
    }, {
      projection: {
        _id: 1,
        name: 1,
      },
    });
    if (!dstUser) {
      return { error: ErrorType.userNotFound };
    }

    const dstWalletId = `${dstUser._id}-${currency}`;
    dstWallet = await createSpot({
      userId: dstUser._id,
      userEmail: email,
      userName: dstUser.name,
      walletId: dstWalletId,
      currency,
    });
  }

  const srcType = SourceType.wallet;
  const srcId = srcWalletId;
  const payId = `${TransactionType.transfer}-${srcId}-${srcType}-${random()}`;

  const transaction = await createTransfer({
    payId,
    userId: uid,

    srcType,
    srcId,
    srcCurrency: currency,
    srcAmount: amount,
    srcBalance: srcWallet.balance,
    srcData: {
      name: userInfo.email,
    },

    dstId: dstWallet._id,
    dstCurrency: currency,
    dstBalance: dstWallet.balance,

    dstData: {
      name: email,
    },
  });

  // cron will handle next and update transaction status to success

  return { result: transaction };
};

export default transferAdd;
