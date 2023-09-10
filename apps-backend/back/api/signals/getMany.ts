import { ErrorType } from '@fishprovider/utils/dist/constants/error';
import type { User } from '@fishprovider/utils/dist/types/User.model';
import moment from 'moment';

const signalGetMany = async ({ data, userInfo }: {
  data: {
    symbol: string,
  },
  userInfo: User,
}) => {
  const { symbol } = data;
  if (!symbol) {
    return { error: ErrorType.badRequest };
  }

  const { uid } = userInfo;
  if (!uid) {
    return { error: ErrorType.accessDenied };
  }

  let offsetDays = 0;
  if (moment.utc().day() === 6) {
    offsetDays = 1;
  }
  if (moment.utc().day() === 0) {
    offsetDays = 2;
  }
  if (moment.utc().day() === 1) {
    offsetDays = 3;
  }

  const signals = await Mongo.collection('signals')
    .find({
      $or: [
        {
          timeFr: 'Weekly',
          openTime: { $gte: moment().subtract(7, 'weeks').subtract(offsetDays, 'days').toDate() },
        },
        {
          timeFr: 'Daily',
          openTime: { $gte: moment().subtract(7, 'days').subtract(offsetDays, 'days').toDate() },
        },
        {
          timeFr: 'Hour4',
          openTime: { $gte: moment().subtract(28, 'hours').subtract(offsetDays, 'days').toDate() },
        },
        {
          timeFr: 'Hour',
          openTime: { $gte: moment().subtract(7, 'hours').subtract(offsetDays, 'days').toDate() },
        },
      ],
      symbolName: symbol,
    })
    .toArray();

  return { result: signals };
};

export default signalGetMany;
