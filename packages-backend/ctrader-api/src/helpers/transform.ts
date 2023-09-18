import {
  CTraderAccountInfo, CTraderBar, CTraderDeal, CTraderDepositWithdraw, CTraderDepth, CTraderOrder,
  CTraderPosition, CTraderTick,
} from '..';

export const transformLong = (value: Long, moneyDigits = 0) => {
  const divide = 10 ** moneyDigits;
  return value.toNumber() / divide;
};

export const transformOrder = (order: CTraderOrder) => {
  const {
    orderId, positionId, tradeData, utcLastUpdateTimestamp,
  } = order;
  const { openTimestamp, symbolId, volume } = tradeData;
  return {
    ...order,
    ...tradeData,

    orderId: orderId.toNumber().toString(),
    positionId: positionId?.toNumber()?.toString(),

    symbolId: symbolId.toNumber().toString(),
    volume: volume.toNumber() / 100,

    createdAt: openTimestamp && new Date(openTimestamp.toNumber()),
    updatedAt: utcLastUpdateTimestamp && new Date(utcLastUpdateTimestamp.toNumber()),
  };
};

export const transformPosition = (position: CTraderPosition) => {
  const {
    positionId, tradeData, commission, usedMargin, swap, moneyDigits,
    utcLastUpdateTimestamp,
  } = position;
  const {
    symbolId, volume, openTimestamp,
  } = tradeData;
  return {
    ...position,
    ...tradeData,

    positionId: positionId.toNumber().toString(),
    swap: transformLong(swap, moneyDigits),
    commission: commission && transformLong(commission, moneyDigits),
    usedMargin: usedMargin && transformLong(usedMargin, moneyDigits),

    symbolId: symbolId.toNumber().toString(),
    volume: volume.toNumber() / 100,

    createdAt: openTimestamp && new Date(openTimestamp.toNumber()),
    updatedAt: utcLastUpdateTimestamp && new Date(utcLastUpdateTimestamp.toNumber()),
  };
};

export const transformDeal = (deal: CTraderDeal) => {
  const {
    dealId, orderId, positionId, symbolId, volume, filledVolume,
    executionTimestamp, utcLastUpdateTimestamp,
    commission, moneyDigits, closePositionDetail,
  } = deal;
  return {
    ...deal,
    ...closePositionDetail,

    dealId: dealId.toNumber().toString(),
    orderId: orderId.toNumber().toString(),
    positionId: positionId.toNumber().toString(),
    symbolId: symbolId.toNumber().toString(),
    volume: volume.toNumber() / 100,
    filledVolume: filledVolume.toNumber() / 100,
    commission: commission && transformLong(commission, moneyDigits),

    closedVolume: closePositionDetail?.closedVolume
      && closePositionDetail.closedVolume.toNumber() / 100,
    closedCommission: closePositionDetail?.commission
      && transformLong(closePositionDetail.commission, moneyDigits),
    swap: closePositionDetail?.swap
      && transformLong(closePositionDetail.swap, moneyDigits),
    grossProfit: closePositionDetail?.grossProfit
      && transformLong(closePositionDetail.grossProfit, moneyDigits),
    balance: closePositionDetail?.balance
      && transformLong(closePositionDetail.balance, moneyDigits),
    pnlConversionFee: closePositionDetail?.pnlConversionFee
      && transformLong(closePositionDetail.pnlConversionFee, moneyDigits),

    createdAt: executionTimestamp && new Date(executionTimestamp.toNumber()),
    updatedAt: utcLastUpdateTimestamp && new Date(utcLastUpdateTimestamp.toNumber()),
  };
};

export const transformAccountInfo = (accountInfo: CTraderAccountInfo) => {
  const {
    ctidTraderAccountId, balance, depositAssetId, moneyDigits, traderLogin, leverageInCents,
  } = accountInfo;
  return {
    ...accountInfo,
    accountId: ctidTraderAccountId.toNumber().toString(),
    traderLogin: traderLogin?.toNumber().toString(),
    balance: transformLong(balance, moneyDigits),
    assetId: depositAssetId.toNumber().toString(),
    leverage: leverageInCents && leverageInCents / 100,
  };
};

export const transformBar = (bar: CTraderBar) => {
  const {
    volume, low, deltaOpen, deltaClose, deltaHigh, utcTimestampInMinutes,
  } = bar;
  const priceLow = low && transformLong(low, 5);
  const startAt = utcTimestampInMinutes && new Date(utcTimestampInMinutes * 60 * 1000);
  return {
    ...bar,
    volume: volume.toNumber(),
    low: priceLow,
    high: priceLow && deltaHigh && priceLow + transformLong(deltaHigh, 5),
    open: priceLow && deltaOpen && priceLow + transformLong(deltaOpen, 5),
    close: priceLow && deltaClose && priceLow + transformLong(deltaClose, 5),
    startAt,
    timestamp: startAt && startAt.getTime(),
  };
};

export const transformTick = (tickData: CTraderTick) => {
  const {
    timestamp, tick,
  } = tickData;
  const startAt = new Date(transformLong(timestamp));
  return {
    ...tickData,
    tick: tick && transformLong(tick, 5),
    startAt,
    timestamp: startAt && startAt.getTime(),
  };
};

export const transformDepth = ({
  id, size, bid, ask,
}: CTraderDepth) => ({
  id: id.toNumber().toString(),
  size: size.toNumber(),
  bid: bid && transformLong(bid, 5),
  ask: ask && transformLong(ask, 5),
});

export const transformDepositWithdraw = (depositWithdraw: CTraderDepositWithdraw) => {
  const {
    balanceHistoryId, balance, delta, changeBalanceTimestamp,
    balanceVersion, equity, moneyDigits,
  } = depositWithdraw;
  return {
    ...depositWithdraw,
    balanceHistoryId: balanceHistoryId.toNumber().toString(),
    balance: transformLong(balance, moneyDigits),
    delta: transformLong(delta, moneyDigits),
    changeBalanceTimestamp: changeBalanceTimestamp.toNumber(),
    balanceVersion: balanceVersion && balanceVersion.toNumber(),
    equity: equity && transformLong(equity, moneyDigits),
  };
};
