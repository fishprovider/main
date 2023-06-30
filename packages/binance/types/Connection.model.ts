import type WebSocket from 'ws';

import type { PromiseCreator } from '~types/PromiseCreator.model';

interface ConnectionType {
  clientId: string;
  clientSecret: string;
  name?: string;

  onEvent: (_: any) => void;
  onError: (_: any) => void;
  onClose: () => void;

  socket?: WebSocket | undefined;
  listenKey?: string | undefined;
  pingInterval?: NodeJS.Timer | undefined;
  destroyPromise?: PromiseCreator<void> | undefined;

  start: () => Promise<void>;
  destroy: () => Promise<void>;
}

export type {
  ConnectionType,
};
