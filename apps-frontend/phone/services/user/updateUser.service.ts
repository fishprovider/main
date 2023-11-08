import { checkRepository } from '@fishprovider/core';
import storeUser from '@fishprovider/cross/dist/stores/user';
import { FishApiUserRepository } from '@fishprovider/fish-api';

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
  const updateUserRepo = checkRepository(FishApiUserRepository.updateUser);
  const { doc: user } = await updateUserRepo(filter, payload);

  if (user) {
    storeUser.mergeState({
      info: {
        ...storeUser.getState().info,
        ...user,
      },
    });
  }

  return user;
};
