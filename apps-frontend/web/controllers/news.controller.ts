import { checkRepository, News } from '@fishprovider/core';
import { StoreFirstNewsRepository } from '@fishprovider/store-first';

const repo = StoreFirstNewsRepository;

export const getNewsController = async (filter: {
  today?: boolean,
  week?: string,
  upcoming?: boolean,
}) => {
  const getNewsRepo = checkRepository(repo.getNews);
  const { docs: news } = await getNewsRepo(filter);
  return news;
};

export const watchNewsController = <T>(
  selector: (state: Record<string, News>) => T,
) => {
  const watchNewsRepo = checkRepository(repo.watchNews);
  return watchNewsRepo(selector);
};
