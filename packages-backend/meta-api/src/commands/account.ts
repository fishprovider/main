import type { MetatraderAccountInformation } from 'metaapi.cloud-sdk';

import { MetaApiListener, sendRequest, TMetaApiConnection } from '..';

/*
{
  platform: 'mt4',
  broker: 'Exness Technologies Ltd',
  currency: 'USD',
  server: 'Exness-Trial8',
  balance: 956.34,
  equity: 916.53,
  margin: 46.09,
  freeMargin: 870.44,
  leverage: 50,
  marginLevel: 1988.5658494250379,
  name: 'Dev Pro',
  login: 69291513,
  credit: 0,
  tradeAllowed: true,
  investorMode: false,
  marginMode: 'ACCOUNT_MARGIN_MODE_RETAIL_HEDGING',
  type: 'ACCOUNT_TRADE_MODE_CONTEST'
}
*/
export const getAccountInformation = async (
  connection: TMetaApiConnection,
  accountId?: string,
) => {
  const res = await sendRequest<MetatraderAccountInformation>({
    url: `/users/current/accounts/${accountId || connection.accountId}/accountInformation`,
    clientSecret: connection.clientSecret,
  });
  return res;
};

export const startAccount = async (
  connection: TMetaApiConnection,
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
    await account.deploy();
  }

  if (account.connectionStatus !== 'CONNECTED') {
    await account.waitConnected();
  }
};

export const stopAccount = async (
  connection: TMetaApiConnection,
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

export const removeAccount = (
  connection: TMetaApiConnection,
  accountId?: string,
) => sendRequest<{
  id?: string,
  error?: string,
  message?: string,
  code?: number,
  details?: any,
  arguments?: any[],
}>({
  mode: 'provisioning',
  method: 'delete',
  url: `/users/current/accounts/${accountId || connection.accountId}`,
  clientSecret: connection.clientSecret,
});

/*
{
  "id": "98349e92-dec0-408e-89c7-7e786b893549",
  "state": "DEPLOYED"
}
*/
export const newAccount = (
  connection: TMetaApiConnection,
  options: {
    name?: string,
    login?: string,
    password?: string,
    platform?: string,
    server?: string,
    tags?: string[],
  },
) => sendRequest<{
  id: string,
  state: string,
}>({
  mode: 'provisioning',
  method: 'post',
  url: '/users/current/accounts',
  clientSecret: connection.clientSecret,
  data: {
    type: 'cloud-g2',
    region: 'new-york',
    manualTrades: true,
    magic: 0,

    platform: 'mt4',
    ...options,
  },
});

export const subAccount = async (
  connection: TMetaApiConnection,
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

  const listener = new MetaApiListener(account.id, connection.onEvent);
  stream.addSynchronizationListener(listener);

  await stream.connect();
  await stream.waitSynchronized({});
};
