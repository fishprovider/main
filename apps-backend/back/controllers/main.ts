import { startDataAccess, stopDataAccess } from '@fishprovider/data-access';
import { destroyAsync, start as startCore } from '@fishprovider/old-core/dist/controllers/main';

import * as adapter from '~controllers/adapter';

const start = () => Promise.all([
  startDataAccess(), // new
  (async () => {
    await startCore(adapter);
    await adapter.start();
  })(),
]);

const destroy = () => Promise.all([
  stopDataAccess(), // new
  destroyAsync(adapter),
]);

export { destroy, start };
