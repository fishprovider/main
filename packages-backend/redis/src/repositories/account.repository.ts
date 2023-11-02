import { AccountRepository } from '@fishprovider/core-backend';

import { buildKeyAccount, buildKeyAccounts, getRedis } from '..';

const getAccount: AccountRepository['getAccount'] = async (filter) => {
  const { client } = await getRedis();
  const key = buildKeyAccount(filter);
  const str = await client.get(key);
  const doc = str ? JSON.parse(str) : undefined;
  return { doc };
};

const getAccounts: AccountRepository['getAccounts'] = async (filter) => {
  const { client } = await getRedis();
  const key = buildKeyAccounts(filter);
  const str = await client.get(key);
  const docs = str ? JSON.parse(str) : undefined;
  return { docs };
};

const updateAccounts: AccountRepository['updateAccounts'] = async (filter, payload) => {
  const { client } = await getRedis();
  const key = buildKeyAccounts(filter);
  await client.set(key, JSON.stringify(payload.accounts), { EX: 60 * 60 });
  return { docs: payload.accounts };
};

export const RedisAccountRepository: AccountRepository = {
  getAccount,
  getAccounts,
  updateAccounts,
};
