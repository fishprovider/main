import { cancelPayment as cancelPaymentCoinbaseCommerce } from '@fishbot/coin/libs/coinbaseCommerce';
import { getTransactionUpdates as getTransactionUpdatesFromCoinbaseCommerce } from '@fishbot/coin/libs/coinbaseCommerce/utils';
import { cancelPayment as cancelPaymentRequestFinance } from '@fishbot/coin/libs/requestFinance';
import { getTransactionUpdates as getTransactionUpdatesFromRequestFinance } from '@fishbot/coin/libs/requestFinance/utils';
import updateTransaction from '@fishbot/coin/utils/transaction/updateTransaction';
import { ErrorType } from '@fishbot/utils/constants/error';
import { SourceType, TransactionStatus } from '@fishbot/utils/constants/pay';
import type { Transaction } from '@fishbot/utils/types/Pay.model';
import type { User } from '@fishbot/utils/types/User.model';

import isDemo from '~utils/isDemo';

const defaultSrcType = SourceType.coinbaseCommerce;

const cancelPayments = {
  [SourceType.coinbaseCommerce]: cancelPaymentCoinbaseCommerce,
  [SourceType.requestFinance]: cancelPaymentRequestFinance,
};

const getTransactionUpdates = {
  [SourceType.coinbaseCommerce]: getTransactionUpdatesFromCoinbaseCommerce,
  [SourceType.requestFinance]: getTransactionUpdatesFromRequestFinance,
};

const depositCancel = async ({ data, userInfo }: {
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
    // demo is always success, does nothing here
    return { result: transaction };
  }

  let updateData: Partial<Transaction> | undefined;

  const {
    srcType = defaultSrcType,
  } = data;

  switch (srcType) {
    case SourceType.coinbaseCommerce:
    case SourceType.requestFinance: {
      await cancelPayments[srcType](transaction.srcId);
      updateData = await getTransactionUpdates[srcType](transaction.srcId);
      break;
    }
    case SourceType.fishPay: {
      updateData = {
        status: TransactionStatus.cancelled,
      };
      await updateTransaction({
        transaction,
        updateData,
      });
      break;
    }
    default:
      return { error: ErrorType.badRequest };
  }

  return { result: { ...transaction, ...updateData } };
};

export default depositCancel;
