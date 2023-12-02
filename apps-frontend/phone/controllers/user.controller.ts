import { User } from '@fishprovider/core';
import {
  BaseGetOptions,
  BaseUpdateOptions,
  getUserInfoService, getUserService, updateUserInfoService,
  updateUserService, UserInfo, watchUserInfoService, watchUserService,
} from '@fishprovider/core-frontend';
import { StoreFirstUserRepository } from '@fishprovider/store-first';

export const getUserController = async (
  filter: {
    email?: string,
  },
  options?: BaseGetOptions<User>,
) => {
  const { doc: user } = await getUserService({
    filter,
    repositories: { user: StoreFirstUserRepository },
    options,
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
    },
    refreshRoles?: boolean
  },
  options?: BaseUpdateOptions<User>,
) => {
  const { doc: user } = await updateUserService({
    filter,
    payload,
    repositories: { user: StoreFirstUserRepository },
    options,
  });
  return user;
};

export const watchUserController = <T>(
  selector: (state: Record<string, User>) => T,
) => watchUserService({
    selector,
    repositories: { user: StoreFirstUserRepository },
  });

//
// UserInfo
//

export const getUserInfoController = () => getUserInfoService({
  repositories: { user: StoreFirstUserRepository },
});

export const updateUserInfoController = (payload: Partial<UserInfo>) => {
  updateUserInfoService({
    payload,
    repositories: { user: StoreFirstUserRepository },
  });
};

export const watchUserInfoController = <T>(
  selector: (state: UserInfo) => T,
) => watchUserInfoService({
    selector,
    repositories: { user: StoreFirstUserRepository },
  });
