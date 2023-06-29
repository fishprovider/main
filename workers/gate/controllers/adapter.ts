import { start as startSysInfo } from '@fishbot/core/libs/sysinfo';

import { startTelegramVerify } from '~libs/telebot';

import routes from './routes';

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
};

const start = async () => {
  try {
    Logger.info('⭐ Starting...');
    startSysInfo();
    await startTelegramVerify();
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
