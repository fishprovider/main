import { ErrorType } from '@fishprovider/utils/constants/error';
import type { Stat } from '@fishprovider/utils/types/Stat.model';
import type { User } from '@fishprovider/utils/types/User.model';

const statGet = async ({ data, userInfo }: {
  data: {
    statId: string,
  }
  userInfo: User,
}) => {
  const { statId } = data;
  if (!statId) {
    return { error: ErrorType.badRequest };
  }

  const { uid } = userInfo;
  if (!uid) {
    return { error: ErrorType.accessDenied };
  }

  const doc = await Mongo.collection<Stat>('stats').findOne({
    _id: statId,
  });

  return { result: doc };
};

export default statGet;
