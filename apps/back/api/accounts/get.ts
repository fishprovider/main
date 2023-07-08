import fetchAccountInfo from '@fishprovider/swap/commands/fetchAccountInfo';
import { getProvider } from '@fishprovider/swap/utils/account';
import { ProviderViewType } from '@fishprovider/utils/constants/account';
import { ErrorType } from '@fishprovider/utils/constants/error';
import { Roles } from '@fishprovider/utils/constants/user';
import { getRoleProvider } from '@fishprovider/utils/helpers/user';
import type { Account, Member } from '@fishprovider/utils/types/Account.model';
import type { User } from '@fishprovider/utils/types/User.model';
import { ReturnDocument } from 'mongodb';

const accountGet = async ({ data, userInfo }: {
  data: {
    providerId: string,
    reload?: boolean,
  }
  userInfo: User,
}) => {
  const { providerId, reload } = data;
  if (!providerId) {
    return { error: ErrorType.badRequest };
  }

  let account = await getProvider(providerId);
  if (!account) {
    return { error: ErrorType.accountNotFound };
  }
  const {
    config, providerType, providerPlatform, providerViewType,
    userId, members, memberInvites, deleted,
  } = account;

  const { isManagerWeb } = getRoleProvider(userInfo.roles);

  const checkAccess = () => {
    if (isManagerWeb) return true;
    if (deleted) return false;
    if (providerViewType === ProviderViewType.public) return true;
    if (userInfo.uid) {
      if (userId === userInfo.uid) return true;
      if (members?.some((item) => item.userId === userInfo.uid)) return true;
      if (memberInvites?.some((item) => item.email === userInfo.email)) return true;
    }
    return false;
  };
  if (!checkAccess()) {
    return { error: ErrorType.accessDenied };
  }

  const memberInvite = memberInvites?.find(({ email }) => email === userInfo.email);
  if (memberInvite) {
    const { email, role } = memberInvite;
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
        roles: 1,
      },
      returnDocument: ReturnDocument.AFTER,
    });

    // eslint-disable-next-line no-param-reassign
    userInfo.roles = user?.roles;

    const member: Member = {
      ...memberInvite,
      userId: userInfo._id,
      name: userInfo.name,
      picture: userInfo.picture,
      updatedAt: new Date(),
    };

    const { value: accountUpdated } = await Mongo.collection<Account>('accounts').findOneAndUpdate(
      {
        _id: providerId,
      },
      {
        $pull: {
          memberInvites: {
            email,
          },
        },
        $push: {
          members: member,
        },
      },
      {
        returnDocument: ReturnDocument.AFTER,
        projection: {
          members: 1,
          memberInvites: 1,
        },
      },
    );

    account = {
      ...account,
      ...accountUpdated,
    };
  }

  let newInfo;

  if (reload) {
    const { isViewerProvider } = getRoleProvider(userInfo.roles, providerId);
    if (isViewerProvider) {
      newInfo = await fetchAccountInfo({
        providerId,
        providerType,
        providerPlatform,
        options: { config },
      });
    }
  }

  const result: Account & { config?: any } = {
    ...account,
    ...newInfo,
  };
  delete result.config;

  return { result };
};

export default accountGet;
