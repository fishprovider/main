import type { Config } from '@fishbot/ctrader/types/Config.model';
import type { ConnectionType } from '@fishbot/ctrader/types/Connection.model';
import type { ProviderPlatform, ProviderType } from '@fishbot/utils/constants/account';

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
