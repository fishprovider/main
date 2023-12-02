import { News } from '@fishprovider/core';
import { BaseGetOptions, getNewsService, watchNewsService } from '@fishprovider/core-frontend';
import { StoreFirstNewsRepository } from '@fishprovider/store-first';

export const getNewsController = async (
  filter: {
    today?: boolean,
    week?: string,
    upcoming?: boolean,
  },
  options?: BaseGetOptions<News>,
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
