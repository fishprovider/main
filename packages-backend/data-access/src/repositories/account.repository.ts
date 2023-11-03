import { Account } from '@fishprovider/core';
import { AccountRepository, BaseGetManyResult, BaseGetResult } from '@fishprovider/core-backend';
import { MongoAccountRepository } from '@fishprovider/mongo';
import { RedisAccountRepository } from '@fishprovider/redis';

import {
  getMany, getOne, removeOne, updateMany, updateOne,
} from '..';

const getAccount: AccountRepository['getAccount'] = async (filter, options) => {
  const getCache = RedisAccountRepository.getAccount;
  const setCache = RedisAccountRepository.updateAccount;
  const getDb = MongoAccountRepository.getAccount;

  const res = await getOne<BaseGetResult<Account>>({
    getCache: getCache && (() => getCache(filter, options)),
    setCache: setCache && (({ doc }) => setCache(filter, { account: doc }, options)),
    getDb: getDb && (() => getDb(filter, options)),
  });

  return res ?? {};
};

const getAccounts: AccountRepository['getAccounts'] = async (filter, options) => {
  const getCache = RedisAccountRepository.getAccounts;
  const setCache = RedisAccountRepository.updateAccounts;
  const getDb = MongoAccountRepository.getAccounts;

  const res = await getMany<BaseGetManyResult<Account>>({
    getCache: getCache && (() => getCache(filter, options)),
    setCache: setCache && (({ docs }) => setCache(filter, { accounts: docs }, options)),
    getDb: getDb && (() => getDb(filter, options)),
  });

  return res ?? {};
};

const updateAccount: AccountRepository['updateAccount'] = async (filter, payload) => {
  const updateDb = MongoAccountRepository.updateAccount;
  const updateCache = RedisAccountRepository.updateAccount;

  const res = await updateOne<BaseGetResult<Account>>({
    updateDb: updateDb && (() => updateDb(filter, payload)),
    updateCache: updateCache && (({ doc } = {}) => updateCache(filter, { account: doc })),
  });

  return res ?? {};
};

const updateAccounts: AccountRepository['updateAccounts'] = async (filter, payload) => {
  const updateDb = MongoAccountRepository.updateAccounts;
  const updateCache = RedisAccountRepository.updateAccounts;

  const res = await updateMany<BaseGetManyResult<Account>>({
    updateDb: updateDb && (() => updateDb(filter, payload)),
    updateCache: updateCache && (({ docs } = {}) => updateCache(filter, { accounts: docs })),
  });

  return res ?? {};
};

const removeAccount: AccountRepository['removeAccount'] = async (filter) => {
  const removeDb = MongoAccountRepository.removeAccount;
  const removeCache = RedisAccountRepository.removeAccount;

  const res = await removeOne<BaseGetResult<Account>>({
    removeDb: removeDb && (() => removeDb(filter)),
    removeCache: removeCache && (() => removeCache(filter)),
  });

  return res ?? {};
};

export const DataAccessAccountRepository: AccountRepository = {
  ...MongoAccountRepository,
  getAccount,
  getAccounts,
  updateAccount,
  updateAccounts,
  removeAccount,
};
