import { TrendbarPeriod } from '@fishprovider/ctrader/dist/constants/openApi';
import type { CallbackPayload } from '@fishprovider/ctrader/dist/types/Event.model';
import type { QueuePromise } from '@fishprovider/old-core/dist/libs/queuePromise';
import { destroy as destroyQueue, start as startQueue } from '@fishprovider/old-core/dist/libs/queuePromise';
import { getSymbols } from '@fishprovider/swap/dist/utils/price';
import type { ProviderType } from '@fishprovider/utils/dist/constants/account';
import _ from 'lodash';
import moment from 'moment';

import type { BarCTrader } from '~types/Bar.model';
import { updateBar } from '~utils/bar';

const env = {
  typeId: process.env.TYPE_ID,
  queryConcurrency: process.env.QUEUE_CONCURRENCY || 1,
  querySizeError: process.env.QUEUE_SIZE_ERROR || 400,
  querySizeErrorStep: process.env.QUEUE_SIZE_ERROR_STEP || 50,
  querySizeWarn: process.env.QUEUE_SIZE_WARN || 200,
  querySizeWarnStep: process.env.QUEUE_SIZE_WARN_STEP || 50,
};

let pQueue: QueuePromise;

const periodTexts = _.invert(TrendbarPeriod);

const lastRuns: Record<string, Record<string, Date>> = {};

const start = async () => {
  pQueue = await startQueue({
    name: env.typeId,
    concurrency: +env.queryConcurrency,
    sizeError: +env.querySizeError,
    sizeErrorStep: +env.querySizeErrorStep,
    sizeWarn: +env.querySizeWarn,
    sizeWarnStep: +env.querySizeWarnStep,
  });
};

const destroy = async () => {
  if (pQueue) {
    await destroyQueue(pQueue);
  }
};

const getNewBars = (symbol: string, bars: BarCTrader[]) => bars.filter(({ period, startAt }) => {
  if (!period || !startAt) {
    Logger.debug('Invalid bar');
    return false;
  }

  if (!lastRuns[symbol]) lastRuns[symbol] = {};

  const lastRun = lastRuns[symbol] as Record<string, Date>;

  if (!lastRun[period]) {
    Logger.debug(`First bar ${symbol} ${periodTexts[period]} at ${startAt}`);
    lastRun[period] = startAt;
    return true;
  }

  if (moment(lastRun[period]).isSame(moment(startAt))) return false;

  Logger.debug(`New bar ${symbol} ${periodTexts[period]} at ${startAt}`);
  lastRun[period] = startAt;
  return true;
});

const handleEventBars = async (
  providerType: ProviderType,
  payload: CallbackPayload,
) => {
  const {
    symbolId, bars, bid, ask,
  } = payload;
  try {
    const { symbolIds } = await getSymbols(providerType);
    const symbol = symbolIds[symbolId]?.symbol;
    if (!symbol) {
      // Logger.warn(`[event-bar] Symbol not found ${symbolId}`);
      return 3;
    }

    const bidPrice = +bid || +ask;
    const askPrice = +ask || +bid;
    const price = (bidPrice + askPrice) / 2;

    const newBars = getNewBars(symbol, bars);
    newBars.forEach((bar) => {
      pQueue.add(() => updateBar(providerType, symbol, {
        ...bar,
        close: bar.close || price,
      }));
    });

    return 1;
  } catch (err) {
    Logger.error('Failed to handleEventBars', err);
    return 2;
  }
};

export default handleEventBars;

export {
  destroy,
  start,
};
