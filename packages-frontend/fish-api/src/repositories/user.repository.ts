import { User } from '@fishprovider/core';
import { UserRepository } from '@fishprovider/core-frontend';

import { fishApiGet, fishApiPost } from '..';

const getUser: UserRepository['getUser'] = async () => {
  const user = await fishApiGet<Partial<User> | undefined>('/user/getUser');
  return { doc: user };
};

const updateUser: UserRepository['updateUser'] = async (_filter, payload) => {
  const { refreshRoles, name, starAccount } = payload;

  if (refreshRoles) {
    const user = await fishApiPost<Partial<User> | undefined>('/user/refreshUserRoles');
    return { doc: user };
  }

  const user = await fishApiPost<Partial<User> | undefined>('/user/updateUser', {
    name, starAccount,
  });
  return { doc: user };
};

export const FishApiUserRepository: UserRepository = {
  getUser,
  updateUser,
};
