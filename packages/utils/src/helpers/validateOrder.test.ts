import moment from 'moment';

import { LockType, PlanType, ProviderType } from '~constants/account';
import { OrderType } from '~constants/order';
import { getAccount } from '~tests/account';
import { getOrder } from '~tests/order';
import { getPrice, getPrices } from '~tests/price';
import { getUser } from '~tests/user';

import { validateOrderAdd } from './validateOrder';

describe('validateOrderAdd', () => {
  it('check allowed pairs', () => {
    const planPairs = ['EURUSD', 'AUDUSD'];
    const symbol = 'EURUSD';

    const user = getUser();
    const account = getAccount({
      plan: [{
        type: PlanType.pairs,
        value: planPairs,
      }],
    });
    const orderToNew = getOrder({ symbol });

    const { error } = validateOrderAdd({
      user,
      account,
      liveOrders: [],
      pendingOrders: [],
      orderToNew,
      prices: getPrices(),
    });

    expect(error).toBeUndefined();
  });

  it('check non-allowed pairs', () => {
    const planPairs = ['EURUSD', 'AUDUSD'];
    const symbol = 'GBPUSD';

    const user = getUser();
    const account = getAccount({
      plan: [{
        type: PlanType.pairs,
        value: planPairs,
      }],
    });
    const orderToNew = getOrder({ symbol });

    const { error } = validateOrderAdd({
      user,
      account,
      liveOrders: [],
      pendingOrders: [],
      orderToNew,
      prices: getPrices(),
    });

    expect(error).toBeDefined();
    expect(error).toEqual(`Allowed pairs are ${planPairs.join(', ')}`);
  });

  it('check locked pairs', () => {
    const lockedPairs = ['EURUSD', 'AUDUSD'];
    const symbol = 'EURUSD';

    const user = getUser();
    const account = getAccount({
      locks: [{
        type: LockType.pairs,
        value: lockedPairs,
        lockFrom: new Date(),
        lockUntil: moment().add(1, 'day').toDate(),
        lockMessage: 'test',
        lockByUserId: 'test',
        lockByUserName: 'test',
      }],
    });
    const orderToNew = getOrder({ symbol });

    const { error } = validateOrderAdd({
      user,
      account,
      liveOrders: [],
      pendingOrders: [],
      orderToNew,
      prices: getPrices(),
    });

    expect(error).toBeDefined();
    expect(error).toEqual(`Pair ${symbol} is locked`);
  });

  it('check non-locked pairs', () => {
    const lockedPairs = ['EURUSD', 'AUDUSD'];
    const symbol = 'GBPUSD';

    const user = getUser();
    const account = getAccount({
      locks: [{
        type: LockType.pairs,
        value: lockedPairs,
        lockFrom: new Date(),
        lockUntil: moment().add(1, 'day').toDate(),
        lockMessage: 'test',
        lockByUserId: 'test',
        lockByUserName: 'test',
      }],
    });
    const orderToNew = getOrder({ symbol });

    const { error } = validateOrderAdd({
      user,
      account,
      liveOrders: [],
      pendingOrders: [],
      orderToNew,
      prices: getPrices(),
    });

    expect(error).toBeUndefined();
  });

  it('check limit only', () => {
    const limitAmt = -5;
    const limitPrice = 1.49;
    const last = 1.5;
    const providerType = ProviderType.icmarkets;
    const symbol = 'EURUSD';

    const user = getUser();
    const account = getAccount({
      plan: [{
        type: PlanType.limitOnly,
        value: limitAmt,
      }],
    });
    const orderToNew = getOrder({
      providerType,
      orderType: OrderType.limit,
      symbol,
      limitPrice,
    });

    const { error } = validateOrderAdd({
      user,
      account,
      liveOrders: [],
      pendingOrders: [],
      orderToNew,
      prices: {
        ...getPrices(),
        [`${providerType}-${symbol}`]: getPrice({ last }),
      },
    });

    expect(error).toBeUndefined();
  });

  it('check limit only - reject market', () => {
    const limitAmt = -5;

    const user = getUser();
    const account = getAccount({
      plan: [{
        type: PlanType.limitOnly,
        value: limitAmt,
      }],
    });
    const orderToNew = getOrder({ orderType: OrderType.market });

    const { error } = validateOrderAdd({
      user,
      account,
      liveOrders: [],
      pendingOrders: [],
      orderToNew,
      prices: getPrices(),
    });

    expect(error).toBeDefined();
    expect(error).toEqual('Limit order only');
  });

  it('check limit only - unknown price', () => {
    const limitAmt = -5;
    const providerType = ProviderType.icmarkets;
    const symbol = 'EURUSD';

    const user = getUser();
    const account = getAccount({
      plan: [{
        type: PlanType.limitOnly,
        value: limitAmt,
      }],
    });
    const orderToNew = getOrder({
      providerType,
      orderType: OrderType.limit,
      symbol,
      limitPrice: 1.5,
    });

    const { error } = validateOrderAdd({
      user,
      account,
      liveOrders: [],
      pendingOrders: [],
      orderToNew,
      prices: {},
    });

    expect(error).toBeDefined();
    expect(error).toEqual('Limit price is invalid');
  });

  it('check limit only - too near limit', () => {
    const limitAmt = -5;
    const minLimit = 1.495;
    const limitPrice = 1.499;
    const last = 1.5;
    const asset = 'USD';
    const providerType = ProviderType.icmarkets;
    const symbol = 'EURUSD';

    const user = getUser();
    const account = getAccount({
      plan: [{
        type: PlanType.limitOnly,
        value: limitAmt,
      }],
    });
    const orderToNew = getOrder({
      providerType,
      orderType: OrderType.limit,
      symbol,
      limitPrice,
    });

    const { error } = validateOrderAdd({
      user,
      account,
      liveOrders: [],
      pendingOrders: [],
      orderToNew,
      prices: {
        ...getPrices(),
        [`${providerType}-${symbol}`]: getPrice({ last }),
      },
    });

    expect(error).toBeDefined();
    expect(error).toEqual(`Min Limit Amount is ${limitAmt} ${asset}. Please set Limit Price < ${minLimit}`);
  });
});
