import { start as startSysInfo } from '@fishbot/core/libs/sysinfo';

import routes from './routes';
import { socketConnectHandler, socketDisconnectHandler, socketMiddlewareHandler } from './sockets';
import { destroy as destroyRedisSub, start as startRedisSub } from './sockets/redis';

const env = {
  nodeEnv: process.env.NODE_ENV,
  corsOrigins: process.env.CORS_ORIGINS,
  domainDev: process.env.DOMAIN_DEV || 'localhost',
};

const status = async () => {
  Logger.warn('🎡 Status...');
};

const stop = async () => {
  Logger.warn('🧨 Stopping...');
};

const resume = async () => {
  Logger.warn('🚗 Resuming...');
};

const destroy = async () => {
  Logger.warn('💣 Destroying...');
  await destroyRedisSub();
  Logger.warn('💣 Destroyed');
};

const start = async () => {
  try {
    Logger.info('⭐ Starting...');
    startSysInfo();
    await startRedisSub();
    Logger.info('⭐ Started');
  } catch (err) {
    Logger.error(`🔥 Failed to start: ${err}`);
  }
};

const restart = async ({ restartProcess }: { restartProcess?: boolean }) => {
  try {
    if (restartProcess) {
      Logger.warn('⌛ Restarting process...');
      process.exit(1);
    }
    Logger.warn('⌛ Restarting...');
    await destroy();
    await start();
    Logger.warn('⌛ Restarted');
  } catch (err) {
    Logger.error('🔥 Failed to restart', err);
  }
};

const enableHeartbeat = true;
const enableLocalRemote = true;

const beforeShutdownHandlers = [destroy];

const corsCredentials = true;
const corsOrigins = env.corsOrigins?.split(',');

const sessionOptions = {
  cookie: {
    maxAge: 1000 * 3600 * 24 * 7, // 7 days
    httpOnly: true,
    sameSite: true,
    ...(env.nodeEnv === 'production' ? {
      secure: true,
      domain: '.fishprovider.com',
    } : {
      domain: env.domainDev,
    }),
  },
};

export {
  beforeShutdownHandlers,
  corsCredentials,
  corsOrigins,
  destroy,
  enableHeartbeat,
  enableLocalRemote,
  restart,
  resume,
  routes,
  sessionOptions,
  socketConnectHandler,
  socketDisconnectHandler,
  socketMiddlewareHandler,
  start,
  status,
  stop,
};
