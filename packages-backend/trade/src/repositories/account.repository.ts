import { AccountPlatform } from '@fishprovider/core';
import { CTraderAccountRepository } from '@fishprovider/ctrader-api';
import { MetaApiAccountRepository } from '@fishprovider/meta-api';
import { AccountRepository } from '@fishprovider/repositories';

const addTradeAccount: AccountRepository['addTradeAccount'] = async (payload) => {
  const { accountPlatform, config } = payload;

  if (accountPlatform === AccountPlatform.metatrader) {
    if (MetaApiAccountRepository.addTradeAccount) {
      return MetaApiAccountRepository.addTradeAccount(payload);
    }
  }

  return { doc: config };
};

export const TradeAccountRepository: AccountRepository = {
  ...CTraderAccountRepository,
  addTradeAccount,
};
