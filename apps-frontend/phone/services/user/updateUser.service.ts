import { checkRepository } from '@fishprovider/core';
import storeUser from '@fishprovider/cross/dist/stores/user';
import { DataFetchUserRepository } from '@fishprovider/data-fetch';

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
  const updateUserRepo = checkRepository(DataFetchUserRepository.updateUser);
  const { doc: user } = await updateUserRepo(filter, payload);

  if (user) {
    // TODO: migrate to DataFetchUserRepository
    storeUser.mergeState({
      info: {
        ...storeUser.getState().info,
        ...user,
      },
    });
  }

  return user;
};
