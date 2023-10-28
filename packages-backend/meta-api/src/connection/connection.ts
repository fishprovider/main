import type TMetaApi from 'metaapi.cloud-sdk';
import { createRequire } from 'module';

import { MetaApiCallbackPayload, MetaApiConfig, TMetaApiConnection } from '..';

const require = createRequire(import.meta.url);
const MetaApi = require('metaapi.cloud-sdk').default;

export class Connection implements TMetaApiConnection {
  clientSecret: string;
  clientId: string;
  name?: string;
  accountId?: string;

  api?: TMetaApi;

  onEvent?: (_: MetaApiCallbackPayload) => void;

  constructor(
    config: MetaApiConfig,
    onEvent?: (_: MetaApiCallbackPayload) => void,
  ) {
    const {
      clientId, clientSecret, name, accountId,
    } = config;
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.name = name || accountId || clientId;
    this.accountId = accountId;

    this.onEvent = onEvent;
  }

  async start() {
    this.api = new MetaApi(this.clientSecret);
  }

  async destroy() {
    if (this.api) {
      this.api.close();
    }
  }
}
