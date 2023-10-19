import { AccountRepository } from '@fishprovider/repositories';
import hash from 'object-hash';

import { getRedis } from '../redis';

const prefix = 'accounts-info-v4';

const getAccounts: AccountRepository['getAccounts'] = async (filter) => {
  const { client } = await getRedis();
  const keyAccounts = `${prefix}:${hash(filter)}`;
  const str = await client.get(keyAccounts);
  const docs = str ? JSON.parse(str) : undefined;
  return { docs };
};

const updateAccounts: AccountRepository['updateAccounts'] = async (filter, payload) => {
  const { client } = await getRedis();
  const keyAccounts = `${prefix}:${hash(filter)}`;
  await client.set(keyAccounts, JSON.stringify(payload.accounts), { EX: 60 * 60 });
  return {};
};

export const RedisAccountRepository: AccountRepository = {
  getAccounts,
  updateAccounts,
};
