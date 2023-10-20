import { AccountRepository } from '@fishprovider/repositories';

import { storeAccounts } from '..';

const updateAccount: AccountRepository['updateAccount'] = async (_filter, payload) => {
  const { doc: account } = payload;
  if (account) {
    storeAccounts.mergeDoc(account);
  }
  return { doc: account };
};

const updateAccounts: AccountRepository['updateAccounts'] = async (_filter, payload) => {
  const { accounts } = payload;
  if (accounts) {
    storeAccounts.mergeDocs(accounts);
  }
  return { docs: accounts };
};

export const StoreAccountRepository: AccountRepository = {
  updateAccount,
  updateAccounts,
};
