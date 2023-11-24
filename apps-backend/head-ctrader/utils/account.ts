import { AccountPlatform, AccountTradeType } from '@fishprovider/utils/dist/constants/account';

import type { ClientAccount } from '~types/Client.model';

const env = {
  tradeType: process.env.PROVIDER_TRADE_TYPE || AccountTradeType.demo,
};

const getAccountConfigs = async () => {
  const accounts = await Mongo.collection<ClientAccount>('accounts').find(
    {
      platform: AccountPlatform.ctrader,
      tradeType: env.tradeType as AccountTradeType,
      isSystem: { $ne: true },
      deleted: { $ne: true },
    },
    {
      projection: {
        config: 1,
        providerType: 1,
        platform: 1,
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
    platform: AccountPlatform.ctrader,
    tradeType: env.tradeType as AccountTradeType,
  }, {
    projection: {
      config: 1,
      providerType: 1,
      platform: 1,
    },
  });
  return account;
};

export {
  getAccountConfig,
  getAccountConfigs,
};
