import * as Sentry from '@sentry/node';
import compression from 'compression';
import RedisSession from 'connect-redis';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import session from 'express-session';
import type { Server as ServerHttp } from 'http';
import { createServer as createServerHttp } from 'http';
import type { Server as ServerHttps } from 'https';
import { createServer as createServerHttps } from 'https';
import { Server as ServerSocket, ServerOptions } from 'socket.io';

import type { Adapter } from '~types/Adapter.model';

const env = {
  sentryDsn: process.env.SENTRY_DSN,
  port: process.env.PORT || '3000',

  api: process.env.API || '/api',
  apiPass: process.env.API_PASS || 'fishprovider',

  socketTransports: process.env.SOCKET_TRANSPORTS || 'webtransport,websocket,polling',

  httpsEnabled: process.env.HTTPS_ENABLED,
  httpsKey: process.env.HTTPS_KEY,
  httpsCert: process.env.HTTPS_CERT,
  httpsCA: process.env.HTTPS_CA,

  uploadLimit: process.env.UPLOAD_LIMIT || 100 * 1024 * 1024, // 100mb
};

let webServer: ServerHttp | ServerHttps | undefined;

const start = async (adapter: Adapter) => {
  const app = express();

  if (env.sentryDsn) {
    Sentry.init({
      dsn: env.sentryDsn,
      integrations: [
      // enable HTTP calls tracing
        new Sentry.Integrations.Http({ tracing: true }),
        // enable Express.js middleware tracing
        new Sentry.Integrations.Express({ app }),
        // Automatically instrument Node.js libraries and frameworks
        ...Sentry.autoDiscoverNodePerformanceMonitoringIntegrations(),
      ],

      // Set tracesSampleRate to 1.0 to capture 100%
      // of transactions for performance monitoring.
      // We recommend adjusting this value in production
      tracesSampleRate: 1.0,
    });
  }

  if (env.httpsEnabled) {
    const options = {
      key: env.httpsKey,
      cert: env.httpsCert,
      ca: env.httpsCA,
    };
    webServer = createServerHttps(options, app);
  } else {
    webServer = createServerHttp(app);
  }

  const corsOptions = {
    origin: adapter.corsOrigins || true,
    credentials: adapter.corsCredentials || false,
    methods: adapter.corsMethods || 'GET,POST,OPTIONS',
  };

  const ioServer = new ServerSocket(webServer, {
    transports: env.socketTransports.split(',') as ServerOptions['transports'],
    cors: corsOptions,
  });

  const sessionStore = new RedisSession({ client: Redis });

  const sessionMiddleware = session({
    store: sessionStore,
    resave: false, // disable save session on each request
    saveUninitialized: false, // disable save empty session
    rolling: true, // reset cookie maxAge on each request
    secret: env.apiPass,
    proxy: true,
    cookie: {
      maxAge: 1000 * 3600 * 24 * 7, // 7 days
    },
    ...adapter.sessionOptions,
  });

  //
  // middlewares
  //

  app.use(express.static('public'));
  app.use(cors(corsOptions));
  app.use(express.json({ limit: env.uploadLimit }));
  app.use(express.urlencoded({ extended: false, limit: env.uploadLimit }));
  app.use(sessionMiddleware);
  app.use(compression());

  if (env.sentryDsn) {
    // RequestHandler creates a separate execution context, so that all
    // transactions/spans/breadcrumbs are isolated across requests
    app.use(Sentry.Handlers.requestHandler());
    // TracingHandler creates a trace for every incoming request
    app.use(Sentry.Handlers.tracingHandler());
  }

  //
  // routes
  //

  if (adapter.routes) {
    const routes = await adapter.routes(sessionStore);
    app.use(env.api, routes);
  }

  // The error handler must be before any other error middleware and after all controllers
  app.use(Sentry.Handlers.errorHandler());

  app.use((_, res) => {
    res.status(404).send('Route not found');
  });

  //
  // socket
  //

  ioServer.use((socket, next) => {
    sessionMiddleware(socket.request as Request, {} as Response, next as NextFunction);
  });

  ioServer.use((socket, next) => {
    if (adapter.socketMiddlewareHandler) {
      adapter.socketMiddlewareHandler(socket, next);
    } else {
      next();
    }
  });

  ioServer.on('connection', (socket) => {
    if (adapter.socketConnectHandler) {
      adapter.socketConnectHandler(socket);
    }
    socket.on('disconnect', () => {
      if (adapter.socketDisconnectHandler) {
        adapter.socketDisconnectHandler(socket);
      }
    });
  });

  //
  // start
  //

  webServer.listen(env.port, () => {
    Logger.info(`Server listening on port: ${env.port} 🛡️`);
  });

  global.SocketIO = ioServer;
};

const destroy = () => {
  console.log('Express destroying...');
  if (webServer) {
    webServer.close();
    webServer = undefined;
  }
  console.log('Express destroying...');
};

export { destroy, start };
