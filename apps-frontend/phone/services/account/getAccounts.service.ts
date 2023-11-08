import { AccountViewType, checkRepository } from '@fishprovider/core';
import storeAccounts from '@fishprovider/cross/dist/stores/accounts';
import { FishApiAccountRepository } from '@fishprovider/fish-api';
import { Account } from '@fishprovider/utils/types/Account.model';

export const getAccountsService = async (filter: {
  accountViewType?: AccountViewType,
  email?: string,
}) => {
  const getAccountsRepo = checkRepository(FishApiAccountRepository.getAccounts);
  const { docs: accounts } = await getAccountsRepo(filter);

  if (accounts) {
    storeAccounts.mergeDocs(accounts as Partial<Account>[]);
  }

  return accounts;
};
