import { getDeals, getLiveOrders } from '@fishprovider/swap/dist/utils/order';
import { getPrices } from '@fishprovider/swap/dist/utils/price';
import { getProfit } from '@fishprovider/utils/dist/helpers/order';
import { getMajorPairs } from '@fishprovider/utils/dist/helpers/price';
import _ from 'lodash';
import moment from 'moment';

import { hackActive } from '~services/bots/hackActive';
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

// Rule of thumb: check must be fast (no DB call), action can be slow
const checkAccount = async (providerId: string) => {
  try {
    const account = await getAccount(providerId);
    if (!account) return;

    const todayOrders = await getTodayOrders(providerId);
    const rawLiveOrders = await getLiveOrders(providerId, true);

    // hack: filter out hack LTCUSD orders to keep CTrader Strategy active
    const [liveOrders, hackOrders] = _.partition(rawLiveOrders, (item) => item.symbol !== 'LTCUSD');
    if (account.strategyId) {
      await hackActive(account, liveOrders, hackOrders);
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
