import { Account } from '@fishprovider/core';
import { AccountRepository, RepositoryGetManyResult, RepositoryGetResult } from '@fishprovider/core-backend';
import { MongoAccountRepository } from '@fishprovider/mongo';
import { RedisAccountRepository } from '@fishprovider/redis';

import { getAndSetCacheFirst, updateCacheFirst } from '..';

const getAccount: AccountRepository['getAccount'] = async (filter, options) => {
  const getCache = RedisAccountRepository.getAccount;
  const setCache = RedisAccountRepository.updateAccount;
  const getDb = MongoAccountRepository.getAccount;

  const res = await getAndSetCacheFirst<RepositoryGetResult<Account>>({
    getCache: getCache && (() => getCache(filter, options)),
    setCache: setCache && (({ doc } = {}) => setCache(filter, { account: doc }, options)),
    getDb: getDb && (() => getDb(filter, options)),
    ...options,
  });

  return res ?? {};
};

const getAccounts: AccountRepository['getAccounts'] = async (filter, options) => {
  const getCache = RedisAccountRepository.getAccounts;
  const setCache = RedisAccountRepository.updateAccounts;
  const getDb = MongoAccountRepository.getAccounts;

  const res = await getAndSetCacheFirst<RepositoryGetManyResult<Account>>({
    getCache: getCache && (() => getCache(filter, options)),
    setCache: setCache && (({ docs } = {}) => setCache(filter, { accounts: docs }, options)),
    getDb: getDb && (() => getDb(filter, options)),
    ...options,
  });

  return res ?? {};
};

const updateAccount: AccountRepository['updateAccount'] = async (filter, payload, options) => {
  const updateDb = MongoAccountRepository.updateAccount;
  const updateCache = RedisAccountRepository.updateAccount;

  const res = await updateCacheFirst<RepositoryGetResult<Account>>({
    updateDb: updateDb && (() => updateDb(filter, payload, options)),
    updateCache: updateCache && (({ doc } = {}) => updateCache(filter, { account: doc }, options)),
  });

  return res ?? {};
};

const removeAccount: AccountRepository['removeAccount'] = async (filter, options) => {
  const updateDb = MongoAccountRepository.removeAccount;
  const updateCache = RedisAccountRepository.removeAccount;

  const res = await updateCacheFirst<RepositoryGetResult<Account>>({
    updateDb: updateDb && (() => updateDb(filter, options)),
    updateCache: updateCache && (() => updateCache(filter, options)),
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
