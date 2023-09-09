import {
  BaseUpdateOptions, GetUserFilter, UpdateUserPayload, User, UserRepository,
} from '@fishprovider/core-new';

import { fishApi } from '../main';

const getUser = async (filter: GetUserFilter) => {
  const { apiGet } = await fishApi.get();
  const user = await apiGet<Partial<User> | undefined>('/user/getUser', filter);
  return { doc: user };
};

const updateUser = async (
  filter: GetUserFilter,
  payload: UpdateUserPayload,
  options: BaseUpdateOptions<User>,
) => {
  const { apiPost } = await fishApi.get();
  const user = await apiPost<Partial<User> | undefined>('/user/updateUser', {
    filter, payload, options,
  });
  return { doc: user };
};

export const FishApiUserRepository: UserRepository = {
  getUser,
  updateUser,
};
