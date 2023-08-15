import type { PromiseCreator } from '@fishprovider/utils/dist/types/PromiseCreator.model';
import type WebSocket from 'ws';

interface ConnectionType {
  clientId: string;
  clientSecret: string;
  name?: string;

  onEvent: (_: any) => void;
  onError: (_: any) => void;
  onClose: () => void;

  socket?: WebSocket;
  listenKey?: string;
  pingInterval?: NodeJS.Timeout;
  destroyPromise?: PromiseCreator<void>;

  start: () => Promise<void>;
  destroy: () => Promise<void>;
}

export type {
  ConnectionType,
};
