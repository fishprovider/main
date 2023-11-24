import { Account, User } from '@fishprovider/core';
import { Socket } from 'socket.io-client';

import {
  BaseGetOptions, BaseGetResult, BaseUpdateOptions, BaseUpdateResult,
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
    options?: BaseGetOptions<User>,
  ) => Promise<BaseGetResult<User>>;

  updateUser?: (
    filter: {
      email?: string,
    },
    payload: {
      refreshRoles?: boolean,
      name?: string,
      starAccount?: {
        accountId: string
        enabled: boolean
      }
      user?: Partial<User>,
    },
    options?: BaseUpdateOptions<User>,
  ) => Promise<BaseUpdateResult<User>>;

  watchUser?: <T>(
    selector: (state: Record<string, User>) => T,
  ) => T;

  watchUserInfo?: <T>(
    selector: (state: UserInfo) => T,
  ) => T;

  getUserInfo?: () => UserInfo;

  updateUserInfo?: (payload: Partial<UserInfo>) => void;
}
