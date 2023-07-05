import { redisKeys } from '@fishbot/utils/constants/redis';
import type { Account } from '@fishbot/utils/types/Account.model';
import _ from 'lodash';

const botUser = {
  userId: 'bot',
  userEmail: 'admin@fishprovider.com',
  userName: 'Bot',
  userPicture: 'https://www.fishprovider.com/icons/bot.png',
};

const getProvider = async (providerId: string) => {
  const str = await Redis.get(redisKeys.account(providerId));
  return str ? JSON.parse(str) as Account : undefined;
};

const getProviderIds = async (filter: Record<string, any> = {}) => {
  const accounts = await Mongo.collection<Account>('accounts').find(
    filter,
    {
      projection: {
        _id: 1,
      },
      sort: {
        order: -1,
      },
    },
  ).toArray();
  const providerIds = accounts.map(({ _id }) => _id);
  Logger.debug(`Got ${providerIds.length} providers: ${providerIds.join(',')}`);
  return providerIds;
};

const updateRedis = async (account: Account) => {
  const slimAccount = _.omit(account, ['providerData']);
  const accountStr = JSON.stringify(slimAccount);
  await Promise.all([
    Redis.publish(redisKeys.account(account._id), accountStr),
    Redis.set(redisKeys.account(account._id), accountStr, {
      EX: 60 * 60 * 24 * 30,
    }),
  ]);
};

const updateFirebase = async (account: Account) => {
  const slimAccountPublic = _.omit(account, ['config', 'providerData']);
  const membersSlim: Record<string, boolean> = {};
  account.members?.forEach((member) => {
    membersSlim[member.userId] = true;
  });
  await Firebase.firestore().collection('account').doc(account._id).set({
    ...slimAccountPublic,
    ...account.members && membersSlim,
  });
};

const updateMongo = async (account: Account) => {
  await Mongo.collection<Account>('accounts').updateOne(
    { _id: account._id },
    { $set: account },
  );
};

const updateCache = async (account: Account) => {
  Promise.all([
    updateRedis(account),
    updateFirebase(account),
    updateMongo(account),
  ]);
};

export {
  botUser,
  getProvider,
  getProviderIds,
  updateCache,
  updateFirebase,
  updateMongo,
  updateRedis,
};
