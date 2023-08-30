import type { BaseGetManyResult, BaseGetOptions, News } from '..';

export interface GetNewsFilter {
  today?: boolean,
  week?: string,
  upcoming?: boolean,
}

export interface WatchNewsParams<T> {
  selector: (input: Record<string, News>) => T,
}

export interface NewsRepository {
  getNews: (
    filter: GetNewsFilter,
    options: BaseGetOptions<News>,
  ) => Promise<BaseGetManyResult<News>>;

  watchNews: <T, State = Record<string, News>>(
    selector: (state: State) => T,
  ) => T;
}
