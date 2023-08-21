import getSymbolList from '@fishprovider/ctrader/dist/commands/getSymbolList';
import { QuoteType } from '@fishprovider/ctrader/dist/constants/openApi';
import type { Config } from '@fishprovider/ctrader/dist/types/Config.model';
import type { ConnectionType } from '@fishprovider/ctrader/dist/types/Connection.model';
import type { CallbackPayload } from '@fishprovider/ctrader/dist/types/Event.model';
import connect from '@fishprovider/swap/dist/libs/ctrader/connect';
import getSymbolTick from '@fishprovider/swap/dist/libs/ctrader/getSymbolTick';
import renewTokensCTrader from '@fishprovider/swap/dist/libs/ctrader/renewTokens';
import type { SymbolCTrader } from '@fishprovider/swap/dist/types/Symbol.model';
import { getSymbols, savePrice } from '@fishprovider/swap/dist/utils/price';
import type { ProviderType } from '@fishprovider/utils/dist/constants/account';
import type { Account } from '@fishprovider/utils/dist/types/Account.model';
import _ from 'lodash';
import moment from 'moment';

import { setLastUpdated } from '~services/checkCTrader';
import { startSubs, stopSubs } from '~services/handleSubs';
import { spotTasks } from '~utils/tasks';

import onEvent, { destroy as destroyEventHandler, start as startEventHandler } from './events';
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
let symbols: SymbolCTrader[] = [];
let isRenewing = false;
let isRestarting = false;
let isWaitingRestart = false;

const setIsRestarting = (value: boolean) => {
  isRestarting = value;
};

const getIsRestarting = () => isRestarting;

const renewSymbols = () => renewSymbolsHandler(symbols);

const pollSymbols = async (all = false) => {
  if (!connection) {
    Logger.error('connection not found');
    return;
  }
  if (!account) {
    Logger.error(`account not found ${env.typeId}`);
    return;
  }

  const { providerType } = account;
  const { symbolNames } = await getSymbols(providerType);

  const now = moment();
  const to = now.unix() * 1000;
  const from = now.subtract(30, 'seconds').unix() * 1000;

  for (const symbolItem of (all ? allSymbols : symbols)) {
    const { symbol } = symbolItem;
    const { digits } = symbolNames[symbol] || {};

    const { ticks } = await getSymbolTick({
      providerType,
      connection,
      symbol: symbolItem,
      quoteType: QuoteType.BID,
      fromTimestamp: from,
      toTimestamp: to,
    });
    const tick = _.findLast(
      ticks,
      (item) => item.timestamp > 0 && item.tick && _.round(item.tick, digits) > 0,
    ) as { tick: number, timestamp: number } | undefined;

    if (tick) {
      const { tick: last, timestamp } = tick;
      const price = {
        _id: `${providerType}-${symbol}`,
        last,
        time: timestamp,
        bid: last,
        ask: last,
      };
      await savePrice(providerType, symbol, price);

      setLastUpdated();
    }
  }
};

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
      await stopSubs(connectionToClose, symbols);
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
  allSymbols = symbolList.filter(({ symbolName }) => !!symbolName) as SymbolCTrader[];

  const skipPattern = env.skipPattern && new RegExp(env.skipPattern);
  const watchPattern = new RegExp(env.watchPattern);
  symbols = allSymbols.filter(({ symbol }) => {
    if (skipPattern && skipPattern.test(symbol)) return false;
    return watchPattern.test(symbol);
  });

  if (spotTasks.price) {
    Logger.info(`Subscribing ${symbols.length} symbols`, symbols.map(({ symbol }) => symbol).join(','));
    await startSubs(connection, symbols);
    Logger.warn(`Subscribed ${symbols.length} symbols`);
    await updateAssets(connection, providerType);
    renewSymbols();
  }
  if (spotTasks.poll) {
    renewSymbolsHandler(symbols);
  }
  if (spotTasks.bar) {
    await updateLastBars(connection, symbols, providerType);
  }
};

export {
  destroy,
  getIsRestarting,
  pollSymbols,
  renewSymbols,
  renewTokens,
  setIsRestarting,
  start,
};
