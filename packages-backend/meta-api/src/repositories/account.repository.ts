import {
  AccountConfig, BaseError, RepositoryError,
} from '@fishprovider/core';
import { AccountRepository } from '@fishprovider/core-backend';

import { Connection, getAccountInformation, newAccount } from '..';

const checkConfig = (config?: AccountConfig) => {
  if (!config) {
    throw new BaseError(RepositoryError.REPOSITORY_BAD_REQUEST, 'Missing config');
  }

  return config;
};

const getAccountProvider: AccountRepository['getAccountProvider'] = async (payload) => {
  const { accountId, config: rawConfig } = payload;
  const config = checkConfig(rawConfig);

  const tradeAccount = await getAccountInformation(
    new Connection(config),
    config.accountId,
  );

  return {
    doc: {
      _id: accountId,
      assetId: tradeAccount.currency,
      asset: tradeAccount.currency,
      brokerType: tradeAccount.platform,
      leverage: tradeAccount.leverage,
      balance: tradeAccount.balance,
      equity: tradeAccount.equity,
      margin: tradeAccount.margin,
      freeMargin: tradeAccount.freeMargin,
      marginLevel: tradeAccount.marginLevel,
      providerData: tradeAccount,
    },
  };
};

const addAccountProvider: AccountRepository['addAccountProvider'] = async (payload) => {
  const { accountId, config: rawConfig } = payload;
  const config = checkConfig(rawConfig);

  const { id: tradeAccountId } = await newAccount(
    new Connection(config),
    {
      ...config,
      login: config.user,
      password: config.pass,
    },
  );

  return {
    doc: {
      _id: accountId,
      config: {
        ...config,
        accountId: tradeAccountId,
      },
    },
  };
};

export const MetaApiAccountRepository: AccountRepository = {
  getAccountProvider,
  addAccountProvider,
};
