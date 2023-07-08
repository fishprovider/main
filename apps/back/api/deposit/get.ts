import { getTransactionUpdates as getTransactionUpdatesFromCoinbaseCommerce } from '@fishprovider/coin/libs/coinbaseCommerce/utils';
import { getTransactionUpdates as getTransactionUpdatesFromRequestFinance } from '@fishprovider/coin/libs/requestFinance/utils';
import { ErrorType } from '@fishprovider/utils/constants/error';
import { SourceType } from '@fishprovider/utils/constants/pay';
import type { Transaction } from '@fishprovider/utils/types/Pay.model';
import type { User } from '@fishprovider/utils/types/User.model';

import isDemo from '~utils/isDemo';

const defaultSrcType = SourceType.coinbaseCommerce;

const getTransactionUpdates = {
  [SourceType.coinbaseCommerce]: getTransactionUpdatesFromCoinbaseCommerce,
  [SourceType.requestFinance]: getTransactionUpdatesFromRequestFinance,
};

const depositGet = async ({ data, userInfo }: {
  data: {
    payId: string,
    srcType?: SourceType,
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
  if (!transaction || !transaction.srcId) {
    return { error: ErrorType.transactionNotFound };
  }

  if (isDemo) {
    return { result: transaction };
  }

  let updateData: Partial<Transaction> | undefined;

  const {
    srcType = defaultSrcType,
  } = data;

  switch (srcType) {
    case SourceType.coinbaseCommerce:
    case SourceType.requestFinance: {
      updateData = await getTransactionUpdates[srcType](transaction.srcId);
      break;
    }
    default:
      return { error: ErrorType.badRequest };
  }

  return { result: { ...transaction, ...updateData } };
};

export default depositGet;
