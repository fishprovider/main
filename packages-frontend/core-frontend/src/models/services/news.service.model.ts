import { News } from '@fishprovider/core';

import { NewsRepository, RepositoryGetManyResult, ServiceGetParams } from '..';

export type GetNewsService = (params: ServiceGetParams<News> & {
  filter: {
    today?: boolean,
    week?: string,
    upcoming?: boolean,
  },
  repositories: {
    news: NewsRepository
  },
}) => Promise<RepositoryGetManyResult<News>>;

export type WatchNewsService = <T>(params: {
  selector: (state: Record<string, News>) => T,
  repositories: {
    news: NewsRepository
  },
}) => T;
