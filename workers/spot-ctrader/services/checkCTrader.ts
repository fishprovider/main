import { isPausedWeekend } from '@fishprovider/utils/helpers/pause';
import moment from 'moment';

const env = {
  typeId: process.env.TYPE_ID || '',
};

let lastUpdated: moment.Moment;

const checkLastUpdated = async () => {
  if (isPausedWeekend()) return;

  if (!lastUpdated || lastUpdated.isBefore(moment().subtract(2, 'minutes'))) {
    Logger.warn('Lost prices from CTrader', env.typeId);
  }
};

const setLastUpdated = () => {
  lastUpdated = moment();
};

export {
  checkLastUpdated,
  setLastUpdated,
};
