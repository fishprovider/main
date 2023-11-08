import { checkRepository } from '@fishprovider/core';
import storeUser from '@fishprovider/cross/dist/stores/user';
import { LocalFirstUserRepository } from '@fishprovider/local-first';

export const getUserService = async (filter: {
  email?: string,
}) => {
  const getUserRepo = checkRepository(LocalFirstUserRepository.getUser);
  const { doc: user } = await getUserRepo(filter);

  if (user) {
    // TODO: migrate to LocalFirstUserRepository
    storeUser.mergeState({
      info: {
        ...storeUser.getState().info,
        ...user,
      },
    });
  }

  return user;
};
