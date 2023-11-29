import { User } from '@fishprovider/core';
import { UserRepository } from '@fishprovider/core-frontend';

import { buildKeyUser, localGet, localSet } from '..';

const getUser: UserRepository['getUser'] = async (filter) => {
  const key = buildKeyUser(filter);
  const user = await localGet<User>(key);
  return { doc: user };
};

const updateUser: UserRepository['updateUser'] = async (filter, payload) => {
  const key = buildKeyUser(filter);
  await localSet(key, payload.user);
  return { doc: payload.user };
};

export const LocalUserRepository: UserRepository = {
  getUser,
  updateUser,
};
