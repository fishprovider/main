import { fishApi } from '@fishprovider/fish-api';
import { local } from '@fishprovider/local';

const start = async (params: {
  baseURL?: string,
  logDebug?: (...args: any[]) => void
  logError?: (...args: any[]) => void
}) => {
  await Promise.all([
    local.start(),
    fishApi.start(params),
  ]);
  console.info('Started offlineFirst.framework');
};

const stop = async () => {
  await Promise.all([
    fishApi.stop(),
    local.stop(),
  ]);
  console.info('Stopped offlineFirst.framework');
};

const get = async () => ({
  local: await local.get(),
  fishApi: await fishApi.get(),
});

export const offlineFirst = {
  start,
  stop,
  get,
};
