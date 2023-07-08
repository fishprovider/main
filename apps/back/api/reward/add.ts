import createDeposit from '@fishprovider/coin/utils/transaction/createDeposit';
import createSpot from '@fishprovider/coin/utils/wallet/createSpot';
import { ErrorType } from '@fishprovider/utils/constants/error';
import { SourceType, TransactionType } from '@fishprovider/utils/constants/pay';
import random from '@fishprovider/utils/helpers/random';
import { getRoleProvider } from '@fishprovider/utils/helpers/user';
import type { Wallet } from '@fishprovider/utils/types/Pay.model';
import type { User } from '@fishprovider/utils/types/User.model';

const rewardAdd = async ({ data, userInfo }: {
  data: {
    userId: string,
    amount: number,
  }
  userInfo: User,
}) => {
  const { userId, amount } = data;
  if (!userId || !amount) {
    return { error: ErrorType.badRequest };
  }

  const {
    uid, name, email, roles,
  } = userInfo;
  const { isAdmin } = getRoleProvider(roles);
  if (!isAdmin) {
    return { error: ErrorType.accessDenied };
  }

  const currency = 'USD';
  const walletId = `${userId}-${currency}`;

  let wallet = await Mongo.collection<Wallet>('wallets').findOne({
    _id: walletId,
  }, {
    projection: {
      balance: 1,
    },
  });

  if (!wallet) {
    wallet = await createSpot({
      userId: uid,
      userEmail: email,
      userName: name,
      walletId,
      currency,
    });
  }

  const { balance } = wallet;

  const srcType = SourceType.reward;
  const srcId = random();
  const payId = `${TransactionType.deposit}-${walletId}-${srcType}-${srcId}`;

  const transaction = await createDeposit({
    payId,
    userId,

    srcType,
    srcId,
    srcCurrency: currency,
    srcAmount: amount,

    dstCurrency: currency,
    dstId: walletId,
    dstBalance: balance,
  });

  // cron will handle next and update transaction status to success

  return { result: transaction };
};

export default rewardAdd;
