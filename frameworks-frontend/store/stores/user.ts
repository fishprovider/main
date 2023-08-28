import type { Account, User } from '@fishprovider/core-new';
import type { Socket } from 'socket.io-client';

import { buildStoreObj } from '../store.framework';

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
