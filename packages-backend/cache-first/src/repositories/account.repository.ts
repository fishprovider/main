import { Account } from '@fishprovider/core';
import { AccountRepository, BaseGetManyResult, BaseGetResult } from '@fishprovider/core-backend';
import { MongoAccountRepository } from '@fishprovider/mongo';
import { RedisAccountRepository } from '@fishprovider/redis';

import { getCacheFirst, updateCacheFirst } from '..';

const getAccount: AccountRepository['getAccount'] = async (filter, options) => {
  const getCache = RedisAccountRepository.getAccount;
  const setCache = RedisAccountRepository.updateAccount;
  const getDb = MongoAccountRepository.getAccount;

  const res = await getCacheFirst<BaseGetResult<Account>>({
    getCache: getCache && (() => getCache(filter, options)),
    setCache: setCache && (({ doc } = {}) => setCache(filter, { account: doc }, options)),
    getDb: getDb && (() => getDb(filter, options)),
  }, options);

  return res ?? {};
};

const getAccounts: AccountRepository['getAccounts'] = async (filter, options) => {
  const getCache = RedisAccountRepository.getAccounts;
  const setCache = RedisAccountRepository.updateAccounts;
  const getDb = MongoAccountRepository.getAccounts;

  const res = await getCacheFirst<BaseGetManyResult<Account>>({
    getCache: getCache && (() => getCache(filter, options)),
    setCache: setCache && (({ docs } = {}) => setCache(filter, { accounts: docs }, options)),
    getDb: getDb && (() => getDb(filter, options)),
  }, options);

  return res ?? {};
};

const updateAccount: AccountRepository['updateAccount'] = async (filter, payload) => {
  const updateDb = MongoAccountRepository.updateAccount;
  const updateCache = RedisAccountRepository.updateAccount;

  const res = await updateCacheFirst<BaseGetResult<Account>>({
    updateDb: updateDb && (() => updateDb(filter, payload)),
    updateCache: updateCache && (({ doc } = {}) => updateCache(filter, { account: doc })),
  });

  return res ?? {};
};

const removeAccount: AccountRepository['removeAccount'] = async (filter) => {
  const updateDb = MongoAccountRepository.removeAccount;
  const updateCache = RedisAccountRepository.removeAccount;

  const res = await updateCacheFirst<BaseGetResult<Account>>({
    updateDb: updateDb && (() => updateDb(filter)),
    updateCache: updateCache && (() => updateCache(filter)),
  });

  return res ?? {};
};

export const CacheFirstAccountRepository: AccountRepository = {
  ...RedisAccountRepository,
  ...MongoAccountRepository,
  getAccount,
  getAccounts,
  updateAccount,
  removeAccount,
};
