import { checkRepository } from '@fishprovider/core';
import storeAccounts from '@fishprovider/cross/dist/stores/accounts';
import { StoreFirstAccountRepository } from '@fishprovider/store-first';

export const removeAccountService = async (filter: {
  accountId: string,
}) => {
  const removeAccountRepo = checkRepository(StoreFirstAccountRepository.removeAccount);
  await removeAccountRepo(filter);

  // TODO: migrate to StoreFirstAccountRepository
  storeAccounts.removeDoc(filter.accountId);
};
