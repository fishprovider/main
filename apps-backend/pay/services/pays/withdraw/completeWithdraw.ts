import updateTransaction from '@fishprovider/coin/dist/utils/transaction/updateTransaction';
import { TransactionStatus } from '@fishprovider/utils/dist/constants/pay';
import type { Transaction, Wallet } from '@fishprovider/utils/dist/types/Pay.model';
import type { ClientSession } from 'mongodb';

const completeWithdraw = async (params: {
  transaction: Transaction,
  session: ClientSession,
}) => {
  const {
    transaction, session,
  } = params;
  const {
    _id: payId, srcId, dstAmount,
  } = transaction;
  if (!dstAmount) {
    throw new Error(`Invalid transaction destination amount ${dstAmount} from ${payId}`);
  }

  const srcWallet = await Mongo.collection<Wallet>('wallets').findOne({
    _id: srcId,
  }, {
    projection: {
      balance: 1,
    },
  });
  if (!srcWallet) {
    throw new Error(`Wallet not found: ${srcId}`);
  }

  const updateData: Partial<Transaction> = {
    status: TransactionStatus.success,
    srcBalanceBefore: srcWallet.balance,
    srcBalanceAfter: srcWallet.balance - dstAmount,
  };
  await updateTransaction({
    transaction,
    updateData,
    session,
  });

  const transactionUpdatedWithBalanceUpdated = {
    ...transaction,
    ...updateData,
  };
  await Mongo.collection<Wallet>('wallets').updateOne({
    _id: srcId,
  }, {
    $inc: {
      balance: -dstAmount,
    },
    $push: {
      recentTransactions: {
        $each: [transactionUpdatedWithBalanceUpdated],
        $sort: { updatedAt: -1 },
        $slice: 20,
      },
    },
  }, {
    session,
  });
};

export default completeWithdraw;
