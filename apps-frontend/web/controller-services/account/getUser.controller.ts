import { getUserService } from '@fishprovider/base-services';
import storeUser from '@fishprovider/cross/dist/stores/user';
import { DataFetchUserRepository } from '@fishprovider/data-fetch';

export const getUserController = async (filter: {
  email?: string,
}) => {
  const { doc: user } = await getUserService({
    filter,
    repositories: {
      user: DataFetchUserRepository,
    },
    context: {
      internal: true,
    },
  });

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
