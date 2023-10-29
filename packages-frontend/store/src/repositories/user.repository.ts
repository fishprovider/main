import { UserRepository } from '@fishprovider/core-frontend';

import { storeUser } from '..';

const updateUser: UserRepository['updateUser'] = async (_filter, payload) => {
  const { doc: user } = payload;
  if (user) {
    storeUser.mergeState({
      info: {
        ...storeUser.getState().info,
        ...user,
      },
    });
  }
  return { doc: user };
};

export const StoreUserRepository: UserRepository = {
  updateUser,
};
