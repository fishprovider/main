import { AccountRepository, UserRepository } from '@fishprovider/core-new';

export const userRepoDefault: UserRepository = {
  getUser: async () => ({}),
  updateUser: async () => ({}),
};

export const accountRepoDefault: AccountRepository = {
  getAccount: async () => ({}),
  getAccounts: async () => ({ docs: [] }),
  updateAccount: async () => ({}),
};
