import { AccountRepository } from '@fishprovider/core-backend';
import _ from 'lodash';

import { buildKeyAccount, buildKeyAccounts, getRedis } from '..';

const getAccount: AccountRepository['getAccount'] = async (filter) => {
  const keyFields = ['accountId', 'tradeAccountId'];
  if (!_.has(filter, keyFields)) return {};

  const key = buildKeyAccount(_.pick(filter, keyFields));
  const { client } = await getRedis();
  const str = await client.get(key);
  const doc = str ? JSON.parse(str) : undefined;
  return { doc };
};

const getAccounts: AccountRepository['getAccounts'] = async (filter) => {
  const keyFields = ['accountViewType', 'email'];
  if (!_.has(filter, keyFields)) return {};

  const key = buildKeyAccounts(_.pick(filter, keyFields));
  const { client } = await getRedis();
  const str = await client.get(key);
  const docs = str ? JSON.parse(str) : undefined;
  return { docs };
};

const updateAccount: AccountRepository['updateAccount'] = async (filter) => {
  const keyFields = ['accountId'];
  if (!_.has(filter, keyFields)) return {};

  const key = buildKeyAccount(_.pick(filter, keyFields));
  const { client } = await getRedis();
  await client.del(key);
  return {};
};

const updateAccounts: AccountRepository['updateAccounts'] = async (filter) => {
  const keyFields = ['accountViewType', 'email'];
  if (!_.has(filter, keyFields)) return {};

  const key = buildKeyAccounts(_.pick(filter, keyFields));
  const { client } = await getRedis();
  await client.del(key);
  return {};
};

const removeAccount: AccountRepository['removeAccount'] = async (filter) => {
  const keyFields = ['accountId'];
  if (!_.has(filter, keyFields)) return {};

  const key = buildKeyAccount(_.pick(filter, keyFields));
  const { client } = await getRedis();
  await client.del(key);
  return {};
};

export const RedisAccountRepository: AccountRepository = {
  getAccount,
  getAccounts,
  updateAccount,
  updateAccounts,
  removeAccount,
};
