import { Account } from '@fishprovider/core';
import { AccountRepository } from '@fishprovider/core-frontend';
import _ from 'lodash';

import {
  buildKeyAccount, buildKeyAccounts, localGet, localSet,
} from '..';

const getAccount: AccountRepository['getAccount'] = async (filter) => {
  const keyFields = ['accountId', 'getTradeInfo'];
  if (!_.has(filter, keyFields)) return {};

  const key = buildKeyAccount(_.pick(filter, keyFields));
  const account = await localGet<Account>(key);
  return { doc: account };
};

const getAccounts: AccountRepository['getAccounts'] = async (filter) => {
  const keyFields = ['accountViewType', 'email'];
  if (!_.has(filter, keyFields)) return {};

  const key = buildKeyAccounts(_.pick(filter, keyFields));
  const accounts = await localGet<Account[]>(key);
  return { docs: accounts };
};

const updateAccount: AccountRepository['updateAccount'] = async (filter) => {
  const keyFields = ['accountId'];
  if (!_.has(filter, keyFields)) return {};

  const key = buildKeyAccount(_.pick(filter, keyFields));
  await localSet(key, undefined);
  return {};
};

const updateAccounts: AccountRepository['updateAccounts'] = async (filter) => {
  const keyFields = ['accountViewType', 'email'];
  if (!_.has(filter, keyFields)) return {};

  const key = buildKeyAccounts(_.pick(filter, keyFields));
  await localSet(key, undefined);
  return {};
};

const removeAccount: AccountRepository['removeAccount'] = async (filter) => {
  const keyFields = ['accountId'];
  if (!_.has(filter, keyFields)) return {};

  const key = buildKeyAccount(_.pick(filter, keyFields));
  await localSet(key, undefined);
  return {};
};

export const LocalAccountRepository: AccountRepository = {
  getAccount,
  updateAccount,
  getAccounts,
  updateAccounts,
  removeAccount,
};
