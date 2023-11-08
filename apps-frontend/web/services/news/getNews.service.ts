import { checkRepository } from '@fishprovider/core';
import { StoreFirstNewsRepository } from '@fishprovider/store-first';

export const getNewsService = async (filter: {
  today?: boolean,
  week?: string,
  upcoming?: boolean,
}) => {
  const getNewsRepo = checkRepository(StoreFirstNewsRepository.getNews);
  const { docs: news } = await getNewsRepo(filter);
  return news;
};
