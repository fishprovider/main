import { ErrorType } from '@fishprovider/utils/constants/error';
import type { User } from '@fishprovider/utils/types/User.model';
import moment from 'moment';

const newsGetMany = async ({ data, userInfo }: {
  data: {
    today?: boolean,
    week?: string,
    upcoming?: boolean,
  },
  userInfo: User,
}) => {
  const { today, week, upcoming } = data;
  if (!(today || week || upcoming)) {
    return { error: ErrorType.badRequest };
  }

  const { uid } = userInfo;
  if (!uid) {
    return { error: ErrorType.accessDenied };
  }

  if (today) {
    const docs = await Mongo.collection('news').find({
      datetime: {
        $gte: new Date(),
        $lte: moment().add(24, 'hours').toDate(),
      },
    }).toArray();
    return { result: docs };
  }

  if (week) {
    const docs = await Mongo.collection('news').find({
      week,
    }).toArray();
    return { result: docs };
  }

  if (upcoming) {
    const docs = await Mongo.collection('news').find({
      impact: { $in: ['high', 'medium'] },
      datetime: {
        $gte: moment().subtract(1, 'hour').toDate(),
        $lte: moment().add(1, 'hour').toDate(),
      },
    }).toArray();
    return { result: docs };
  }

  return { error: ErrorType.badRequest };
};

export default newsGetMany;
