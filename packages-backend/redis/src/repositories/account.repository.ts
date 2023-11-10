import { AccountRepository } from '@fishprovider/core-backend';

import { buildKeyAccount, buildKeyAccounts, getRedis } from '..';

const getAccount: AccountRepository['getAccount'] = async ({ accountId }) => {
  if (!accountId) return {};

  const key = buildKeyAccount({ accountId });
  const { client } = await getRedis();
  const str = await client.get(key);
  if (!str) return {};

  return { doc: JSON.parse(str) };
};

const getAccounts: AccountRepository['getAccounts'] = async ({ accountViewType, email }) => {
  if (!accountViewType && !email) return {};

  const key = buildKeyAccounts({ accountViewType, email });
  const { client } = await getRedis();
  const str = await client.get(key);
  if (!str) return {};

  return { docs: JSON.parse(str) };
};

// const updateAccount: AccountRepository['updateAccount'] = async (filter, payload) => {
//   const key = buildKeyAccount(filter);
//   const { client } = await getRedis();
//   const { account } = payload;
//   await client.set(key, JSON.stringify(account), { EX: 60 * 60 });
//   return { doc: account };
// };

// const updateAccounts: AccountRepository['updateAccounts'] = async (filter, payload) => {
//   const key = buildKeyAccounts(filter);
//   const { client } = await getRedis();
//   const { accounts } = payload;
//   await client.set(key, JSON.stringify(accounts), { EX: 60 * 60 });
//   return { docs: accounts };
// };

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
  // updateAccount,
  // updateAccounts,
  removeAccount,
};
