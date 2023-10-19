import { Account } from '@fishprovider/core';
import { AccountRepository } from '@fishprovider/repositories';

import { fishApiGet } from '..';

const getAccount: AccountRepository['getAccount'] = async (filter) => {
  const doc = await fishApiGet<Partial<Account> | undefined>('/account/getAccount', filter);
  return { doc };
};

const getAccounts: AccountRepository['getAccounts'] = async (filter) => {
  const docs = await fishApiGet<Partial<Account>[] | undefined>('/account/getAccounts', filter);
  return { docs };
};

export const FishApiAccountRepository: AccountRepository = {
  getAccount,
  getAccounts,
};
