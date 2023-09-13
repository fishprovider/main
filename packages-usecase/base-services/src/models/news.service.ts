import { News } from '@fishprovider/core';
import {
  BaseGetManyResult, BaseGetOptions, BaseUpdateOptions, GetNewsFilter,
  NewsRepository, UpdateNewsPayload,
} from '@fishprovider/repositories';

import { BaseServiceParams } from '..';

export type GetNewsService = (params: BaseServiceParams & {
  filter: GetNewsFilter,
  options: BaseGetOptions<News>,
  repositories: {
    news: NewsRepository
  },
}) => Promise<BaseGetManyResult<News>>;

export type SetNewsService = (params: BaseServiceParams & {
  filter: GetNewsFilter,
  payload: UpdateNewsPayload,
  options: BaseUpdateOptions<News>,
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
