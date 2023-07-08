import { ErrorType } from '@fishprovider/utils/constants/error';
import type { Account } from '@fishprovider/utils/types/Account.model';
import type { User } from '@fishprovider/utils/types/User.model';

const userUpdate = async ({ data, userInfo }: {
  data: {
    starProviders?: Record<string, boolean>,
  },
  userInfo: User,
}) => {
  const { uid } = userInfo;
  if (!uid) {
    return { error: ErrorType.accessDenied };
  }

  const userDoc = await Mongo.collection<Account>('users').findOne(
    { _id: uid },
    {
      projection: {
        updatedAt: 1,
      },
    },
  );
  if (!userDoc) {
    return { error: ErrorType.userNotFound };
  }

  const { starProviders } = data;

  const userToUpdate = {
    ...(starProviders && { starProviders }),
    updatedAt: new Date(),
  };

  await Mongo.collection<User>('users').updateOne(
    { _id: uid },
    {
      $set: userToUpdate,
    },
  );

  return {
    result: {
      _id: uid,
      ...userToUpdate,
    },
  };
};

export default userUpdate;
