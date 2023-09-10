import { ErrorType } from '@fishprovider/utils/dist/constants/error';
import { Roles } from '@fishprovider/utils/dist/constants/user';
import { getRoleProvider } from '@fishprovider/utils/dist/helpers/user';
import type { Account, Member } from '@fishprovider/utils/dist/types/Account.model';
import type { User } from '@fishprovider/utils/dist/types/User.model';

const updateUser = async (providerId: string, member: Member) => {
  const { userId, role } = member;

  await Mongo.collection<User>('users').updateOne(
    { _id: userId },
    {
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
    },
  );
};

const memberFetch = async ({ data, userInfo }: {
  data: {
    providerId: string,
  }
  userInfo: User,
}) => {
  const { providerId } = data;
  if (!providerId) {
    return { error: ErrorType.badRequest };
  }

  const { isViewerProvider } = getRoleProvider(userInfo.roles, providerId);
  if (!isViewerProvider) {
    return { error: ErrorType.accessDenied };
  }

  const account = await Mongo.collection<Account>('accounts').findOne({
    _id: providerId,
  }, {
    projection: {
      members: 1,
    },
  });
  if (!account) {
    return { error: ErrorType.accountNotFound };
  }

  if (!account.members) {
    return {
      result: {
        _id: providerId,
        members: [],
      },
    };
  }

  for (const member of account.members) {
    await updateUser(providerId, member);
  }

  const users = await Mongo.collection<User>('users').find({
    _id: { $in: account.members.map((item) => item.userId) },
  }, {
    projection: {
      _id: 1,
      email: 1,
      name: 1,
      picture: 1,
    },
  }).toArray();

  const updateData = {
    members: Object.values(account.members.reduce((acc, member) => {
      const user = users.find((item) => item._id === member.userId);
      return {
        ...acc,
        [member.userId]: {
          ...member,
          email: user?.email || member.email,
          name: user?.name || member.name,
          picture: user?.picture || member.picture,
        },
      };
    }, {} as Record<string, Member>)),
    updatedAt: new Date(),
  };

  await Mongo.collection<Account>('accounts').updateOne(
    {
      _id: providerId,
    },
    {
      $set: updateData,
    },
  );

  return {
    result: {
      _id: providerId,
      ...updateData,
    },
  };
};

export default memberFetch;
