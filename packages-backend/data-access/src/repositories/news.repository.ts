import { MongoNewsRepository } from '@fishprovider/mongo';
import { RedisNewsRepository } from '@fishprovider/redis';
import { NewsRepository } from '@fishprovider/repositories';

const getNews: NewsRepository['getNews'] = async (filter, options) => {
  let docs;
  if (RedisNewsRepository.getNews) {
    const res = await RedisNewsRepository.getNews(filter, options);
    docs = res.docs;
  }
  if (!docs && MongoNewsRepository.getNews) {
    const res = await MongoNewsRepository.getNews(filter, options);
    docs = res.docs;
    if (RedisNewsRepository.updateNews) {
      RedisNewsRepository.updateNews(filter, { news: docs ?? undefined }, options); // non-blocking
    }
  }
  return { docs };
};

export const DataAccessNewsRepository: NewsRepository = {
  getNews,
};
