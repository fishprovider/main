import type { News } from '.';

export interface GetNewsParams {
  today?: boolean,
  week?: string,
  upcoming?: boolean,
}

export interface SetNewsParams {
  news: News[],
}

export interface WatchNewsParams<T> {
  selector: (input: Record<string, News>) => T,
}

export interface NewsRepository {
  getNews: (params: GetNewsParams) => Promise<News[] | null>;
  setNews: (params: SetNewsParams) => Promise<boolean>;
  watchNews: <T>(params: WatchNewsParams<T>) => T;
}
