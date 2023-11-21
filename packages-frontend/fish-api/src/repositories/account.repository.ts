import { Account } from '@fishprovider/core';
import { AccountRepository } from '@fishprovider/core-frontend';

import { fishApiGet, fishApiPost } from '..';

const getAccount: AccountRepository['getAccount'] = async (filter) => {
  const { getTradeInfo, ...rest } = filter;

  if (getTradeInfo) {
    const account = await fishApiGet<Partial<Account> | undefined>('/account/getTradeAccount', rest);
    return { doc: account };
  }

  const account = await fishApiGet<Partial<Account> | undefined>('/account/getAccount', rest);
  return { doc: account };
};

const getAccounts: AccountRepository['getAccounts'] = async (filter) => {
  const { getTradeAccounts, ...rest } = filter;

  if (getTradeAccounts) {
    const accounts = await fishApiPost<Partial<Account>[] | undefined>('/account/getTradeAccounts', getTradeAccounts);
    return { docs: accounts };
  }

  const accounts = await fishApiGet<Partial<Account>[] | undefined>('/account/getAccounts', rest);
  return { docs: accounts };
};

const updateAccount: AccountRepository['updateAccount'] = async (filter, payload) => {
  const account = await fishApiPost<Partial<Account> | undefined>('/account/updateAccount', { ...filter, payload });
  return { doc: account };
};

const removeAccount: AccountRepository['removeAccount'] = async (filter) => {
  const account = await fishApiPost<Partial<Account> | undefined>('/account/removeAccount', filter);
  return { doc: account };
};

export const FishApiAccountRepository: AccountRepository = {
  getAccount,
  getAccounts,
  updateAccount,
  removeAccount,
};
