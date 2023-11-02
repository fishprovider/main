import { Account } from '@fishprovider/core';
import { AccountRepository, BaseGetManyResult, BaseGetResult } from '@fishprovider/core-backend';
import { MongoAccountRepository } from '@fishprovider/mongo';
import { RedisAccountRepository } from '@fishprovider/redis';

import { getDoc, getDocs, removeDoc } from '..';

const getAccount: AccountRepository['getAccount'] = async (filter, options) => {
  const getDocCache = RedisAccountRepository.getAccount;
  const setDocCache = RedisAccountRepository.updateAccount;
  const getDocDb = MongoAccountRepository.getAccount;

  const res = await getDoc<BaseGetResult<Account>>({
    getDocCache: getDocCache
      && (() => getDocCache(filter, options)),
    setDocCache: setDocCache
      && (({ doc }) => setDocCache(filter, { account: doc }, options)),
    getDocDb: getDocDb
      && (() => getDocDb(filter, options)),
  });

  return res ?? {};
};

const getAccounts: AccountRepository['getAccounts'] = async (filter, options) => {
  const getDocsCache = RedisAccountRepository.getAccounts;
  const setDocsCache = RedisAccountRepository.updateAccounts;
  const getDocsDb = MongoAccountRepository.getAccounts;

  const res = await getDocs<BaseGetManyResult<Account>>({
    getDocsCache: getDocsCache
      && (() => getDocsCache(filter, options)),
    setDocsCache: setDocsCache
      && (({ docs }) => setDocsCache(filter, { accounts: docs }, options)),
    getDocsDb: getDocsDb
      && (() => getDocsDb(filter, options)),
  });

  return res ?? {};
};

const removeAccount: AccountRepository['removeAccount'] = async (filter) => {
  const removeDocCache = RedisAccountRepository.removeAccount;
  const removeDocDb = MongoAccountRepository.removeAccount;

  const res = await removeDoc<BaseGetResult<Account>>({
    removeDocCache: removeDocCache && (() => removeDocCache(filter)),
    removeDocDb: removeDocDb && (() => removeDocDb(filter)),
  });

  return res ?? {};
};

// TODO: addAccount should update cache

export const DataAccessAccountRepository: AccountRepository = {
  ...MongoAccountRepository,
  getAccount,
  getAccounts,
  removeAccount,
};
