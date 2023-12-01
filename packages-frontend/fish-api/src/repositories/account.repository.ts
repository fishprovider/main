import { Account } from '@fishprovider/core';
import { AccountRepository } from '@fishprovider/core-frontend';

import { fishApiGet, fishApiPost } from '..';

const getAccount: AccountRepository['getAccount'] = async (filter, options) => {
  const { getTradeAccount, ...rest } = filter;

  if (getTradeAccount) {
    const account = await fishApiGet<Partial<Account> | undefined>('/account/getTradeAccount', { filter: rest, options });
    return { doc: account };
  }

  const account = await fishApiGet<Partial<Account> | undefined>('/account/getAccount', { filter: rest, options });
  return { doc: account };
};

const getAccounts: AccountRepository['getAccounts'] = async (filter, options) => {
  const { getTradeAccounts, ...rest } = filter;

  if (getTradeAccounts) {
    const accounts = await fishApiPost<Partial<Account>[] | undefined>('/account/getTradeAccounts', { filter: getTradeAccounts, options });
    return { docs: accounts };
  }

  const accounts = await fishApiGet<Partial<Account>[] | undefined>('/account/getAccounts', { filter: rest, options });
  return { docs: accounts };
};

const updateAccount: AccountRepository['updateAccount'] = async (filter, payload, options) => {
  // TODO: addMember
  // TODO: removeMemberEmail

  const account = await fishApiPost<Partial<Account> | undefined>('/account/updateAccount', { filter, payload, options });
  return { doc: account };
};

const addAccount: AccountRepository['addAccount'] = async (payload, options) => {
  const account = await fishApiPost<Partial<Account> | undefined>('/account/addAccount', { payload, options });
  return { doc: account };
};

const removeAccount: AccountRepository['removeAccount'] = async (filter, options) => {
  await fishApiPost<Partial<Account> | undefined>('/account/removeAccount', { filter, options });
  return {};
};

export const FishApiAccountRepository: AccountRepository = {
  getAccount,
  getAccounts,
  updateAccount,
  addAccount,
  removeAccount,
};
