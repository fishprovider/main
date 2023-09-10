import { startCacheFirst, stopCacheFirst } from '@fishprovider/database';
import { destroyAsync, start as startCore } from '@fishprovider/old-core/dist/controllers/main';

import * as adapter from '~controllers/adapter';

const start = async () => {
  // apiV3
  await startCacheFirst();

  await startCore(adapter);
  await adapter.start();
};

const destroy = async () => {
  await destroyAsync(adapter);

  // apiV3
  await stopCacheFirst();
};

export { destroy, start };
