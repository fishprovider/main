import { Account, AccountViewType } from '@fishprovider/core';
import { AccountRepository } from '@fishprovider/repositories';

import { fishApiGet } from '..';

const getAccount = async (filter: {
  accountId: string,
  getTradeInfo?: boolean,
}) => {
  const doc = await fishApiGet<Partial<Account> | undefined>('/account/getAccount', filter);
  return { doc };
};

const getAccounts = async (filter: {
  accountViewType?: AccountViewType,
}) => {
  const docs = await fishApiGet<Partial<Account>[] | undefined>('/account/getAccounts', filter);
  return { docs };
};

export const FishApiAccountRepository: AccountRepository = {
  getAccount,
  getAccounts,
};
