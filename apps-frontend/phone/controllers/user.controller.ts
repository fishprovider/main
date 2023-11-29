import { User } from '@fishprovider/core';
import {
  getUserInfoService, getUserService, updateUserInfoService,
  updateUserService, UserInfo, watchUserInfoService, watchUserService,
} from '@fishprovider/core-frontend';
import { StoreFirstUserRepository } from '@fishprovider/store-first';

const defaultRepo = StoreFirstUserRepository;

export const getUserController = async (filter: {
  email?: string,
}) => {
  const { doc: user } = await getUserService({
    filter,
    repositories: { user: defaultRepo },
  });
  return user;
};

export const updateUserController = async (
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
  const { doc: user } = await updateUserService({
    filter,
    payload,
    repositories: { user: defaultRepo },
  });
  return user;
};

export const watchUserController = <T>(
  selector: (state: Record<string, User>) => T,
) => watchUserService({
    selector,
    repositories: { user: defaultRepo },
  });

//
// UserInfo
//

export const getUserInfoController = () => getUserInfoService({
  repositories: { user: defaultRepo },
});

export const updateUserInfoController = (payload: Partial<UserInfo>) => {
  updateUserInfoService({
    payload,
    repositories: { user: defaultRepo },
  });
};

export const watchUserInfoController = <T>(
  selector: (state: UserInfo) => T,
) => watchUserInfoService({
    selector,
    repositories: { user: defaultRepo },
  });
