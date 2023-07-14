import { destroyAsync, start as startCore } from '@fishprovider/core/dist/controllers/main';

import * as adapter from '~controllers/adapter';

const start = async () => {
  await startCore(adapter);
  await adapter.start();
};

const destroy = async () => {
  await destroyAsync(adapter);
};

export { destroy, start };
