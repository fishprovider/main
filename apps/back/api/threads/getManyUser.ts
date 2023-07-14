import { ErrorType } from '@fishprovider/utils/dist/constants/error';
import type { Thread } from '@fishprovider/utils/dist/types/Thread.model';
import type { User } from '@fishprovider/utils/dist/types/User.model';

const threadGetManyUser = async ({ userInfo }: {
  userInfo: User,
}) => {
  const { uid } = userInfo;
  if (!uid) {
    return { error: ErrorType.accessDenied };
  }

  const threads = await Mongo.collection<Thread>('threads').find(
    {
      $or: [
        { viewType: 'public' },
        { userId: uid },
        { 'members.userId': uid },
      ],
    },
    {
      sort: {
        order: -1,
      },
    },
  ).toArray();

  return { result: threads };
};

export default threadGetManyUser;
