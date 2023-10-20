import { Account } from '@fishprovider/core';
import { AccountRepository } from '@fishprovider/repositories';

import { buildKeyAccounts, localGet, localSet } from '..';

const getAccount: AccountRepository['getAccount'] = async (filter) => {
  const key = filter.accountId;
  const account = await localGet<Account>(key);
  return { doc: account };
};

const updateAccount: AccountRepository['updateAccount'] = async (filter, payload) => {
  const key = filter.accountId;
  const { doc: account } = payload;
  await localSet(key, account);
  return { doc: account };
};

const getAccounts: AccountRepository['getAccounts'] = async (filter) => {
  const key = buildKeyAccounts(filter);
  const accounts = await localGet<Account[]>(key);
  return { docs: accounts };
};

const updateAccounts: AccountRepository['updateAccounts'] = async (filter, payload) => {
  const key = buildKeyAccounts(filter);
  const { accounts } = payload;
  await localSet(key, accounts);
  return { docs: accounts };
};

export const LocalAccountRepository: AccountRepository = {
  getAccount,
  updateAccount,
  getAccounts,
  updateAccounts,
};
