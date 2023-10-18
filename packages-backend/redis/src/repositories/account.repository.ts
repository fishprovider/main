import { Account } from '@fishprovider/core';
import { AccountRepository } from '@fishprovider/repositories';

import { getRedis } from '../redis';

const keyAccounts = 'accounts-info-v3';

const getAccounts = async () => {
  const { client } = await getRedis();
  const str = await client.get(keyAccounts);
  const docs = str ? JSON.parse(str) : undefined;
  return { docs };
};

const updateAccounts = async (payload: {
  accounts?: Partial<Account>[],
}) => {
  const { client } = await getRedis();
  await client.set(keyAccounts, JSON.stringify(payload.accounts), { EX: 60 * 60 });
  return {};
};

export const RedisAccountRepository: AccountRepository = {
  getAccounts,
  updateAccounts,
};
