import { destroy as destroyQueue, QueuePromise, start as startQueue } from '@fishprovider/core/libs/queuePromise';
import { SourceType, TransactionStatus, TransactionType } from '@fishprovider/utils/constants/pay';
import type { Transaction } from '@fishprovider/utils/types/Pay.model';
import _ from 'lodash';

import runDeposit from './deposit/runDeposit';
import runTransfer from './transfer/runTransfer';
import runWithdraw from './withdraw/runWithdraw';

const env = {
  typeId: process.env.TYPE_ID,
};

let isPaused = false;
let pQueue: QueuePromise;

const doneStatuses = [
  TransactionStatus.cancelled,
  TransactionStatus.expired,
  TransactionStatus.success,
  TransactionStatus.failed,
];

const notifDepositTypes = [
  SourceType.wallet,
  SourceType.reward,
];

const stop = () => {
  isPaused = true;
};

const resume = () => {
  isPaused = false;
};

const start = async () => {
  pQueue = await startQueue({
    name: env.typeId, sizeError: 200, sizeWarn: 100, concurrency: 1,
  });
};

const destroy = async () => {
  if (pQueue) {
    await destroyQueue(pQueue);
  }
};

const baseFilters = {
  status: { $nin: doneStatuses },
  statusRequest: { $exists: false },
};

const runDeposits = async () => {
  const filters = {
    ...baseFilters,
    type: TransactionType.deposit,
    srcId: { $exists: true },
  };
  const transactions = await Mongo.collection<Transaction>('transactions').find(filters, {
    projection: {
      _id: 1,
    },
  }).toArray();
  Logger.debug(`🔥 Deposits found ${transactions.length}`, filters);

  if (transactions.length) {
    const transactionsToNotif = transactions.filter(
      (item) => notifDepositTypes.includes(item.srcType),
    );
    if (transactionsToNotif.length) {
      Logger.warn(`🔥 Deposits found ${transactionsToNotif.length}`);
    }
    transactions.forEach((transaction) => {
      pQueue.add(() => runDeposit(transaction._id, filters).catch((err) => {
        Logger.error(`Failed to runDeposit ${transaction._id}`, err);
      }));
    });
  }
};

const runTransfers = async () => {
  const filters = {
    ...baseFilters,
    type: TransactionType.transfer,
  };
  const transactions = await Mongo.collection<Transaction>('transactions').find(filters, {
    projection: {
      _id: 1,
    },
  }).toArray();
  Logger.debug(`🔥 Transfers found ${transactions.length}`, filters);

  if (transactions.length) {
    Logger.warn(`🔥 Transfers found ${transactions.length}`);
    transactions.forEach((transaction) => {
      pQueue.add(() => runTransfer(transaction._id, filters).catch((err) => {
        Logger.error(`Failed to runTransfer ${transaction._id}`, err);
      }));
    });
  }
};

const runWithdrawals = async () => {
  const filters = {
    ...baseFilters,
    type: TransactionType.withdraw,
  };
  const transactions = await Mongo.collection<Transaction>('transactions').find(filters, {
    projection: {
      _id: 1,
    },
  }).toArray();
  Logger.debug(`🔥 Withdrawals found ${transactions.length}`, filters);

  if (transactions.length) {
    Logger.warn(`🔥 Withdrawals found ${transactions.length}`);
    transactions.forEach((transaction) => {
      pQueue.add(() => runWithdraw(transaction._id, filters).catch((err) => {
        Logger.error(`Failed to runWithdraw ${transaction._id}`, err);
      }));
    });
  }
};

const runPays = async () => {
  if (isPaused) {
    return;
  }

  try {
    await runDeposits();
    await runTransfers();
    await runWithdrawals();
  } catch (err) {
    Logger.error('Failed at runRays', err);
  }
};

export {
  destroy,
  resume,
  runPays,
  start,
  stop,
};
