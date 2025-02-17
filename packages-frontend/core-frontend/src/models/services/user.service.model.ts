import { User } from '@fishprovider/core';

import {
  RepositoryGetResult, ServiceGetParams, ServiceUpdateParams, UserInfo, UserRepository,
} from '..';

export type GetUserService = (params: ServiceGetParams<User> & {
  filter: {
    email?: string,
  },
  repositories: {
    user: UserRepository
  },
}) => Promise<RepositoryGetResult<User>>;

export type UpdateUserService = (params: ServiceUpdateParams<User> & {
  filter: {
    email?: string,
  },
  payload: {
    name?: string,
    starAccount?: {
      accountId: string,
      enabled: boolean,
    },
    refreshRoles?: boolean,
  },
  repositories: {
    user: UserRepository
  },
}) => Promise<RepositoryGetResult<User>>;

export type WatchUserService = <T>(params: {
  selector: (state: Record<string, User>) => T,
  repositories: {
    user: UserRepository,
  },
}) => T;

//
// UserInfo
//

export type GetUserInfoService = (params: {
  repositories: {
    user: UserRepository,
  },
}) => UserInfo;

export type UpdateUserInfoService = (params: {
  payload: Partial<UserInfo>,
  repositories: {
    user: UserRepository,
  },
}) => void;

export type WatchUserInfoService = <T>(params: {
  selector: (state: Record<string, UserInfo>) => T,
  repositories: {
    user: UserRepository,
  },
}) => T;
