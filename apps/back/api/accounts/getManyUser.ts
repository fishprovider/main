import { ErrorType } from '@fishprovider/utils/dist/constants/error';
import type { AccountPublic } from '@fishprovider/utils/dist/types/Account.model';
import type { User } from '@fishprovider/utils/dist/types/User.model';

const accountGetManyUser = async ({ userInfo }: {
  userInfo: User,
}) => {
  const { uid, email } = userInfo;
  if (!uid) {
    return { error: ErrorType.accessDenied };
  }

  const accounts = await Mongo.collection<AccountPublic>('accounts').find(
    {
      $or: [
        { userId: uid }, // owner
        { 'members.userId': uid }, // member
        { 'memberInvites.email': email }, // memberInvite
      ],
      deleted: { $ne: true },
    },
    {
      projection: {
        config: 0,
      },
      sort: {
        order: -1,
      },
    },
  ).toArray();

  return { result: accounts };
};

export default accountGetManyUser;
