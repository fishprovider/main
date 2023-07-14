import { destroyAsync, start as startCore } from '@fishprovider/core/dist/controllers/main';

import * as adapter from '~controllers/adapter';
import { start as startAgenda } from '~controllers/agenda';

const env = {
  nodeEnv: process.env.NODE_ENV,
};

const start = async () => {
  await startCore(adapter);
  if (env.nodeEnv === 'production') {
    await startAgenda();
  }
  await adapter.start();
};

const destroy = async () => {
  await destroyAsync(adapter);
};

export { destroy, start };
