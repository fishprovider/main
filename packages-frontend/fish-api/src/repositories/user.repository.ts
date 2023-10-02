import { User } from '@fishprovider/core';
import {
  UserRepository,
} from '@fishprovider/repositories';

import { fishApiGet, fishApiPost } from '..';

const getUser = async (filter: {
  email?: string,
}) => {
  const user = await fishApiGet<Partial<User> | undefined>('/user/getUser', filter);
  return { doc: user };
};

const updateUser = async (
  filter: {
    email?: string,
  },
  payload: {
    name?: string
    starAccount?: {
      accountId: string
      enabled: boolean
    }
  },
) => {
  const user = await fishApiPost<Partial<User> | undefined>('/user/updateUser', {
    filter, payload,
  });
  return { doc: user };
};

export const FishApiUserRepository: UserRepository = {
  getUser,
  updateUser,
};
