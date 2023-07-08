import removeAccount from '@fishprovider/swap/libs/metatrader/removeAccount';
import { ProviderPlatform } from '@fishprovider/utils/constants/account';
import { ErrorType } from '@fishprovider/utils/constants/error';
import { getRoleProvider } from '@fishprovider/utils/helpers/user';
import type { Account } from '@fishprovider/utils/types/Account.model';
import type { User } from '@fishprovider/utils/types/User.model';

const env = {
  typePre: process.env.TYPE_PRE,
};

const accountRemove = async ({ data, userInfo }: {
  data: {
    providerId: string,
  }
  userInfo: User,
}) => {
  const { providerId } = data;
  if (!providerId) {
    return { error: ErrorType.badRequest };
  }

  const { isAdminProvider } = getRoleProvider(userInfo.roles, providerId);
  if (!isAdminProvider) {
    return { error: ErrorType.accessDenied };
  }

  const account = await Mongo.collection<Account>('accounts').findOne(
    {
      _id: providerId,
    },
    {
      projection: {
        providerType: 1,
        providerPlatform: 1,
        providerTradeType: 1,
        config: 1,
      },
    },
  );
  if (!account) {
    return { error: ErrorType.accountNotFound };
  }

  const {
    providerType, providerPlatform, providerTradeType, config,
  } = account;

  switch (providerPlatform) {
    case ProviderPlatform.metatrader: {
      await removeAccount({
        providerId,
        config,
      });
      break;
    }
    default:
  }

  await Mongo.collection<Account>('accounts').updateOne(
    {
      _id: providerId,
    },
    {
      $set: {
        deleted: true,
        deletedAt: new Date(),
      },
    },
  );

  switch (providerPlatform) {
    case ProviderPlatform.ctrader: {
      Agenda.now(`${env.typePre}-${providerTradeType}-head-destroy-provider`, {
        providerId,
      });
      break;
    }
    case ProviderPlatform.metatrader: {
      Agenda.now(`${env.typePre}-${providerTradeType}-head-meta-destroy-provider`, {
        providerId,
      });
      break;
    }
    default:
  }

  await Mongo.collection('users').updateMany(
    {
      $or: [
        {
          [`roles.adminProviders.${providerId}`]: { $exists: true },
        },
        {
          [`roles.traderProviders.${providerId}`]: { $exists: true },
        },
        {
          [`roles.protectorProviders.${providerId}`]: { $exists: true },
        },
        {
          [`roles.viewerProviders.${providerId}`]: { $exists: true },
        },
        {
          [`starProviders.${providerId}`]: { $exists: true },
        },
      ],
    },
    {
      $unset: {
        [`roles.adminProviders.${providerId}`]: '',
        [`roles.traderProviders.${providerId}`]: '',
        [`roles.protectorProviders.${providerId}`]: '',
        [`roles.viewerProviders.${providerId}`]: '',
        [`starProviders.${providerId}`]: '',
      },
      $set: {
        updatedAt: new Date(),
      },
    },
  );

  await Mongo.collection('clientSecrets').updateOne(
    {
      providerType,
      providerPlatform,
      clientId: config.clientId,
    },
    {
      $inc: {
        activeAccounts: -1,
      },
    },
  );

  return {
    result: providerId,
  };
};

export default accountRemove;
