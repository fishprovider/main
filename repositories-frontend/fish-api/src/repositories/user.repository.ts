import {
  BaseGetOptions, BaseUpdateOptions,
  type GetUserFilter, type UpdateUserPayload, type User, type UserRepository,
} from '@fishprovider/core-new';

// import { StoreUserRepository } from '@fishprovider/repository-store';
import { fishApi } from '../main';

const getUser = async (
  filter: GetUserFilter,
  _options: BaseGetOptions<User>,
) => {
  const { apiGet } = await fishApi.get();
  const user = await apiGet<Partial<User> | null | undefined>('/user/getUser', filter);
  // StoreUserRepository.setUser({ user });
  return { doc: user };
};

const updateUser = async (
  filter: GetUserFilter,
  payload: UpdateUserPayload,
  options: BaseUpdateOptions<User>,
) => {
  const { apiPost } = await fishApi.get();
  const user = await apiPost<Partial<User> | null | undefined>('/user/updateUser', {
    filter, payload, options,
  });
  // StoreUserRepository.setUser({ user });
  return { doc: user };
};

export const FishApiUserRepository: UserRepository = {
  getUser,
  updateUser,
};
