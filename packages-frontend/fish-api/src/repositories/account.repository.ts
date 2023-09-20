import { Account } from '@fishprovider/core';
import { AccountRepository } from '@fishprovider/repositories';

import { fishApiGet } from '..';

const getAccount = async (filter: {
  accountId: string,
}) => {
  const account = await fishApiGet<Partial<Account> | undefined>('/account/getAccount', filter);
  return { doc: account };
};

export const FishApiAccountRepository: AccountRepository = {
  getAccount,
};
