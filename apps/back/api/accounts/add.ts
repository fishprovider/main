import newAccount from '@fishbot/swap/libs/metatrader/newAccount';
import {
  ProviderPlatform, ProviderViewType, SourceType,
} from '@fishbot/utils/constants/account';
import { ErrorType } from '@fishbot/utils/constants/error';
import { Roles } from '@fishbot/utils/constants/user';
import { getRoleProvider } from '@fishbot/utils/helpers/user';
import type { Account } from '@fishbot/utils/types/Account.model';
import type { User } from '@fishbot/utils/types/User.model';
import _ from 'lodash';
import md5 from 'md5';

import isDemo from '~utils/isDemo';

const env = {
  typePre: process.env.TYPE_PRE,
};

const accountAdd = async ({ data, userInfo }: {
  data: {
    accountToNew: Partial<Account>,
  }
  userInfo: User,
}) => {
  const { uid, roles } = userInfo;
  if (!uid) {
    return { error: ErrorType.accessDenied };
  }

  // TODO: allow user to create account when FishPay is done
  const { isManagerWeb } = getRoleProvider(roles);
  if (!isDemo && !isManagerWeb) {
    return { error: ErrorType.accessDenied };
  }

  const {
    name,
    providerType,
    providerPlatform,
    providerTradeType,
    config: baseConfig,
  } = data.accountToNew;
  if (!name || !providerType || !providerPlatform || !baseConfig) {
    return { error: ErrorType.badRequest };
  }

  if (!/^[a-zA-Z0-9][a-zA-Z0-9-_ ]*[a-zA-Z0-9]$/i.test(name)) {
    return { error: 'Invalid character' };
  }

  const providerId = _.replace(name, /\s+/g, '_').toLowerCase();

  const accountCheck = await Mongo.collection<Account>('accounts').findOne(
    {
      $or: [
        { _id: providerId },
        {
          name,
          deleted: { $ne: true },
        },
        ...(providerPlatform === ProviderPlatform.ctrader ? [
          {
            'config.accountId': baseConfig.accountId,
            deleted: { $ne: true },
          },
        ] : []),
      ],
    },
    {
      projection: {
        _id: 1,
      },
    },
  );
  if (accountCheck) {
    return { error: 'Name or Account existed. Please try another one!' };
  }

  const accountToNew = {
    _id: providerId,
    name,
    providerType,
    providerPlatform,
    providerViewType: ProviderViewType.private,
    providerTradeType,
    sourceType: SourceType.user,
    members: [
      {
        userId: userInfo.uid,
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture,
        role: Roles.admin,
        updatedAt: new Date(),
        createdAt: new Date(),
      },
    ],
    userId: userInfo.uid,
    userEmail: userInfo.email,
    userName: userInfo.name,
    userPicture: userInfo.picture,
    updatedAt: new Date(),
    createdAt: new Date(),
  };

  const config = {
    ...baseConfig,
  };

  if (providerPlatform === ProviderPlatform.metatrader) {
    // TODO: remove hard code
    config.clientId = 'marco.dinh91@gmail.com';
  }

  const client = await Mongo.collection<{ clientSecret: string }>('clientSecrets').findOne({
    providerType,
    providerPlatform,
    clientId: config.clientId,
  }, {
    projection: {
      clientSecret: 1,
    },
  });
  if (!client) {
    return { error: ErrorType.accountNotFound };
  }
  config.clientSecret = client.clientSecret;

  if (providerPlatform === ProviderPlatform.metatrader) {
    const { accountId } = await newAccount({
      providerId,
      options: {
        name,
        login: config.user,
        password: config.pass,
        platform: config.platform,
        server: config.server,
      },
      config,
    });
    if (!accountId) {
      return { error: ErrorType.badRequest };
    }
    config.accountId = accountId;
  }

  await Mongo.collection<Account>('accounts').insertOne({
    ...accountToNew,
    config: {
      ...config,
      ...(config.pass && {
        pass: md5(config.pass),
      }),
    },
  });

  if (providerPlatform === ProviderPlatform.ctrader) {
    Agenda.now(`${env.typePre}-${providerTradeType}-head-start-provider`, {
      providerId,
    });
  } else if (providerPlatform === ProviderPlatform.metatrader) {
    Agenda.now(`${env.typePre}-${providerTradeType}-head-meta-start-provider`, {
      providerId,
    });
  }

  await Mongo.collection<User>('users').updateOne(
    {
      _id: userInfo.uid,
    },
    {
      $set: {
        [`roles.adminProviders.${providerId}`]: true,
        updatedAt: new Date(),
      },
    },
  );

  return { result: accountToNew };
};

export default accountAdd;
