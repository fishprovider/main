import { User, UserRepository } from '@fishprovider/core';

import { buildKeyUser, localGet } from '..';

const getUser: UserRepository['getUser'] = async (filter) => {
  const key = buildKeyUser(filter);
  const user = await localGet<User>(key);
  return { doc: user };
};

export const LocalUserRepository: UserRepository = {
  getUser,
};
