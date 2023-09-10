import createTransfer from '@fishprovider/coin/dist/utils/transaction/createTransfer';
import { ErrorType } from '@fishprovider/utils/dist/constants/error';
import { InvestStatus, SourceType, TransactionType } from '@fishprovider/utils/dist/constants/pay';
import random from '@fishprovider/utils/dist/helpers/random';
import { getRoleProvider } from '@fishprovider/utils/dist/helpers/user';
import type { AccountPublic } from '@fishprovider/utils/dist/types/Account.model';
import type { Wallet } from '@fishprovider/utils/dist/types/Pay.model';
import type { User } from '@fishprovider/utils/dist/types/User.model';

const stopInvest = async ({ data, userInfo }: {
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

  const srcWallet = await Mongo.collection<Wallet>('wallets').findOne({
    _id: walletId,
    'manualData.userId': uid,
    investStatus: InvestStatus.pending,
  });
  if (!srcWallet?.investData?.balanceStart) {
    return { error: ErrorType.walletNotFound };
  }

  const account = await Mongo.collection<AccountPublic>('accounts').findOne({
    _id: srcWallet.investData.dstProviderId || srcWallet.investData.providerId,
  }, {
    projection: {
      name: 1,
      balance: 1,
    },
  });
  if (!account) {
    return { error: ErrorType.accountNotFound };
  }

  const profit = srcWallet.balance - srcWallet.investData.balanceStart;
  const roi = (100 * profit) / srcWallet.investData.balanceStart;

  const updateData: Partial<Wallet> = {
    investStatus: InvestStatus.inactive,
    investData: {
      ...srcWallet.investData,

      endedAt: new Date(),
      balanceEnd: srcWallet.balance,

      profit,
      roi,
    },
  };
  await Mongo.collection<Wallet>('wallets').updateOne({
    _id: walletId,
  }, {
    $set: updateData,
  });

  const currency = 'USD';
  const dstWalletId = `${uid}-${currency}`;

  const dstWallet = await Mongo.collection<Wallet>('wallets').findOne({
    _id: dstWalletId,
  }, {
    projection: {
      balance: 1,
      userEmail: 1,
    },
  });
  if (!dstWallet) {
    return { error: ErrorType.walletNotFound };
  }

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
      name: dstWallet.userEmail,
      description: 'Remove funds',
    },
  });

  // cron will handle next and update transaction status to success

  return { result: { ...srcWallet, ...updateData } };
};

export default stopInvest;
