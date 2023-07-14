import { ErrorType } from '@fishprovider/utils/dist/constants/error';
import type { Account } from '@fishprovider/utils/dist/types/Account.model';
import type { User } from '@fishprovider/utils/dist/types/User.model';

const userGetInfo = async ({ userInfo }: {
  data: {
    reload?: boolean;
  },
  userInfo: User,
}) => {
  const { uid } = userInfo;
  if (!uid) {
    return { error: ErrorType.accessDenied };
  }

  const user = await Mongo.collection<Account>('users').findOne(
    { _id: uid },
    {
      projection: {
        telegram: 1,
        updatedAt: 1,
      },
    },
  );
  if (!user) {
    return { error: ErrorType.userNotFound };
  }

  return { result: user };
};

export default userGetInfo;
