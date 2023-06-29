import { getTransactionUpdates as getTransactionUpdatesFromCoinbaseCommerce } from '@fishbot/coin/libs/coinbaseCommerce/utils';
import { getTransactionUpdates as getTransactionUpdatesFromRequestFinance } from '@fishbot/coin/libs/requestFinance/utils';
import updateTransaction from '@fishbot/coin/utils/transaction/updateTransaction';
import { runDBTransaction } from '@fishbot/core/libs/mongo';
import { SourceType, TransactionStatus, TransactionStatusRequest } from '@fishbot/utils/constants/pay';
import type { Transaction } from '@fishbot/utils/types/Pay.model';
import _ from 'lodash';

import completeDeposit from './completeDeposit';

const getTransactionUpdates = {
  [SourceType.coinbaseCommerce]: getTransactionUpdatesFromCoinbaseCommerce,
  [SourceType.requestFinance]: getTransactionUpdatesFromRequestFinance,
};

const runDeposit = async (payId: string, filters: Record<string, any>) => {
  const transaction = await Mongo.collection<Transaction>('transactions').findOne({
    ...filters,
    _id: payId,
  });
  if (!transaction) {
    throw new Error(`Transaction not found ${payId}`);
  }

  try {
    switch (transaction.srcType) {
      case SourceType.reward: {
        const updateData: Partial<Transaction> = {
          status: TransactionStatus.pending,
          statusRequest: TransactionStatusRequest.toSuccess,
          dstAmount: transaction.srcAmount,
        };
        await updateTransaction({
          transaction,
          updateData,
        });
        await runDBTransaction((session) => completeDeposit({
          transaction: {
            ...transaction,
            ...updateData,
          },
          session,
        }));
        return;
      }

      case SourceType.coinbaseCommerce:
      case SourceType.requestFinance: {
        if (!transaction.srcId) {
          throw new Error(`Missing srcId ${transaction._id}`);
        }

        const updates = await getTransactionUpdates[transaction.srcType](transaction.srcId);

        if (updates.status !== transaction.status) {
          if (updates.status !== TransactionStatus.success) {
            await updateTransaction({
              transaction,
              updateData: updates,
            });
          } else {
            const updateData: Partial<Transaction> = {
              ...updates,
              status: TransactionStatus.pending,
              statusRequest: TransactionStatusRequest.toSuccess,
            };
            await updateTransaction({
              transaction,
              updateData,
            });
            await runDBTransaction((session) => completeDeposit({
              transaction: {
                ...transaction,
                ...updateData,
              },
              session,
            }));
          }
        }
        break;
      }

      default:
        throw new Error(`Invalid srcType ${transaction.srcType}`);
    }
  } catch (err) {
    Logger.error(`Failed to deposit ${payId}`, err);
    await updateTransaction({
      transaction,
      updateData: {
        status: TransactionStatus.failed,
      },
    });
  }
};

export default runDeposit;
