import { checkRepository } from '@fishprovider/core';
import storeUser from '@fishprovider/cross/dist/stores/user';
import { LocalFirstUserRepository } from '@fishprovider/local-first';

export const updateUserService = async (
  filter: {
    email?: string,
  },
  payload: {
    name?: string,
    starAccount?: {
      accountId: string
      enabled: boolean
    }
  },
) => {
  const updateUserRepo = checkRepository(LocalFirstUserRepository.updateUser);
  const { doc: user } = await updateUserRepo(filter, payload);

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
