import newOrder from '@fishprovider/swap/dist/commands/newOrder';
import removePosition from '@fishprovider/swap/dist/commands/removePosition';
import { getDeals, getLiveOrders } from '@fishprovider/swap/dist/utils/order';
import { getPrices } from '@fishprovider/swap/dist/utils/price';
import { ProviderPlatform, ProviderType } from '@fishprovider/utils/dist/constants/account';
import { Direction, OrderStatus, OrderType } from '@fishprovider/utils/dist/constants/order';
import { getProfit } from '@fishprovider/utils/dist/helpers/order';
import { isPausedWeekend } from '@fishprovider/utils/dist/helpers/pause';
import { getMajorPairs } from '@fishprovider/utils/dist/helpers/price';
import { Account } from '@fishprovider/utils/dist/types/Account.model';
import type { Order, OrderWithoutId } from '@fishprovider/utils/dist/types/Order.model';
import _ from 'lodash';
import moment from 'moment';

import { botTasks, getAccount } from '~utils/account';

import closeAtTime from './bots/closeAtTime';
import closeOnEquity from './bots/closeOnEquity';
import closeOnProfit from './bots/closeOnProfit';
import lockLostSeriesPair from './bots/lockLostSeriesPair';
import lockMaxBdd from './bots/lockMaxBdd';
import lockMaxEdd from './bots/lockMaxEdd';
import lockTarget from './bots/lockTarget';
import setBalanceStartDay from './bots/setBalanceStartDay';
import setEdd from './bots/setEdd';
import setMaxEquity from './bots/setMaxEquity';

const getTodayOrders = async (providerId: string) => {
  const todayOrders = await getDeals(providerId, { days: 1 });
  const startOfDay = moment.utc().startOf('d');
  return _.orderBy(
    todayOrders.filter((order) => moment(order.createdAt) >= startOfDay),
    ['updatedAt'],
    ['desc'],
  );
};

const hackCTraderActive = async (account: Account, liveOrders: Order[], hackOrders: Order[]) => {
  if (isPausedWeekend()) return;

  let lastOrderCreated: Order | undefined;
  liveOrders.forEach((item) => {
    if (!lastOrderCreated) {
      lastOrderCreated = item;
      return;
    }
    if (moment(item.createdAt) > moment(lastOrderCreated.createdAt)) {
      lastOrderCreated = item;
    }
  });
  hackOrders.forEach((item) => {
    if (!lastOrderCreated) {
      lastOrderCreated = item;
      return;
    }
    if (moment(item.createdAt) > moment(lastOrderCreated.createdAt)) {
      lastOrderCreated = item;
    }
  });

  const isActive = () => { // CTrader requirements
    if (!lastOrderCreated) return false; // 1 position any time
    if (moment().diff(moment(lastOrderCreated.createdAt), 'hours') > 70) return false; // 1 deal last 72 hours

    const dayInWeek = moment.utc().day(); // 0: Sun, 1: Mon, ..., 5: Fri, 6: Sat
    if (dayInWeek === 5) {
      const hour = moment.utc().hour(); // 0-23
      if (hour > 10) {
        const orderCreatedDay = moment(lastOrderCreated.createdAt).utc().day();
        if (orderCreatedDay < 5) return false; // 1 deal after Fri 10:00

        const orderCreatedHour = moment(lastOrderCreated.createdAt).utc().hour();
        if (orderCreatedDay === 5 && orderCreatedHour < 10) return false; // 1 deal after Fri 10:00
      }
    }

    return true;
  };

  if (isActive()) {
    const removeDuplicateOrders = async (direction: Direction) => {
      const checkOrders = hackOrders.filter((item) => item.direction === direction);
      if (checkOrders.length > 1) {
        await Promise.all(checkOrders.map(async (order) => {
          await removePosition({ order, options: { config: account.config } });
        }));
      }
    };
    await Promise.all([
      removeDuplicateOrders(Direction.buy),
      removeDuplicateOrders(Direction.sell),
    ]);
    return;
  }

  const baseOrder: OrderWithoutId = {
    providerId: account._id,
    providerType: ProviderType.icmarkets,
    providerPlatform: ProviderPlatform.ctrader,

    orderType: OrderType.market,
    status: OrderStatus.idea,

    symbol: 'LTCUSD',
    direction: Direction.buy,
    volume: 0.01,
  };

  await Promise.all([
    newOrder({
      order: { ...hackOrders[0], ...baseOrder, direction: Direction.buy },
      options: { config: account.config },
    }),
    newOrder({
      order: { ...hackOrders[0], ...baseOrder, direction: Direction.sell },
      options: { config: account.config },
    }),
  ]);

  await Promise.all(hackOrders.map(async (order) => {
    await removePosition({ order, options: { config: account.config } });
  }));
};

// Rule of thumb: check must be fast (no DB call), action can be slow
const checkAccount = async (providerId: string) => {
  try {
    const account = await getAccount(providerId);
    if (!account) return;

    const shouldHackCTraderActive = !!account.strategyId
      && account.providerType === ProviderType.icmarkets
      && account.providerPlatform === ProviderPlatform.ctrader;

    const todayOrders = await getTodayOrders(providerId);
    const rawLiveOrders = await getLiveOrders(providerId, shouldHackCTraderActive);

    // hack: filter out hack LTCUSD orders to keep CTrader Strategy active
    const [liveOrders, hackOrders] = _.partition(rawLiveOrders, (item) => item.symbol !== 'LTCUSD');
    if (shouldHackCTraderActive) {
      await hackCTraderActive(account, liveOrders, hackOrders);
    }

    const {
      providerType,
      asset = 'USD',
    } = account;

    const prices = await getPrices(
      providerType,
      _.uniq([
        ...getMajorPairs(providerType),
        ...liveOrders.map((item) => item.symbol),
      ]),
    );
    const profit = getProfit(liveOrders, prices, asset);

    if (botTasks.account) {
      await setBalanceStartDay(account);
      await setEdd(account, profit);
      await setMaxEquity(account, profit);
    }

    if (botTasks.locks) {
      await lockLostSeriesPair(account, todayOrders, liveOrders);
      await lockMaxBdd(account, todayOrders, liveOrders, profit);
      await lockMaxEdd(account, liveOrders, profit);
      await lockTarget(account, liveOrders, profit);
    }

    if (!liveOrders.length) return;

    if (botTasks.orders) {
      await closeOnProfit(account, liveOrders, profit);
      await closeOnEquity(account, liveOrders, profit);
      await closeAtTime(account, liveOrders, profit);
    }
  } catch (err) {
    Logger.error(`Failed to checkAccount ${providerId}`, err);
  }
};

export default checkAccount;
