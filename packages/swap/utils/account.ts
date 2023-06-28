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

export {
  botUser,
  getProvider,
  getProviderIds,
};
