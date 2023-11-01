import { Account } from '@fishprovider/core';
import { AccountRepository } from '@fishprovider/core-backend';
import { MongoAccountRepository } from '@fishprovider/mongo';
import { RedisAccountRepository } from '@fishprovider/redis';

import { getDoc, getDocs } from '..';

const getAccount: AccountRepository['getAccount'] = async (filter, options) => {
  const getDocCache = RedisAccountRepository.getAccount;
  const setDocCache = RedisAccountRepository.updateAccount;
  const getDocDb = MongoAccountRepository.getAccount;

  const account = await getDoc<Partial<Account>>({
    getDocCache: getDocCache
      && (() => getDocCache(filter, options).then((res) => res.doc)),
    setDocCache: setDocCache
      && ((doc) => setDocCache(filter, { account: doc }, options)),
    getDocDb: getDocDb
      && (() => getDocDb(filter, options).then((res) => res.doc)),
  });

  return { doc: account };
};

const getAccounts: AccountRepository['getAccounts'] = async (filter, options) => {
  const getDocsCache = RedisAccountRepository.getAccounts;
  const setDocsCache = RedisAccountRepository.updateAccounts;
  const getDocsDb = MongoAccountRepository.getAccounts;

  const accounts = await getDocs<Partial<Account>>({
    getDocsCache: getDocsCache
      && (() => getDocsCache(filter, options).then((res) => res.docs)),
    setDocsCache: setDocsCache
      && ((docs) => setDocsCache(filter, { accounts: docs }, options)),
    getDocsDb: getDocsDb
      && (() => getDocsDb(filter, options).then((res) => res.docs)),
  });

  return { docs: accounts };
};

export const DataAccessAccountRepository: AccountRepository = {
  ...MongoAccountRepository,
  getAccount,
  getAccounts,
};
