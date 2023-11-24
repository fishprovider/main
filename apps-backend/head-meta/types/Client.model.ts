import type { Config } from '@fishprovider/metatrader/dist/types/Config.model';
import type { ConnectionType } from '@fishprovider/metatrader/dist/types/Connection.model';
import type { AccountPlatform, ProviderType } from '@fishprovider/utils/dist/constants/account';

interface ClientAccount {
  _id: string;
  config: Config;
  providerType: ProviderType;
  platform: AccountPlatform;
}

interface Client {
  clientId: string;
  config: Config;
  accounts: ClientAccount[];
  connection?: ConnectionType;
  isRestarting?: boolean;
}

export type {
  Client,
  ClientAccount,
};
