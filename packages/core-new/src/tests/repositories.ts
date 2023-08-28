import { AccountRepository, UserRepository } from '..';

export const userRepoDefault: UserRepository = {
  getUser: async () => null,
  updateUser: async () => ({}),
};

export const accountRepoDefault: AccountRepository = {
  getAccount: async () => null,
  updateAccount: async () => ({}),
};
