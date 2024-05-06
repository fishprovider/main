import type { Config } from '@fishprovider/ctrader/dist/types/Config.model';
import type { CallbackPayload } from '@fishprovider/ctrader/dist/types/Event.model';
import fetchAccountInfo from '@fishprovider/swap/dist/commands/fetchAccountInfo';
import fetchOrders from '@fishprovider/swap/dist/commands/fetchOrders';
import authorizeAccount from '@fishprovider/swap/dist/libs/ctrader/authorizeAccount';
import connect from '@fishprovider/swap/dist/libs/ctrader/connect';
import renewTokensCTrader from '@fishprovider/swap/dist/libs/ctrader/renewTokens';
import delay from '@fishprovider/utils/dist/helpers/delay';
import _ from 'lodash';

import type { Client, ClientAccount } from '~types/Client.model';
import { getAccountConfig, getAccountConfigs } from '~utils/account';

import onEvent from './events';

const maxRequestPerSec = 50;

const clients: Record<string, Client> = {};

const isRenewingAccountIds: Record<string, boolean> = {};
let isRestarting = false;
let isWaitingRestart = false;

const setIsRestarting = (value: boolean) => {
  isRestarting = value;
};

const getIsRestarting = () => isRestarting;

const renewAccountTokens = async (client: Client, accounts: ClientAccount[]) => {
  const { connection } = client;
  if (!connection) return;

  const groupRefreshTokens = _.map(
    _.groupBy(accounts, (item) => (item.config).refreshToken),
    (groupAccounts, refreshToken) => ({
      refreshToken,
      groupAccountIds: _.compact(groupAccounts.map((item) => (item.config).accountId)),
    }),
  );

  for (const { refreshToken, groupAccountIds } of groupRefreshTokens) {
    groupAccountIds.forEach((accountId) => {
      isRenewingAccountIds[accountId] = true;
    });
    await renewTokensCTrader(connection, refreshToken).catch((err: any) => {
      Logger.error('Failed to renew tokens', refreshToken, groupAccountIds, err);
    });
    groupAccountIds.forEach((accountId) => {
      isRenewingAccountIds[accountId] = false;
    });
  }
};

const renewTokens = () => Promise.all(
  _.map(clients, (client) => renewAccountTokens(client, client.accounts)),
);

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
  const { accountId, accessToken, refreshToken } = config;
  if (!accountId || !accessToken || !refreshToken) {
    Logger.error(`Missing data for ${providerId}`);
    return;
  }

  Logger.debug(`Authorizing account ${providerId}, ${accountId}`);
  await authorizeAccount({
    connection, providerId, accountId, accessToken, refreshToken,
  });
};

const reloadData = async (client: Client, account: ClientAccount) => {
  const { connection } = client;
  if (!connection) return;

  const {
    _id: providerId, providerType, platform, config,
  } = account;
  const { accountId, accessToken, refreshToken } = config;
  if (!accountId || !accessToken || !refreshToken) {
    Logger.error(`Missing data for ${providerId}`);
    return;
  }

  await fetchAccountInfo({
    providerId,
    providerType,
    platform,
    options: {
      connection,
      accountId,
    },
  });
  await fetchOrders({
    providerId,
    providerType,
    platform,
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
  onAppDisconnect: async (reason?: string) => {
    Logger.warn('Connection onAppDisconnect, restarting now...', reason);
    const client = clients[clientId];
    if (!client) {
      Logger.warn(`Client not found ${clientId}`);
      return;
    }
    await restartClient(client);
  },
  onAccountDisconnect: async (accountId: string) => {
    if (isRenewingAccountIds[accountId]) {
      Logger.info(`[Skip] Account is renewing ${accountId}`);
      return;
    }

    const client = clients[clientId];
    if (!client) {
      Logger.warn(`Client not found ${clientId}`);
      return;
    }

    const { accounts } = client;
    const account = accounts.find((item) => item.config.accountId === accountId);
    if (!account) {
      Logger.warn(`Account not found ${accountId}`);
      return;
    }

    Logger.warn(`onAccountDisconnect ${accountId} ${account?._id}`);
    await startAccount(client, account);
    await reloadData(client, account);
    Logger.warn(`onAccountDisconnect restarted ${accountId} ${account?._id}`);
  },
  onTokenInvalid: async (accountIds: string[], reason: string) => {
    const [accountIdsToSkip, accountIdsToRenew] = _.partition(
      accountIds,
      (accountId) => isRenewingAccountIds[accountId],
    );
    if (accountIdsToSkip.length) {
      Logger.info(`[Skip] Accounts are renewing ${accountIdsToSkip}`);
      return;
    }

    if (!accountIdsToRenew.length) {
      return;
    }

    Logger.warn(`onTokenInvalid: ${accountIdsToRenew}, ${reason}`);

    const client = clients[clientId];
    if (!client) {
      Logger.warn(`Client not found ${clientId}`);
      return;
    }

    const { accounts } = client;
    const accountsToRenew = accounts.filter((item) => item.config.accountId
      && accountIdsToRenew.includes(item.config.accountId));
    await renewAccountTokens(client, accountsToRenew);

    for (const account of accountsToRenew) {
      await startAccount(client, account);
      await reloadData(client, account);
    }
    Logger.warn(`onTokenInvalid restarted: ${accountIdsToRenew}`);
  },
});

const startClient = async (client: Client) => {
  const { clientId, config, accounts } = client;

  // eslint-disable-next-line no-param-reassign
  client.connection = await connect({
    providerId: clientId,
    config,
    onEvent: (payload: CallbackPayload) => onEventHandler(payload, clientId),
    onError: (err: any) => {
      if (isWaitingRestart) {
        Logger.warn('Connection error, waiting to restart...', err);
        return;
      }
      Logger.warn('Connection error, restarting now...', err);
      isWaitingRestart = true;
      setTimeout(() => {
        isWaitingRestart = false;
        const clientToRestart = clients[clientId];
        if (!clientToRestart) {
          Logger.warn(`Client not found ${clientId}`);
          return;
        }
        restartClient(clientToRestart);
      }, 1000 * 60 * 5);
    },
    onClose: () => {
      if (isWaitingRestart) {
        Logger.warn('Connection closed, waiting to restart...');
        return;
      }
      Logger.warn('Connection closed, restarting now...');
      isWaitingRestart = true;
      setTimeout(() => {
        isWaitingRestart = false;
        const clientToRestart = clients[clientId];
        if (!clientToRestart) {
          Logger.warn(`Client not found ${clientId}`);
          return;
        }
        restartClient(clientToRestart);
      }, 1000 * 60 * 5);
    },
  });

  for (const account of accounts) {
    await startAccount(client, account)
      .catch((err: any) => {
        Logger.error(`Failed to start account ${account._id}`, err);
      });
    await delay(1000 / +maxRequestPerSec);
  }
  Logger.info(`Started ${accounts.length} accounts ${clientId.substring(0, 4)}...`);

  for (const account of accounts) {
    await reloadData(client, account)
      .catch((err: any) => {
        Logger.error(`Failed to reload account ${account._id}`, err);
      });
    await delay(1000 / +maxRequestPerSec);
  }
  Logger.info(`Reloaded ${accounts.length} accounts ${clientId.substring(0, 4)}...`);
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
      delete config.accessToken;
      delete config.refreshToken;
      clients[clientId] = {
        clientId,
        config,
        accounts,
      };
    },
  );

  await Promise.all(_.map(clients, startClient));
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

  const index = client.accounts.findIndex((item) => item._id === providerId);
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
  renewTokens,
  setIsRestarting,
  start,
  startOne,
};
