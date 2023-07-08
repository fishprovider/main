import { ProviderPlatform, ProviderTradeType } from '@fishprovider/utils/constants/account';

import type { ClientAccount } from '~types/Client.model';

const env = {
  providerTradeType: process.env.PROVIDER_TRADE_TYPE || ProviderTradeType.demo,
};

const getAccountConfigs = async () => {
  const accounts = await Mongo.collection<ClientAccount>('accounts').find(
    {
      providerPlatform: ProviderPlatform.ctrader,
      providerTradeType: env.providerTradeType as ProviderTradeType,
      isSystem: { $ne: true },
      deleted: { $ne: true },
    },
    {
      projection: {
        config: 1,
        providerType: 1,
        providerPlatform: 1,
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
    providerPlatform: ProviderPlatform.ctrader,
    providerTradeType: env.providerTradeType as ProviderTradeType,
  }, {
    projection: {
      config: 1,
      providerType: 1,
      providerPlatform: 1,
    },
  });
  return account;
};

export {
  getAccountConfig,
  getAccountConfigs,
};
