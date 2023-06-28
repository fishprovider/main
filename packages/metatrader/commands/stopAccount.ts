import type { ConnectionType } from '~types/Connection.model';

const stopAccount = async (
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

  await account.undeploy();
  await account.waitUndeployed();
};

export default stopAccount;
