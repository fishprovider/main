import type MetaApi from 'metaapi.cloud-sdk';

import type { CallbackPayload } from './Event.model';

interface ConnectionType {
  clientId: string;
  clientSecret: string;
  accountId?: string;
  name?: string;

  api?: MetaApi;

  start: () => Promise<void>;
  destroy: () => Promise<void>;

  onEvent?: (_: CallbackPayload) => void;
}

export type {
  ConnectionType,
};
