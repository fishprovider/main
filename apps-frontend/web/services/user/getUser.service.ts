import { checkRepository } from '@fishprovider/core-frontend';
import storeUser from '@fishprovider/cross/dist/stores/user';
import { DataFetchUserRepository } from '@fishprovider/data-fetch';

export const getUserService = async (filter: {
  //
}) => {
  const getUserRepo = checkRepository(DataFetchUserRepository.getUser);
  const { doc: user } = await getUserRepo(filter);

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
