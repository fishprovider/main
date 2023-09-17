import {
  CTraderCallbackPayload, CTraderCallbackType, CTraderDepthEvent,
  CTraderSpotEvent, CTraderSymbolChangedEvent,
  transformBar, transformDepth, transformLong,
} from '..';

export const handleEventPrice = (
  payload: CTraderSpotEvent,
  callback: (_: CTraderCallbackPayload) => void,
) => {
  const {
    ctidTraderAccountId, symbolId, bid, ask, trendbar, sessionClose, timestamp,
  } = payload;
  callback({
    ...payload,
    type: CTraderCallbackType.price,
    accountId: ctidTraderAccountId.toNumber().toString(),
    symbolId: symbolId.toNumber().toString(),
    bid: bid && transformLong(bid, 5),
    ask: ask && transformLong(ask, 5),
    bars: trendbar.map(transformBar),
    sessionClose: sessionClose && transformLong(sessionClose, 5),
    timestamp: timestamp && timestamp.toNumber(),
  });
};

export const handleEventSymbol = (
  payload: CTraderSymbolChangedEvent,
  callback: (_: CTraderCallbackPayload) => void,
) => {
  const { ctidTraderAccountId, symbolId } = payload;
  callback({
    ...payload,
    type: CTraderCallbackType.symbol,
    accountId: ctidTraderAccountId.toNumber().toString(),
    symbolIds: symbolId.map((item) => item.toNumber().toString()),
  });
};

export const handleEventDepth = (
  payload: CTraderDepthEvent,
  callback: (_: CTraderCallbackPayload) => void,
) => {
  const {
    ctidTraderAccountId, symbolId, newQuotes, deletedQuotes,
  } = payload;
  callback({
    type: CTraderCallbackType.depth,
    accountId: ctidTraderAccountId.toNumber().toString(),
    symbolId: symbolId.toNumber().toString(),
    newQuotes: newQuotes.map(transformDepth),
    deletedQuotes: deletedQuotes.map((item) => item.toNumber().toString()),
  });
};
