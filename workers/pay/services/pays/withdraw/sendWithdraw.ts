import { getAccount, sendTransaction } from '@fishprovider/coin/dist/libs/coinbaseApi';
import updateTransaction from '@fishprovider/coin/dist/utils/transaction/updateTransaction';
import { DestinationPayType, TransactionStatus, TransactionStatusRequest } from '@fishprovider/utils/dist/constants/pay';
import type { Transaction, Wallet } from '@fishprovider/utils/dist/types/Pay.model';
import _ from 'lodash';
import moment from 'moment';

import isDemo from '~utils/isDemo';

const sendWithdraw = async (transaction: Transaction) => {
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
    const isExpired = moment().diff(transaction.createdAt, 'minutes') > 60;
    if (isExpired) {
      throw new Error(`Insufficient funds ${srcWallet._id}`);
    }
    return;
  }

  if (isDemo) {
    await updateTransaction({
      transaction,
      updateData: {
        status: TransactionStatus.pending,
        statusRequest: TransactionStatusRequest.toSuccess,
        dstAmount: transaction.srcAmount,
      },
    });
    return;
  }

  // TODO: Coinbase listAccounts then getAccount
  const coinbaseAccountId = '';
  if (!coinbaseAccountId) {
    await updateTransaction({
      transaction,
      updateData: {
        statusRequest: TransactionStatusRequest.sendExternal,
      },
    });
    return;
  }

  const account = await getAccount(coinbaseAccountId);
  if (!account || !account.balance || account.balance < transaction.srcAmount) {
    await updateTransaction({
      transaction,
      updateData: {
        statusRequest: TransactionStatusRequest.sendExternal,
      },
    });
    return;
  }

  const res = await sendTransaction(coinbaseAccountId, {
    to: transaction.dstId,
    currency: transaction.dstCurrency,
    amount: transaction.srcAmount,
    description: 'Send via CoinbaseApi',
  });
    // TODO: Coinbase sendTransaction
  const { id: dstPayId } = res;
  if (!dstPayId) {
    Logger.error(`Missing dstPayId ${transaction._id}`);
    await updateTransaction({
      transaction,
      updateData: {
        statusRequest: TransactionStatusRequest.sendExternal,
      },
    });
    return;
  }

  await updateTransaction({
    transaction,
    updateData: {
      status: TransactionStatus.pending,
      dstPayType: DestinationPayType.coinbaseApi,
      dstPayAccountId: coinbaseAccountId,
      dstPayId,
    },
  });
};

export default sendWithdraw;
