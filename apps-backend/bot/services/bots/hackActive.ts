import newOrder from '@fishprovider/swap/dist/commands/newOrder';
import removePosition from '@fishprovider/swap/dist/commands/removePosition';
import { AccountPlatform, ProviderType } from '@fishprovider/utils/dist/constants/account';
import { Direction, OrderStatus, OrderType } from '@fishprovider/utils/dist/constants/order';
import { isLastRunExpired } from '@fishprovider/utils/dist/helpers/lastRunChecks';
import { isPausedWeekend } from '@fishprovider/utils/dist/helpers/pause';
import { Account, Config } from '@fishprovider/utils/dist/types/Account.model';
import type { Order, OrderWithoutId } from '@fishprovider/utils/dist/types/Order.model';
import moment from 'moment';

const runs = {};

const getLastOrderCreated = (liveOrders: Order[], hackOrders: Order[]) => {
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
  return lastOrderCreated;
};

const checkHackOrders = async (hackOrders: Order[]) => {
  const checkDuplicateOrders = async (direction: Direction) => {
    const checkOrders = hackOrders.filter((item) => item.direction === direction);
    if (checkOrders.length > 1) {
      Logger.warn('Duplicated hackOrders', checkOrders[0]?.providerId, direction, checkOrders.length);
    }
  };
  await Promise.all([
    checkDuplicateOrders(Direction.buy),
    checkDuplicateOrders(Direction.sell),
  ]);
};

const newHackOrders = async (baseNewOrder: OrderWithoutId, hackOrders: Order[], config: Config) => {
  await Promise.all([
    newOrder({
      order: { ...hackOrders[0], ...baseNewOrder, direction: Direction.buy },
      options: { config },
    }),
    newOrder({
      order: { ...hackOrders[0], ...baseNewOrder, direction: Direction.sell },
      options: { config },
    }),
  ]);

  await Promise.all(hackOrders.map(async (order) => {
    await removePosition({ order, options: { config } });
  }));
};

const hackActiveCTrader = async (
  account: Account,
  liveOrders: Order[],
  hackOrders: Order[],
) => {
  if (isPausedWeekend()) return;

  const lastOrderCreated = getLastOrderCreated(liveOrders, hackOrders);

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
    await checkHackOrders(hackOrders);
    return;
  }
  Logger.warn('hackActiveCTrader', account._id, lastOrderCreated?.createdAt);

  const baseOrder: OrderWithoutId = {
    providerId: account._id,
    providerType: ProviderType.icmarkets,
    platform: AccountPlatform.ctrader,

    orderType: OrderType.market,
    status: OrderStatus.idea,

    symbol: 'LTCUSD',
    direction: Direction.buy,
    volume: 0.01,
  };

  await newHackOrders(baseOrder, hackOrders, account.config);
};

const hackActiveExness = async (
  account: Account,
  liveOrders: Order[],
  hackOrders: Order[],
) => {
  if (isPausedWeekend()) return;

  const lastOrderCreated = getLastOrderCreated(liveOrders, hackOrders);

  const isActive = () => { // Exness requirements
    if (!lastOrderCreated) return false; // 1 position any time
    if (moment().diff(moment(lastOrderCreated.createdAt), 'hours') > (24 * 6 + 22)) return false; // 1 deal last 7 days
    return true;
  };

  if (isActive()) {
    await checkHackOrders(hackOrders);
    return;
  }
  Logger.warn('hackActiveExness', account._id, lastOrderCreated?.createdAt);

  const baseOrder: OrderWithoutId = {
    providerId: account._id,
    providerType: ProviderType.exness,
    platform: AccountPlatform.metatrader,

    orderType: OrderType.market,
    status: OrderStatus.idea,

    symbol: 'LTCUSD',
    direction: Direction.buy,
    volume: 0.01,
  };

  await newHackOrders(baseOrder, hackOrders, account.config);
};

export const hackActive = async (
  account: Account,
  liveOrders: Order[],
  hackOrders: Order[],
) => {
  if (!account.strategyId) return;

  if (
    !isLastRunExpired({
      runs,
      runId: account._id,
      timeUnit: 'minutes',
      timeAmt: 10,
      checkIds: [account._id],
    })
  ) return;

  if (account.providerType === ProviderType.icmarkets) {
    await hackActiveCTrader(account, liveOrders, hackOrders);
  }
  // if (account.providerType === ProviderType.exness) {
  //   await hackActiveExness(account, liveOrders, hackOrders);
  // }
};
