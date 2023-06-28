import { ErrorType } from '@fishbot/utils/constants/error';
import { getRoleProvider } from '@fishbot/utils/helpers/user';
import type { Account } from '@fishbot/utils/types/Account.model';
import type { User } from '@fishbot/utils/types/User.model';
import _ from 'lodash';
import { ReturnDocument } from 'mongodb';

const memberRemove = async ({ data, userInfo }: {
  data: {
    providerId: string,
    email: string;
  }
  userInfo: User,
}) => {
  const { providerId, email } = data;
  if (!providerId || !email) {
    return { error: ErrorType.badRequest };
  }
  const { isAdminProvider } = getRoleProvider(userInfo.roles, providerId);
  if (!isAdminProvider) {
    return { error: ErrorType.accessDenied };
  }

  await Mongo.collection<User>('users').updateOne(
    { email },
    {
      $unset: {
        [`roles.adminProviders.${providerId}`]: '',
        [`roles.traderProviders.${providerId}`]: '',
        [`roles.protectorProviders.${providerId}`]: '',
        [`roles.viewerProviders.${providerId}`]: '',
      },
    },
  );

  const { value: account } = await Mongo.collection<Account>('accounts').findOneAndUpdate(
    {
      _id: providerId,
    },
    {
      $pull: {
        members: {
          email,
        },
        memberInvites: {
          email,
        },
      },
    },
    {
      projection: {
        members: 1,
        memberInvites: 1,
      },
      returnDocument: ReturnDocument.AFTER,
    },
  );

  return {
    result: {
      _id: providerId,
      ...(account && {
        members: account.members,
        memberInvites: account.memberInvites,
      }),
    },
  };
};

export default memberRemove;
