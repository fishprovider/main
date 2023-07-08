import { destroyAsync, start as startCore } from '@fishprovider/core/controllers/main';

import * as adapter from '~controllers/adapter';
import { start as startAgenda } from '~controllers/agenda';

const start = async () => {
  await startCore(adapter);
  await startAgenda();
  await adapter.start();
};

const destroy = async () => {
  await destroyAsync(adapter);
};

export { destroy, start };
