import { AccountRepository, UserRepository } from '@fishprovider/repositories';

export const userRepoDefault: UserRepository = {
  getUser: async () => ({}),
  updateUser: async () => ({}),
};

export const accountRepoDefault: AccountRepository = {
  getAccount: async () => ({}),
  getAccounts: async () => ({ docs: [] }),
  updateAccount: async () => ({}),
};
