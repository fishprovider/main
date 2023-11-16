import { Account } from '@fishprovider/core';
import { AccountRepository } from '@fishprovider/core-backend';

import {
  buildKeyAccount, buildKeyAccounts, convertUndefinedToNull, getRedis,
} from '..';

const getAccount: AccountRepository['getAccount'] = async (filter) => {
  if (!filter.accountId) return {};

  const key = buildKeyAccount(filter);
  const { clientJson } = await getRedis();
  const doc = await clientJson.get(key);
  if (!doc) return {};

  return { doc: doc as Partial<Account> };
};

const getAccounts: AccountRepository['getAccounts'] = async (filter) => {
  if (!(filter.accountViewType || filter.email)) return {};

  const key = buildKeyAccounts(filter);
  const { clientJson } = await getRedis();
  const docs = await clientJson.get(key);
  if (!docs) return {};

  return { docs: docs as Partial<Account>[] };
};

const updateAccount: AccountRepository['updateAccount'] = async (filter, payload) => {
  const key = buildKeyAccount(filter);
  const { client, clientJson } = await getRedis();
  const { account, ...rest } = payload;
  await clientJson.merge(key, '.', convertUndefinedToNull({ ...account, ...rest }));
  await client.expire(key, 60 * 60 * 4);
  return { doc: account };
};

const updateAccounts: AccountRepository['updateAccounts'] = async (filter, payload) => {
  const key = buildKeyAccounts(filter);
  const { client, clientJson } = await getRedis();
  const { accounts } = payload;
  if (accounts) {
    await clientJson.set(key, '.', convertUndefinedToNull(accounts));
    await client.expire(key, 60 * 60 * 4);
  }
  return { docs: accounts };
};

const removeAccount: AccountRepository['removeAccount'] = async ({ accountId }) => {
  if (!accountId) return {};

  const key = buildKeyAccount({ accountId });
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
