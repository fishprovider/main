import updateTransaction from '@fishprovider/coin/dist/utils/transaction/updateTransaction';
import { runDBTransaction } from '@fishprovider/old-core/dist/libs/mongo';
import { TransactionStatus, TransactionStatusRequest } from '@fishprovider/utils/dist/constants/pay';
import type { Transaction, Wallet } from '@fishprovider/utils/dist/types/Pay.model';

import completeTransfer from './completeTransfer';

const runTransfer = async (payId: string, filters: Record<string, any>) => {
  const transaction = await Mongo.collection<Transaction>('transactions').findOne({
    ...filters,
    _id: payId,
  });
  if (!transaction) {
    throw new Error(`Transaction not found ${payId}`);
  }

  try {
    const srcWallet = await Mongo.collection<Wallet>('wallets').findOne({
      _id: transaction.srcId,
    }, {
      projection: {
        balance: 1,
      },
    });
    if (!srcWallet) {
      throw new Error(`Wallet not found ${transaction.srcId}`);
    }
    if (!srcWallet.balance || srcWallet.balance < transaction.srcAmount) {
      throw new Error(`Insufficient funds ${srcWallet._id}`);
    }

    const updateData: Partial<Transaction> = {
      status: TransactionStatus.pending,
      statusRequest: TransactionStatusRequest.toSuccess,
      dstAmount: transaction.srcAmount,
    };
    await updateTransaction({
      transaction,
      updateData,
    });

    await runDBTransaction((session) => completeTransfer({
      transaction: {
        ...transaction,
        ...updateData,
      },
      session,
    }));
  } catch (err) {
    Logger.error(`Failed to transfer ${payId}`, err);
    await updateTransaction({
      transaction,
      updateData: {
        status: TransactionStatus.failed,
      },
    });
  }
};

export default runTransfer;
