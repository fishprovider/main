import type WebSocket from 'ws';

import type { Config } from '~types/Config.model';
import type { ConnectionType } from '~types/Connection.model';
import type { PromiseCreator } from '~types/PromiseCreator.model';

class Connection implements ConnectionType {
  /* eslint-disable @typescript-eslint/lines-between-class-members */
  name: string;
  clientId: string;
  clientSecret: string;

  onEvent: (_: any) => void;
  onError: (_: any) => void;
  onClose: () => void;

  socket: WebSocket | undefined;
  listenKey: string | undefined;
  pingInterval: NodeJS.Timer | undefined;
  destroyPromise: PromiseCreator<void> | undefined;
  /* eslint-enable @typescript-eslint/lines-between-class-members */

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
