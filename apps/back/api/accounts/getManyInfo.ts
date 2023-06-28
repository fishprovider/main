import { ProviderViewType } from '@fishbot/utils/constants/account';
import type { AccountPublic } from '@fishbot/utils/types/Account.model';
// import moment from 'moment';

// const key = 'accounts-info-v2';
// let updatedAt = Date.now();

// const getFromCache = async () => {
//   const str = await Redis.get(key);
//   return str ? JSON.parse(str) as AccountPublic[] : undefined;
// };

const getFromDB = async () => {
  const accounts = await Mongo.collection<AccountPublic>('accounts').find(
    {
      providerViewType: ProviderViewType.public,
      deleted: { $ne: true },
    },
    {
      projection: {
        providerViewType: 1,
        providerTradeType: 1,
        providerPlatformAccountId: 1,

        assetId: 1,
        leverage: 1,
        margin: 1,
        maxEquity: 1,
        maxEquityTime: 1,
        balanceStart: 1,
        balanceStartDay: 1,
        balanceStartDayUpdatedAt: 1,

        members: 1,
        investors: 1,
        plan: 1,
        settings: 1,
        tradeSettings: 1,
        protectSettings: 1,
        bannerStatus: 1,

        summary: 1,
        activities: 1,
        locks: 1,
        stats: 1,

        userId: 1,
        userEmail: 1,
        userName: 1,
        userPicture: 1,
      },
      sort: {
        order: -1,
      },
    },
  ).toArray();
  return accounts;
};

// const checkAndUpdateCache = async () => {
//   if (moment().diff(moment(updatedAt), 'minutes') > 5) {
//     updatedAt = Date.now();
//     Logger.debug('accountGetManyInfo', 'Updating cache');
//     const accounts = await getFromDB();
//     await Redis.set(key, JSON.stringify(accounts), { EX: 60 * 60 * 24 * 7 });
//   }
// };

const accountGetManyInfo = async () => {
  // const cache = await getFromCache();
  // if (cache) {
  //   checkAndUpdateCache(); // non-blocking
  //   return { result: cache };
  // }

  const result = await getFromDB();
  // checkAndUpdateCache(); // non-blocking
  return { result };
};

export default accountGetManyInfo;
