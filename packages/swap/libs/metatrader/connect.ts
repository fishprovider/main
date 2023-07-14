import Connection from '@fishprovider/metatrader/dist/Connection';
import type { Config } from '@fishprovider/metatrader/dist/types/Config.model';
import type { CallbackPayload } from '@fishprovider/metatrader/dist/types/Event.model';

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
