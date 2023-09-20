import { User } from '@fishprovider/core';
import {
  UserRepository,
} from '@fishprovider/repositories';

import { fishApiGet, fishApiPost } from '..';

const getUser = async (filter: {
  userId?: string
  email?: string,
}) => {
  const user = await fishApiGet<Partial<User> | undefined>('/user/getUser', filter);
  return { doc: user };
};

const updateUser = async (
  filter: {
    userId?: string
    email?: string,
  },
  payload: {
    starProvider?: {
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
