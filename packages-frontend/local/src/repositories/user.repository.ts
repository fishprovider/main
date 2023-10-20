import { User } from '@fishprovider/core';
import { UserRepository } from '@fishprovider/repositories';

import { localGet } from '..';

const getUser: UserRepository['getUser'] = async (filter) => {
  const key = filter.email ?? 'current';
  const user = await localGet<User>(key);
  return { doc: user };
};

export const LocalUserRepository: UserRepository = {
  getUser,
};
