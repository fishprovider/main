import { News } from '@fishprovider/core';
import { getNewsService, watchNewsService } from '@fishprovider/core-frontend';
import { StoreFirstNewsRepository } from '@fishprovider/store-first';

const defaultRepo = StoreFirstNewsRepository;

export const getNewsController = async (filter: {
  today?: boolean,
  week?: string,
  upcoming?: boolean,
}) => {
  const { docs: news } = await getNewsService({
    filter,
    repositories: { news: defaultRepo },
  });
  return news;
};

export const watchNewsController = <T>(
  selector: (state: Record<string, News>) => T,
) => watchNewsService({
    selector,
    repositories: { news: defaultRepo },
  });
