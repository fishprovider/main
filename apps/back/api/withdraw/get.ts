import { getTransactionUpdates } from '@fishprovider/coin/dist/libs/coinbaseApi/utils';
import { ErrorType } from '@fishprovider/utils/dist/constants/error';
import { DestinationPayType } from '@fishprovider/utils/dist/constants/pay';
import type { Transaction } from '@fishprovider/utils/dist/types/Pay.model';
import type { User } from '@fishprovider/utils/dist/types/User.model';

import isDemo from '~utils/isDemo';

const withdrawGet = async ({ data, userInfo }: {
  data: {
    payId: string,
  }
  userInfo: User,
}) => {
  const { payId } = data;
  if (!payId) {
    return { error: ErrorType.badRequest };
  }

  const { uid } = userInfo;
  if (!uid) {
    return { error: ErrorType.accessDenied };
  }

  const transaction = await Mongo.collection<Transaction>('transactions').findOne({
    _id: payId,
    userId: uid,
  });
  if (!transaction) {
    return { error: ErrorType.transactionNotFound };
  }

  if (isDemo) {
    return { result: transaction };
  }

  const { dstPayType, dstPayAccountId, dstPayId } = transaction;
  if (!dstPayType) {
    return { result: transaction };
  }

  switch (dstPayType) {
    case DestinationPayType.manual:
      return { result: transaction };

    case DestinationPayType.coinbaseApi: {
      if (!dstPayAccountId) {
        return { error: `Missing dstPayAccountId ${transaction._id}` };
      }
      if (!dstPayId) {
        return { error: `Missing dstPayId ${transaction._id}` };
      }

      const updates = await getTransactionUpdates(dstPayAccountId, dstPayId);
      return { result: { ...transaction, ...updates } };
    }

    default:
      return { error: `Invalid dstPayType ${dstPayType} ${transaction._id}` };
  }
};

export default withdrawGet;
