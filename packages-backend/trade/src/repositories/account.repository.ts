import { AccountPlatform } from '@fishprovider/core';
import { AccountRepository } from '@fishprovider/core-backend';
import { CTraderAccountRepository } from '@fishprovider/ctrader-api';
import { MetaApiAccountRepository } from '@fishprovider/meta-api';

const getAccount: AccountRepository['getAccount'] = async (filter) => {
  const { accountPlatform } = filter;

  if (accountPlatform === AccountPlatform.ctrader) {
    if (CTraderAccountRepository.getAccount) {
      return CTraderAccountRepository.getAccount(filter);
    }
  }

  if (accountPlatform === AccountPlatform.metatrader) {
    if (MetaApiAccountRepository.getAccount) {
      return MetaApiAccountRepository.getAccount(filter);
    }
  }

  return {};
};

const getAccounts: AccountRepository['getAccounts'] = async (filter) => {
  const { accountPlatform } = filter;

  if (accountPlatform === AccountPlatform.ctrader) {
    if (CTraderAccountRepository.getAccounts) {
      return CTraderAccountRepository.getAccounts(filter);
    }
  }

  return {};
};

const addAccount: AccountRepository['addAccount'] = async (payload) => {
  const { accountPlatform } = payload;

  if (accountPlatform === AccountPlatform.metatrader) {
    if (MetaApiAccountRepository.addAccount) {
      return MetaApiAccountRepository.addAccount(payload);
    }
  }

  return {};
};

export const TradeAccountRepository: AccountRepository = {
  getAccount,
  getAccounts,
  addAccount,
};
