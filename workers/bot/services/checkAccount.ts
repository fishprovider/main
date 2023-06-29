import { getDeals, getLiveOrders } from '@fishbot/swap/utils/order';
import { getPrices } from '@fishbot/swap/utils/price';
import { getProfit } from '@fishbot/utils/helpers/order';
import { getMajorPairs } from '@fishbot/utils/helpers/price';
import _ from 'lodash';
import moment from 'moment';

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
    const {
      providerType,
      asset = 'USD',
    } = account;

    if (botTasks.account) {
      await setBalanceStartDay(account);
    }

    const todayOrders = await getTodayOrders(providerId);
    const liveOrders = await getLiveOrders(providerId);

    if (botTasks.locks) {
      await lockLostSeriesPair(account, todayOrders, liveOrders);
    }

    if (!liveOrders.length) {
      if (botTasks.account) {
        await setMaxEquity(account, 0);
      }

      return;
    }

    const prices = await getPrices(
      providerType,
      _.uniq([
        ...getMajorPairs(providerType),
        ...liveOrders.map((item) => item.symbol),
      ]),
    );
    const profit = getProfit(liveOrders, prices, asset);

    if (botTasks.account) {
      await setEdd(account, profit);
      await setMaxEquity(account, profit);
    }
    if (botTasks.locks) {
      await lockMaxBdd(account, todayOrders, liveOrders, profit);
      await lockMaxEdd(account, liveOrders, profit);
      await lockTarget(account, liveOrders, profit);
    }
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
