import type {
  BaseGetOptions, BaseServiceGetManyResult, BaseServiceParams,
  GetNewsFilter, News, NewsRepository,
} from '..';

export type GetNewsService = (params: BaseServiceParams & {
  filter: GetNewsFilter,
  options: BaseGetOptions<News>,
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
