import { getTransactionUpdates } from '@fishbot/coin/libs/coinbaseApi/utils';
import updateTransaction from '@fishbot/coin/utils/transaction/updateTransaction';
import { runDBTransaction } from '@fishbot/core/libs/mongo';
import { DestinationPayType, TransactionStatus, TransactionStatusRequest } from '@fishbot/utils/constants/pay';
import type { Transaction } from '@fishbot/utils/types/Pay.model';
import _ from 'lodash';

import isDemo from '~utils/isDemo';

import completeWithdraw from './completeWithdraw';

const checkWithdraw = async (transaction: Transaction) => {
  if (isDemo) {
    await runDBTransaction((session) => completeWithdraw({
      transaction,
      session,
    }));
    return;
  }

  const { dstPayType, dstPayAccountId, dstPayId } = transaction;
  switch (dstPayType) {
    case DestinationPayType.manual:
      if (dstPayId) {
        await runDBTransaction((session) => completeWithdraw({
          transaction,
          session,
        }));
      }
      return;

    case DestinationPayType.coinbaseApi: {
      if (!dstPayAccountId) {
        throw new Error(`Missing dstPayAccountId ${transaction._id}`);
      }
      if (!dstPayId) {
        throw new Error(`Missing dstPayId ${transaction._id}`);
      }

      const updates = await getTransactionUpdates(dstPayAccountId, dstPayId);
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
            dstAmount: updates.dstAmount,
          };
          await updateTransaction({
            transaction,
            updateData,
          });
          await runDBTransaction((session) => completeWithdraw({
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
      throw new Error(`Invalid dstPayType ${dstPayType} ${transaction._id}`);
  }
};

export default checkWithdraw;
