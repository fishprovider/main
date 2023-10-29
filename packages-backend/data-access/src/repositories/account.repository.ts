import { Account } from '@fishprovider/core';
import { AccountRepository } from '@fishprovider/core-backend';
import { MongoAccountRepository } from '@fishprovider/mongo';
import { RedisAccountRepository } from '@fishprovider/redis';
import _ from 'lodash';

import { getDocs } from '..';

const getAccounts: AccountRepository['getAccounts'] = async (filter, options) => {
  const getDocsCache = RedisAccountRepository.getAccounts;
  const setDocsCache = RedisAccountRepository.updateAccounts;
  const getDocsDb = MongoAccountRepository.getAccounts;

  const filterCache = _.pick(filter, ['accountViewType', 'email']);

  const accounts = await getDocs<Partial<Account>>({
    getDocsCache: getDocsCache
      && (() => getDocsCache(filterCache, options).then((res) => res.docs)),
    setDocsCache: setDocsCache
      && ((docs) => setDocsCache(filterCache, { accounts: docs }, options)),
    getDocsDb: getDocsDb
      && (() => getDocsDb(filter, options).then((res) => res.docs)),
  });

  return { docs: accounts };
};

export const DataAccessAccountRepository: AccountRepository = {
  ...MongoAccountRepository,
  getAccounts,
};
