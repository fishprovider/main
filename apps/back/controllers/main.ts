import { destroyAsync, start as startCore } from '@fishprovider/core/dist/controllers/main';
import { mongo } from '@fishprovider/framework-mongo';
import { redis } from '@fishprovider/framework-redis';

import * as adapter from '~controllers/adapter';

const start = async () => {
  await startCore(adapter);
  await adapter.start();

  // Clean architecture
  await Promise.all([
    redis.start(),
    mongo.start(),
  ]);
};

const destroy = async () => {
  // Clean architecture
  await Promise.all([
    redis.stop(),
    mongo.stop(),
  ]);

  await destroyAsync(adapter);
};

export { destroy, start };
