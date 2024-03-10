import { News } from '@fishprovider/core';

import {
  NewsRepository, RepositoryGetManyResult, ServiceGetParams, ServiceUpdateParams,
} from '..';

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

export type UpdateNewsService = (params: ServiceUpdateParams<News> & {
  filter: {
    today?: boolean,
    week?: string,
    upcoming?: boolean,
  },
  payload: {
    news?: Partial<News>[],
  },
  repositories: {
    news: NewsRepository
  },
}) => Promise<RepositoryGetManyResult<News>>;
