import {
  News,
} from '@fishprovider/core';

import {
  BaseGetManyResult, NewsRepository,
} from '..';

export type GetNewsService = (params: {
  filter: {
    today?: boolean,
    week?: string,
    upcoming?: boolean,
  },
  repositories: {
    news: NewsRepository
  },
}) => Promise<BaseGetManyResult<News>>;

export type WatchNewsService = <T>(params: {
  selector: (state: Record<string, News>) => T,
  repositories: {
    news: NewsRepository
  },
}) => T;
