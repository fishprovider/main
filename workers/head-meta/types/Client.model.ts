import type { Config } from '@fishprovider/metatrader/types/Config.model';
import type { ConnectionType } from '@fishprovider/metatrader/types/Connection.model';
import type { ProviderPlatform, ProviderType } from '@fishprovider/utils/constants/account';

interface ClientAccount {
  _id: string;
  config: Config;
  providerType: ProviderType;
  providerPlatform: ProviderPlatform;
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
