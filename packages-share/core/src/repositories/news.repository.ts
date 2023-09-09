import {
  BaseGetManyResult, BaseGetOptions, BaseUpdateOptions, News,
} from '..';

export interface GetNewsFilter {
  today?: boolean,
  week?: string,
  upcoming?: boolean,
}

export interface UpdateNewsPayload {
  news?: Partial<News>[],
}

export interface NewsRepository {
  getNews?: (
    filter: GetNewsFilter,
    options: BaseGetOptions<News>,
  ) => Promise<BaseGetManyResult<News>>;

  setNews?: (
    filter: GetNewsFilter,
    payload: UpdateNewsPayload,
    options: BaseUpdateOptions<News>,
  ) => Promise<BaseGetManyResult<News>>;

  watchNews?: <T>(
    selector: (state: Record<string, News>) => T,
  ) => T;
}
