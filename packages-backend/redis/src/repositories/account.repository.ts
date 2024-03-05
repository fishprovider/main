import { Account } from '@fishprovider/core';
import { AccountRepository, BaseGetManyResult, BaseGetResult } from '@fishprovider/core-backend';

import {
  buildKeyAccount, buildKeyAccounts, convertUndefinedToNull, getRedis,
} from '..';

const getAccount: AccountRepository['getAccount'] = async (filter) => {
  const key = buildKeyAccount(filter);
  const { clientJson } = await getRedis();
  const result = await clientJson.get(key) as BaseGetResult<Account> | undefined;
  if (!result) return {};

  return result;
};

const getAccounts: AccountRepository['getAccounts'] = async (filter) => {
  const key = buildKeyAccounts(filter);
  const { clientJson } = await getRedis();
  const result = await clientJson.get(key) as BaseGetManyResult<Account> | undefined;
  if (!result) return {};

  return { ...result, docs: Object.values(result.docsObj || {}) };
};

const updateAccount: AccountRepository['updateAccount'] = async (filter, payload, options) => {
  const key = buildKeyAccount(filter);
  const { clientJson, client } = await getRedis();
  const { account } = payload;
  if (!account) return {};

  await clientJson.merge(key, '$', {});
  await clientJson.merge(key, '$.doc', convertUndefinedToNull(account)).catch(console.error);
  const at = new Date();
  await clientJson.set(key, '$.at', at);

  const { ttlSec } = options || {};
  if (ttlSec) {
    await client.expire(key, ttlSec * 2);
  }

  return { doc: account, at };
};

const updateAccounts: AccountRepository['updateAccounts'] = async (filter, payload, options) => {
  const key = buildKeyAccounts(filter);
  const { clientJson, client } = await getRedis();
  const { accounts } = payload;
  if (!accounts) return {};

  await clientJson.merge(key, '$', {});
  for (const account of accounts) {
    await clientJson.merge(key, `$.docsObj.${account._id}`, convertUndefinedToNull(account));
  }
  const at = new Date();
  await clientJson.set(key, '$.at', at);

  const { ttlSec } = options || {};
  if (ttlSec) {
    await client.expire(key, ttlSec * 2);
  }

  return { docs: accounts, at };
};

const removeAccount: AccountRepository['removeAccount'] = async (filter) => {
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
