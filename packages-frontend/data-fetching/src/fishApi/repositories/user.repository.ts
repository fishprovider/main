import { User } from '@fishprovider/core';
import {
  BaseUpdateOptions, GetUserFilter, UpdateUserPayload, UserRepository,
} from '@fishprovider/repositories';

import { fishApiGet, fishApiPost } from '..';

const getUser = async (filter: GetUserFilter) => {
  const user = await fishApiGet<Partial<User> | undefined>('/user/getUser', filter);
  return { doc: user };
};

const updateUser = async (
  filter: GetUserFilter,
  payload: UpdateUserPayload,
  options: BaseUpdateOptions<User>,
) => {
  const user = await fishApiPost<Partial<User> | undefined>('/user/updateUser', {
    filter, payload, options,
  });
  return { doc: user };
};

export const FishApiUserRepository: UserRepository = {
  getUser,
  updateUser,
};
