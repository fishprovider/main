import type { AccountViewType } from '@fishprovider/utils/dist/constants/account';
import { ErrorType } from '@fishprovider/utils/dist/constants/error';
import { getRoleProvider } from '@fishprovider/utils/dist/helpers/user';
import type {
  Account, Activity, BannerStatus,
  ProtectSettings,
  Settings, TradeSettings,
} from '@fishprovider/utils/dist/types/Account.model';
import type { User } from '@fishprovider/utils/dist/types/User.model';
import _ from 'lodash';

const accountUpdate = async ({ data, userInfo }: {
  data: {
    providerId: string,
    accountViewType?: AccountViewType,
    name?: string,
    icon?: string,
    strategyId?: string,
    tradeSettings?: TradeSettings,
    protectSettings?: ProtectSettings,
    settings?: Settings,
    notes?: string,
    privateNotes?: string,
    bannerStatus?: BannerStatus,
    activity?: Activity,
  }
  userInfo: User,
}) => {
  const { uid } = userInfo;
  const {
    providerId, protectSettings, tradeSettings, settings, notes, privateNotes, bannerStatus,
    accountViewType, name, icon, strategyId, activity,
  } = data;
  if (!providerId) {
    return { error: ErrorType.badRequest };
  }

  const {
    isManagerWeb, isAdminProvider, isTraderProvider, isProtectorProvider, isViewerProvider,
  } = getRoleProvider(userInfo.roles, providerId);
  if (!isViewerProvider) {
    return { error: ErrorType.accessDenied };
  }

  if (activity) {
    const accountToUpdate = {
      [`activities.${uid}`]: activity,
    };

    await Mongo.collection<Account>('accounts').updateOne(
      {
        _id: providerId,
      },
      {
        $set: accountToUpdate,
      },
    );

    return {
      result: {
        _id: providerId,
      },
    };
  }

  const account = await Mongo.collection<Account>('accounts').findOne(
    {
      _id: providerId,
    },
    {
      projection: {
        settings: 1,
      },
    },
  );
  if (!account) {
    return { error: ErrorType.accountNotFound };
  }
  const { settings: oldSettings } = account;

  const accountToUpdate: Partial<Account> = {
    ...(isTraderProvider && {
      ...(tradeSettings && { tradeSettings }),
    }),
    ...(isProtectorProvider && {
      ...(protectSettings && { protectSettings }),
    }),
    ...(isAdminProvider && {
      ...(settings && {
        settings: {
          ...settings,
          parents: isManagerWeb
            ? settings.parents // allow add new parent
            : _.omitBy(settings.parents, (_1, key) => !oldSettings?.parents?.[key]),
        },
      }),
    }),
    ...((isTraderProvider || isProtectorProvider) && {
      ...(accountViewType && { accountViewType }),
      ...(name && { name }),
      ...(icon && { icon }),
      ...(strategyId && { strategyId }),
      ...(notes && { notes }),
      ...(privateNotes && { privateNotes }),
      ...(bannerStatus && { bannerStatus }),
    }),
    updatedAt: new Date(),
  };

  await Mongo.collection<Account>('accounts').updateOne(
    {
      _id: providerId,
    },
    {
      $set: accountToUpdate,
    },
  );

  return {
    result: {
      _id: providerId,
      ...accountToUpdate,
    },
  };
};

export default accountUpdate;
