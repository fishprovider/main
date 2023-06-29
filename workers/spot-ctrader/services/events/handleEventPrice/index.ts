import type { CallbackPayload } from '@fishbot/ctrader/types/Event.model';
import { getSymbols, savePrice } from '@fishbot/swap/utils/price';
import type { ProviderType } from '@fishbot/utils/constants/account';
import { isLastRunExpired } from '@fishbot/utils/helpers/lastRunChecks';

import { setLastUpdated } from '~services/checkCTrader';

const runs = {};

const handleEventPrice = async (
  providerType: ProviderType,
  payload: CallbackPayload,
) => {
  const { symbolId, bid, ask } = payload;
  try {
    if (
      !isLastRunExpired({
        runs,
        runId: symbolId,
        timeUnit: 'seconds',
        timeAmt: 5,
        checkIds: [],
      })
    ) return 1;

    const { symbolIds } = await getSymbols(providerType);
    const symbol = symbolIds[symbolId]?.symbol;
    if (!symbol) {
      // Logger.warn(`[event-price] Symbol not found ${symbolId}`);
      return 3;
    }

    const bidPrice = +bid || +ask;
    const askPrice = +ask || +bid;
    const last = (bidPrice + askPrice) / 2;

    const price = {
      _id: `${providerType}-${symbol}`,
      last,
      time: Date.now(),
      bid: bidPrice || last,
      ask: askPrice || last,
    };

    await savePrice(providerType, symbol, price);

    setLastUpdated();
    return 1;
  } catch (err) {
    Logger.error('Failed to handleEventPrice', err);
    return 2;
  }
};

export default handleEventPrice;
