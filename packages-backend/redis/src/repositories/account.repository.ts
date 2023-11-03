import { AccountRepository } from '@fishprovider/core-backend';
import _ from 'lodash';

import { buildKeyAccount, buildKeyAccounts, getRedis } from '..';

const getAccount: AccountRepository['getAccount'] = async (filterRaw) => {
  const filter = _.pick(filterRaw, ['accountId', 'tradeAccountId']);
  if (_.isEmpty(filter)) return {};

  const key = buildKeyAccount(filter);
  const { client } = await getRedis();
  const str = await client.get(key);
  if (!str) return {};

  return { doc: JSON.parse(str) };
};

const getAccounts: AccountRepository['getAccounts'] = async (filterRaw) => {
  const filter = _.pick(filterRaw, ['accountViewType', 'email']);
  if (_.isEmpty(filter)) return {};

  const key = buildKeyAccounts(filter);
  const { client } = await getRedis();
  const str = await client.get(key);
  if (!str) return {};

  return { docs: JSON.parse(str) };
};

const updateAccount: AccountRepository['updateAccount'] = async (filterRaw, payload) => {
  const filter = _.pick(filterRaw, ['accountId']);
  if (_.isEmpty(filter)) return {};

  const key = buildKeyAccount(filter);
  const { client } = await getRedis();
  const { account } = payload;
  await client.set(key, JSON.stringify(account), { EX: 60 * 60 });
  return { doc: account };
};

const updateAccounts: AccountRepository['updateAccounts'] = async (filterRaw, payload) => {
  const filter = _.pick(filterRaw, ['accountViewType', 'email']);
  if (_.isEmpty(filter)) return {};

  const key = buildKeyAccounts(filter);
  const { client } = await getRedis();
  const { accounts } = payload;
  await client.set(key, JSON.stringify(accounts), { EX: 60 * 60 });
  return { docs: accounts };
};

const removeAccount: AccountRepository['removeAccount'] = async (filterRaw) => {
  const filter = _.pick(filterRaw, ['accountId']);
  if (_.isEmpty(filter)) return {};

  const key = buildKeyAccount(filter);
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
