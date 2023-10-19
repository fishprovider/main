import { MongoAccountRepository } from '@fishprovider/mongo';
import { RedisAccountRepository } from '@fishprovider/redis';
import { AccountRepository } from '@fishprovider/repositories';

const getAccounts: AccountRepository['getAccounts'] = async (filter, options) => {
  let docs;
  if (RedisAccountRepository.getAccounts) {
    const res = await RedisAccountRepository.getAccounts(filter, options);
    docs = res.docs;
  }
  if (!docs && MongoAccountRepository.getAccounts) {
    const res = await MongoAccountRepository.getAccounts(filter, options);
    docs = res.docs;
    if (RedisAccountRepository.updateAccounts) {
      // non-blocking
      RedisAccountRepository.updateAccounts(filter, { accounts: docs });
    }
  }
  return { docs };
};

export const DataAccessAccountRepository: AccountRepository = {
  ...MongoAccountRepository,
  getAccounts,
};
