import { News } from '@fishprovider/core';
import {
  BaseGetManyResult, NewsRepository,
} from '@fishprovider/repositories';

import { BaseGetServiceParams, BaseServiceParams, BaseUpdateServiceParams } from '..';

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

export type SetNewsService = (params: BaseUpdateServiceParams<News> & {
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

export type WatchNewsService = <T>(params: BaseServiceParams & {
  selector: (state: Record<string, News>) => T,
  repositories: {
    news: NewsRepository
  },
}) => T;
