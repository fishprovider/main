import { type News } from '.';

export interface GetNewsRepositoryParams {
  today?: boolean,
  week?: string,
  upcoming?: boolean,
}

export interface SetNewsRepositoryParams {
  news: News[],
  key?: string,
}

export interface WatchNewsRepositoryParams<T> {
  selector: (input: Record<string, News>) => T,
}

export interface NewsRepository {
  getNews: (params: GetNewsRepositoryParams) => Promise<News[] | null>;
  setNews: (params: SetNewsRepositoryParams) => Promise<boolean>;
  watchNews: <T>(params: WatchNewsRepositoryParams<T>) => T;
}
