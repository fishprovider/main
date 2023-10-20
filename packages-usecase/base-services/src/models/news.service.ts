import { News } from '@fishprovider/core';
import { BaseGetManyResult, NewsRepository } from '@fishprovider/repositories';

import { BaseGetServiceParams, BaseUpdateServiceParams } from '..';

export type GetNewsService = (params: BaseGetServiceParams<News> & {
  filter: {
    today?: boolean,
    week?: string,
    upcoming?: boolean,
  },
  repositories: {
    news: NewsRepository
  },
}) => Promise<BaseGetManyResult<News>>;

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
}) => Promise<BaseGetManyResult<News>>;
