import type { Adapter } from '~types/Adapter.model';

let _adapter: Adapter;

const initialize = (adapter: Adapter) => {
  try {
    if (adapter) {
      _adapter = adapter;
    } else {
      Logger.warn('Adapter not found');
    }
    Logger.info('Adapter initialized');
  } catch (err) {
    Logger.error(`🔥 Failed to start: ${err}`);
  }
};

const status = async () => {
  try {
    if (_adapter) {
      await _adapter.status();
    } else {
      Logger.warn('Adapter not found');
    }
    Logger.info('Adapter status checked');
  } catch (err) {
    Logger.error(`🔥 Failed to status: ${err}`);
  }
};

const stop = async () => {
  try {
    if (_adapter) {
      await _adapter.stop();
    } else {
      Logger.warn('Adapter not found');
    }
    Logger.info('Adapter stopped');
  } catch (err) {
    Logger.error(`🔥 Failed to stop: ${err}`);
  }
};

const resume = async () => {
  try {
    if (_adapter) {
      await _adapter.resume();
    } else {
      Logger.warn('Adapter not found');
    }
    Logger.info('Adapter resumed');
  } catch (err) {
    Logger.error(`🔥 Failed to resume: ${err}`);
  }
};

const restart = async ({ restartProcess }: { restartProcess?: boolean } = {}) => {
  try {
    if (_adapter) {
      await _adapter.restart({ restartProcess });
    } else {
      Logger.warn('Adapter not found');
    }
    Logger.info('Adapter restarted');
  } catch (err) {
    Logger.error(`🔥 Failed to restart: ${err}`);
  }
};

const destroy = async () => {
  try {
    if (_adapter) {
      await _adapter.destroy();
    } else {
      Logger.warn('Adapter not found');
    }
    Logger.info('Adapter destroyed');
  } catch (err) {
    Logger.error(`🔥 Failed to destroy: ${err}`);
  }
};

export {
  destroy, initialize, restart, resume, status, stop,
};
