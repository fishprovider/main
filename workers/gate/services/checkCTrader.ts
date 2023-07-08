import { isPausedWeekend } from '@fishprovider/utils/helpers/pause';
import type { Moment } from 'moment';
import moment from 'moment-timezone';

let lastUpdated: Moment;

const checkLastUpdated = async () => {
  if (isPausedWeekend()) return;

  const docSignal = await Mongo.collection('signals').findOne(
    {
      createdAt: { $gte: moment().subtract(1, 'hour').toDate() },
    },
    {
      projection: {
        _id: 1,
      },
    },
  );
  if (!docSignal) {
    Logger.warn('Lost signals from CTrader');
  }

  // const docBar = await Mongo.collection('bars').findOne(
  //   {
  //     'providerData.source.Gate': { $gte: moment().subtract(5, 'minutes').toDate() },
  //   },
  //   {
  //     projection: {
  //       _id: 1,
  //     },
  //   },
  // );
  // if (!docBar) {
  //   Logger.warn('Lost bars from CTrader');
  // }

  if (!lastUpdated || lastUpdated.isBefore(moment().subtract(2, 'minutes'))) {
    // Logger.warn('Lost prices from CTrader');
  }
};

const setLastUpdated = () => {
  lastUpdated = moment();
};

export {
  checkLastUpdated,
  setLastUpdated,
};
