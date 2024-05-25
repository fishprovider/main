import type { ConnectionType } from '~types/Connection.model';
import { sendRequest } from '~utils/url';

/*
{
  "id": "98349e92-dec0-408e-89c7-7e786b893549",
  "state": "DEPLOYED"
}
*/

interface NewAccountRes {
  id: string,
  state: string,
}

interface NewAccountOptions {
  name: string,
  platform?: string,
  login?: string,
  password?: string,
  server?: string,
  tags?: string[],
}

const newAccount = (
  connection: ConnectionType,
  options: NewAccountOptions,
) => sendRequest<NewAccountRes>({
  mode: 'provisioning',
  method: 'post',
  url: '/users/current/accounts',
  clientSecret: connection.clientSecret,
  data: {
    type: 'cloud-g2',
    region: 'london',
    manualTrades: true,
    magic: 0,

    platform: 'mt4',
    ...options,
  },
});

export default newAccount;

export type {
  NewAccountRes,
};
