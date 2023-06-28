import { LockType, PlanType } from '~constants/account';
import { Direction, OrderStatus, OrderType } from '~constants/order';
import type { Account } from '~types/Account.model';
import type { Order, OrderWithoutId } from '~types/Order.model';
import type { Price } from '~types/Price.model';
import type { User } from '~types/User.model';

import { getEntry } from './order';
import {
  getConversionRate, getLotFromVolume, getPriceFromAmount,
} from './price';

const checkStopLoss = (
  account: Account,
  order: OrderWithoutId,
  prices: Record<string, Price>,
) => {
  const {
    plan = [],
    asset = 'USD',
  } = account;
  const {
    providerType, symbol, direction, stopLoss, volume, lockSL,
  } = order;

  if (lockSL) {
    if (!stopLoss) {
      return { error: 'Stop loss is required' };
    }
    if (direction === Direction.buy) {
      if (stopLoss < lockSL) {
        return { error: `Max StopLoss is ${lockSL} ${asset}. Please set SL Price > ${lockSL}` };
      }
    } else if (stopLoss > lockSL) {
      return { error: `Max StopLoss is ${lockSL} ${asset}. Please set SL Price < ${lockSL}` };
    }
  }

  const stopLossAmt = plan.find((item) => item.type === PlanType.stopLoss)
    ?.value as number;
  if (!stopLossAmt) return {};

  if (!stopLoss) {
    return { error: 'Stop loss is required' };
  }

  const entry = getEntry(order) as number;
  const { conversionRate, error } = getConversionRate(providerType, symbol, asset, prices);
  if (error || !conversionRate) {
    return { error };
  }
  const maxSL = getPriceFromAmount({
    direction,
    volume,
    entry,
    assetAmt: stopLossAmt,
    rate: conversionRate,
  });
  if (direction === Direction.buy) {
    if (stopLoss < maxSL) {
      return { error: `Max StopLoss is ${stopLossAmt} ${asset}. Please set SL Price > ${maxSL}` };
    }
  } else if (stopLoss > maxSL) {
    return { error: `Max StopLoss is ${stopLossAmt} ${asset}. Please set SL Price < ${maxSL}` };
  }

  return {};
};

const checkTakeProfit = (
  account: Account,
  order: OrderWithoutId,
  prices: Record<string, Price>,
) => {
  const {
    plan = [],
    asset = 'USD',
  } = account;
  const takeProfitAmt = (plan.find((item) => item.type === PlanType.takeProfit)
    ?.value || 0) as number;
  const {
    providerType, symbol, direction, volume, stopLoss, takeProfit,
  } = order;

  if (!takeProfitAmt) return {};
  if (!takeProfit) {
    return { error: 'Take profit is required' };
  }

  const entry = getEntry(order) as number;
  if (stopLoss) {
    if (direction === Direction.buy) {
      if (stopLoss > entry) return {};
    } else if (stopLoss < entry) return {};
  }

  const { conversionRate, error } = getConversionRate(providerType, symbol, asset, prices);
  if (error || !conversionRate) {
    return { error };
  }
  const maxTP = getPriceFromAmount({
    direction,
    volume,
    entry,
    assetAmt: takeProfitAmt,
    rate: conversionRate,
  });
  if (direction === Direction.buy) {
    if (takeProfit > maxTP) {
      return { error: `Max TakeProfit is ${takeProfitAmt} ${asset}. Please set TP Price < ${maxTP}` };
    }
  } else if (takeProfit < maxTP) {
    return { error: `Max TakeProfit is ${takeProfitAmt} ${asset}. Please set TP Price > ${maxTP}` };
  }

  return {};
};

const checkMinTakeProfit = (
  account: Account,
  order: OrderWithoutId,
  prices: Record<string, Price>,
  takeProfit: number,
) => {
  const {
    plan = [],
    asset = 'USD',
  } = account;
  const minTakeProfitRatio = plan.find((item) => item.type === PlanType.minTakeProfit)
    ?.value as number;
  if (!minTakeProfitRatio) return {};

  const entry = getEntry(order) as number;
  const {
    providerType, symbol, direction, stopLoss,
  } = order;

  if (!stopLoss) {
    return { error: 'Stop loss is required' };
  }

  const stopLossDiff = Math.abs(stopLoss - entry);
  const takeProfitDiff = stopLossDiff * minTakeProfitRatio;

  const { conversionRate, error } = getConversionRate(providerType, symbol, asset, prices);
  if (error || !conversionRate) {
    return { error };
  }

  if (direction === Direction.buy) {
    const minTP = entry + takeProfitDiff;
    if (takeProfit < minTP) {
      return { error: `Min TakeProfit is ${minTakeProfitRatio} x Risk_SL. Please set TP Price > ${minTP}` };
    }
  } else {
    const minTP = entry - takeProfitDiff;
    if (takeProfit > minTP) {
      return { error: `Min TakeProfit is ${minTakeProfitRatio} x Risk_SL. Please set TP Price < ${minTP}` };
    }
  }

  return {};
};

const getOrderLot = (
  order: OrderWithoutId,
  prices: Record<string, Price>,
  bySymbol? : string,
) => {
  const {
    providerType, symbol, volume, lockSL,
  } = order;

  if (bySymbol && bySymbol !== symbol) return 0;

  const { lot, error } = getLotFromVolume({
    providerType,
    prices,
    symbol,
    volume,
  });

  if (error || !lot) {
    throw new Error(error);
  }

  if (lockSL) return 0;

  return lot;
};

const MAX_LOT = 10000;

const checkMaxLot = (
  account: Account,
  liveOrders: Order[],
  pendingOrders: Order[],
  prices: Record<string, Price>,
  order: OrderWithoutId,
  orderId?: string,
) => {
  const {
    plan = [],
  } = account;
  const { symbol } = order;

  const maxLotOrder = (plan.find((item) => item.type === PlanType.maxLotOrder)
    ?.value || MAX_LOT) as number;
  const lot = getOrderLot(order, prices);
  if (lot > maxLotOrder) {
    return { error: `Max lot per order is ${maxLotOrder}` };
  }

  const otherLiveOrders = liveOrders.filter((item) => item._id !== orderId);
  const otherPendingOrders = pendingOrders.filter((item) => item._id !== orderId);

  const maxLotTotal = (plan.find((item) => item.type === PlanType.maxLotTotal)
    ?.value || MAX_LOT) as number;
  const lotTotal = otherLiveOrders.reduce((acc, curr) => acc + getOrderLot(curr, prices), 0)
    + otherPendingOrders.reduce((acc, curr) => acc + getOrderLot(curr, prices), 0)
    + lot;
  if (lotTotal > maxLotTotal) {
    return { error: `Max lot total is ${maxLotTotal}` };
  }

  const maxLotPair = (plan.find((item) => item.type === PlanType.maxLotPair)
    ?.value || MAX_LOT) as number;
  const lotPair = otherLiveOrders.reduce((acc, curr) => acc + getOrderLot(curr, prices, symbol), 0)
    + otherPendingOrders.reduce((acc, curr) => acc + getOrderLot(curr, prices, symbol), 0)
    + lot;
  if (lotPair > maxLotPair) {
    return { error: `Max lot per pair is ${maxLotPair}` };
  }

  const maxLotPairs = plan.find((item) => item.type === PlanType.maxLotPairs)
    ?.value as Record<string, number>;
  if (maxLotPairs && maxLotPairs[symbol]) {
    const maxLotPairBySymbol = maxLotPairs[symbol] || MAX_LOT;
    if (lotPair > maxLotPairBySymbol) {
      return { error: `Max lot per pair by symbol is ${maxLotPairBySymbol}` };
    }
  }

  return {};
};

// check order entry: plan.limitOnly
const checkLimitOnly = (
  account: Account,
  order: OrderWithoutId,
  prices: Record<string, Price>,
) => {
  const {
    plan = [],
    asset = 'USD',
  } = account;
  const {
    providerType, orderType, symbol, direction, volume, limitPrice,
  } = order;
  const limitAmt = plan.find((item) => item.type === PlanType.limitOnly)
    ?.value as number;
  if (!limitAmt) return {};

  if (orderType === OrderType.market || !limitPrice) {
    return { error: 'Limit order only' };
  }

  const last = prices[`${providerType}-${symbol}`]?.last;
  if (!last) {
    return { error: `Unknown price ${providerType}-${symbol}` };
  }

  const { conversionRate, error } = getConversionRate(providerType, symbol, asset, prices);
  if (error || !conversionRate) {
    return { error };
  }

  const minLimit = getPriceFromAmount({
    direction,
    volume,
    entry: last,
    assetAmt: limitAmt,
    rate: conversionRate,
  });
  if (direction === Direction.buy) {
    if (limitPrice > minLimit) {
      return { error: `Min Limit Amount is ${limitAmt} ${asset}. Please set Limit Price < ${minLimit}` };
    }
  } else if (limitPrice < minLimit) {
    return { error: `Min Limit Amount is ${limitAmt} ${asset}. Please set Limit Price > ${minLimit}` };
  }

  return {};
};

const checkPriceLimit = (orderToNew: OrderWithoutId, prices: Record<string, Price>) => {
  const {
    providerType, orderType, symbol, limitPrice, direction,
  } = orderToNew;

  if (orderType !== OrderType.limit) return true;
  if (!limitPrice) return false;

  const last = prices[`${providerType}-${symbol}`]?.last;
  if (!last) return false;

  return (direction === Direction.buy && limitPrice < last)
    || (direction === Direction.sell && limitPrice > last);
};

const checkPriceStop = (orderToNew: OrderWithoutId, prices: Record<string, Price>) => {
  const {
    providerType, orderType, symbol, stopPrice, direction,
  } = orderToNew;

  if (orderType !== OrderType.stop) return true;
  if (!stopPrice) return false;

  const last = prices[`${providerType}-${symbol}`]?.last;
  if (!last) return false;

  return (direction === Direction.buy && stopPrice > last)
    || (direction === Direction.sell && stopPrice < last);
};

const checkOrderUpdate = (
  account: Account,
  liveOrders: Order[],
  pendingOrders: Order[],
  prices: Record<string, Price>,
  orderToUpdate: OrderWithoutId,
  orderId?: string,
): { error?: string } => {
  const {
    takeProfit,
  } = orderToUpdate;

  const maxLotPlan = checkMaxLot(
    account,
    liveOrders,
    pendingOrders,
    prices,
    orderToUpdate,
    orderId,
  );
  if (maxLotPlan.error) {
    return maxLotPlan;
  }

  const stopLossPlan = checkStopLoss(account, orderToUpdate, prices);
  if (stopLossPlan.error) {
    return stopLossPlan;
  }

  const takeProfitPlan = checkTakeProfit(account, orderToUpdate, prices);
  if (takeProfitPlan.error) {
    return takeProfitPlan;
  }

  if (takeProfit) {
    const minTakeProfitPlan = checkMinTakeProfit(account, orderToUpdate, prices, takeProfit);
    if (minTakeProfitPlan.error) {
      return minTakeProfitPlan;
    }
  }

  return {};
};

const validateOrderAdd = ({
  user,
  account,
  liveOrders,
  pendingOrders,
  // todayOrders,
  orderToNew,
  prices,
} : {
  user: User,
  account: Account,
  liveOrders: Order[],
  pendingOrders: Order[],
  // todayOrders: Order[],
  orderToNew: OrderWithoutId,
  prices: Record<string, Price>,
}): { error?: string } => {
  const {
    providerType,
    providerId,
    orderType,

    symbol,
    direction,
    volume,
    price,
    limitPrice,
    stopPrice,
  } = orderToNew;

  if (!user || !account
    || !providerType || !providerId || !orderType
    || !symbol || !direction || !volume
    || !(price || limitPrice || stopPrice)
  ) {
    return { error: 'Invalid order' };
  }

  const {
    plan = [],
    locks = [],
    members = [],
  } = account;

  const pairs = plan.find((item) => item.type === PlanType.pairs)
    ?.value as string[] | undefined;
  if (pairs && !pairs.includes(symbol)) {
    return { error: `Allowed pairs are ${pairs.join(', ')}` };
  }

  const lockedPair = locks.find((item) => item.type === LockType.pairs
    && (item.value as string[] | undefined)?.includes(symbol));
  if (lockedPair) {
    return { error: `Pair ${symbol} is locked` };
  }

  const isValidPriceLimit = checkPriceLimit(orderToNew, prices);
  if (!isValidPriceLimit) {
    return { error: 'Limit price is invalid' };
  }

  const isValidPriceStop = checkPriceStop(orderToNew, prices);
  if (!isValidPriceStop) {
    return { error: 'Stop price is invalid' };
  }

  const limitOnlyPlan = checkLimitOnly(
    account,
    orderToNew,
    prices,
  );
  if (limitOnlyPlan.error) {
    return limitOnlyPlan;
  }

  const checkOrderUpdateResult = checkOrderUpdate(
    account,
    liveOrders,
    pendingOrders,
    prices,
    orderToNew,
  );
  if (checkOrderUpdateResult.error) {
    return checkOrderUpdateResult;
  }

  const lockedAccount = locks.find((item) => item.type === LockType.open);
  if (lockedAccount) {
    return { error: 'Account open order is locked' };
  }

  const lockedUser = members.find((item) => item.userId === user._id)?.locks
    ?.find((item) => item.type === LockType.open);
  if (lockedUser) {
    return { error: 'User open order is locked' };
  }

  return {};
};

const validateOrderUpdate = ({
  user,
  account,
  liveOrders,
  pendingOrders,
  orderToUpdate,
  prices,
} : {
  user?: User,
  account?: Account,
  liveOrders: Order[],
  pendingOrders: Order[],
  orderToUpdate: Order,
  prices: Record<string, Price>,
}): { error?: string } => {
  const {
    providerType,
    providerId,
    orderType,
    status,

    symbol,
    direction,
    volume,
    price,
    limitPrice,
    stopPrice,

    lock,
    lockSL,
  } = orderToUpdate;
  if (!user || !account
    || !providerType || !providerId || !orderType || !status
    || !symbol || !direction || !volume
    || !(price || limitPrice || stopPrice)
  ) {
    return { error: 'Invalid order' };
  }
  const {
    members = [],
    locks = [],
  } = account;

  const checkOrderUpdateResult = checkOrderUpdate(
    account,
    liveOrders,
    pendingOrders,
    prices,
    orderToUpdate,
    orderToUpdate._id,
  );
  if (checkOrderUpdateResult.error) {
    return checkOrderUpdateResult;
  }

  // shield can be enabled anytime even user/account/order is locked
  if (lockSL) return {};

  const lockedAccount = locks.find((item) => item.type === LockType.update);
  if (lockedAccount) {
    return { error: 'Account update order is locked' };
  }

  const lockedUser = members.find((item) => item.userId === user._id)?.locks
    ?.find((item) => item.type === LockType.update);
  if (lockedUser) {
    return { error: 'User update order is locked' };
  }

  if (lock) {
    return { error: 'Order is locked' };
  }

  return {};
};

const validateOrderRemove = ({
  user,
  account,
  orderToRemove,
  prices,
} : {
  user?: User,
  account?: Account,
  orderToRemove: Order,
  prices: Record<string, Price>,
}): { error?: string } => {
  const {
    providerType,
    providerId,
    orderType,
    status,

    symbol,
    direction,
    volume,
    price,
    limitPrice,
    stopPrice,

    lock,
  } = orderToRemove;

  if (!user || !account
    || !providerType || !providerId || !orderType || !status
    || !symbol || !direction || !volume
    || !(price || limitPrice || stopPrice)
  ) {
    return { error: 'Invalid order' };
  }

  const {
    members = [],
    locks = [],
  } = account;

  const lockedAccount = locks.find((item) => item.type === LockType.close);
  if (lockedAccount) {
    return { error: 'Account close order is locked' };
  }

  const lockedUser = members.find((item) => item.userId === user._id)?.locks
    ?.find((item) => item.type === LockType.close);
  if (lockedUser) {
    return { error: 'User close order is locked' };
  }

  if (lock) {
    return { error: 'Order is locked' };
  }

  if (status === OrderStatus.pending) return {};

  const last = prices[`${providerType}-${symbol}`]?.last;
  if (price && last) {
    const isProfit = direction === Direction.buy ? last > price : last < price;
    if (!isProfit) return {};

    const minTakeProfitPlan = checkMinTakeProfit(account, orderToRemove, prices, last);
    if (minTakeProfitPlan.error) {
      return minTakeProfitPlan;
    }
  }

  return {};
};

export {
  validateOrderAdd,
  validateOrderRemove,
  validateOrderUpdate,
};
