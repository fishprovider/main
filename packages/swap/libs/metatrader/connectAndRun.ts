import type { Config } from '@fishbot/metatrader/types/Config.model';
import type { ConnectionType } from '@fishbot/metatrader/types/Connection.model';
import type { CallbackPayload } from '@fishbot/metatrader/types/Event.model';

import connect from './connect';

async function connectAndRun<T>({
  providerId, config, handler,
  onEvent = () => undefined,
}: {
  providerId: string,
  handler: (_: ConnectionType) => Promise<T>,
  config: Config,
  onEvent?: (_: CallbackPayload) => void,
}) {
  let result: T | undefined;

  const connection = await connect({
    providerId,
    config,
    onEvent,
  });

  try {
    result = await handler(connection);
  } finally {
    await connection.destroy();
  }

  return result;
}

export default connectAndRun;
