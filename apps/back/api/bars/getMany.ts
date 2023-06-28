import type { ProviderType } from '@fishbot/utils/constants/account';
import { ErrorType } from '@fishbot/utils/constants/error';
import type { User } from '@fishbot/utils/types/User.model';
import moment from 'moment';

const barGetMany = async ({ data, userInfo }: {
  data: {
    providerType: ProviderType,
    symbol: string;
    period: string;
    scale: number;
  },
  userInfo: User,
}) => {
  const {
    providerType, symbol, period, scale,
  } = data;
  if (!providerType || !symbol || !period || !scale) {
    return { error: ErrorType.badRequest };
  }

  const { uid } = userInfo;
  if (!uid) {
    return { error: ErrorType.accessDenied };
  }

  const getFrom = (scaleInput: number) => {
    if (period === 'MN1') {
      return moment()
        .subtract(scaleInput * 5, 'years')
        .toDate();
    }
    if (period === 'W1') {
      return moment()
        .subtract(scaleInput * 3, 'years')
        .toDate();
    }
    if (period === 'D1') {
      return moment()
        .subtract(scaleInput * 6, 'months')
        .toDate();
    }
    if (period === 'H4') {
      return moment()
        .subtract(scaleInput * 1, 'month')
        .toDate();
    }
    if (period === 'H1') {
      return moment()
        .subtract(scaleInput * 1, 'week')
        .toDate();
    }
    if (period === 'M15') {
      return moment()
        .subtract(scaleInput * 3, 'days')
        .toDate();
    }
    if (period === 'M5') {
      return moment()
        .subtract(scaleInput * 24, 'hours')
        .toDate();
    }
    if (period === 'M3') {
      return moment()
        .subtract(scaleInput * 12, 'hours')
        .toDate();
    }
    if (period === 'M1') {
      return moment()
        .subtract(scaleInput * 4, 'hours')
        .toDate();
    }
    return moment()
      .subtract(scaleInput, 'hours')
      .toDate();
  };

  const bars = await Mongo.collection('bars').find({
    providerType,
    symbol,
    period,
    startAt: {
      $gte: getFrom(scale),
      ...(scale > 1 && {
        $lte: getFrom(scale - 1),
      }),
    },
  }, {
    projection: {
      providerData: 0,
    },
  }).toArray();

  return { result: bars };
};

export default barGetMany;
