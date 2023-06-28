import { ProviderViewType } from '@fishbot/utils/constants/account';
import type { AccountPublic } from '@fishbot/utils/types/Account.model';
import moment from 'moment';

const key = 'accounts-slim-v2';
let updatedAt = Date.now();

const getFromCache = async () => {
  const str = await Redis.get(key);
  return str ? JSON.parse(str) as AccountPublic[] : undefined;
};

const getFromDB = async () => {
  const accounts = await Mongo.collection<AccountPublic>('accounts').find(
    {
      providerViewType: ProviderViewType.public,
      deleted: { $ne: true },
    },
    {
      projection: {
        config: 0,
        providerData: 0,

        providerViewType: 0,
        providerTradeType: 0,
        providerPlatformAccountId: 0,

        assetId: 0,
        leverage: 0,
        margin: 0,
        maxEquity: 0,
        maxEquityTime: 0,
        balanceStart: 0,
        balanceStartDay: 0,
        balanceStartDayUpdatedAt: 0,

        members: 0,
        investors: 0,
        plan: 0,
        settings: 0,
        tradeSettings: 0,
        protectSettings: 0,
        bannerStatus: 0,

        summary: 0,
        locks: 0,
        activities: 0,
        stats: 0,

        userId: 0,
        userEmail: 0,
        userName: 0,
        userPicture: 0,
      },
      sort: {
        order: -1,
      },
    },
  ).toArray();
  return accounts;
};

const checkAndUpdateCache = async () => {
  if (moment().diff(moment(updatedAt), 'minutes') > 5) {
    updatedAt = Date.now();
    Logger.debug('accountGetManySlim', 'Updating cache');
    const accounts = await getFromDB();
    await Redis.set(key, JSON.stringify(accounts), { EX: 60 * 60 * 24 * 7 });
  }
};

const accountGetManySlim = async () => {
  const cache = await getFromCache();
  if (cache) {
    checkAndUpdateCache(); // non-blocking
    return { result: cache };
  }

  const result = await getFromDB();
  checkAndUpdateCache(); // non-blocking
  return { result };
};

export default accountGetManySlim;
