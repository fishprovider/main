import type { PromiseCreator } from '@fishprovider/utils/dist/types/PromiseCreator.model';
import type WebSocket from 'ws';

interface ConnectionType {
  clientId: string;
  clientSecret: string;
  name?: string;

  onEvent: (_: any) => void;
  onError: (_: any) => void;
  onClose: () => void;

  socket?: WebSocket | undefined;
  listenKey?: string | undefined;
  pingInterval?: NodeJS.Timeout | undefined;
  destroyPromise?: PromiseCreator<void> | undefined;

  start: () => Promise<void>;
  destroy: () => Promise<void>;
}

export type {
  ConnectionType,
};
