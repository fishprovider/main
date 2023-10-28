import { User, UserRepository } from '@fishprovider/core';

import { fishApiGet, fishApiPost } from '..';

const getUser: UserRepository['getUser'] = async (filter) => {
  const user = await fishApiGet<Partial<User> | undefined>('/user/getUser', filter);
  return { doc: user };
};

const updateUser: UserRepository['updateUser'] = async (filter, payload) => {
  const user = await fishApiPost<Partial<User> | undefined>('/user/updateUser', {
    filter, payload,
  });
  return { doc: user };
};

export const FishApiUserRepository: UserRepository = {
  getUser,
  updateUser,
};
