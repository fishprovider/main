import type { News } from '.';

export interface GetNews {
  today?: boolean,
  week?: string,
  upcoming?: boolean,
}

export interface SetNews {
  news: News[],
}

export interface WatchNews<T> {
  selector: (input: Record<string, News>) => T,
}

export interface NewsRepository {
  getNews: (params: GetNews) => Promise<News[] | null>;
  setNews: (params: SetNews) => Promise<boolean>;
  watchNews: <T>(params: WatchNews<T>) => T;
}
