import { startCacheFirst, stopCacheFirst } from '@fishprovider/database';
import { destroyAsync, start as startCore } from '@fishprovider/old-core/dist/controllers/main';

import * as adapter from '~controllers/adapter';

const start = () => Promise.all([
  startCacheFirst(), // new
  (async () => {
    await startCore(adapter);
    await adapter.start();
  })(),
]);

const destroy = () => Promise.all([
  stopCacheFirst(), // new
  destroyAsync(adapter),
]);

export { destroy, start };
