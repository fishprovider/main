import { Account, User } from '@fishprovider/core';
import { Socket } from 'socket.io-client';

import {
  RepositoryGetOptions, RepositoryGetResult, RepositoryUpdateOptions,
  RepositoryUpdateResult,
} from '..';

export interface UserInfo extends Record<string, any> {
  theme?: string;
  lang?: string;

  isClientLoggedIn?: boolean;
  isServerLoggedIn?: boolean,

  activeUser?: Partial<User>,
  activeAccount?: Partial<Account>,
  activeSymbol?: string,

  banners?: Record<string, boolean>;
  socket?: Socket;
}

export interface UserRepository {
  getUser?: (
    filter: {
      email?: string,
    },
    options?: RepositoryGetOptions<User>,
  ) => Promise<RepositoryGetResult<User>>;

  updateUser?: (
    filter: {
      email?: string,
    },
    payload: {
      name?: string,
      starAccount?: {
        accountId: string
        enabled: boolean
      },
      refreshRoles?: boolean,
      user?: Partial<User>,
    },
    options?: RepositoryUpdateOptions<User>,
  ) => Promise<RepositoryUpdateResult<User>>;

  watchUser?: <T>(
    selector: (state: Record<string, User>) => T,
  ) => T;

  getUserInfo?: () => UserInfo;

  updateUserInfo?: (payload: Partial<UserInfo>) => void;

  watchUserInfo?: <T>(
    selector: (state: UserInfo) => T,
  ) => T;
}
