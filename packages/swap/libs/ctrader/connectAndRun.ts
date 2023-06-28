import type { Config } from '@fishbot/ctrader/types/Config.model';
import type { ConnectionType } from '@fishbot/ctrader/types/Connection.model';
import type { CallbackPayload } from '@fishbot/ctrader/types/Event.model';

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
    onError: (err: any) => console.error(`[${providerId}] Connection error`, err),
    onClose: () => console.log(`[${providerId}] Connection closed`),
  });

  try {
    result = await handler(connection);
  } finally {
    await connection.destroy();
  }

  return result;
}

export default connectAndRun;
