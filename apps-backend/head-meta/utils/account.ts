import { AccountPlatform, AccountTradeType } from '@fishprovider/utils/dist/constants/account';

import type { ClientAccount } from '~types/Client.model';

const env = {
  accountTradeType: process.env.PROVIDER_TRADE_TYPE || AccountTradeType.demo,
};

const getAccountConfigs = async () => {
  const accounts = await Mongo.collection<ClientAccount>('accounts').find(
    {
      accountPlatform: AccountPlatform.metatrader,
      accountTradeType: env.accountTradeType as AccountTradeType,
      isSystem: { $ne: true },
      deleted: { $ne: true },
    },
    {
      projection: {
        config: 1,
        providerType: 1,
        accountPlatform: 1,
      },
      sort: {
        order: -1,
      },
    },
  ).toArray();
  return accounts;
};

const getAccountConfig = async (providerId: string) => {
  const account = await Mongo.collection<ClientAccount>('accounts').findOne({
    _id: providerId,
    accountPlatform: AccountPlatform.metatrader,
    accountTradeType: env.accountTradeType as AccountTradeType,
  }, {
    projection: {
      config: 1,
      providerType: 1,
      accountPlatform: 1,
    },
  });
  return account;
};

export {
  getAccountConfig,
  getAccountConfigs,
};
