import type { QueuePromise } from '@fishprovider/old-core/dist/libs/queuePromise';
import { destroy as destroyQueue, start as startQueue } from '@fishprovider/old-core/dist/libs/queuePromise';
import { getProviderIds } from '@fishprovider/swap/dist/utils/account';
import { AccountTradeType } from '@fishprovider/utils/dist/constants/account';
import { isPausedWeekend } from '@fishprovider/utils/dist/helpers/pause';
import _ from 'lodash';
import moment, { Moment } from 'moment';

import { copyTasks } from '~utils/account';

import checkAccount from './checkAccount';

const env = {
  typeId: process.env.TYPE_ID,
  tradeType: process.env.PROVIDER_TRADE_TYPE || AccountTradeType.demo,
};

let isPaused = false;
let pQueue: QueuePromise;

const numRunsInQueue = 2;
const runs: Record<string, number> = {};
const lastRuns: Record<string, Moment> = {};

const status = () => _.map(lastRuns, (lastRun, providerId) => `[${providerId}] ${lastRun.fromNow()}`).join(', ');

const stop = () => {
  isPaused = true;
};

const resume = () => {
  isPaused = false;
};

const start = async () => {
  pQueue = await startQueue({
    name: env.typeId, sizeError: 200, sizeWarn: 100, concurrency: 3,
  });
};

const destroy = async () => {
  if (pQueue) {
    await destroyQueue(pQueue);
  }
};

const runCopiers = async (onStart?: boolean) => {
  const providerIds = await getProviderIds({
    tradeType: env.tradeType,
    'settings.enableCopyParent': true,
    isSystem: { $ne: true },
    deleted: { $ne: true },
  });

  if (onStart) {
    Logger.info(`🎡 Running ${providerIds.length} providers`, providerIds, isPaused, isPausedWeekend());
    Logger.warn(`🎡 Running ${providerIds.length} providers`, copyTasks);
  }
  Logger.debug(`🎡 Running ${providerIds.length} providers`, providerIds, copyTasks, runs, lastRuns, isPaused, isPausedWeekend());

  providerIds.forEach((providerId) => {
    if (!runs[providerId]) {
      runs[providerId] = 0;
    }
    if (runs[providerId] as number >= numRunsInQueue) {
      return;
    }
    if (isPaused) {
      return;
    }
    runs[providerId] += 1;
    pQueue.add(() => checkAccount(providerId).finally(() => {
      runs[providerId] -= 1;
      lastRuns[providerId] = moment();
    }));
  });
};

export {
  destroy,
  resume,
  runCopiers,
  start,
  status,
  stop,
};
