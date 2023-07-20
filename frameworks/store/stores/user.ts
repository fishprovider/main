import type { Account } from '@fishprovider/utils/dist/types/Account.model';
import type { User } from '@fishprovider/utils/dist/types/User.model';
import type { Socket } from 'socket.io-client';

import { buildStore } from '../store.framework';

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

export const storeUser = buildStore<UserStore>({
  theme: 'light',
  lang: 'en',
  activeSymbol: 'EURUSD',
  banners: {},
}, 'user');
