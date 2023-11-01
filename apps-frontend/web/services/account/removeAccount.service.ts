import { checkRepository } from '@fishprovider/core';
import storeAccounts from '@fishprovider/cross/dist/stores/accounts';
import { DataFetchAccountRepository } from '@fishprovider/data-fetch';

export const removeAccountService = async (filter: {
  accountId: string,
}) => {
  const removeAccountRepo = checkRepository(DataFetchAccountRepository.removeAccount);
  await removeAccountRepo(filter);

  // TODO: migrate to DataFetchAccountRepository
  storeAccounts.removeDoc(filter.accountId);
};
