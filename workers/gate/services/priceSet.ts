import { savePrice } from '@fishprovider/swap/utils/price';
import { ProviderType } from '@fishprovider/utils/constants/account';
import { isLastRunExpired } from '@fishprovider/utils/helpers/lastRunChecks/lastRunChecks';
import _ from 'lodash';

import { setLastUpdated } from './checkCTrader';

const env = {
  apiPass: process.env.API_PASS,
  pausePrice: process.env.PAUSE_PRICE,
};

const runs = {};

const updatePrice = async ({ name, ask, bid }: {
  name: string;
  ask: number;
  bid: number;
}) => {
  if (
    !isLastRunExpired({
      runs,
      runId: name,
      timeUnit: 'seconds',
      timeAmt: 5,
      checkIds: [],
    })
  ) return;

  const bidPrice = +bid || +ask;
  const askPrice = +ask || +bid;
  const last = (bidPrice + askPrice) / 2;

  const price = {
    _id: `${ProviderType.icmarkets}-${name}`,
    last,
    time: Date.now(),
    bid: bidPrice || last,
    ask: askPrice || last,
  };

  if (env.pausePrice) {
    Logger.info('Paused price', price);
    return;
  }

  await savePrice(ProviderType.icmarkets, name, price);
};

const priceSet = async ({ secret, prices }: {
  secret: string;
  prices: any[];
}) => {
  if (secret !== env.apiPass) {
    return { error: 'Params error' };
  }

  try {
    await Promise.all(prices.map(updatePrice));
    setLastUpdated();
  } catch (err) {
    Logger.error('Failed at priceSet', err);
    return { error: `${err}` };
  }

  return { result: 'OK' };
};

export default priceSet;
