import {
  News,
} from '@fishprovider/core';

import { BaseGetServiceParams, NewsRepository, RepositoryGetManyResult } from '..';

export type GetNewsService = (params: BaseGetServiceParams<News> & {
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
