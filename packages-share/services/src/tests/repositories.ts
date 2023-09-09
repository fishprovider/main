import { AccountRepository, UserRepository } from '@fishprovider-new/core';

export const userRepoDefault: UserRepository = {
  getUser: async () => ({}),
  updateUser: async () => ({}),
};

export const accountRepoDefault: AccountRepository = {
  getAccount: async () => ({}),
  getAccounts: async () => ({ docs: [] }),
  updateAccount: async () => ({}),
};
