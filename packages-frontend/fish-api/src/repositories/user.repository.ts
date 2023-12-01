import { User } from '@fishprovider/core';
import { UserRepository } from '@fishprovider/core-frontend';

import { fishApiGet, fishApiPost } from '..';

const getUser: UserRepository['getUser'] = async (_filter, options) => {
  const user = await fishApiGet<Partial<User> | undefined>('/user/getUser', { options });
  return { doc: user };
};

const updateUser: UserRepository['updateUser'] = async (_filter, payload, options) => {
  const { refreshRoles, ...rest } = payload;

  if (refreshRoles) {
    const user = await fishApiPost<Partial<User> | undefined>('/user/refreshUserRoles', { options });
    return { doc: user };
  }

  const user = await fishApiPost<Partial<User> | undefined>('/user/updateUser', { payload: rest, options });
  return { doc: user };
};

export const FishApiUserRepository: UserRepository = {
  getUser,
  updateUser,
};
