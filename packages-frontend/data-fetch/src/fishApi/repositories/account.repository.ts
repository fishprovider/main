import { Account } from '@fishprovider/core';
import { AccountRepository, GetAccountFilter } from '@fishprovider/repositories';

import { fishApiGet } from '..';

const getAccount = async (filter: GetAccountFilter) => {
  const account = await fishApiGet<Partial<Account> | undefined>('/account/getAccount', filter);
  return { doc: account };
};

export const FishApiAccountRepository: AccountRepository = {
  getAccount,
};
