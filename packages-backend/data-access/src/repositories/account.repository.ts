import { Account, AccountViewType } from '@fishprovider/core';
import { MongoAccountRepository } from '@fishprovider/mongo';
import { RedisAccountRepository } from '@fishprovider/redis';
import { AccountRepository, BaseGetOptions } from '@fishprovider/repositories';

const getAccounts = async (
  filter: {
    accountIds?: string[],
    accountViewType?: AccountViewType,
    email?: string,
  },
  options?: BaseGetOptions<Account>,
) => {
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
      RedisAccountRepository.updateAccounts({ accounts: docs });
    }
  }
  return { docs };
};

export const DataAccessAccountRepository: AccountRepository = {
  ...MongoAccountRepository,
  getAccounts,
};
