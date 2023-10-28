import type MetaApi from 'metaapi.cloud-sdk';

export interface MetaApiConfig {
  clientId: string;
  clientSecret: string;
  name?: string;
  accountId?: string;
}

export type MetaApiCallbackPayload = Record<string, any>;

export interface TMetaApiConnection {
  clientId: string;
  clientSecret: string;
  name?: string;
  accountId?: string;

  api?: MetaApi;

  start: () => Promise<void>;
  destroy: () => Promise<void>;

  onEvent?: (_: MetaApiCallbackPayload) => void;
}
