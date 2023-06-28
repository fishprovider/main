import type { ConnectionType } from '~types/Connection.model';

const startAccount = async (
  connection: ConnectionType,
  accountId?: string,
) => {
  if (!connection.api) {
    throw new Error('api not found');
  }

  const accId = accountId || connection.accountId;
  if (!accId) {
    throw new Error('accountId not found');
  }

  const account = await connection.api.metatraderAccountApi.getAccount(accId);

  if (!['DEPLOYING', 'DEPLOYED'].includes(account.state)) {
    Logger.debug('Deploying account');
    await account.deploy();
    Logger.debug('Deployed account');
  }

  if (account.connectionStatus !== 'CONNECTED') {
    Logger.debug('Waiting connection');
    await account.waitConnected();
    Logger.debug('Connected');
  }
};

export default startAccount;
