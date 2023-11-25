import { AccountRepository } from '@fishprovider/core-frontend';
import _ from 'lodash';

import { storeAccounts } from '..';

const getAccount: AccountRepository['getAccount'] = async (filter) => {
  const { accountId } = filter;
  if (!accountId) return {};

  const account = storeAccounts.getState()[accountId];
  return { doc: account };
};

const getAccounts: AccountRepository['getAccounts'] = async (filter) => {
  const accounts = _.filter(storeAccounts.getState(), filter);
  if (!accounts.length) return {};

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
  storeAccounts.removeDoc(filter.accountId);
  return {};
};

const watchAccount: AccountRepository['watchAccount'] = (selector) => storeAccounts.useStore(selector);

export const StoreAccountRepository: AccountRepository = {
  getAccount,
  getAccounts,
  updateAccount,
  updateAccounts,
  removeAccount,
  watchAccount,
};
