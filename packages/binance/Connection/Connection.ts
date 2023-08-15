import type { PromiseCreator } from '@fishprovider/utils/dist/types/PromiseCreator.model';
import type WebSocket from 'ws';

import type { Config } from '~types/Config.model';
import type { ConnectionType } from '~types/Connection.model';

class Connection implements ConnectionType {
  name: string;
  clientId: string;
  clientSecret: string;

  onEvent: (_: any) => void;
  onError: (_: any) => void;
  onClose: () => void;

  socket: WebSocket | undefined;
  listenKey: string | undefined;
  pingInterval: NodeJS.Timeout | undefined;
  destroyPromise: PromiseCreator<void> | undefined;

  constructor(
    config: Config,
    onEvent: (_: any) => void,
    onError: (_: any) => void,
    onClose: () => void,
  ) {
    const { clientId, clientSecret } = config;
    this.clientId = clientId;
    this.clientSecret = clientSecret;

    this.onEvent = onEvent;
    this.onError = onError;
    this.onClose = onClose;

    this.name = clientId;
  }

  async start() {
    Logger.debug(`Started ${this.name}`);
  }

  async destroy() {
    Logger.debug(`Destroyed ${this.name}`);
  }
}

export default Connection;
