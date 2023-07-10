import getSymbolList from '@fishprovider/metatrader/commands/getSymbolList';
import startAccount from '@fishprovider/metatrader/commands/startAccount';
import subAccount from '@fishprovider/metatrader/commands/subAccount';
import type { ConnectionType } from '@fishprovider/metatrader/types/Connection.model';
import type { CallbackPayload } from '@fishprovider/metatrader/types/Event.model';
import newOrder from '@fishprovider/swap/commands/newOrder';
import removeOrder from '@fishprovider/swap/commands/removeOrder';
import connect from '@fishprovider/swap/libs/metatrader/connect';
import getSymbolTick from '@fishprovider/swap/libs/metatrader/getSymbolTick';
import type { SymbolMetaTrader } from '@fishprovider/swap/types/Symbol.model';
import { botUser } from '@fishprovider/swap/utils/account';
import { savePrice } from '@fishprovider/swap/utils/price';
import type { ProviderType } from '@fishprovider/utils/constants/account';
import { ProviderPlatform } from '@fishprovider/utils/constants/account';
import { Direction, OrderStatus, OrderType } from '@fishprovider/utils/constants/order';
import type { Account } from '@fishprovider/utils/types/Account.model';

import { startSubs, stopSubs } from '~services/handleSubs';
import { spotTasks } from '~utils/tasks';

import onEvent, { destroy as destroyEventHandler, start as startEventHandler } from './events';
import renewSymbolsHandler from './renewSymbols';

const env = {
  typeId: process.env.TYPE_ID || '',
  nodeEnv: process.env.NODE_ENV,
  skipPattern: process.env.SKIP_PATTERN || '',
  watchPattern: process.env.WATCH_PATTERN || '',
};

let account: Account | null;
let connection: ConnectionType | undefined;
let allSymbols: SymbolMetaTrader[] = [];
let symbols: SymbolMetaTrader[] = [];
let isRestarting = false;

const setIsRestarting = (value: boolean) => {
  isRestarting = value;
};

const getIsRestarting = () => isRestarting;

const renewSymbols = () => renewSymbolsHandler(symbols);

const pollSymbols = async (all = false) => {
  if (!account) {
    Logger.error(`account not found ${env.typeId}`);
    return;
  }

  const { config, providerType } = account;

  for (const symbol of (all ? allSymbols : symbols)) {
    const price = await getSymbolTick({
      providerType,
      symbol,
      config,
    });
    await savePrice(providerType, symbol, price);
  }
};

const sendHeartbeat = async () => {
  if (!account) {
    Logger.error('account not found');
    return;
  }

  const { config, providerType } = account;
  const order = await newOrder({
    order: {
      providerId: env.typeId,
      providerType,
      providerPlatform: ProviderPlatform.metatrader,

      orderType: OrderType.limit,
      status: OrderStatus.idea,

      symbol: 'AUDUSD',
      direction: Direction.buy,
      volume: 1000,

      limitPrice: 0.1,

      ...botUser,
    },
    options: {
      config,
    },
  });
  await removeOrder({ order, options: { config } });
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
  onAppDisconnect: async () => {
    Logger.warn('Connection onAppDisconnect, restarting now...');
    await restart();
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
    config,
    onEvent: (payload: CallbackPayload) => onEventHandler(providerType, payload, restart),
  });
  await connection.start();
  await startAccount(connection);
  await subAccount(connection);

  allSymbols = await getSymbolList(connection);

  const skipPattern = env.skipPattern && new RegExp(env.skipPattern);
  const watchPattern = new RegExp(env.watchPattern);
  symbols = allSymbols.filter((symbol) => {
    if (skipPattern && skipPattern.test(symbol)) return false;
    return watchPattern.test(symbol);
  });

  if (spotTasks.price) {
    Logger.info(`Subscribing ${symbols.length} symbols`, symbols.map((symbol) => symbol).join(','));
    await startSubs(connection, symbols);
    Logger.warn(`Subscribed ${symbols.length} symbols`);
    renewSymbols();
  }
  if (spotTasks.poll) {
    renewSymbolsHandler(symbols);
  }

  sendHeartbeat();
};

export {
  destroy,
  getIsRestarting,
  pollSymbols,
  renewSymbols,
  setIsRestarting,
  start,
};
