import { DefaultUserRepository, type GetUserRepositoryParams, type UserRepository } from '@fishprovider/application-rules';
import type { User } from '@fishprovider/enterprise-rules';

// import { StoreUserRepository } from '@fishprovider/framework-store';
import { fishApi } from '../fishApi.framework';

const getUser = async (params: GetUserRepositoryParams) => {
  const { apiGet } = await fishApi.get();
  const user = await apiGet<User>('/user/getUser', params);
  // StoreUserRepository.setUser({ user });
  return user;
};

export const FishApiUserRepository: UserRepository = {
  ...DefaultUserRepository,
  getUser,
};
