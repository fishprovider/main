import { Account } from '@fishprovider/core';
import { AccountRepository } from '@fishprovider/core-frontend';

import {
  buildKeyAccount, buildKeyAccounts, localGet, localRemove, localSet,
} from '..';

const getAccount: AccountRepository['getAccount'] = async (filter) => {
  const key = buildKeyAccount(filter);
  const account = await localGet<Account>(key);
  return { doc: account };
};

const getAccounts: AccountRepository['getAccounts'] = async (filter) => {
  const key = buildKeyAccounts(filter);
  const accounts = await localGet<Account[]>(key);
  if (!accounts?.length) return {};

  return { docs: accounts };
};

const updateAccount: AccountRepository['updateAccount'] = async (filter, payload) => {
  const key = buildKeyAccount(filter);
  await localSet(key, payload.account);
  return { doc: payload.account };
};

const updateAccounts: AccountRepository['updateAccounts'] = async (filter, payload) => {
  const key = buildKeyAccounts(filter);
  await localSet(key, payload.accounts);
  return { docs: payload.accounts };
};

const removeAccount: AccountRepository['removeAccount'] = async (filter) => {
  const key = buildKeyAccount(filter);
  await localRemove(key);
  return {};
};

export const LocalAccountRepository: AccountRepository = {
  getAccount,
  updateAccount,
  getAccounts,
  updateAccounts,
  removeAccount,
};
