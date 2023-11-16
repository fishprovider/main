import newAccountMetaTrader from '@fishprovider/swap/dist/libs/metatrader/newAccount';
import { updateCache } from '@fishprovider/swap/dist/utils/account';
import {
  AccountPlatform,
  AccountTradeType,
  AccountViewType,
} from '@fishprovider/utils/dist/constants/account';
import { ErrorType } from '@fishprovider/utils/dist/constants/error';
import { Roles } from '@fishprovider/utils/dist/constants/user';
import { getRoleProvider } from '@fishprovider/utils/dist/helpers/user';
import type { Account } from '@fishprovider/utils/dist/types/Account.model';
import type { User } from '@fishprovider/utils/dist/types/User.model';
import _ from 'lodash';

import isDemo from '~utils/isDemo';

const env = {
  typePre: process.env.TYPE_PRE,
  accountTradeType: process.env.PROVIDER_TRADE_TYPE || AccountTradeType.demo,
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
    accountPlatform,
    config: baseConfig,
  } = data.accountToNew;
  if (!name || !providerType || !accountPlatform || !baseConfig) {
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
        ...(accountPlatform === AccountPlatform.ctrader ? [
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
    accountPlatform,
    accountViewType: AccountViewType.private,
    accountTradeType: env.accountTradeType as AccountTradeType,
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

  switch (accountPlatform) {
    case AccountPlatform.ctrader: {
      const client = await Mongo.collection<{ clientSecret: string }>('clientSecrets').findOne({
        providerType,
        accountPlatform,
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
      break;
    }
    case AccountPlatform.metatrader: {
      const client = await Mongo.collection<{ clientId: string, clientSecret: string }>('clientSecrets').findOne({
        providerType,
        accountPlatform,
        activeAccounts: { $lt: 2 },
      }, {
        projection: {
          clientId: 1,
          clientSecret: 1,
        },
      });
      if (!client) {
        return { error: ErrorType.accountNotFound };
      }
      config.clientId = client.clientId;
      config.clientSecret = client.clientSecret;

      const { accountId } = await newAccountMetaTrader({
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
      break;
    }
    default:
  }

  const newAccount = {
    ...accountToNew,
    config,
  };
  await Mongo.collection<Account>('accounts').insertOne(newAccount);

  await updateCache(newAccount);

  switch (accountPlatform) {
    case AccountPlatform.ctrader: {
      Agenda.now(`${env.typePre}-${env.accountTradeType}-head-start-provider`, {
        providerId,
      });
      break;
    }
    case AccountPlatform.metatrader: {
      Agenda.now(`${env.typePre}-${env.accountTradeType}-head-meta-start-provider`, {
        providerId,
      });
      break;
    }
    default:
  }

  await Mongo.collection<User>('users').updateOne(
    { _id: userInfo.uid },
    {
      $set: {
        [`roles.adminProviders.${providerId}`]: true,
        updatedAt: new Date(),
      },
    },
  );

  await Mongo.collection('clientSecrets').updateOne(
    {
      providerType,
      accountPlatform,
      clientId: config.clientId,
    },
    {
      $inc: {
        activeAccounts: 1,
      },
    },
  );

  return { result: accountToNew };
};

export default accountAdd;
