import type TMetaApi from 'metaapi.cloud-sdk';
import { createRequire } from 'module';

import type { Config } from '~types/Config.model';
import type { ConnectionType } from '~types/Connection.model';
import type { CallbackPayload } from '~types/Event.model';

const require = createRequire(import.meta.url);
const MetaApi = require('metaapi.cloud-sdk').default;

class Connection implements ConnectionType {
  clientSecret: string;
  clientId: string;
  name?: string;
  accountId?: string;

  api?: TMetaApi;

  onEvent?: (_: CallbackPayload) => void;

  constructor(
    config: Config,
    onEvent?: (_: CallbackPayload) => void,
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
    Logger.debug(`Starting ${this.name}`);
    this.api = new MetaApi(this.clientSecret);
    Logger.debug(`Started ${this.name}`);
  }

  async destroy() {
    Logger.debug(`Destroying ${this.name}`);
    if (this.api) {
      this.api.close();
    }
    Logger.debug(`Destroyed ${this.name}`);
  }
}

export default Connection;
