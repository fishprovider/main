import { start as startSysInfo } from '@fishprovider/core/libs/sysinfo';

import {
  destroy as destroyProvider, getIsRestarting, setIsRestarting, start as startProvider,
} from '~services/provider';

const status = async () => {
  Logger.warn('🎡 Status..');
};

const stop = async () => {
  Logger.warn('🧨 Stopping...');
};

const resume = async () => {
  Logger.warn('🚗 Resuming...');
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
    if (getIsRestarting()) {
      Logger.warn('⌛ Skip restarting!');
      return;
    }
    setIsRestarting(true);
    Logger.warn('⌛ Restarting...');
    await destroy();
    await start();
    Logger.warn('⌛ Restarted');
    setIsRestarting(false);
  } catch (err) {
    Logger.error('🔥 Failed to restart', err);
    setIsRestarting(false);
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
