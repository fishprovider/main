import MetaApi from 'metaapi.cloud-sdk';

import type { Config } from '~types/Config.model';
import type { ConnectionType } from '~types/Connection.model';
import type { CallbackPayload } from '~types/Event.model';

class Connection implements ConnectionType {
  clientSecret: string;
  clientId: string;
  name?: string;
  accountId?: string;

  api?: MetaApi;

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
    // @ts-ignore esm
    // eslint-disable-next-line new-cap
    this.api = new MetaApi.default(this.clientSecret);
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
