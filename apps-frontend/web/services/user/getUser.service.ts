import { checkRepository } from '@fishprovider/core';
import storeUser from '@fishprovider/cross/dist/stores/user';
import { StoreFirstUserRepository } from '@fishprovider/store-first';

export const getUserService = async (filter: {
  email?: string,
}) => {
  const getUserRepo = checkRepository(StoreFirstUserRepository.getUser);
  const { doc: user } = await getUserRepo(filter);

  if (user) {
    // TODO: migrate to StoreFirstUserRepository
    storeUser.mergeState({
      info: {
        ...storeUser.getState().info,
        ...user,
      },
    });
  }

  return user;
};
