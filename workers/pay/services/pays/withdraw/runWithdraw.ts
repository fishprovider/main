import updateTransaction from '@fishprovider/coin/dist/utils/transaction/updateTransaction';
import { TransactionStatus } from '@fishprovider/utils/dist/constants/pay';
import type { Transaction } from '@fishprovider/utils/dist/types/Pay.model';
import _ from 'lodash';

import checkWithdraw from './checkWithdraw';
import sendWithdraw from './sendWithdraw';

const runWithdraw = async (payId: string, filters: Record<string, any>) => {
  const transaction = await Mongo.collection<Transaction>('transactions').findOne({
    ...filters,
    _id: payId,
  });
  if (!transaction) {
    throw new Error(`Transaction not found ${payId}`);
  }

  try {
    switch (transaction.status) {
      case TransactionStatus.new: {
        await sendWithdraw(transaction);
        return;
      }
      case TransactionStatus.pending: {
        await checkWithdraw(transaction);
        return;
      }
      default:
        throw new Error(`Invalid status ${transaction.status}`);
    }
  } catch (err) {
    Logger.error(`Failed to withdraw ${payId}`, err);
    await updateTransaction({
      transaction,
      updateData: {
        status: TransactionStatus.failed,
      },
    });
  }
};

export default runWithdraw;
