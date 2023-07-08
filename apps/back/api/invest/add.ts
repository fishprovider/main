import createTransfer from '@fishprovider/coin/utils/transaction/createTransfer';
import createInvest from '@fishprovider/coin/utils/wallet/createInvest';
import { ProviderViewType } from '@fishprovider/utils/constants/account';
import { ErrorType } from '@fishprovider/utils/constants/error';
import { InvestStatus, SourceType, TransactionType } from '@fishprovider/utils/constants/pay';
import random from '@fishprovider/utils/helpers/random';
import type { AccountPublic } from '@fishprovider/utils/types/Account.model';
import type { Wallet } from '@fishprovider/utils/types/Pay.model';
import type { User } from '@fishprovider/utils/types/User.model';

const investAdd = async ({ data, userInfo }: {
  data: {
    amount: number,
    providerId: string,
  }
  userInfo: User,
}) => {
  const { amount, providerId } = data;
  if (!amount || !providerId) {
    return { error: ErrorType.badRequest };
  }

  const { uid, email, name } = userInfo;
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

  const account = await Mongo.collection<AccountPublic>('accounts').findOne({
    _id: providerId,
    providerViewType: ProviderViewType.public,
    strategyId: { $exists: true },
  }, {
    projection: {
      name: 1,
    },
  });
  if (!account) {
    return { error: ErrorType.accountNotFound };
  }

  const dstWalletId = `${uid}-${currency}-${providerId}-${random()}`;

  const dstWallet = await createInvest({
    userId: uid,
    userEmail: email,
    userName: name,
    walletId: dstWalletId,
    name: `${currency} Invest ${account.name || providerId}`,
    currency,
    investStatus: InvestStatus.new,
    investData: {
      providerId,
      providerName: account.name,
    },
  });

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
      name: account.name || providerId,
      description: 'Add funds',
    },
  });

  // cron will handle next and update transaction status to success

  return { result: dstWallet };
};

export default investAdd;
