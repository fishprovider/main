import { AccountRepository } from '@fishprovider/core-frontend';
import _ from 'lodash';

import { storeAccounts } from '..';

const getAccount: AccountRepository['getAccount'] = async (filter) => {
  const keyFields = ['accountId'];
  if (!_.has(filter, keyFields)) return {};

  const account = storeAccounts.getState()[filter.accountId as string];
  return { doc: account };
};

const getAccounts: AccountRepository['getAccounts'] = async (filter) => {
  const keyFields = ['accountViewType', 'email'];
  if (!_.has(filter, keyFields)) return {};

  const accounts = _.filter(storeAccounts.getState(), _.pick(filter, keyFields));
  return { docs: accounts };
};

const updateAccount: AccountRepository['updateAccount'] = async (_filter, payload) => {
  const { account } = payload;
  if (account) {
    storeAccounts.mergeDoc(account);
  }
  return { doc: account };
};

const updateAccounts: AccountRepository['updateAccounts'] = async (_filter, payload) => {
  const { accounts } = payload;
  if (accounts) {
    storeAccounts.mergeDocs(accounts);
  }
  return { docs: accounts };
};

const removeAccount: AccountRepository['removeAccount'] = async (filter) => {
  const keyFields = ['accountId'];
  if (!_.has(filter, keyFields)) return {};

  storeAccounts.removeDoc(filter.accountId);
  return {};
};

export const StoreAccountRepository: AccountRepository = {
  getAccount,
  updateAccount,
  getAccounts,
  updateAccounts,
  removeAccount,
};
