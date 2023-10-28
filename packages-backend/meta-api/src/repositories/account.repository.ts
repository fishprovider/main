import { AccountRepository } from '@fishprovider/repositories';

import { Connection, newAccount } from '..';

const addTradeAccount: AccountRepository['addTradeAccount'] = async (payload) => {
  const { config } = payload;

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
      ...config,
      accountId: id,
    },
  };
};

export const MetaApiAccountRepository: AccountRepository = {
  addTradeAccount,
};
