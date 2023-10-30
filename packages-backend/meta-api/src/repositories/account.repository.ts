import { AccountConfig, BaseError, RepositoryError } from '@fishprovider/core';
import { AccountRepository } from '@fishprovider/core-backend';

import { Connection, newAccount } from '..';

const checkConfig = (config?: AccountConfig) => {
  if (!config) {
    throw new BaseError(RepositoryError.REPOSITORY_BAD_REQUEST, 'Missing config');
  }

  return config;
};

const addAccount: AccountRepository['addAccount'] = async (payload) => {
  const { config: rawConfig } = payload;
  const config = checkConfig(rawConfig);

  const { id } = await newAccount(
    new Connection(config),
    {
      ...config,
      login: config.user,
      password: config.pass,
    },
  );

  return {
    doc: {
      _id: id,
    },
  };
};

export const MetaApiAccountRepository: AccountRepository = {
  addAccount,
};
