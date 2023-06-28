import Connection from '@fishbot/metatrader/Connection';
import type { Config } from '@fishbot/metatrader/types/Config.model';
import type { CallbackPayload } from '@fishbot/metatrader/types/Event.model';

const connect = async ({
  providerId, config: configRaw, onEvent,
}: {
  providerId: string,
  config: Config,
  onEvent: (_: CallbackPayload) => void,
}) => {
  const config = {
    ...configRaw,
    name: providerId,
  };
  const connection = new Connection(
    config,
    onEvent,
  );
  return connection;
};

export default connect;
