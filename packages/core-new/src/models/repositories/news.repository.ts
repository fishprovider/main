import type { BaseGetManyResult, BaseGetOptions, News } from '..';

export interface GetNewsFilter {
  today?: boolean,
  week?: string,
  upcoming?: boolean,
}

export interface NewsRepository {
  getNews: (
    filter: GetNewsFilter,
    options: BaseGetOptions<News>,
  ) => Promise<BaseGetManyResult<News>>;

  watchNews: <T>(
    selector: (state: Record<string, News>) => T,
  ) => T;
}
