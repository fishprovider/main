import updateTransaction from '@fishbot/coin/utils/transaction/updateTransaction';
import { TransactionStatus } from '@fishbot/utils/constants/pay';
import type { Transaction, Wallet } from '@fishbot/utils/types/Pay.model';
import type { ClientSession } from 'mongodb';

const completeDeposit = async (params: {
  transaction: Transaction,
  session: ClientSession,
}) => {
  const {
    transaction, session,
  } = params;
  const {
    _id: payId, dstId, dstAmount,
  } = transaction;
  if (!dstAmount) {
    throw new Error(`Invalid transaction destination amount ${dstAmount} from ${payId}`);
  }

  const wallet = await Mongo.collection<Wallet>('wallets').findOne({
    _id: dstId,
  }, {
    projection: {
      balance: 1,
    },
  });
  if (!wallet) {
    throw new Error(`Wallet not found: ${dstId}`);
  }

  const updateData: Partial<Transaction> = {
    status: TransactionStatus.success,
    dstBalanceBefore: wallet.balance,
    dstBalanceAfter: wallet.balance + dstAmount,
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
    _id: dstId,
  }, {
    $inc: {
      balance: +dstAmount,
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

export default completeDeposit;
