import { destroyAsync, start as startCore } from '@fishprovider/core/dist/controllers/main';
import { cacheFirst } from '@fishprovider/framework-cache-first';

import * as adapter from '~controllers/adapter';

const start = async () => {
  await startCore(adapter);
  await adapter.start();

  // Clean architecture
  await cacheFirst.start();
};

const destroy = async () => {
  // Clean architecture
  await cacheFirst.stop();

  await destroyAsync(adapter);
};

export { destroy, start };
