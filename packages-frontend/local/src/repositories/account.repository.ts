import { Account } from '@fishprovider/core';
import { AccountRepository } from '@fishprovider/core-frontend';
import _ from 'lodash';

import {
  buildKeyAccount, buildKeyAccounts, localGet, localRemove,
} from '..';

const getAccount: AccountRepository['getAccount'] = async (filterRaw) => {
  const filter = _.pick(filterRaw, ['accountId', 'getTradeInfo']);
  if (_.isEmpty(filter)) return {};

  const key = buildKeyAccount(filter);
  const account = await localGet<Account>(key);
  return { doc: account };
};

const getAccounts: AccountRepository['getAccounts'] = async (filterRaw) => {
  const filter = _.pick(filterRaw, ['accountViewType', 'email']);
  if (_.isEmpty(filter)) return {};

  const key = buildKeyAccounts(filter);
  const accounts = await localGet<Account[]>(key);
  return { docs: accounts };
};

const updateAccount: AccountRepository['updateAccount'] = async (filterRaw) => {
  const filter = _.pick(filterRaw, ['accountId']);
  if (_.isEmpty(filter)) return {};

  const key = buildKeyAccount(filter);
  await localRemove(key);
  return {};
};

const updateAccounts: AccountRepository['updateAccounts'] = async (filterRaw) => {
  const filter = _.pick(filterRaw, ['accountViewType', 'email']);
  if (_.isEmpty(filter)) return {};

  const key = buildKeyAccounts(filter);
  await localRemove(key);
  return {};
};

const removeAccount: AccountRepository['removeAccount'] = async (filterRaw) => {
  const filter = _.pick(filterRaw, ['accountId']);
  if (_.isEmpty(filter)) return {};

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
