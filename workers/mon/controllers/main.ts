import { destroyAsync, start as startCore } from '@fishbot/core/controllers/main';

import * as adapter from '~controllers/adapter';
import { start as startAgenda } from '~controllers/agenda';
import writeHeartbeatFile from '~services/writeHeartbeatFile';

const start = async () => {
  writeHeartbeatFile();
  await startCore(adapter);
  await startAgenda();
  await adapter.start();
};

const destroy = async () => {
  await destroyAsync(adapter);
};

export { destroy, start };
