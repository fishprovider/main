import { destroyAsync, start as startCore } from '@fishprovider/core/dist/controllers/main';
import { cacheFirst } from '@fishprovider/framework-cache-first';

import * as adapter from '~controllers/adapter';

const start = async () => {
  // Clean architecture
  await cacheFirst.start();

  await startCore(adapter);
  await adapter.start();
};

const destroy = async () => {
  await destroyAsync(adapter);

  // Clean architecture
  await cacheFirst.stop();
};

export { destroy, start };
