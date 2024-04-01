import getSymbolList from '@fishprovider/metatrader/dist/commands/getSymbolList';
import startAccount from '@fishprovider/metatrader/dist/commands/startAccount';
import subAccount from '@fishprovider/metatrader/dist/commands/subAccount';
import type { ConnectionType } from '@fishprovider/metatrader/dist/types/Connection.model';
import type { CallbackPayload } from '@fishprovider/metatrader/dist/types/Event.model';
import newOrder from '@fishprovider/swap/dist/commands/newOrder';
import removeOrder from '@fishprovider/swap/dist/commands/removeOrder';
import connect from '@fishprovider/swap/dist/libs/metatrader/connect';
import getSymbolTick from '@fishprovider/swap/dist/libs/metatrader/getSymbolTick';
import type { SymbolMetaTrader } from '@fishprovider/swap/dist/types/Symbol.model';
import { botUser } from '@fishprovider/swap/dist/utils/account';
import { savePrice } from '@fishprovider/swap/dist/utils/price';
import type { ProviderType } from '@fishprovider/utils/dist/constants/account';
import { AccountPlatform } from '@fishprovider/utils/dist/constants/account';
import { Direction, OrderStatus, OrderType } from '@fishprovider/utils/dist/constants/order';
import type { Account } from '@fishprovider/utils/dist/types/Account.model';

import { setLastUpdated } from '~services/checkMetaTrader';
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
let symbols: SymbolMetaTrader[] = [];
let isRestarting = false;

const setIsRestarting = (value: boolean) => {
  isRestarting = value;
};

const getIsRestarting = () => isRestarting;

const renewSymbols = () => renewSymbolsHandler(symbols);

const pollSymbols = async () => {
  if (!account) {
    Logger.error(`account not found ${env.typeId}`);
    return;
  }

  const { config, providerType } = account;

  for (const symbol of symbols) {
    const price = await getSymbolTick({
      providerType,
      symbol,
      config,
    });
    await savePrice(providerType, symbol, price);

    setLastUpdated();
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
      platform: AccountPlatform.metatrader,

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

  const allSymbols = await getSymbolList(connection);

  const skipPattern = env.skipPattern && new RegExp(env.skipPattern);
  const watchPattern = new RegExp(env.watchPattern);
  symbols = allSymbols.filter((symbol) => {
    if (skipPattern && skipPattern.test(symbol)) return false;
    return watchPattern.test(symbol);
  });

  if (spotTasks.price) {
    Logger.info(`Subscribing ${symbols.length} symbols`, symbols.map((symbol) => symbol).join(','));
    await startSubs(connection, symbols);
    Logger.info(`Subscribed ${symbols.length} symbols`);
    renewSymbols();
  }
  if (spotTasks.poll) {
    // renewSymbolsHandler(allSymbols);
    renewSymbols();
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
