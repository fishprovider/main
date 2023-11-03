import { AccountRepository } from '@fishprovider/core-frontend';
import _ from 'lodash';

import { storeAccounts } from '..';

const getAccount: AccountRepository['getAccount'] = async (filterRaw) => {
  const filter = _.pick(filterRaw, ['accountId']);
  if (_.isEmpty(filter)) return {};

  const account = storeAccounts.getState()[filter.accountId as string];
  return { doc: account };
};

const getAccounts: AccountRepository['getAccounts'] = async (filterRaw) => {
  const filter = _.pick(filterRaw, ['accountViewType', 'email']);
  if (_.isEmpty(filter)) return {};

  const accounts = _.filter(storeAccounts.getState(), filter);
  if (_.isEmpty(accounts)) return {};

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

export const StoreAccountRepository: AccountRepository = {
  getAccount,
  getAccounts,
  updateAccount,
  updateAccounts,
  removeAccount,
};
