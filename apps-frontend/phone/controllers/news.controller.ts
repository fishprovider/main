import { News } from '@fishprovider/core';
import { getNewsService, RepositoryGetOptions, watchNewsService } from '@fishprovider/core-frontend';
import { StoreFirstNewsRepository } from '@fishprovider/store-first';

export const getNewsController = async (
  filter: {
    today?: boolean,
    week?: string,
    upcoming?: boolean,
  },
  options?: RepositoryGetOptions<News>,
) => {
  const { docs: news } = await getNewsService({
    filter,
    repositories: { news: StoreFirstNewsRepository },
    options,
  });
  return news;
};

export const watchNewsController = <T>(
  selector: (state: Record<string, News>) => T,
) => watchNewsService({
    selector,
    repositories: { news: StoreFirstNewsRepository },
  });
