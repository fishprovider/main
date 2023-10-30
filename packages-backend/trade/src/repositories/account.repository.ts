import { AccountPlatform } from '@fishprovider/core';
import { AccountRepository } from '@fishprovider/core-backend';
import { CTraderAccountRepository } from '@fishprovider/ctrader-api';
import { MetaApiAccountRepository } from '@fishprovider/meta-api';

const addAccount: AccountRepository['addAccount'] = async (payload) => {
  const { accountPlatform, config } = payload;

  if (accountPlatform === AccountPlatform.metatrader) {
    if (MetaApiAccountRepository.addAccount) {
      return MetaApiAccountRepository.addAccount(payload);
    }
  }

  return {
    doc: {
      _id: config?.accountId || '',
    },
  };
};

export const TradeAccountRepository: AccountRepository = {
  ...CTraderAccountRepository,
  addAccount,
};
