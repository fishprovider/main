import { destroyAsync, start as startCore } from '@fishprovider/core/dist/controllers/main';
import { mongo } from '@fishprovider/repository-mongo';

import * as adapter from '~controllers/adapter';

const start = async () => {
  // apiV3
  await mongo.start();

  await startCore(adapter);
  await adapter.start();
};

const destroy = async () => {
  await destroyAsync(adapter);

  // apiV3
  await mongo.stop();
};

export { destroy, start };
