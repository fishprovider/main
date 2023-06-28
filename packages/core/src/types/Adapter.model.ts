import type { Router } from 'express';
import type { SessionOptions, Store } from 'express-session';
import type { Socket } from 'socket.io';

import type { BeforeShutdownListener } from './BeforeShutdownListener.model';

interface Adapter {
  status: () => Promise<void>;
  stop: () => Promise<void>;
  resume: () => Promise<void>;
  restart: ({ restartProcess }: { restartProcess?: boolean }) => Promise<void>;
  destroy: () => Promise<void>;

  enableHeartbeat?: boolean;
  enableLocalRemote?: boolean;

  corsOrigins?: string[];
  corsCredentials?: boolean;
  corsMethods?: string;

  sessionOptions?: Partial<SessionOptions>;

  routes?: (sessionStore: Store) => Router | Promise<Router>;

  socketMiddlewareHandler?: (socket: Socket, next: (err?: any) => void) => void;
  socketConnectHandler?: (socket: Socket) => void;
  socketDisconnectHandler?: (socket: Socket) => void;

  beforeShutdownHandlers?: BeforeShutdownListener[];
}

export type { Adapter };
