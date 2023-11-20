import { AccountConfig, BaseError, RepositoryError } from '@fishprovider/core';
import { AccountRepository } from '@fishprovider/core-backend';

import { Connection, getAccountInformation, newAccount } from '..';

const checkConfig = (config?: AccountConfig) => {
  if (!config) {
    throw new BaseError(RepositoryError.REPOSITORY_BAD_REQUEST, 'Missing config');
  }

  return config;
};

const getAccount: AccountRepository['getAccount'] = async (payload) => {
  const { accountId, config: rawConfig } = payload;
  const config = checkConfig(rawConfig);

  const doc = await getAccountInformation(
    new Connection(config),
    config.accountId,
  );

  return {
    doc: {
      ...doc,
      _id: accountId,
      accountPlatformType: doc.platform,
      assetId: doc.currency,
      asset: doc.currency,
      providerData: doc,
    },
  };
};

const addAccount: AccountRepository['addAccount'] = async (payload) => {
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
  getAccount,
  addAccount,
};
