import { getDeals, getLiveOrders } from '@fishprovider/swap/dist/utils/order';
import { getPrices } from '@fishprovider/swap/dist/utils/price';
import { getProfit } from '@fishprovider/utils/dist/helpers/order';
import { getMajorPairs } from '@fishprovider/utils/dist/helpers/price';
import type { Account } from '@fishprovider/utils/dist/types/Account.model';
import _ from 'lodash';
import moment from 'moment';

const getTodayOrders = async (providerId: string) => {
  const todayOrders = await getDeals(providerId, { days: 1 });
  const startOfDay = moment.utc().startOf('d');
  return _.orderBy(
    todayOrders.filter((order) => moment(order.createdAt) >= startOfDay),
    ['updatedAt'],
    ['desc'],
  );
};

const getAccInfo = async (account: Account) => {
  const {
    _id: providerId,
    providerType,
    asset = 'USD',
    balance = 0,
    balanceStartDay = 0,
    maxEquity,
    maxEquityTime,
    edd,
    capital,
    summary,
  } = account;

  const todayOrders = await getTodayOrders(providerId);
  const liveOrders = await getLiveOrders(providerId);

  const prices = await getPrices(
    providerType,
    _.uniq([
      ...getMajorPairs(providerType),
      ...liveOrders.map((item) => item.symbol),
    ]),
  );
  const profit = getProfit(liveOrders, prices, asset);

  const todayProfits = todayOrders.map((item) => getProfit([item], {}, asset));
  const [todayWon, todayLost] = _.partition(todayProfits, (item) => item > 0);

  return {
    balance,
    balanceStartDay,
    balanceDiff: balance - balanceStartDay,
    profit,
    todayProfits,
    todayWon,
    todayLost,
    equity: balance + profit,
    maxEquity,
    maxEquityTime,
    edd,
    capital,
    summary,
  };
};

const updateAcc = async (account: Account) => {
  try {
    const accInfo = await getAccInfo(account);
    await Mongo.collection('stats').updateOne(
      {
        type: 'dailyBalance',
        typeId: account._id,
        year: moment.utc().year(),
        dayOfYear: moment.utc().dayOfYear(),
      },
      {
        $set: {
          ...accInfo,
          createdAt: new Date(),
        },
      },
      { upsert: true },
    );
  } catch (err) {
    Logger.error('Failed in updateAcc', account._id, err);
  }
};

const dailyBalance = async () => {
  try {
    const accounts = await Mongo.collection<Account>('accounts').find(
      {
        updatedAt: { $gte: moment().subtract(2, 'days').toDate() },
        deleted: { $ne: true },
      },
      {
        projection: {
          config: 0,
          providerData: 0,
        },
        sort: {
          order: -1,
        },
      },
    ).toArray();
    Logger.warn(`[dailyBalance] Found ${accounts.length} accounts`);

    for (const account of accounts) {
      await updateAcc(account);
    }
  } catch (err) {
    Logger.error('Failed in dailyBalance', err);
  }
};

export default dailyBalance;
