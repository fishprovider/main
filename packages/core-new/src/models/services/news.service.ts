import type {
  BaseGetOptions, BaseServiceGetManyResult, BaseServiceParams,
  BaseUpdateOptions,
  GetNewsFilter, News, NewsRepository, UpdateNewsPayload,
} from '..';

export type GetNewsService = (params: BaseServiceParams & {
  filter: GetNewsFilter,
  options: BaseGetOptions<News>,
  repositories: {
    news: NewsRepository
  },
}) => Promise<BaseServiceGetManyResult<News>>;

export type SetNewsService = (params: BaseServiceParams & {
  filter: GetNewsFilter,
  payload: UpdateNewsPayload,
  options: BaseUpdateOptions<News>,
  repositories: {
    news: NewsRepository
  },
}) => Promise<BaseServiceGetManyResult<News>>;

export type WatchNewsService = <T>(params: BaseServiceParams & {
  selector: (state: Record<string, News>) => T,
  repositories: {
    news: NewsRepository
  },
}) => T;
