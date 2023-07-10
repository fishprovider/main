import startAccountMetaTrader from '@fishprovider/metatrader/commands/startAccount';
import subAccount from '@fishprovider/metatrader/commands/subAccount';
import type { Config } from '@fishprovider/metatrader/types/Config.model';
import type { CallbackPayload } from '@fishprovider/metatrader/types/Event.model';
import fetchAccountInfo from '@fishprovider/swap/commands/fetchAccountInfo';
import fetchOrders from '@fishprovider/swap/commands/fetchOrders';
import connect from '@fishprovider/swap/libs/metatrader/connect';
import delay from '@fishprovider/utils/helpers/delay';
import _ from 'lodash';

import type { Client, ClientAccount } from '~types/Client.model';
import { getAccountConfig, getAccountConfigs } from '~utils/account';

import onEvent from './events';

const maxRequestPerSec = 50;

const clients: Record<string, Client> = {};

let isRestarting = false;

const setIsRestarting = (value: boolean) => {
  isRestarting = value;
};

const getIsRestarting = () => isRestarting;

const destroyClient = async (client: Client) => {
  const connectionToClose = client.connection;
  // eslint-disable-next-line no-param-reassign
  client.connection = undefined;
  if (connectionToClose) {
    await connectionToClose.destroy();
  }
};

const destroy = () => Promise.all(_.map(clients, destroyClient));

const startAccount = async (client: Client, account: ClientAccount) => {
  const { connection } = client;
  if (!connection) return;

  const { _id: providerId, config } = account;
  const { accountId } = config;
  if (!accountId) {
    Logger.error(`Missing data for ${providerId}`);
    return;
  }

  Logger.debug(`Authorizing account ${providerId}, ${accountId}`);
  await startAccountMetaTrader(connection, accountId);
  await subAccount(connection, accountId);
};

const reloadData = async (client: Client, account: ClientAccount) => {
  const { connection } = client;
  if (!connection) return;

  const {
    _id: providerId, config, providerType, providerPlatform,
  } = account;
  const { accountId } = config;
  if (!accountId) {
    Logger.error(`Missing data for ${providerId}`);
    return;
  }

  await fetchAccountInfo({
    providerId,
    providerType,
    providerPlatform,
    options: {
      connection,
      accountId,
    },
  });
  await fetchOrders({
    providerId,
    providerType,
    providerPlatform,
    options: {
      connection,
      accountId,
      updateClosedOrders: true,
    },
  });
  Logger.debug(`Reloaded account ${providerId}, ${accountId}`);
};

const restartClient = async (client: Client) => {
  try {
    if (getIsRestarting()) {
      Logger.warn('Skip manually restarting!');
      return;
    }
    Logger.warn('Manually restarting...');
    await destroyClient(client);
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    await startClient(client);
    Logger.warn('Manually restarted');
  } catch (err) {
    Logger.error('Failed to manually restart', err);
  }
};

const onEventHandler = (payload: CallbackPayload, clientId: string) => onEvent({
  payload,
  getAccount: (accountId) => clients[clientId]?.accounts
    .find((item) => item.config.accountId === accountId),
  getConnection: () => clients[clientId]?.connection,
  onAppDisconnect: async () => {
    Logger.warn('Connection onAppDisconnect, restarting now...');
    const client = clients[clientId];
    if (!client) {
      Logger.warn(`Client not found ${clientId}`);
      return;
    }
    await restartClient(client);
  },
});

const startClient = async (client: Client) => {
  const { clientId, config, accounts } = client;

  // eslint-disable-next-line no-param-reassign
  client.connection = await connect({
    providerId: clientId,
    config,
    onEvent: (payload: CallbackPayload) => onEventHandler(payload, clientId),
  });
  await client.connection.start();

  for (const account of accounts) {
    await startAccount(client, account)
      .catch((err: any) => {
        Logger.error(`Failed to start account ${account._id}`, err);
      });
    await delay(1000 / +maxRequestPerSec);
  }
  Logger.warn(`Started ${accounts.length} accounts ${clientId.substring(0, 10)}...`);

  for (const account of accounts) {
    await reloadData(client, account)
      .catch((err: any) => {
        Logger.error(`Failed to reload account ${account._id}`, err);
      });
    await delay(1000 / +maxRequestPerSec);
  }
  Logger.warn(`Reloaded ${accounts.length} accounts ${clientId.substring(0, 10)}...`);
};

const start = async () => {
  const accountConfigs = await getAccountConfigs();
  _.forEach(
    _.groupBy(accountConfigs, (item) => item.config.clientId),
    (accounts, clientId) => {
      const config = {
        ...(accounts[0]?.config as Config),
        name: clientId,
      };
      delete config.accountId;
      clients[clientId] = {
        clientId,
        config,
        accounts,
      };
    },
  );

  Logger.warn(`Starting ${clients.length} clients...`);
  await Promise.all(_.map(clients, startClient));
  Logger.warn(`Started ${clients.length} clients...`);
};

const startOne = async (providerId: string) => {
  const account = await getAccountConfig(providerId);
  if (!account) {
    Logger.debug(`Account not found ${providerId}`);
    return;
  }

  const { clientId } = account.config;
  if (!clients[clientId]) {
    const config = {
      ...(account.config as Config),
      name: clientId,
    };
    delete config.accountId;
    clients[clientId] = {
      clientId,
      config,
      accounts: [],
    };
  }

  const client = clients[clientId];
  if (!client) {
    Logger.warn(`Client not found ${clientId}`);
    return;
  }

  client.accounts.push(account);

  Logger.warn(`📥 Staring new account ${providerId}`);
  await startAccount(client, account)
    .catch((err: any) => {
      Logger.warn(`Failed to start account ${providerId}`, err);
    });
  await reloadData(client, account)
    .catch((err: any) => {
      Logger.warn(`Failed to reload account ${providerId}`, err);
    });
  Logger.warn(`Started new account ${providerId}`);
};

const destroyOne = async (providerId: string) => {
  const account = await getAccountConfig(providerId);
  if (!account) {
    Logger.debug(`Account not found ${providerId}`);
    return;
  }

  const { clientId } = account.config;
  const client = clients[clientId];
  if (!client) {
    Logger.warn(`Client not found ${clientId}`);
    return;
  }

  const { connection, accounts } = client;
  if (!connection) return;

  const index = accounts.findIndex((item) => item._id === providerId);
  if (index === -1) {
    Logger.debug(`Account not found ${providerId}`);
    return;
  }

  Logger.warn(`📥 Destroying account ${providerId}`);
  delete client.accounts[index];
};

export {
  destroy,
  destroyOne,
  getIsRestarting,
  setIsRestarting,
  start,
  startOne,
};
