import { start as startSysInfo } from '@fishprovider/core/libs/sysinfo';

import {
  destroy as destroyPays,
  resume as resumePays,
  runPays,
  start as startPays,
  stop as stopPays,
} from '~services/pays';

import routes from './routes';

const status = async () => {
  Logger.warn('🎡 Status...');
};

const stop = async () => {
  Logger.warn('🧨 Stopping...');
  stopPays();
  Logger.warn('🧨 Stopped');
};

const resume = async () => {
  Logger.warn('🚗 Resuming...');
  resumePays();
  Logger.warn('🚗 Resumed');
};

const destroy = async () => {
  try {
    Logger.warn('💣 Destroying...');
    await destroyPays();
    Logger.warn('💣 Destroyed');
  } catch (err) {
    Logger.error('🔥 Failed to destroy', err);
  }
};

const start = async () => {
  try {
    Logger.info('⭐ Starting...');
    startSysInfo();
    await startPays();
    await runPays();
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

export {
  beforeShutdownHandlers,
  destroy,
  enableHeartbeat,
  enableLocalRemote,
  restart,
  resume,
  routes,
  start,
  status,
  stop,
};
