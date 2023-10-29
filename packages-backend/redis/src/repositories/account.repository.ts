import { AccountRepository } from '@fishprovider/core-backend';

import { buildKeyAccounts, getRedis } from '..';

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
  return {};
};

export const RedisAccountRepository: AccountRepository = {
  getAccounts,
  updateAccounts,
};
