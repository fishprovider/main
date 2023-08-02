import type { Account } from '@fishprovider/utils/dist/types/Account.model';
import type { User } from '@fishprovider/utils/dist/types/User.model';
import type { Socket } from 'socket.io-client';

import { buildStoreObj } from '~libs/store';

interface Store extends Record<string, any> {
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

const storeUser = buildStoreObj<Store>({
  theme: 'light',
  lang: 'en',
  activeSymbol: 'EURUSD',
  banners: {},
}, 'user');

export default storeUser;
