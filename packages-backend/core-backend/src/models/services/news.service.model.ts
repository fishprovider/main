import {
  News,
} from '@fishprovider/core';

import {
  BaseGetServiceParams, BaseUpdateServiceParams, NewsRepository,
  RepositoryGetManyResult,
} from '..';

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

export type UpdateNewsService = (params: BaseUpdateServiceParams<News> & {
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
