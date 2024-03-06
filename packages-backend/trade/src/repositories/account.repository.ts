import { AccountPlatform } from '@fishprovider/core';
import { AccountRepository } from '@fishprovider/core-backend';
import { CTraderAccountRepository } from '@fishprovider/ctrader-api';
import { MetaApiAccountRepository } from '@fishprovider/meta-api';

const getAccountProvider: AccountRepository['getAccountProvider'] = async (filter) => {
  const { platform } = filter;

  if (platform === AccountPlatform.ctrader) {
    if (CTraderAccountRepository.getAccountProvider) {
      return CTraderAccountRepository.getAccountProvider(filter);
    }
  }

  if (platform === AccountPlatform.metatrader) {
    if (MetaApiAccountRepository.getAccountProvider) {
      return MetaApiAccountRepository.getAccountProvider(filter);
    }
  }

  return {};
};

const getAccountProviders: AccountRepository['getAccountProviders'] = async (filter) => {
  const { platform } = filter;

  if (platform === AccountPlatform.ctrader) {
    if (CTraderAccountRepository.getAccountProviders) {
      return CTraderAccountRepository.getAccountProviders(filter);
    }
  }

  return {};
};

const addAccountProvider: AccountRepository['addAccountProvider'] = async (payload) => {
  const { platform } = payload;

  if (platform === AccountPlatform.metatrader) {
    if (MetaApiAccountRepository.addAccountProvider) {
      return MetaApiAccountRepository.addAccountProvider(payload);
    }
  }

  return {};
};

// TODO: implement removeAccount

export const TradeAccountRepository: AccountRepository = {
  getAccountProvider,
  getAccountProviders,
  addAccountProvider,
};
