import Listener from '~Connection/events';
import type { ConnectionType } from '~types/Connection.model';

const subAccount = async (
  connection: ConnectionType,
  accountId?: string,
) => {
  if (!connection.api) {
    throw new Error('api not found');
  }
  if (!connection.onEvent) {
    throw new Error('onEvent not found');
  }

  const accId = accountId || connection.accountId;
  if (!accId) {
    throw new Error('accountId not found');
  }

  const account = await connection.api.metatraderAccountApi.getAccount(accId);

  const stream = account.getStreamingConnection();

  const listener = new Listener(account.id, connection.onEvent);
  stream.addSynchronizationListener(listener);

  await stream.connect();
  await stream.waitSynchronized({});
};

export default subAccount;
