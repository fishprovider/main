import { ErrorType } from '@fishbot/utils/constants/error';
import { Roles } from '@fishbot/utils/constants/user';
import { getRoleProvider } from '@fishbot/utils/helpers/user';
import type { Account, Member, MemberInvite } from '@fishbot/utils/types/Account.model';
import type { User } from '@fishbot/utils/types/User.model';
import _ from 'lodash';
import { ReturnDocument } from 'mongodb';

const memberAdd = async ({ data, userInfo }: {
  data: {
    providerId: string,
    email: string;
    role: Roles,
  },
  userInfo: User,
}) => {
  const {
    providerId, email: emailRaw, role,
  } = data;

  const email = _.trim(emailRaw.toLowerCase());

  if (!providerId || !email || !role) {
    return { error: ErrorType.badRequest };
  }

  const { isAdminProvider } = getRoleProvider(userInfo.roles, providerId);
  if (!isAdminProvider) {
    return { error: ErrorType.accessDenied };
  }

  await Mongo.collection<Account>('accounts').updateOne(
    { _id: providerId },
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
  );

  const { value: user } = await Mongo.collection<User>('users').findOneAndUpdate({
    email,
  }, {
    $unset: {
      ...(role !== Roles.admin && {
        [`roles.adminProviders.${providerId}`]: '',
      }),
      ...(role !== Roles.trader && {
        [`roles.traderProviders.${providerId}`]: '',
      }),
      ...(role !== Roles.protector && {
        [`roles.protectorProviders.${providerId}`]: '',
      }),
      ...(role !== Roles.viewer && {
        [`roles.viewerProviders.${providerId}`]: '',
      }),
    },
    $set: {
      ...(role === Roles.admin && {
        [`roles.adminProviders.${providerId}`]: true,
      }),
      ...(role === Roles.trader && {
        [`roles.traderProviders.${providerId}`]: true,
      }),
      ...(role === Roles.protector && {
        [`roles.protectorProviders.${providerId}`]: true,
      }),
      ...(role === Roles.viewer && {
        [`roles.viewerProviders.${providerId}`]: true,
      }),
    },
  }, {
    projection: {
      _id: 1,
      name: 1,
      picture: 1,
    },
  });

  if (!user) {
    const memberInvite: MemberInvite = {
      email,
      role,
      createdAt: new Date(),
    };

    const { value: account } = await Mongo.collection<Account>('accounts').findOneAndUpdate(
      {
        _id: providerId,
      },
      {
        $push: {
          memberInvites: memberInvite,
        },
      },
      {
        projection: {
          memberInvites: 1,
        },
        returnDocument: ReturnDocument.AFTER,
      },
    );

    return {
      result: {
        _id: providerId,
        ...(account && {
          memberInvites: account.memberInvites,
        }),
      },
    };
  }

  const member: Member = {
    userId: user._id,
    email,
    name: user.name,
    picture: user.picture,
    role,
    updatedAt: new Date(),
    createdAt: new Date(),
  };

  const { value: account } = await Mongo.collection<Account>('accounts').findOneAndUpdate(
    {
      _id: providerId,
    },
    {
      $push: {
        members: member,
      },
    },
    {
      projection: {
        members: 1,
      },
      returnDocument: ReturnDocument.AFTER,
    },
  );

  return {
    result: {
      _id: providerId,
      ...(account && {
        members: account.members,
      }),
    },
  };
};

export default memberAdd;
