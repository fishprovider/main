import { checkRepository } from '@fishprovider/core';
import { LocalFirstNewsRepository } from '@fishprovider/local-first';

export const getNewsService = async (filter: {
  today?: boolean,
  week?: string,
  upcoming?: boolean,
}) => {
  const getNewsRepo = checkRepository(LocalFirstNewsRepository.getNews);
  const { docs: news } = await getNewsRepo(filter);
  return news;
};
