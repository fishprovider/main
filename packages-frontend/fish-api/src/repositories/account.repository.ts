import { Account } from '@fishprovider/core';
import { AccountRepository } from '@fishprovider/core-frontend';

import { fishApiGet, fishApiPost } from '..';

const getAccount: AccountRepository['getAccount'] = async (filter, options) => {
  const { getTradeAccount, ...rest } = filter;

  if (getTradeAccount) {
    const account = await fishApiGet<Partial<Account> | undefined>('/account/getTradeAccount', rest, options);
    return { doc: account };
  }

  const account = await fishApiGet<Partial<Account> | undefined>('/account/getAccount', rest, options);
  return { doc: account };
};

const getAccounts: AccountRepository['getAccounts'] = async (filter, options) => {
  const { getTradeAccounts, ...rest } = filter;

  if (getTradeAccounts) {
    const accounts = await fishApiPost<Partial<Account>[] | undefined>('/account/getTradeAccounts', getTradeAccounts, options);
    return { docs: accounts };
  }

  const accounts = await fishApiGet<Partial<Account>[] | undefined>('/account/getAccounts', rest, options);
  return { docs: accounts };
};

const updateAccount: AccountRepository['updateAccount'] = async (filter, payload, options) => {
  // TODO: addMember
  // TODO: removeMemberEmail

  const account = await fishApiPost<Partial<Account> | undefined>('/account/updateAccount', { ...filter, payload }, options);
  return { doc: account };
};

const addAccount: AccountRepository['addAccount'] = async (payload) => {
  const account = await fishApiPost<Partial<Account> | undefined>('/account/addAccount', payload);
  return { doc: account };
};

const removeAccount: AccountRepository['removeAccount'] = async (filter) => {
  await fishApiPost<Partial<Account> | undefined>('/account/removeAccount', filter);
  return {};
};

export const FishApiAccountRepository: AccountRepository = {
  getAccount,
  getAccounts,
  updateAccount,
  addAccount,
  removeAccount,
};
