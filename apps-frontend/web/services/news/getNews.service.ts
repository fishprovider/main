import { checkRepository } from '@fishprovider/core';
import { DataFetchNewsRepository } from '@fishprovider/data-fetch';

export const getNewsService = async (filter: {
  today?: boolean,
  week?: string,
  upcoming?: boolean,
}) => {
  const getNewsRepo = checkRepository(DataFetchNewsRepository.getNews);
  const { docs: news } = await getNewsRepo(filter);
  return news;
};
