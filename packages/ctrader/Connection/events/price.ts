import { CallbackType } from '~constants/openApi';
import type { CallbackPayload, SpotEvent } from '~types/Event.model';
import { transformBar, transformLong } from '~utils/transform';

const handleEventPrice = (
  payload: SpotEvent,
  callback: (_: CallbackPayload) => void,
) => {
  const {
    ctidTraderAccountId, symbolId, bid, ask, trendbar, sessionClose, timestamp,
  } = payload;
  callback({
    ...payload,
    type: CallbackType.price,
    accountId: ctidTraderAccountId.toNumber().toString(),
    symbolId: symbolId.toNumber().toString(),
    bid: bid && transformLong(bid, 5),
    ask: ask && transformLong(ask, 5),
    bars: trendbar.map(transformBar),
    sessionClose: sessionClose && transformLong(sessionClose, 5),
    timestamp: timestamp && timestamp.toNumber(),
  });
};

export default handleEventPrice;
