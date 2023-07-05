import getSymbolList from '@fishbot/metatrader/commands/getSymbolList';
import startAccount from '@fishbot/metatrader/commands/startAccount';
import subAccount from '@fishbot/metatrader/commands/subAccount';
import type { ConnectionType } from '@fishbot/metatrader/types/Connection.model';
import type { CallbackPayload } from '@fishbot/metatrader/types/Event.model';
import newOrder from '@fishbot/swap/commands/newOrder';
import removeOrder from '@fishbot/swap/commands/removeOrder';
import connect from '@fishbot/swap/libs/metatrader/connect';
import type { SymbolMetaTrader } from '@fishbot/swap/types/Symbol.model';
import { botUser } from '@fishbot/swap/utils/account';
import type { ProviderType } from '@fishbot/utils/constants/account';
import { ProviderPlatform } from '@fishbot/utils/constants/account';
import { Direction, OrderStatus, OrderType } from '@fishbot/utils/constants/order';
import type { Account } from '@fishbot/utils/types/Account.model';

import { startSubs, stopSubs } from '~services/handleSubs';
import { spotTasks } from '~utils/tasks';

import onEvent, { destroy as destroyEventHandler, start as startEventHandler } from './events';
import { startPolls, stopPolls } from './handlePolls';
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
let isRestarting = false;

const setIsRestarting = (value: boolean) => {
  isRestarting = value;
};

const getIsRestarting = () => isRestarting;

const renewSymbols = () => renewSymbolsHandler(allSymbols);

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

  const symbols = await getSymbolList(connection);

  if (spotTasks.price) {
    const skipPattern = env.skipPattern && new RegExp(env.skipPattern);
    const watchPattern = new RegExp(env.watchPattern);
    allSymbols = symbols.filter((symbol) => {
      if (!symbol) return false;
      if (skipPattern && skipPattern.test(symbol)) return false;
      return watchPattern.test(symbol);
    });

    Logger.info(`Subscribing ${allSymbols.length} symbols`, allSymbols.map((symbol) => symbol).join(','));
    await startSubs(connection, allSymbols);
    Logger.warn(`Subscribed ${allSymbols.length} symbols`);

    renewSymbols();
  }

  if (spotTasks.poll) {
    await startPolls(connection, symbols);
    await renewSymbolsHandler(symbols);
  }

  sendHeartbeat();
};

export {
  destroy,
  getIsRestarting,
  renewSymbols,
  setIsRestarting,
  start,
};
