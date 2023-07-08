import { start as startSysInfo } from '@fishprovider/core/libs/sysinfo';

import {
  destroy as destroyProvider, resume as resumeProvider,
  runCopiers,
  start as startProvider, status as statusProvider,
  stop as stopProvider,
} from '~services/provider';

const status = async () => {
  Logger.warn(`🎡 Status: ${statusProvider()}`);
};

const stop = async () => {
  Logger.warn('🧨 Stopping...');
  stopProvider();
  Logger.warn('🧨 Stopped');
};

const resume = async () => {
  Logger.warn('🚗 Resuming...');
  resumeProvider();
  Logger.warn('🚗 Resumed');
};

const destroy = async () => {
  try {
    Logger.warn('💣 Destroying...');
    await destroyProvider();
    Logger.warn('💣 Destroyed');
  } catch (err) {
    Logger.error('🔥 Failed to destroy', err);
  }
};

const start = async () => {
  try {
    Logger.info('⭐ Starting...');
    startSysInfo();
    await startProvider();
    await runCopiers(true);
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
  start,
  status,
  stop,
};
