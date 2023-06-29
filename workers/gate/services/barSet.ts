import type { Bar } from '@fishbot/utils/types/Bar.model';
import _ from 'lodash';
import moment from 'moment-timezone';

const env = {
  apiPass: process.env.API_PASS,
};

enum Period {
  'MN1' = 'Monthly',
  'W1' = 'Weekly',
  'D1' = 'Daily',
  'H4' = 'Hour4',
  'H1' = 'Hour',
  'M15' = 'Minute15',
  'M5' = 'Minute5',
  'M3' = 'Minute3',
  'M1' = 'Minute1',
}

const periodKeys = _.invert(Period);

const updateBar = async ({
  symbol,
  period,
  high,
  low,
  open,
  close,
  volume,
  startAt: startAtRaw,
  ema20,
  ema50,
}: {
  symbol: string;
  period: Period;
  high: number;
  low: number;
  open: number;
  close: number;
  volume: number;
  startAt: string;
  ema20: number;
  ema50: number;
}) => {
  const startAt = moment.tz(startAtRaw, 'UTC').toDate();

  const bar = {
    symbol,
    period: periodKeys[period],
    timestamp: startAt.getTime(),
    high: +high,
    low: +low,
    open: +open,
    close: +close,
    ema20: +ema20,
    ema50: +ema50,
    volume: +volume,
    startAt,
  };

  const _id = `${symbol}_${bar.period}_${bar.timestamp}`;

  await Mongo.collection<Bar>('bars').updateOne(
    { _id },
    {
      $set: {
        ...bar,
        'providerData.source.Gate': new Date(),
      },
    },
    { upsert: true },
  );
};

const barSet = async ({ secret, bars }: {
  secret: string;
  bars: any[];
}) => {
  if (secret !== env.apiPass) {
    return { error: 'Params error' };
  }

  for (const bar of bars) {
    await updateBar(bar);
  }

  return { result: 'OK' };
};

export default barSet;
