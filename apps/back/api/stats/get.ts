import { ErrorType } from '@fishbot/utils/constants/error';
import type { Stat } from '@fishbot/utils/types/Stat.model';
import type { User } from '@fishbot/utils/types/User.model';

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
