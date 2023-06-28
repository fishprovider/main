import type { ConnectionType } from '~types/Connection.model';
import { sendRequest } from '~utils/url';

interface RemoveAccountRes {
  id?: string,
  error?: string,
  message?: string,
  code?: number,
  details?: any,
  arguments?: any[],
}

const removeAccount = (
  connection: ConnectionType,
  accountId?: string,
) => sendRequest<RemoveAccountRes>({
  mode: 'provisioning',
  method: 'delete',
  url: `/users/current/accounts/${accountId || connection.accountId}`,
  clientSecret: connection.clientSecret,
});

export default removeAccount;

export type {
  RemoveAccountRes,
};
