import type { CallbackPayload } from '@fishprovider/metatrader/dist/types/Event.model';
import { getSymbols, savePrice } from '@fishprovider/swap/dist/utils/price';
import type { ProviderType } from '@fishprovider/utils/dist/constants/account';
import { isLastRunExpired } from '@fishprovider/utils/dist/helpers/lastRunChecks';

import { setLastUpdated } from '~services/checkMetaTrader';

/*
{
  type: 'price',
  accountId: 'bbbb4df6-b4cd-4286-9c5f-4eadd0cc94f6',
  price: {
    time: 2023-04-14T20:20:43.000Z,
    brokerTime: '2023-04-14 20:20:43.000',
    symbol: 'XAGUSD',
    ask: 25.393,
    bid: 25.363,
    accountCurrencyExchangeRate: 1,
    profitTickValue: 5,
    lossTickValue: 5,
    timestamps: {
      eventGenerated: 2023-04-14T20:20:43.500Z,
      serverProcessingStarted: 2023-04-14T20:20:43.369Z,
      serverProcessingFinished: 2023-04-14T20:20:43.371Z
    },
    equity: 918.03
  }
}
*/

const runs = {};

const handleEventPrice = async (
  providerType: ProviderType,
  payload: CallbackPayload,
) => {
  const { symbol, bid, ask } = payload.price;
  try {
    if (
      !isLastRunExpired({
        runs,
        runId: symbol,
        timeUnit: 'seconds',
        timeAmt: 5,
        checkIds: [],
      })
    ) return 1;

    const { symbolIds } = await getSymbols(providerType);
    const symbolCheck = symbolIds[symbol];
    if (!symbolCheck) {
      // Logger.warn(`[event-price] Symbol not found ${symbol}`);
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
