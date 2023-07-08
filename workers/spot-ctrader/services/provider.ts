import getSymbolList from '@fishprovider/ctrader/commands/getSymbolList';
import type { Config } from '@fishprovider/ctrader/types/Config.model';
import type { ConnectionType } from '@fishprovider/ctrader/types/Connection.model';
import type { CallbackPayload } from '@fishprovider/ctrader/types/Event.model';
import connect from '@fishprovider/swap/libs/ctrader/connect';
import renewTokensCTrader from '@fishprovider/swap/libs/ctrader/renewTokens';
import type { SymbolCTrader } from '@fishprovider/swap/types/Symbol.model';
import type { ProviderType } from '@fishprovider/utils/constants/account';
import type { Account } from '@fishprovider/utils/types/Account.model';

import { startSubs, stopSubs } from '~services/handleSubs';
import { spotTasks } from '~utils/tasks';

import onEvent, { destroy as destroyEventHandler, start as startEventHandler } from './events';
import { startPolls, stopPolls } from './handlePolls';
import renewSymbolsHandler from './renewSymbols';
import updateAssets from './updateAssets';
import updateLastBars from './updateLastBars';

const env = {
  typeId: process.env.TYPE_ID || '',
  nodeEnv: process.env.NODE_ENV,
  skipPattern: process.env.SKIP_PATTERN || '',
  watchPattern: process.env.WATCH_PATTERN || '',
};

let account: Account | null;
let connection: ConnectionType | undefined;
let allSymbols: SymbolCTrader[] = [];
let isRenewing = false;
let isRestarting = false;
let isWaitingRestart = false;

const setIsRestarting = (value: boolean) => {
  isRestarting = value;
};

const getIsRestarting = () => isRestarting;

const renewSymbols = () => renewSymbolsHandler(allSymbols);

const renewTokens = async () => {
  if (!connection) {
    Logger.error('connection not found');
    return;
  }

  const { accountId, accessToken, refreshToken } = connection;
  if (!accountId) {
    Logger.warn('No accountId');
    return;
  }
  if (!accessToken || !refreshToken) {
    Logger.error(`Missing accessToken or refreshToken ${accountId}`);
    return;
  }

  isRenewing = true;
  const tokens = await renewTokensCTrader(connection, refreshToken);
  isRenewing = false;

  connection.accessToken = tokens.accessToken;
  connection.refreshToken = tokens.refreshToken;
};

const destroy = async () => {
  if (connection) {
    const connectionToClose = connection;
    connection = undefined;

    if (spotTasks.price) {
      await stopSubs(connectionToClose, allSymbols);
    }
    if (spotTasks.poll) {
      await stopPolls(connectionToClose);
    }
    await destroyEventHandler();
    await connectionToClose.destroy();
  }
  account = null;
};

const onEventHandler = (
  providerType: ProviderType,
  payload: CallbackPayload,
  restart: () => Promise<void>,
) => onEvent({
  providerType,
  payload,
  getConnection: () => connection,
  onAppDisconnect: async (reason?: string) => {
    Logger.warn('Connection onAppDisconnect, restarting now...', reason);
    await restart();
  },
  onAccountDisconnect: async () => {
    if (isRenewing) {
      Logger.info('[Skip onAccountDisconnect] Account is renewing');
      return;
    }
    Logger.warn('onAccountDisconnect, restarting now...');
    await restart();
  },
  onTokenInvalid: async () => {
    if (isRenewing) {
      Logger.info('[Skip onTokenInvalid] Account is renewing');
      return;
    }
    await renewTokens();
  },
});

// same as restart
const start = async () => {
  account = await Mongo.collection<Account>('accounts').findOne({
    _id: env.typeId,
  }, {
    projection: {
      providerType: 1,
      config: 1,
    },
  });
  if (!account) {
    throw new Error(`Account not found ${env.typeId}`);
  }

  await startEventHandler();

  const { providerType, config: configRaw } = account;

  const config = {
    ...configRaw,
    name: env.typeId,
  };

  const restart = async () => {
    try {
      if (isRestarting) {
        Logger.warn('Skip manually restarting!');
        return;
      }
      isRestarting = true;
      Logger.warn('Manually restarting...');
      await destroy();
      await start();
      Logger.warn('Manually restarted');
    } catch (err) {
      Logger.error('Failed to manually restart', err);
    } finally {
      isRestarting = false;
    }
  };

  connection = await connect({
    providerId: env.typeId,
    config: config as Config,
    onEvent: (payload: CallbackPayload) => onEventHandler(providerType, payload, restart),
    onError: (err: any) => {
      if (isWaitingRestart) {
        Logger.warn('Connection error, waiting to restart...', err);
        return;
      }
      Logger.warn('Connection error, restarting now...', err);
      isWaitingRestart = true;
      setTimeout(() => {
        isWaitingRestart = false;
        restart();
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
        restart();
      }, 1000 * 60 * 5);
    },
  });

  const { symbols: symbolList } = await getSymbolList(connection);

  const skipPattern = env.skipPattern && new RegExp(env.skipPattern);
  const watchPattern = new RegExp(env.watchPattern);
  allSymbols = symbolList.filter(({ symbolName }) => {
    if (!symbolName) return false;
    if (skipPattern && skipPattern.test(symbolName)) return false;
    return watchPattern.test(symbolName);
  }) as SymbolCTrader[];

  if (spotTasks.price) {
    Logger.info(`Subscribing ${allSymbols.length} symbols`, allSymbols.map(({ symbol }) => symbol).join(','));
    await startSubs(connection, allSymbols);
    Logger.warn(`Subscribed ${allSymbols.length} symbols`);
    await updateAssets(connection, providerType);
    renewSymbols();
  }
  if (spotTasks.poll) {
    await startPolls(connection, allSymbols);
    renewSymbolsHandler(allSymbols);
  }
  if (spotTasks.bar) {
    await updateLastBars(connection, allSymbols, providerType);
  }
};

export {
  destroy,
  getIsRestarting,
  renewSymbols,
  renewTokens,
  setIsRestarting,
  start,
};
