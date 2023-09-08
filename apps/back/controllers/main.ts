import { destroyAsync, start as startCore } from '@fishprovider/core/dist/controllers/main';
import { startMongo, stopMongo } from '@fishprovider/libs';

import * as adapter from '~controllers/adapter';

const start = async () => {
  // apiV3
  await startMongo();

  await startCore(adapter);
  await adapter.start();
};

const destroy = async () => {
  await destroyAsync(adapter);

  // apiV3
  await stopMongo();
};

export { destroy, start };
