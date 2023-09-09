import { Account, User } from '@fishprovider/core';
import { Socket } from 'socket.io-client';

import { buildStoreObj } from '..';

export interface UserStore extends Record<string, any> {
  isClientLoggedIn?: boolean;
  isServerLoggedIn?: boolean;
  info?: Partial<User> | null;
  socket?: Socket;

  theme: string;
  lang: string;

  activeProvider?: Account,
  activeSymbol: string;
  banners: Record<string, boolean>;
}

export const storeUser = buildStoreObj<UserStore>({
  theme: 'light',
  lang: 'en',
  activeSymbol: 'EURUSD',
  banners: {},
}, 'user');
